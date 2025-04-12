'use client'
import { Progress, Separator, Avatar, Card, Text, Dialog, Heading, Container, Button, ScrollArea, Tabs } from "@radix-ui/themes";
import { useState } from "react";

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
        <Container className="flex flex-col px-10 gap-4">
            <Tabs.Root defaultValue="friends" className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <Heading>Challenges</Heading>
                    <Tabs.List>
                        <Tabs.Trigger value="friends"><Text>Friends</Text></Tabs.Trigger>
                        <Tabs.Trigger value="community"><Text>Community</Text></Tabs.Trigger>
                    </Tabs.List>

                    <Button variant="soft">Create a challenge</Button>
                </div>

                <Tabs.Content value="friends" className="my-10">
                    <div className="grid lg:grid-cols-3 gap-16">
                        {challengeData.map((challenge) => (
                            <Card key={challenge.challengeID} className="flex justify-center items-center">
                                <div className="flex flex-col justify-center items-center">
                                    <Text>{challenge.title}</Text>
                                    <Text size="1" className="opacity-40">
                                        {`${formatDate(challenge.created_at)} – ${formatDate(challenge.goalDate)}`}
                                    </Text>
                                </div>
                                <ScrollArea scrollbars="vertical" style={{ height: 170 }}>
                                    {challenge.participants.map((user) => (
                                        <div className="my-3">
                                            <div className="flex flex-row justify-between items-center my-1">
                                                <div className="flex gap-2 items-center">
                                                    <Avatar fallback="U" size="1" />
                                                    <Text size="2" weight="light">{user.userID}</Text>
                                                </div>
                                                <Text size="2" weight="bold">{user.progress} <span className="opacity-50 font-light">/ {challenge.goalTime}h</span></Text>
                                            </div>
                                            <Progress size="2" variant="soft" color={(Math.round((user.progress/challenge.goalTime)*100) < 10 ) ? "red" : "green"} value={Math.round((user.progress/challenge.goalTime)*100)}/>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <div className="flex flex-col justify-center">
                                    <Separator my="3" size="4"/>
                                    <Button variant="outline">Launch Timer</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Tabs.Content>

                <Tabs.Content value="community">

                </Tabs.Content>
            </Tabs.Root>

        </Container>
    );
}
 
export default Challenges;