import {gameDb} from '@/lib/game-db';
export async function GET(){try{await gameDb().prepare('SELECT 1 AS ready').first();return Response.json({status:'ok'});}catch{return Response.json({status:'unavailable'},{status:503});}}
