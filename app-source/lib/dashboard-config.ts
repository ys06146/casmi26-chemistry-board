export const caseStatuses = {not_started:"Not reviewed",in_progress:"In progress",needs_input:"Needs input",complete:"Complete"} as const;
export const experimentStatuses = {planned:"Planned",running:"Running",review:"Needs review",complete:"Complete"} as const;
export const focusOptions = ["Chemistry","Modeling","Data & experiments","Coordination"];
export type CaseWork = {assignee:string;status:keyof typeof caseStatuses;dueDate:string;nextStep:string;notes:string};
export type Experiment = {title:string;question:string;result:string;decision:string;status:keyof typeof experimentStatuses;assignee:string;dueDate:string;archived:boolean};
export type TeamFocus = {goal:string;meeting:string;decisions:string};
export type WorkItem<T> = {id:string;kind:string;data:T;version:number;updatedAt:number|null;updatedBy:string|null};
export type Member = {id:string;alias:string;focus:string;role:string;status:string};
export type Activity = {id:string;kind:string;entity_id:string;actor_alias:string;summary:string;before_data:string;after_data:string;created_at:number};
export type DashboardData = {viewer:{signedIn:boolean;isOwner:boolean;member:Member|null};members:Member[];requests:Member[];cases:WorkItem<CaseWork>[];experiments:WorkItem<Experiment>[];focus:WorkItem<TeamFocus>;activity:Activity[]};
export const emptyCase = ():CaseWork => ({assignee:"",status:"not_started",dueDate:"",nextStep:"",notes:""});
export const defaultFocus:TeamFocus = {goal:"Review the 11 rank regressions, compare the 6 improved cases, and agree on the next experiment.",meeting:"",decisions:"Which chemical evidence can distinguish the competing structures? What additional measurement would resolve the uncertainty?"};
export const defaultExperiments:{id:string;data:Experiment}[] = [
 {id:"exp-weight-ablation",data:{title:"Separate the three ranking changes",question:"Replay the saved candidate scores across the two DreaMS weights, two ICEBERG weights, and two fusion depths. Keep the candidate pool fixed.",result:"",decision:"",status:"planned",assignee:"",dueDate:"",archived:false}},
 {id:"exp-tautomer-grouping",data:{title:"Compare grouping before rank fusion",question:"Compare evaluation-equivalent tautomer grouping against the preserved v3 baseline, without rewarding duplicate representations.",result:"",decision:"",status:"planned",assignee:"",dueDate:"",archived:false}},
 {id:"exp-chemical-evidence",data:{title:"Test a chemistry-informed support feature",question:"After chemical review, choose one supported structural or spectral clue. Record alternative explanations and validate its effect on separate molecules.",result:"",decision:"",status:"planned",assignee:"",dueDate:"",archived:false}}
];
