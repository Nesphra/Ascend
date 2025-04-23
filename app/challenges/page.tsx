// challenges/page.tsx
'use client';

import {
  Progress,
  Separator,
  Avatar,
  Card,
  Text,
  Dialog,
  Heading,
  Container,
  Button,
  ScrollArea,
  Tabs,
  Skeleton,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import Timer from '@/components/timer';
import { createClient } from '@/utils/supabase/client';
import CreateChallenge from '@/components/createChallenge';

export default function Challenges() {


  const [challenges, setChallenges] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('participants')
        .select(`
          progress,
          challenge_id,
          challenges ( challenge_id, title, goal_time, created_at, goal_date, community ),
          profiles: user_id ( username, avatar_url, profile_id )
        `);

      if (error) {
        console.log(error);
        return;
      }

      const grouped: Record<string, any> = {};
      data.forEach((row: any) => {
        const challengeId = row.challenge_id;
        if (!grouped[challengeId]) {
          grouped[challengeId] = {
            ...row.challenges,
            participants: [],
          };
        }
        grouped[challengeId].participants.push({
          ...row.profiles,
          progress: row.progress,
        });
      });

      setChallenges(Object.values(grouped));
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleTimeSubmit = async (challengeId: string, addedSeconds: number) => {
    if (!userId) return;
    const supabase = createClient();

    const { data, error } = await supabase
      .rpc('increment_participant_progress_seconds', {
        p_user_id: userId,
        p_challenge_id: challengeId,
        p_seconds: addedSeconds,
      });

    if (error) {
      console.error('Failed to update progress:', error);
      return;
    }

    const updated = challenges.map((ch) => {
      if (ch.challenge_id !== challengeId) return ch;
      return {
        ...ch,
        participants: ch.participants.map((p: any) =>
          p.profile_id === userId
            ? { ...p, progress: p.progress + addedSeconds }
            : p
        ),
      };
    });

    setChallenges(updated);
  };

  function formatDate(date?: string) {
    if (!date || isNaN(new Date(date).getTime())) {
      return 'N/A';
    }
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(new Date(date));
  }

  return (
    <Container className="flex flex-col px-3 gap-6">
      <Tabs.Root defaultValue="friends" className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <Heading className="hidden lg:flex">Challenges</Heading>
          <Tabs.List className="flex gap-3">
            <Tabs.Trigger value="friends">
              <Text>Friends</Text>
            </Tabs.Trigger>
            <Tabs.Trigger value="community">
              <Text>Community</Text>
            </Tabs.Trigger>
          </Tabs.List>
          <CreateChallenge />
        </div>

        <Tabs.Content value="friends">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {loading? Array.from({ length: 4 }).map((_, i) =>(
              <Card
              key={i}
              className="relative flex flex-col justify-between w-full max-w-[350px] p-4 gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
      
              <div className="flex flex-col gap-3 px-3 my-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-2.5 w-full" />
                  </div>
                ))}
              </div>
      
              <Skeleton className="h-8 w-full" />
            </Card>
            )) : (
              challenges.map((challenge) => (
                <Card
                  key={challenge.challenge_id}
                  className="relative flex flex-col justify-between w-full max-w-[350px] p-4 gap-4"
                >
                  <div className="absolute top-0 left-0 p-2 cursor-grab">
                    <div className="flex flex-col gap-0.5 items-start">
                      {[3, 2, 1].map((row) => (
                        <div key={row} className="flex gap-0.5">
                          {Array.from({ length: row }).map((_, i) => (
                            <span
                              key={i}
                              className="w-[3px] h-[3px] rounded-full bg-foreground/50"
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Text weight="bold">{challenge.title}</Text>
                    <Text size="1" className="opacity-40">
                      {`${formatDate(challenge.created_at)} – ${formatDate(
                        challenge.goal_date
                      )}`}
                    </Text>
                  </div>

                  <ScrollArea scrollbars="vertical" style={{ height: 170 }}>
                    <div className="flex flex-col gap-4 px-3 my-3">
                      {challenge.participants
                        .sort((a: any, b: any) => b.progress - a.progress)
                        .map((user: any) => (
                        <div key={user.profile_id} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <Avatar fallback={user.username.charAt(0)} size="1" src={user.avatar_url} />
                              <Text size="2" weight="light">
                                {user.username}
                              </Text>
                            </div>
                            <Text size="2" weight="bold">
                              {Math.round(user.progress / 3600)}{' '}
                              <span className="opacity-50 font-light">
                                / {challenge.goal_time}h
                              </span>
                            </Text>
                          </div>
                          <Progress
                            size="2"
                            variant="soft"
                            color={
                              Math.round((user.progress / (challenge.goal_time * 3600)) * 100) < 10
                                ? 'red'
                                : 'green'
                            }
                            value={(user.progress / (challenge.goal_time * 3600)) * 100}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex flex-col gap-3">
                    <Separator size="4" />
                    <Dialog.Root onOpenChange={async (open) => {
                      if (!open) {
                        // Get the timer's current value from the Timer component
                        const timerSeconds = document.querySelector('[data-timer-seconds]')?.getAttribute('data-timer-seconds');
                        if (!timerSeconds) return;

                        const newSeconds = parseInt(timerSeconds);
                        if (newSeconds <= 0) return;

                        const supabase = createClient();
                        const { data, error } = await supabase
                          .rpc('increment_participant_progress_seconds', {
                            p_user_id: userId,
                            p_challenge_id: challenge.challenge_id,
                            p_seconds: newSeconds,
                          });

                        if (error) {
                          console.error('Failed to update progress:', error);
                          return;
                        }

                        const updated = challenges.map((ch) => {
                          if (ch.challenge_id !== challenge.challenge_id) return ch;
                          return {
                            ...ch,
                            participants: ch.participants.map((p: any) =>
                              p.profile_id === userId
                                ? { ...p, progress: p.progress + newSeconds }
                                : p
                            ),
                          };
                        });

                        setChallenges(updated);
                      }
                    }}>
                      <Dialog.Trigger>
                        <Button variant="outline">Progress</Button>
                      </Dialog.Trigger>
                      <Dialog.Content className="flex flex-col items-center">
                        <Dialog.Title>{challenge.title}</Dialog.Title>
                        <Progress
                          size="3"
                          variant="soft"
                          color={
                            Math.round(
                              ((challenge.participants.find((p: any) => p.profile_id === userId)?.progress || 0) /
                                (challenge.goal_time * 3600)) * 100
                            ) < 10
                              ? 'red'
                              : 'green'
                          }
                          value={
                            ((challenge.participants.find((p: any) => p.profile_id === userId)?.progress || 0) /
                              (challenge.goal_time * 3600)) * 100
                          }
                        />
                        <Timer
                          onSubmitTime={(seconds) =>
                            handleTimeSubmit(challenge.challenge_id, seconds)
                          }
                          currentProgress={challenge.participants.find((p: any) => p.profile_id === userId)?.progress || 0}
                          goalTime={challenge.goal_time}
                        />
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="community" className="flex justify-center">
          <Text size="1" className="opacity-40">
            There are no community challenges.
          </Text>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}