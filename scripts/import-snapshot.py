"""Import a private Sites snapshot into an EMPTY local game database.

Run migrations first. No private data or recovery codes belong in GitHub.
"""
import argparse
import glob
import json
import os
from pathlib import Path
import sqlite3
import uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('snapshot', nargs='?', default='.migration/sites-live-snapshot.json')
parser.add_argument('--database', help='Explicit local SQLite path')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
snapshot_path = (root / args.snapshot).resolve()
snapshot = json.loads(snapshot_path.read_text())
if snapshot.get('format') != 1:
    raise SystemExit('Unsupported snapshot format')
paths = [args.database] if args.database else glob.glob(str(root / '.wrangler/state/v3/d1/**/*.sqlite'), recursive=True)
target = None
for path in paths:
    with sqlite3.connect(path) as candidate:
        if candidate.execute("SELECT COUNT(*) FROM sqlite_master WHERE name='rpg_profiles'").fetchone()[0]:
            target = path
            break
if not target:
    raise SystemExit('No game database. Run npm run db:migrate first.')

# Sites identities cannot authenticate on another origin. Replace them with
# random cookie sessions and keep their recovery codes in a private local file.
identity_map = {}
recovery = []
for table in ('rpg_profiles', 'players'):
    for row in snapshot['tables'][table]['rows']:
        old_id = row['id']
        if old_id.startswith('user:') and old_id not in identity_map:
            new_id = str(uuid.uuid4())
            identity_map[old_id] = new_id
            recovery.append({'name': row['name'], 'source_identity': old_id, 'code': new_id})

def identifier(value):
    if not isinstance(value, str):
        return value
    for old, new in identity_map.items():
        if value == old:
            return new
        if value.startswith(old + ':'):
            return new + value[len(old):]
    return value

counts = {}
with sqlite3.connect(target) as db:
    db.execute('BEGIN IMMEDIATE')
    try:
        for table, payload in snapshot['tables'].items():
            actual = [row[1] for row in db.execute('PRAGMA table_info(' + '"' + table.replace('"', '""') + '")')]
            columns = payload['columns']
            if not actual or set(columns) != set(actual):
                raise ValueError('Schema mismatch: ' + table)
            quote = lambda name: '"' + name.replace('"', '""') + '"'
            if db.execute('SELECT COUNT(*) FROM ' + quote(table)).fetchone()[0]:
                raise ValueError('Destination must be empty: ' + table)
            statement = 'INSERT INTO ' + quote(table) + '(' + ','.join(map(quote, columns)) + ') VALUES(' + ','.join('?' for _ in columns) + ')'
            for source in payload['rows']:
                row = dict(source)
                for column in ('id', 'owner', 'leader', 'buyer_id'):
                    if column in row:
                        row[column] = identifier(row[column])
                for column in ('locked_until', 'last_seen', 'action_at'):
                    if column in row:
                        row[column] = 0
                db.execute(statement, [row[column] for column in columns])
            counts[table] = db.execute('SELECT COUNT(*) FROM ' + quote(table)).fetchone()[0]
            if counts[table] != len(payload['rows']):
                raise ValueError('Row count mismatch: ' + table)
        recovery_path = root / '.migration/session-recovery.json'
        recovery_path.parent.mkdir(mode=0o700, exist_ok=True)
        recovery_path.write_text(json.dumps(recovery, ensure_ascii=False, indent=2))
        os.chmod(recovery_path, 0o600)
        db.commit()
    except Exception:
        db.rollback()
        raise
print(json.dumps({'imported_rows': sum(counts.values()), 'tables': counts, 'recovered_sites_profiles': len(recovery), 'recovery_file': '.migration/session-recovery.json'}))
