'use client'
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themeSwitch = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const ICON_SIZE = 18;

    return (
        <div className="flex justify-center items-center">
            {theme === "light" ? (
                <button onClick={() => setTheme("dark")} className="p-2"><Moon strokeWidth={1} size={ICON_SIZE}/></button>
            ) : (
                <button onClick={() => setTheme("light")} className="p-2"><Sun strokeWidth={1} size={ICON_SIZE}/></button>
            )}
        </div>
    );
}
 
export default themeSwitch;