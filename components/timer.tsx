// timer component
import React, { useState, useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import { Tabs } from "radix-ui";
import { Button, Progress, Text } from "@radix-ui/themes";
import { X } from "lucide-react";
import { useThemeContext } from "@radix-ui/themes";

interface TimerProps {
  onSubmitTime?: (seconds: number) => void;
  currentProgress: number; // in seconds
  goalTime: number; // in hours
}

export default function Timer({ onSubmitTime, currentProgress, goalTime }: TimerProps) {
  const accentColor = useThemeContext().accentColor;
  const [cachedProgress, setCachedProgress] = useState(currentProgress);
  const loveMessages = ["Keep going!", "You're doing great!", "Almost there!", "Light work!", "Right there!", "You got this!"];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messageVisible, setMessageVisible] = useState(false);

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset: resetTimer,
  } = useStopwatch({ autoStart: false, interval: 1000 });

  // Update cached progress when timer is running
  useEffect(() => {
    if (isRunning) {
      setCachedProgress(currentProgress + totalSeconds);
    }
  }, [totalSeconds, isRunning, currentProgress]);

  // Message rotation effect
  useEffect(() => {
    if (!isRunning) return;
  
    const showNewMessage = () => {
      setCurrentMessageIndex((prevIndex) => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * loveMessages.length);
        } while (newIndex === prevIndex);
        return newIndex;
      });
  
      setMessageVisible(true);
      setTimeout(() => {
        setMessageVisible(false);
      }, 5000);
    };
  
    showNewMessage();
  
    const messageInterval = setInterval(showNewMessage, 50000); // every 50s
  
    return () => {
      clearInterval(messageInterval);
    };
  }, [isRunning]);  

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const handleSubmit = () => {
    const totalSecondsElapsed = Math.round(
      days * 86400 + hours * 3600 + minutes * 60 + seconds
    );
    onSubmitTime?.(totalSecondsElapsed);
    resetTimer(undefined, false);
    // Keep the progress after submission
    setCachedProgress(currentProgress + totalSecondsElapsed);
  };

  const handleReset = () => {
    resetTimer(undefined, false);
    // Reset to original progress
    setCachedProgress(currentProgress);
  };

  // Calculate progress percentage
  const progressPercent = Math.min(
    ((cachedProgress) / (goalTime * 3600)) * 100,
    100
  );

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center my-3">
        <div className="flex justify-between items-center">
          <Text size="2" weight="light">Your Progress</Text>
          <Text 
            size="1" 
            weight="light" 
            color={accentColor}
            className={`transition-opacity duration-500 ${messageVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            {loveMessages[currentMessageIndex]}
          </Text>
        </div>
        <Progress
          my="1"
          size="2"
          variant="soft"
          value={progressPercent}
        />
        <Text size="1" color={accentColor} weight="light" className="opacity-70">
          <em>{Math.round(progressPercent)}% complete</em>
        </Text>
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
        <Tabs.Content value="stopwatch" className="flex flex-col justify-center items-center">
          <div 
            className="text-8xl font-bold my-5 whitespace-nowrap flex items-center justify-center"
            data-timer-seconds={totalSeconds}
          >
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
            <Button size="3" onClick={() => (isRunning ? pause() : start())} asChild>
              {isRunning ? <p>pause</p> : <p>start</p>}
            </Button>
            <div className={`absolute translate-x-16 flex items-center justify-center ${totalSeconds > 0 ? 'opacity-50 hover:opacity-100' : 'opacity-0'} transition duration-200 ease-in-out`}>
              <button onClick={handleReset} className="">
                <X size="25" />
              </button>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="timer">timer</Tabs.Content>
      </Tabs.Root>
    </div>
  );
}