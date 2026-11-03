import {db,json,actor,id,fail,Fault} from "../../shared";
export const dynamic="force-dynamic";
export async function DELETE(req:Request,ctx:{params:Promise<{id:string}>}){try{
 const user=await actor(req),replyId=id((await ctx.params).id);
 const result=await db().prepare("UPDATE chemistry_replies SET deleted_at=? WHERE id=? AND owner_id=? AND deleted_at IS NULL").bind(Date.now(),replyId,user.userId).run();
 if(!result.meta.changes)throw new Fault(404,"This reply is unavailable or does not belong to you.");return json({deleted:true});
}catch(e){return fail(e);}}

