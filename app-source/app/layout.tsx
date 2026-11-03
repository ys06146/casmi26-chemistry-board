import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"CASMI26 Chemistry Desk",description:"Compare structures, interpret MS/MS evidence, and turn chemical questions into controlled experiments."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}

