import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import net from 'node:net';
import {acquireServerLock,ensurePortAvailable} from '../scripts/server.mjs';

test('startup prevents a second instance and releases its owned lock',()=>{
 const directory=path.resolve('.cache','dashboard-lock-test-'+randomUUID());
 const release=acquireServerLock(directory,3002);
 try{assert.throws(()=>acquireServerLock(directory,3002),/already running/);release();const again=acquireServerLock(directory,3002);again();}finally{release();fs.rmdirSync(directory)}
});
test('startup recovers a stale lock without stopping any process',()=>{
 const directory=path.resolve('.cache','dashboard-lock-test-'+randomUUID());fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'dashboard-3002.lock'),JSON.stringify({pid:2147483647,nonce:'stale'}));
 const release=acquireServerLock(directory,3002);try{assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'dashboard-3002.lock'))).pid,process.pid)}finally{release();fs.rmdirSync(directory)}
});
test('startup rejects a port already occupied by a server outside its launcher',async()=>{
 const server=net.createServer();await new Promise(resolve=>server.listen(0,'0.0.0.0',resolve));
 try{await assert.rejects(()=>ensurePortAvailable(server.address().port),/already in use/)}finally{await new Promise(resolve=>server.close(resolve))}
});
