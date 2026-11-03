import {db,json,body,field,id,fail,Fault} from "../../shared";
import {teamActor,choice,validateItem} from "../shared";
import caseIndex from "../../../../lib/case-index.json";
import {caseStatuses,experimentStatuses,defaultExperiments,defaultFocus,emptyCase} from "../../../../lib/dashboard-config";
export const dynamic="force-dynamic";
export async function PATCH(req:Request){try{
 const who=await teamActor(req),b=await body(req),kind=choice(b.kind,["case","experiment","focus"],"Work type"),entity=field(b.id,"Work ID",1,80),mutation=id(b.mutationId);
 if(kind==="case"&&!caseIndex.some(c=>c.id===entity)||kind==="focus"&&entity!=="team-focus"||kind==="experiment"&&!defaultExperiments.some(e=>e.id===entity)&&!/^exp-[a-f0-9-]{36}$/.test(entity))throw new Fault(400,"Unknown work item.");
 if(!Number.isInteger(b.version)||b.version<0||b.version>1000000)throw new Fault(400,"A valid work version is required.");
 const current=await db().prepare("SELECT kind,data,version,mutation_id FROM dashboard_items WHERE id=?").bind(entity).first<{kind:string;data:string;version:number;mutation_id:string}>();
 if(current?.mutation_id===mutation)return json({saved:true,reused:true,version:current.version});
 if(current&&(current.kind!==kind||current.version!==b.version)||!current&&b.version!==0)throw new Fault(409,"Someone updated this item. Reload the latest values before saving; your draft has been kept.");
 const data=await validateItem(kind,b.data),now=Date.now(),version=b.version+1,encoded=JSON.stringify(data);
 const fallback=kind==="case"?emptyCase():kind==="focus"?defaultFocus:defaultExperiments.find(e=>e.id===entity)?.data||{};
 const old=current?.data||JSON.stringify(fallback);
 const status="status" in data?data.status:"";
 const statusLabel=kind==="case"?caseStatuses[status as keyof typeof caseStatuses]:kind==="experiment"?experimentStatuses[status as keyof typeof experimentStatuses]:"";
 const summary=kind==="focus"?"Updated the team focus and meeting notes":kind==="case"?entity+" · "+statusLabel:("title" in data?data.title:entity)+" · "+statusLabel;
 const statement=current?db().prepare("UPDATE dashboard_items SET data=?,version=?,updated_at=?,updated_by=?,mutation_id=? WHERE id=? AND version=? AND NOT EXISTS(SELECT 1 FROM dashboard_activity WHERE id=?)").bind(encoded,version,now,who.member.id,mutation,entity,b.version,mutation):db().prepare("INSERT INTO dashboard_items (id,kind,data,version,updated_at,updated_by,mutation_id) SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM dashboard_activity WHERE id=?) ON CONFLICT(id) DO NOTHING").bind(entity,kind,encoded,version,now,who.member.id,mutation,mutation);
 const audit=db().prepare("INSERT INTO dashboard_activity (id,kind,entity_id,actor_id,actor_alias,summary,before_data,after_data,created_at) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM dashboard_items WHERE id=? AND mutation_id=?) ON CONFLICT(id) DO NOTHING").bind(mutation,kind,entity,who.member.id,who.member.alias,summary,old,encoded,now,entity,mutation);
 const result=await db().batch([statement,audit]);if(!result[0].meta.changes){
  const latest=await db().prepare("SELECT version,mutation_id FROM dashboard_items WHERE id=?").bind(entity).first<{version:number;mutation_id:string}>();
  if(latest?.mutation_id===mutation)return json({saved:true,reused:true,version:latest.version});
  throw new Fault(409,"Someone updated this item. Reload the latest values before saving; your draft has been kept.");
 }
 return json({saved:true,version});
}catch(e){return fail(e);}}
