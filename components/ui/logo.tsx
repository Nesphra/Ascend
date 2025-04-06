'use client'
import Image from "next/image";

import LightIcon from "@/components/img/Ascend_light.png"
import DarkIcon from "@/components/img/Ascend_Dark.png"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Logo = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const ICON_SIZE = 50
    return (
        <>
            {theme === "light" ? (
                <Image src={LightIcon} width={ICON_SIZE} alt="light icon"/>
            ) : (
                <Image src={DarkIcon} width={ICON_SIZE} alt="dark icon"/>
            )}
        </>
    );
}
 
export default Logo;