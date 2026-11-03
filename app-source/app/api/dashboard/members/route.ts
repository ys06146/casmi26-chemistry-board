import {db,json,actor,body,field,id,fail,Fault} from "../../shared";
import {identity,publicMember,choice,focusOptions,type StoredMember} from "../shared";
export const dynamic="force-dynamic";
export async function POST(req:Request){try{
 await actor(req);const who=await identity(),b=await body(req),alias=field(b.alias,"Public display name",1,60),focus=choice(b.focus,focusOptions,"Focus"),now=Date.now();
 const memberId=who.member?.id||crypto.randomUUID(),role=who.isOwner?"admin":"member";
 const status=who.isOwner?"active":who.member?.status==="active"?"active":"pending";
 await db().prepare("INSERT INTO dashboard_members (id,user_id,alias,focus,role,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET alias=excluded.alias,focus=excluded.focus,role=excluded.role,status=excluded.status,updated_at=excluded.updated_at").bind(memberId,who.user!.userId,alias,focus,role,status,now,now).run();
 const member=await db().prepare("SELECT id,alias,focus,role,status FROM dashboard_members WHERE user_id=?").bind(who.user!.userId).first<StoredMember>();return json({member:publicMember(member!)});
}catch(e){return fail(e);}}
export async function PATCH(req:Request){try{
 await actor(req);const who=await identity();if(!who.isOwner&&!(who.member?.role==="admin"&&who.member.status==="active"))throw new Fault(403,"Only the team owner can approve requests.");
 const b=await body(req),target=id(b.id),action=choice(b.action,["approve","decline"],"Action"),now=Date.now();
 const result=await db().prepare("UPDATE dashboard_members SET status=?,updated_at=? WHERE id=? AND status='pending' AND role='member'").bind(action==="approve"?"active":"declined",now,target).run();
 if(!result.meta.changes)throw new Fault(409,"This request has already changed. Refresh the team list.");return json({updated:true});
}catch(e){return fail(e);}}
