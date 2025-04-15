// timer component
import React from "react";
import { useStopwatch } from "react-timer-hook";
import { Tabs } from "radix-ui";
import { Button, Progress, Text } from "@radix-ui/themes";
import { Check, X } from "lucide-react";

interface TimerProps {
  onSubmitTime?: (seconds: number) => void;
}

export default function Timer({ onSubmitTime }: TimerProps) {
  const {
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, interval: 1000 });

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const handleSubmit = () => {
    const totalSecondsElapsed = Math.round(
      days * 86400 + hours * 3600 + minutes * 60 + seconds
    );
    onSubmitTime?.(totalSecondsElapsed);
    reset(undefined, false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center gap-2">
        <Progress
            size="2"
            variant="soft"
            value={3}
          />
      </div>
      <Tabs.Root
        defaultValue="stopwatch"
        className="w-full flex flex-col items-center justify-center bg-foreground/5 rounded-md p-5"
      >
        <Tabs.List>
          <Tabs.Trigger
            value="stopwatch"
            className="data-[state=active]:bg-background/60 data-[state=active]:font-bold px-2 py-1 rounded"
          >
            Stopwatch
          </Tabs.Trigger>
          <Tabs.Trigger
            value="timer"
            className="data-[state=active]:bg-background/60 data-[state=active]:font-bold px-2 py-1 rounded"
          >
            Timer
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="stopwatch"
          className="flex flex-col justify-center items-center px-10"
        >
          <div className="text-8xl font-bold my-5">
            {hours > 0 ? (
              <span>
                {days * 24 + hours}:{minutes}:{formattedSeconds}
              </span>
            ) : minutes > 0 ? (
              <span>
                {minutes}:{formattedSeconds}
              </span>
            ) : (
              <span>{formattedSeconds}</span>
            )}
          </div>
          <div className="flex justify-center items-center gap-6">
            {!isRunning && seconds > 0 && (
              <Button
                variant="soft"
                size="2"
                onClick={() => reset(undefined, false)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button size="3" onClick={() => (isRunning ? pause() : start())} asChild>
              {isRunning ? <p>pause</p> : <p>start</p>}
            </Button>
            {!isRunning && seconds > 0 && (
              <Button variant="soft" size="2" onClick={handleSubmit}>
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Tabs.Content>
        <Tabs.Content value="timer">timer</Tabs.Content>
      </Tabs.Root>
    </div>
  );
}