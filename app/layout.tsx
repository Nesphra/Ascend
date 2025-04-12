import NavBar from "@/components/navBar"

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./Hooks/authProvider";

// UI
import { Inria_Sans } from "next/font/google";
import "@/app/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ascend",
  description: "Climb your way up",
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
      <body className=" text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Theme appearance="inherit" accentColor="red" grayColor="slate" panelBackground="solid">
            <main className="flex flex-col items-center">
              <div className="w-full flex flex-col items-center h-screen">
                <AuthProvider>
                  <NavBar></NavBar>
                    <div className="flex justify-center items-center absolute h-screen">
                      {children}
                    </div>
                </AuthProvider>
              </div>
            </main>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
