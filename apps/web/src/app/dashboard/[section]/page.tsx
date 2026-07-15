import { DashboardSection } from '@/components/dashboard-section'

const sections=['leads','pipeline','conversations','properties','appointments','workflows','knowledge','analytics','team','ai-settings','integrations','billing','settings']
export function generateStaticParams(){return sections.map((section)=>({section}))}
export default async function SectionPage({params}:{params:Promise<{section:string}>}){const {section}=await params;return <DashboardSection section={section}/>}
