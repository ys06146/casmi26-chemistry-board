import {db,json,fail} from "../shared";
import {identity,publicMember,type StoredMember} from "./shared";
import caseIndex from "../../../lib/case-index.json";
import {emptyCase,defaultFocus,defaultExperiments} from "../../../lib/dashboard-config";
export const dynamic="force-dynamic";
export async function GET(){try{
 const who=await identity();
 const [people,items,history]=await Promise.all([
 db().prepare("SELECT id,alias,focus,role,status FROM dashboard_members WHERE status='active' ORDER BY role,alias").all<StoredMember>(),
 db().prepare("SELECT id,kind,data,version,updated_at,updated_by FROM dashboard_items").all<{id:string;kind:string;data:string;version:number;updated_at:number;updated_by:string}>(),
 db().prepare("SELECT id,kind,entity_id,actor_alias,summary,before_data,after_data,created_at FROM dashboard_activity ORDER BY created_at DESC LIMIT 60").all()]);
 const saved=new Map(items.results.map(r=>[r.id,{id:r.id,kind:r.kind,data:JSON.parse(r.data),version:r.version,updatedAt:r.updated_at,updatedBy:r.updated_by}]));
 const item=(id:string,kind:string,data:unknown)=>saved.get(id)||{id,kind,data,version:0,updatedAt:null,updatedBy:null};
 const experimentIds=new Set(defaultExperiments.map(e=>e.id));
 const requests=who.isOwner||(who.member?.role==="admin"&&who.member.status==="active")?await db().prepare("SELECT id,alias,focus,role,status FROM dashboard_members WHERE status='pending' ORDER BY created_at").all<StoredMember>():{results:[]};
 return json({viewer:{signedIn:!!who.user,isOwner:who.isOwner,member:who.member?publicMember(who.member):null},members:people.results.map(publicMember),requests:requests.results.map(publicMember),cases:caseIndex.map(c=>item(c.id,"case",emptyCase())),focus:item("team-focus","focus",defaultFocus),experiments:[...defaultExperiments.map(e=>item(e.id,"experiment",e.data)),...Array.from(saved.values()).filter(e=>e.kind==="experiment"&&!experimentIds.has(e.id))],activity:history.results});
}catch(e){return fail(e);}}
