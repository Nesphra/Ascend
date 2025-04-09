'use client'
import { Menu } from "lucide-react";
import Logo from "@/components/ui/logo"
import Theme from "./themeSwitch";
import { signOutAction } from "@/app/actions";
import { useAuth } from "@/app/Hooks/authProvider";

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/5 z-10">
            <div className="max-w-6xl lg:w-4/5 w-full flex justify-center h-[75px]">
                <div className="flex justify-between w-full items-cente m-5">
                    <a href="/" className="flex items-center">
                        <Logo/>
                        <h1 className="font-bold">Ascend</h1>
                    </a>
                    <div className="flex items-center gap-2">
                        <Theme/>
                        <button className="lg:hidden hover:bg-red-300 hover:bg-opacity-10 p-2 rounded"><Menu strokeWidth={1} size={18}/></button>
                        <form action={signOutAction}>
                            <button type="submit">Log Off</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;