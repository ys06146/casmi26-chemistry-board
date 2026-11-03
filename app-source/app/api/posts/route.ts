import {getChatGPTUser} from "../../chatgpt-auth";
import {db,json,actor,body,field,id,fail,Fault,categories} from "../shared";
export const dynamic="force-dynamic";
export async function GET(req:Request){try{
 const user=await getChatGPTUser(),params=new URL(req.url).searchParams,trash=params.get("trash")==="1";
 const caseFilter=field(params.get("case")??"","Case filter",0,80).toLowerCase();
 if(trash&&!user)return json({error:"Sign in to view your deleted posts."},401);
 const caseClause=caseFilter?" AND LOWER(TRIM(case_id))=?":"";
 const values=[user?.userId||"",...(caseFilter?[caseFilter==="general"?"":caseFilter]:[])];
 const sql=trash?"SELECT id,author,category,case_id,title,observed,question,hypothesis,status,created_at,deleted_at,1 AS owned FROM chemistry_posts WHERE owner_id=? AND deleted_at IS NOT NULL":
 "SELECT id,author,category,case_id,title,observed,question,hypothesis,status,created_at,deleted_at,(owner_id=?) AS owned FROM chemistry_posts WHERE deleted_at IS NULL";
 const stmt=db().prepare(sql+caseClause+" ORDER BY created_at DESC LIMIT 200").bind(...values);
 const rows=await stmt.all();return json({posts:rows.results,limit:200});
}catch(e){return fail(e);}}
export async function POST(req:Request){try{
 const user=await actor(req),b=await body(req),postId=id(b.id);
 const author=field(b.author,"Display name",1,60),category=field(b.category,"Category",1,60);
 if(!categories.includes(category))throw new Fault(400,"Choose a category.");
 const caseId=field(b.caseId??"","Case ID",0,80).toLowerCase(),title=field(b.title,"Title",3,160),observed=field(b.observed,"Observations",3,5000),question=field(b.question,"Question",3,3000),hypothesis=field(b.hypothesis??"","Interpretation",0,3000),now=Date.now();
 const existing=await db().prepare("SELECT owner_id FROM chemistry_posts WHERE id=?").bind(postId).first<{owner_id:string}>();
 if(existing){if(existing.owner_id===user.userId)return json({id:postId,reused:true});throw new Fault(409,"Please start a new draft.");}
 const result=await db().prepare("INSERT INTO chemistry_posts (id,owner_id,author,category,case_id,title,observed,question,hypothesis,status,created_at) SELECT ?,?,?,?,?,?,?,?,?,'open',? WHERE (SELECT COUNT(*) FROM chemistry_posts WHERE owner_id=? AND created_at>?)<10").bind(postId,user.userId,author,category,caseId,title,observed,question,hypothesis,now,user.userId,now-3600000).run();
 if(!result.meta.changes)throw new Fault(429,"You have posted several questions recently. Please try again in an hour.");
 return json({id:postId},201);
}catch(e){return fail(e);}}

