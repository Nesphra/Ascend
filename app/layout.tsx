import NavBar from "@/components/navBar"

import { Inria_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./Hooks/authProvider";

import "@/app/globals.css";
import "@radix-ui/themes/styles.css";

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
            <div className="w-full flex flex-col items-center h-screen">
              <NavBar></NavBar>
              <div className="flex justify-center items-center absolute h-screen">
                <AuthProvider>{children}</AuthProvider>
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
