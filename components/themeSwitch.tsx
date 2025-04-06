'use client'
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themeSwitch = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const ICON_SIZE = 18;

    return (
        <div>
            {theme === "light" ? (
                <button onClick={() => setTheme("dark")} className="hover:bg-red-300 hover:bg-opacity-10 p-2 rounded"><Moon strokeWidth={1} size={ICON_SIZE}/></button>
            ) : (
                <button onClick={() => setTheme("light")} className="hover:bg-red-300 hover:bg-opacity-10 p-2 rounded"><Sun strokeWidth={1} size={ICON_SIZE}/></button>
            )}
        </div>
    );
}
 
export default themeSwitch;