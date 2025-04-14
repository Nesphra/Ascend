// root app layout
import NavBar from "@/components/navBar"
import Footer from "@/components/footer";

import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";

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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  const { data: profile } = await supabase
  .from('profiles')
  .select()
  .eq('profile_id', user?.id)
  .single()

  console.log(user?.id)

  return (
    <html lang="en" className={inriaSans.className} suppressHydrationWarning>
        <body className=" text-foreground">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <Theme appearance="inherit" accentColor="red" grayColor="slate" panelBackground="solid">
                <main className="flex min-h-screen flex-col justify-between items-center w-full">
                    <NavBar user={user} profile={profile}></NavBar>
                    <div className="flex-grow flex justify-center mt-[100px] w-full">
                      <div className="w-4/5 max-w-6xl">
                        {children}
                      </div>
                    </div>
                    <Footer/>
                </main>
              </Theme>
            </ThemeProvider>
        </body>
    </html>
  );
}
