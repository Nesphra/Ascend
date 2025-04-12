'use client';

import { useAuth } from "@/app/Hooks/authProvider";
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar'
import { useTheme } from "next-themes";

const data = [
  {
    date: '2024-06-23',
    count: 2,
    level: 1,
  },
  {
    date: '2024-08-02',
    count: 16,
    level: 2,
  },
  {
    date: '2024-11-29',
    count: 11,
    level: 3,
  },
  {
    date: '2025-11-29',
    count: 11,
    level: 3,
  },
]

export default function DashboardPage() {
  const { user } = useAuth();

  const minimalTheme: ThemeInput = {
    light: ['hsl(0, 0%, 92%)', 'rebeccapurple'],
    dark: ['hsl(0, 0%, 22%)', 'rebeccapurple'],
  }
  

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* <ActivityCalendar maxLevel={3} data={data} theme={minimalTheme} colorScheme={theme === "light" ? "light" : "dark"}/> */}
    </div>
  );
}
