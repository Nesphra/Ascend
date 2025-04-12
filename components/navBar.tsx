"use client";
import { Menu, ArrowRight, LogOut, X } from "lucide-react";
import Logo from "@/components/ui/logo";

import ThemeSwitcher from "./themeSwitch";
import ThemePicker from "@/components/themePicker"

import { signOutAction } from "@/app/actions";
import { useAuth } from "@/app/Hooks/authProvider";

import { useState } from "react";
import { Button, Text, HoverCard, Separator } from "@radix-ui/themes";
import { useThemeContext } from "@radix-ui/themes";


const Navbar = () => {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const accentColor = useThemeContext().accentColor;

    const liStyle = "opacity-60 hover:opacity-100 transition-opacity duration-200 font-regular"

    return (
        <div className="w-full">
            <div className="flex justify-center relative z-20 lg:border-b lg:border-b-foreground/3">
                <div
                    className={`w-full flex justify-center h-[75px]`}
                >
                    <div className="flex lg:w-4/5 justify-between w-full items-cente m-5 lg:px-8">
                        <a href="/" className="flex items-center">
                            <Logo />
                            <p className="font-bold">Ascend</p>
                        </a>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center justify-center gap-3">
                                    <ul className="hidden lg:flex text-sm gap-3">
                                        <li className={liStyle}>
                                            <a href="/dashboard">Dashboard</a>
                                        </li>
                                        <li className={liStyle}>
                                            <a href="/challenges">Challenges</a>
                                        </li>
                                        <li className={liStyle}>
                                            <a href="/friends">Friends</a>
                                        </li>
                                    </ul>
                                    <ThemeSwitcher />
                                    <div className="hidden lg:flex">
                                        <HoverCard.Root>
                                            <HoverCard.Trigger>
                                                <Button variant="soft" asChild>
                                                    <a href="/profile">
                                                        <Text
                                                            size="3"
                                                            weight="regular"
                                                            className=""
                                                        >
                                                            {user.email?.charAt(0).toUpperCase()}
                                                        </Text>
                                                    </a>
                                                </Button>
                                            </HoverCard.Trigger>

                                            <HoverCard.Content>
                                                <div className="flex flex-col m-1 gap-1">
                                                    <Text
                                                        size="1"
                                                        weight="regular"
                                                        className="opacity-60"
                                                    >
                                                        Logged in as
                                                    </Text>
                                                    <Text size="2" className="mb-2">
                                                        {user.email}
                                                    </Text>
                                                    <Button onClick={signOutAction} variant="outline" asChild>
                                                        <a>Logout</a>
                                                    </Button>
                                                    <Separator my="3" size="4"/>
                                                    <Text
                                                        size="1"
                                                        weight="regular"
                                                        className="opacity-60"
                                                    >
                                                        Color theme:
                                                    </Text>
                                                    <ThemePicker/>
                                                </div>
                                            </HoverCard.Content>
                                        </HoverCard.Root>
                                    </div>
                                    <div className="hidden lg:flex cursor-pointer">
                                        <Button onClick={signOutAction} variant="outline" asChild>
                                            <a>Logout</a>
                                        </Button>
                                    </div>
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="lg:hidden hover:bg-red-300 hover:bg-opacity-10 rounded"
                                    >
                                        {expanded? <X strokeWidth={1} size={18}/> : <Menu strokeWidth={1} size={18} />}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 justify-center">
                                    <ThemeSwitcher />
                                    <a
                                        href="/sign-up"
                                        className="hidden lg:flex opacity-65 bg-gray-600 bg-opacity-0 hover:bg-opacity-20 px-3 py-2 rounded"
                                    >
                                        <Text size="2" weight={"regular"}>
                                            Sign Up
                                        </Text>
                                    </a>
                                    <Button variant="surface">
                                        <a
                                            href="/sign-in"
                                            className="flex items-center gap-1 justify-center"
                                        >
                                            <Text>Login</Text>
                                            <ArrowRight size={12} />
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-full lg:hidden flex flex-col z-10 ${expanded == false ? "-translate-y-full" : ""} border-b border-b-foreground/3 transition-transform duration-300`}>
                <ul className="flex flex-col text-2xl p-5 my-5 gap-3 font-bold">
                    <li>
                        <a href="/dashboard">Dashboard</a>
                    </li>
                    <li>
                        <a href="/challenges">Challenges</a>
                    </li>
                    <li>
                        <a href="/friends">Friends</a>
                    </li>
                </ul>
                <div className={`flex flex-row w-full justify-between items-center p-5 mt-10 ${expanded == false ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
                    <div className="flex flex-row items-center gap-3">
                        <Button variant="soft" asChild>
                            <a href="/profile">
                                <Text
                                    size="5"
                                    weight="regular"
                                >
                                    {user?.email?.charAt(0).toUpperCase()}
                                </Text>
                            </a>
                        </Button>
                        <div className="flex flex-col">
                            <Text
                                size="2"
                                weight="regular"
                            >
                                {user?.email}
                            </Text>
                            <Text
                                size="1"
                                color={accentColor}
                            >
                                <a href="/profile">View Profile</a>
                            </Text>
                        </div>
                    </div>
                    <Button onClick={signOutAction} variant="surface">
                        <LogOut size={18}/>
                        <a>Logout</a>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
