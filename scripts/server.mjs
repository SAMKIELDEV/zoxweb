import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export function acquireServerLock(directory,port) {
 fs.mkdirSync(directory,{recursive:true});
 const file=path.join(directory,`dashboard-${port}.lock`),nonce=randomUUID();
 try {
  const fd=fs.openSync(file,'wx');
  try{fs.writeFileSync(fd,JSON.stringify({pid:process.pid,nonce}));}finally{fs.closeSync(fd)}
 }catch(error){
  if(error.code!=='EEXIST')throw error;
  let owner;try{owner=JSON.parse(fs.readFileSync(file,'utf8'))}catch{throw new Error(`Dashboard on port ${port} is starting. Reuse that instance.`)}
  if(!Number.isInteger(owner.pid)||owner.pid<=0)throw new Error('Invalid dashboard lock; inspect it before restarting.');
  let alive=true;try{process.kill(owner.pid,0)}catch(e){if(e.code==='ESRCH')alive=false;else throw e}
  if(alive)throw new Error(`Dashboard on port ${port} is already running. Reuse that instance.`);
  fs.unlinkSync(file);
  return acquireServerLock(directory,port);
 }
 return ()=>{try{const owner=JSON.parse(fs.readFileSync(file,'utf8'));if(owner.pid===process.pid&&owner.nonce===nonce)fs.unlinkSync(file)}catch(error){if(error.code!=='ENOENT')throw error}};
}
export async function ensurePortAvailable(port) {
 const probe=net.createServer();
 await new Promise((resolve,reject)=>{
  probe.once('error',()=>reject(new Error(`Port ${port} is already in use. Reuse the existing dashboard or stop it before starting another.`)));
  probe.listen({port,host:'0.0.0.0',exclusive:true},()=>probe.close(error=>error?reject(error):resolve()));
 });
}
async function main(){
 const mode=process.argv[2],args=process.argv.slice(3);
 if(!['dev','start'].includes(mode))throw new Error('Use server.mjs dev or start');
 const portIndex=args.findIndex(a=>a==='--port'||a==='-p');
 const port=Number(portIndex<0?3002:args[portIndex+1]);
 if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid dashboard port');
 const release=acquireServerLock(path.resolve('.cache'),port);
 try{await ensurePortAvailable(port)}catch(error){release();throw error}
 const child=spawn(process.execPath,[createRequire(import.meta.url).resolve('next/dist/bin/next'),mode,...args,...(portIndex<0?['--port',String(port)]:[])],{stdio:'inherit',windowsHide:true});
 process.on('exit',release);
 child.on('error',()=>{release();process.exitCode=1});
 child.on('exit',code=>{release();process.exitCode=code??1});
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{child.kill(signal)});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))void main().catch(error=>{console.error(error.message);process.exitCode=1});
