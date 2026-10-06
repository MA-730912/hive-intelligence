import "./globals.css";
import Link from "next/link";
export const metadata = { title: "HIVE Intelligence", description: "Clinical AI infrastructure and intelligence platform" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><div className="shell"><header className="nav"><Link className="brand" href="/">HIVE <span>INTELLIGENCE</span></Link><nav className="navlinks"><Link href="/dashboard">Dashboard</Link><Link href="/workspace">Clinical Workspace</Link><Link href="/knowledge">Clinical Knowledge</Link><Link href="/knowledge/documents">Documents</Link><Link href="/clinician">Clinician Hub</Link><Link href="/case-studies">Case Studies</Link><Link href="/demo/firmus">Firmus Demo</Link></nav></header>{children}</div></body></html>}
