import {getChatGPTUser} from "../../chatgpt-auth";
import {db,json,actor,body,field,id,fail,Fault} from "../shared";
export const dynamic="force-dynamic";
export async function GET(req:Request){try{
 const postId=id(new URL(req.url).searchParams.get("post")),user=await getChatGPTUser();
 const rows=await db().prepare("SELECT r.id,r.post_id,r.author,r.body,r.created_at,(r.owner_id=?) AS owned FROM chemistry_replies r JOIN chemistry_posts p ON p.id=r.post_id WHERE r.post_id=? AND r.deleted_at IS NULL AND p.deleted_at IS NULL ORDER BY r.created_at LIMIT 300").bind(user?.userId||"",postId).all();return json({replies:rows.results});
}catch(e){return fail(e);}}
export async function POST(req:Request){try{
 const user=await actor(req),b=await body(req),replyId=id(b.id),postId=id(b.postId),author=field(b.author,"Display name",1,60),message=field(b.body,"Reply",2,5000),now=Date.now();
 const post=await db().prepare("SELECT id FROM chemistry_posts WHERE id=? AND deleted_at IS NULL").bind(postId).first();if(!post)throw new Fault(404,"This post is no longer available.");
 const existing=await db().prepare("SELECT owner_id FROM chemistry_replies WHERE id=?").bind(replyId).first<{owner_id:string}>();if(existing){if(existing.owner_id===user.userId)return json({id:replyId,reused:true});throw new Fault(409,"Please start a new reply.");}
 const result=await db().prepare("INSERT INTO chemistry_replies (id,post_id,owner_id,author,body,created_at) SELECT ?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM chemistry_replies WHERE owner_id=? AND created_at>?)<30").bind(replyId,postId,user.userId,author,message,now,user.userId,now-3600000).run();
 if(!result.meta.changes)throw new Fault(429,"Too many replies in the past hour. Please try later.");return json({id:replyId},201);
}catch(e){return fail(e);}}

