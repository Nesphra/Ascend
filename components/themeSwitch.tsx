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
    const styling = "flex hover:bg-gray-600 hover:bg-opacity-20 rounded justify-center items-center p-2";

    return (
        <div>
            {theme === "light" ? (
                <button onClick={() => setTheme("dark")} className={styling}><Moon strokeWidth={1} size={ICON_SIZE}/></button>
            ) : (
                <button onClick={() => setTheme("light")} className={styling}><Sun strokeWidth={1} size={ICON_SIZE}/></button>
            )}
        </div>
    );
}
 
export default themeSwitch;