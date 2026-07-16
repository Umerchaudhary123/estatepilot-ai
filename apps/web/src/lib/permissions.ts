export type WorkspaceRole='manager'|'agent'|'support'
export type SessionUser={id:string;email:string;name:string;role:WorkspaceRole}
const access:Record<WorkspaceRole,ReadonlySet<string>>={manager:new Set(['overview','leads','pipeline','conversations','properties','appointments','workflows','knowledge','ai-settings','analytics','team','integrations','billing','settings']),agent:new Set(['overview','leads','pipeline','conversations','properties','appointments','workflows','knowledge']),support:new Set(['overview','leads','conversations','appointments'])}
export function canAccess(role:WorkspaceRole,section:string){return access[role].has(section)}
