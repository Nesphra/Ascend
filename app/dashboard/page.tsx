'use client';

import { useAuth } from "@/app/Hooks/authProvider";
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar'
import { useTheme } from "next-themes";

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
  // const { user } = useAuth();
  const { theme } = useTheme();
  
  const minimalTheme: ThemeInput = {
    light: ['hsl(0, 0%, 92%)', 'crimson'],
    dark: ['hsl(0, 0%, 22%)', 'crimson'],
  }

  return (
    <div className="flex flex-col px-10 gap-6 w-full">
      <div className="flex flex-col gap-3">
        <Text size="4" weight="bold">Progress Grid</Text>
        <ActivityCalendar maxLevel={4} data={dataTimeFrame} theme={minimalTheme} colorScheme={theme === "light" ? "light" : "dark"}/>
      </div>
      <div>
        <div className="flex flex-row w-full justify-between items-center">
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
