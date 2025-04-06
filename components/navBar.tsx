import { Menu } from "lucide-react";
import Logo from "@/components/ui/logo"

import Theme from "./themeSwitch";

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/5">
            <div className="max-w-6xl lg:w-4/5 w-full flex justify-center h-[75px]">
                <div className="flex justify-between w-full items-cente m-5">
                    <a href="/" className="flex items-center">
                        <Logo/>
                        <h1 className="font-bold">Ascend</h1>
                    </a>
                    <li className="lg:flex gap-3 hidden items-center">
                        <ul><a href="/">Home</a></ul>
                        <ul><a href="/sign-in">Sign in</a></ul>
                        <ul><a href="/sign-up">Sign up in</a></ul>
                    </li>
                    <div className="flex items-center gap-2 lg:hidden">
                        <Theme/>
                        <button className="hover:bg-red-300 hover:bg-opacity-10 p-2 rounded"><Menu strokeWidth={1} size={18}/></button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
