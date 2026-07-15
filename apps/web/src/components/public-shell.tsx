import { AIChat } from './ai-chat'
import { Footer } from './footer'
import { SiteHeader } from './site-header'

export function PublicShell({children}:{children:React.ReactNode}) { return <><SiteHeader/><main>{children}</main><Footer/><AIChat/></> }
