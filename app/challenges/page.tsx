'use client'
import { DndContext } from "@dnd-kit/core";
import { Progress, Separator, Avatar, Card, Text, Dialog, Heading, Container, Button, ScrollArea, Tabs, IconButton } from "@radix-ui/themes";
import { Plus } from "lucide-react";

const challengeData = [
    {
        community: false,
        challengeID: "abc123",
        title: "Challenge 1",
        goalTime: 190,
        created_at : "2024-06-01",
        goalDate : "2024-07-01",
        participants: [
            { userID: "user1-ID", progress:15, working: true},
            { userID: "user2-ID", progress:10, working: false},
            { userID: "user3-ID", progress:10, working: false},
            { userID: "user3-ID", progress:10, working: false},
            { userID: "user3-ID", progress:10, working: false}
        ]
    },
    {
        community: false,
        challengeID: "def456",
        title: "Challenge 2",
        goalTime: 100,
        created_at : "2024-06-01",
        goalDate : "2024-07-01",
        participants: [
            { userID: "user1-ID", progress:10},
            { userID: "user2-ID", progress:10}
        ]
    },
    {
        community: true,
        challengeID: "hij789",
        title: "Challenge 3",
        goalTime: 100,
        created_at : "2024-06-01",
        goalDate : "2024-07-01",
        participants: [
            { userID: "user1-ID", progress:10},
            { userID: "user2-ID", progress:10},
            { userID: "user3-ID", progress:10}
        ]
    },
    {
        community: true,
        challengeID: "lmn123",
        title: "Challenge 4",
        goalTime: 100,
        created_at : "2024-06-01",
        goalDate : "2024-07-01",
        participants: [
            { userID: "user1-ID", progress:10},
            { userID: "user2-ID", progress:10},
            { userID: "user3-ID", progress:10}
        ]
    }
]

const Challenges = () => {

    function formatDate(date?: string){
        if (!date || isNaN(new Date(date).getTime())){
            return "N/A"
        }

        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })

        return formatter.format(new Date(date))
    }

    return (
        <DndContext>
            <Container className="flex flex-col px-3 gap-6">
                <Tabs.Root defaultValue="friends" className="flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <Heading className="hidden lg:flex">Challenges</Heading>
                        <Tabs.List className="flex gap-3">
                            <Tabs.Trigger value="friends"><Text>Friends</Text></Tabs.Trigger>
                            <Tabs.Trigger value="community"><Text>Community</Text></Tabs.Trigger>
                        </Tabs.List>
                        <Dialog.Root>
                            <Dialog.Trigger>
                                <div>
                                    <div className="hidden lg:flex">
                                        <Button variant="surface">Create a challenge</Button>
                                    </div>
                                    <div className="flex lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-10">
                                        <IconButton size="4" variant="solid"><Plus/></IconButton>
                                    </div>
                                </div>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Title>Create a new challenge</Dialog.Title>
                                <Dialog.Description>Create and participate in a new challenge.</Dialog.Description>
                            </Dialog.Content>
                        </Dialog.Root>
                    </div>

                    <Tabs.Content value="friends">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                            {challengeData.map((challenge) => (
                                <Card key={challenge.challengeID} className="relative flex flex-col justify-between w-full max-w-[350px] p-4 gap-4">
                                    <div className="absolute top-0 left-0 p-2 cursor-grab">
                                        <div className="flex flex-col gap-0.5 items-start">
                                            {[3, 2, 1].map(row => (
                                                <div key={row} className="flex gap-0.5">
                                                    {Array.from({ length: row }).map((_, i) => (
                                                        <span key={i} className="w-[3px] h-[3px] rounded-full bg-foreground/50" />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <Text weight="bold">{challenge.title}</Text>
                                        <Text size="1" className="opacity-40">
                                            {`${formatDate(challenge.created_at)} – ${formatDate(challenge.goalDate)}`}
                                        </Text>
                                    </div>

                                    <ScrollArea scrollbars="vertical" style={{ height: 170 }}>
                                        <div className="flex flex-col gap-4 px-3 my-3">
                                            {challenge.participants.map((user) => (
                                                <div key={user.userID} className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex gap-2 items-center">
                                                            <Avatar fallback="U" size="1" />
                                                            <Text size="2" weight="light">{user.userID}</Text>
                                                        </div>
                                                        <Text size="2" weight="bold">
                                                            {user.progress} <span className="opacity-50 font-light">/ {challenge.goalTime}h</span>
                                                        </Text>
                                                    </div>
                                                    <Progress
                                                        size="2"
                                                        variant="soft"
                                                        color={(Math.round((user.progress / challenge.goalTime) * 100) < 10) ? "red" : "green"}
                                                        value={Math.round((user.progress / challenge.goalTime) * 100)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="flex flex-col gap-3">
                                        <Separator size="4"/>
                                        <Button variant="outline">Launch Timer</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="community" className="flex justify-center">
                        <Text size="1" className="opacity-40">There are no community challenges.</Text>
                    </Tabs.Content>
                </Tabs.Root>
            </Container>
        </DndContext>
    );
}
 
export default Challenges;
