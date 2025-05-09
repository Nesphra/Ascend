// dashboard page
'use client';

import { ActivityCalendar, ThemeInput } from 'react-activity-calendar'
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";

const dataTimeFrame = [
  {
    date: '2025-01-01',
    count: 0,
    level: 0,
  },
  {
    date: '2025-12-31',
    count: 0,
    level: 0,
  },
]

export default function DashboardPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const minimalTheme: ThemeInput = {
    light: ['hsl(0, 0%, 92%)', 'crimson'],
    dark: ['hsl(0, 0%, 22%)', 'crimson'],
  }

  return (
    <div className="flex flex-col px-10 gap-6 w-full items-center">
      <div className="flex flex-col gap-3 w-screen items-center p-6">
        <ActivityCalendar maxLevel={4} data={dataTimeFrame} theme={minimalTheme} colorScheme={theme === "light" ? "light" : "dark"}/>
      </div>
      <div className="flex w-full gap-6">
        <div>
          Here goes the miles climbed system.
        </div>
        <div className="flex-1 flex flex-row justify-between items-center">
          <Text size="4" weight="bold">Paths</Text>
          <Button variant="surface">
            <a>Create</a>
            <Plus size={17}/>
          </Button>
        </div>
      </div>
    </div>
  );
}
