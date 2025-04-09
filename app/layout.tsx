import NavBar from "@/components/navBar"

import { Inria_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const inriaSans = Inria_Sans({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inriaSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <NavBar></NavBar>
              <div className="flex p-[50px] pb-[100px] justify-center h-screen absolute items-center">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
