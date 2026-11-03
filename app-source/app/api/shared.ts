import {getChatGPTUser} from "../chatgpt-auth";
import {env} from "cloudflare:workers";
export const categories=["Structure differences","Fragments and neutral losses","Adducts and acquisition","Tautomers and normalization","Experiment design","Other"];
export function db(){if(!env.DB)throw new Error("Database is not configured.");return env.DB;}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});}
export async function actor(req:Request){
 const origin=req.headers.get("origin"),expected=new URL(req.url).origin;
 if(req.headers.get("x-chemistry-action")!=="write"||!origin||origin!==expected)throw new Fault(403,"Please use the form on this website.");
 const user=await getChatGPTUser();if(!user)throw new Fault(401,"Sign in to post or manage your own contributions.");return user;
}
export class Fault extends Error{constructor(public status:number,message:string){super(message);}}
export async function body(req:Request){
 const reader=req.body?.getReader();if(!reader)throw new Fault(400,"The request body is missing.");
 let count=0;const chunks:Uint8Array[]=[];
 while(true){const part=await reader.read();if(part.done)break;count+=part.value.length;if(count>32000){await reader.cancel();throw new Fault(413,"This contribution is too long.");}chunks.push(part.value);}
 const bytes=new Uint8Array(count);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{const value=JSON.parse(new TextDecoder().decode(bytes));if(!value||typeof value!=="object"||Array.isArray(value))throw new Error();return value;}catch{throw new Fault(400,"Invalid request.");}
}
export function field(value:unknown,name:string,min:number,max:number){if(typeof value!=="string")throw new Fault(400,name+" is required.");const s=value.trim();if(s.length<min||s.length>max)throw new Fault(400,name+" must be "+min+"–"+max+" characters.");return s;}
export function id(value:unknown){return field(value,"ID",36,36).match(/^[a-f0-9-]{36}$/i)?.[0]||(()=>{throw new Fault(400,"Invalid ID.");})();}
export function fail(e:unknown){if(e instanceof Fault)return json({error:e.message},e.status);console.error("Chemistry request failed",e instanceof Error?e.message:"unknown");return json({error:"We could not save this change. Please try again."},500);}

