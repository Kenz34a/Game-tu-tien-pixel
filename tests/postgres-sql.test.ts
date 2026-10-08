import assert from 'node:assert/strict';
import {postgresSql} from '../lib/postgres-sql';
import {RANKING_BOARDS} from '../lib/rpg/ranking-defs';
assert.equal(postgresSql("SELECT '?' AS literal,? AS value, 'it''s ?' AS text"),"SELECT '?' AS literal,$1 AS value, 'it''s ?' AS text");
assert.equal(postgresSql('SELECT MAX(id),MIN(hp,?),MAX(0,hp-?) FROM rpg_profiles'),'SELECT MAX(id),LEAST(hp,$1),GREATEST(0,hp-$2) FROM rpg_profiles');
assert.equal(postgresSql('INSERT OR IGNORE INTO a(id) VALUES(?)'),'INSERT INTO a(id) VALUES($1) ON CONFLICT DO NOTHING');
for(const board of RANKING_BOARDS){const sql=postgresSql(`SELECT ${board.value} FROM rpg_profiles WHERE ${board.eligible} ORDER BY ${board.order}`);assert(!sql.includes('json_extract')&&!sql.includes('json_each(')&&!sql.includes('json_array_length'));}
console.log('PASS: bound parameters, quoted question marks, scalar/aggregate min/max, conflict semantics and all eight JSON ranking expressions.');
