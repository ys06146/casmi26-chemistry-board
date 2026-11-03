import {getChatGPTUser} from "../../chatgpt-auth";
import {db,actor,Fault,field} from "../shared";
import {caseStatuses,experimentStatuses,focusOptions,type Member} from "../../../lib/dashboard-config";
// This existing post was verified as the site owner's contribution before deployment.
// Ownership is read server-side; public names and client-supplied IDs never grant access.
export const OWNER_ANCHOR_POST = "928f18a3-e066-4d4f-bd36-9598c770d8f8";
export type StoredMember = Member & {user_id:string};
export async function identity(){
 const user=await getChatGPTUser();if(!user)return {user:null,isOwner:false,member:null};
 const [anchor,member]=await Promise.all([db().prepare("SELECT owner_id FROM chemistry_posts WHERE id=?").bind(OWNER_ANCHOR_POST).first<{owner_id:string}>(),db().prepare("SELECT id,user_id,alias,focus,role,status FROM dashboard_members WHERE user_id=?").bind(user.userId).first<StoredMember>()]);
 return {user,isOwner:anchor?.owner_id===user.userId,member};
}
export const publicMember=(m:StoredMember|Member):Member=>({id:m.id,alias:m.alias,focus:m.focus,role:m.role,status:m.status});
export async function teamActor(req:Request){await actor(req);const who=await identity();if(!who.member||who.member.status!=="active")throw new Fault(403,"Join the team and wait for approval before editing shared work.");return {...who,member:who.member};}
export function choice(value:unknown,options:string[],name:string){const v=field(value,name,1,80);if(!options.includes(v))throw new Fault(400,"Choose a valid "+name.toLowerCase()+".");return v;}
export function due(value:unknown){const v=field(value??"","Due date",0,10);if(v&&(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v))throw new Fault(400,"Use a valid due date.");return v;}
export async function assignee(value:unknown){const v=field(value??"","Assignee",0,36);if(v&&!await db().prepare("SELECT id FROM dashboard_members WHERE id=? AND status='active'").bind(v).first())throw new Fault(400,"Choose an active team member or Unassigned.");return v;}
export async function validateItem(kind:string,value:unknown){
 if(!value||typeof value!=="object"||Array.isArray(value))throw new Fault(400,"Work details are required.");const d=value as Record<string,unknown>;
 if(kind==="case")return {assignee:await assignee(d.assignee),status:choice(d.status,Object.keys(caseStatuses),"Status"),dueDate:due(d.dueDate),nextStep:field(d.nextStep??"","Next step",0,300),notes:field(d.notes??"","Notes",0,2000)};
 if(kind==="focus")return {goal:field(d.goal,"Team goal",3,500),meeting:field(d.meeting??"","Next meeting",0,160),decisions:field(d.decisions??"","Decisions needed",0,1500)};
 return {title:field(d.title,"Experiment title",3,180),question:field(d.question,"Experiment question",3,2000),result:field(d.result??"","Results",0,3000),decision:field(d.decision??"","Decision",0,1500),status:choice(d.status,Object.keys(experimentStatuses),"Status"),assignee:await assignee(d.assignee),dueDate:due(d.dueDate),archived:d.archived===true};
}
export {focusOptions};
