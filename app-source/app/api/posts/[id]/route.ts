import {db,json,actor,body,id,fail,Fault} from "../../shared";
export const dynamic="force-dynamic";
type Context={params:Promise<{id:string}>};
export async function DELETE(req:Request,ctx:Context){try{
 const user=await actor(req),postId=id((await ctx.params).id);
 const result=await db().prepare("UPDATE chemistry_posts SET deleted_at=? WHERE id=? AND owner_id=? AND deleted_at IS NULL").bind(Date.now(),postId,user.userId).run();
 if(!result.meta.changes)throw new Fault(404,"This post is unavailable or does not belong to you.");return json({deleted:true});
}catch(e){return fail(e);}}
export async function PATCH(req:Request,ctx:Context){try{
 const user=await actor(req),postId=id((await ctx.params).id),b=await body(req);let result;
 if(b.action==="restore")result=await db().prepare("UPDATE chemistry_posts SET deleted_at=NULL WHERE id=? AND owner_id=? AND deleted_at IS NOT NULL").bind(postId,user.userId).run();
 else if(b.action==="resolve"||b.action==="reopen")result=await db().prepare("UPDATE chemistry_posts SET status=? WHERE id=? AND owner_id=? AND deleted_at IS NULL").bind(b.action==="resolve"?"resolved":"open",postId,user.userId).run();
 else throw new Fault(400,"Unknown action.");
 if(!result.meta.changes)throw new Fault(404,"This post is unavailable or does not belong to you.");return json({updated:true});
}catch(e){return fail(e);}}

