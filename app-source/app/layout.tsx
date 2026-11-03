import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"CASMI26 Team Dashboard",description:"Assign chemistry cases, track shared progress, discuss MS/MS evidence, and plan the next experiment."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}

