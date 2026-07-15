import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-grid">
      <div><Link href="/" className="brand"><span className="brand-mark"><Building2 size={19}/></span>EstatePilot AI</Link><p style={{color:'#a9c0b6',lineHeight:1.7,maxWidth:320,marginTop:18}}>Pakistan’s intelligent property journey—from discovery to viewing, with clarity at every step.</p></div>
      <div><h4>Discover</h4><div className="footer-links"><Link href="/properties">All properties</Link><Link href="/properties?purpose=buy">Buy</Link><Link href="/properties?purpose=rent">Rent</Link><Link href="/compare">Compare</Link></div></div>
      <div><h4>Company</h4><div className="footer-links"><Link href="/#about">About</Link><Link href="/#agents">Agents</Link><Link href="/dashboard">For agencies</Link><Link href="/auth">Sign in</Link></div></div>
      <div><h4>Pakistan</h4><div className="footer-links"><span>Islamabad</span><span>Lahore</span><span>Karachi</span><span>Rawalpindi</span></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 EstatePilot AI. Built for Pakistan.</span><span>Privacy · Terms · Data policy</span></div>
  </div></footer>
}
