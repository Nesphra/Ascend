// alerts component
'use client';
import { useEffect, useState } from "react";
import { Bell, BellDot, Check, X } from "lucide-react";
import { Button, HoverCard, Dialog, Text, useThemeContext, Tabs } from "@radix-ui/themes";
import { createClient } from "@/utils/supabase/client";

const Alerts = () => {
    const [incomingRelations, setIncomingRelations] = useState<any[]>([]);
    const [challengeInvites, setChallengeInvites] = useState<any[]>([]);
    const accentColor = useThemeContext().accentColor;
    
    const fetchAlerts = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch both friend requests and challenge invites
        const [relationData, challengeData] = await Promise.all([
            supabase
                .from('relationships')
                .select(`relation_id, profiles!requester (username)`)
                .eq('receiver', user.id)
                .eq('status', false),
            
            supabase
                .from('participants')
                .select(`
                    participant_id,
                    challenge_id,
                    challenges (
                        title,
                        goal_time,
                        creator_id
                    )
                `)
                .eq('user_id', user.id)
                .eq('accepted', false)
        ]);

        // Fetch creator usernames for challenges
        const creatorIds = challengeData.data?.map(invite => invite.challenges.creator_id) || [];
        const { data: creatorProfiles } = await supabase
            .from('profiles')
            .select('profile_id, username')
            .in('profile_id', creatorIds);

        // Merge creator usernames into challenge data
        const challengesWithCreators = challengeData.data?.map(invite => ({
            ...invite,
            challenges: {
                ...invite.challenges,
                creator: creatorProfiles?.find(p => p.profile_id === invite.challenges.creator_id)
            }
        })) || [];

        setIncomingRelations(relationData.data || []);
        setChallengeInvites(challengesWithCreators);
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const acceptRequest = async (relationId: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('relationships')
            .update({ status: true })
            .eq('relation_id', relationId);

        if (!error) {
            setIncomingRelations(prev => prev.filter(r => r.relation_id !== relationId));
        }
    };

    const denyRequest = async (relationId: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('relationships')
            .delete()
            .eq('relation_id', relationId);
    
        if (!error) {
            setIncomingRelations(prev => prev.filter(r => r.relation_id !== relationId));
        }
    };

    const acceptChallenge = async (participantId: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('participants')
            .update({ accepted: true })
            .eq('participant_id', participantId);

        if (!error) {
            setChallengeInvites(prev => prev.filter(c => c.participant_id !== participantId));
        }
    };

    const denyChallenge = async (participantId: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('participants')
            .delete()
            .eq('participant_id', participantId);

        if (!error) {
            setChallengeInvites(prev => prev.filter(c => c.participant_id !== participantId));
        }
    };

    const hasAlerts = incomingRelations.length > 0 || challengeInvites.length > 0;

    const AlertContent = () => (
            <div className="mt-2">
                    {incomingRelations.length === 0 ? (
                        <Text size="1" className="opacity-50">No friend requests.</Text>
                    ) : (
                        incomingRelations.map((request: any) => (
                            <div key={request.relation_id} className="flex flex-row w-full justify-between items-center gap-2 py-1">
                                <Text size="1">
                                    Friend request from: {request.profiles?.username}
                                </Text>
                                <div className="flex gap-1">
                                    <Button size="1" onClick={() => acceptRequest(request.relation_id)}><Check size={11} /></Button>
                                    <Button size="1" onClick={() => denyRequest(request.relation_id)}><X size={11} /></Button>
                                </div>
                            </div>
                        ))
                    )}
                    {challengeInvites.length === 0 ? (
                        <Text size="1" className="opacity-50">No challenge invites.</Text>
                    ) : (
                        challengeInvites.map((invite: any) => (
                            <div key={invite.participant_id} className="flex flex-row w-full justify-between items-center gap-2 py-1">
                                <div>
                                    <Text size="1" weight="bold">
                                        {invite.challenges.title}
                                    </Text>
                                    <Text size="1" className="opacity-50">
                                        from {invite.challenges.creator?.username} • {invite.challenges.goal_time}h goal
                                    </Text>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="1" onClick={() => acceptChallenge(invite.participant_id)}><Check size={11} /></Button>
                                    <Button size="1" onClick={() => denyChallenge(invite.participant_id)}><X size={11} /></Button>
                                </div>
                            </div>
                        ))
                    )}
            </div>
    );

    return (
        <div>
            <HoverCard.Root>
                <div className="lg:flex hidden justify-center items-center">
                    <HoverCard.Trigger>
                        {hasAlerts ? (
                            <button className="p-2"><BellDot size={18} color={accentColor} strokeWidth={3} /></button>
                        ) : (
                            <button className="p-2"><Bell size={18} strokeWidth={1} /></button>
                        )}
                    </HoverCard.Trigger>
                    <HoverCard.Content>
                        <AlertContent />
                    </HoverCard.Content>
                </div>
            </HoverCard.Root>
            <Dialog.Root>
                <Dialog.Trigger className="lg:hidden">
                    {hasAlerts ? (
                        <button className="p-2"><BellDot size={18} color={accentColor} strokeWidth={3} /></button>
                    ) : (
                        <button className="p-2"><Bell size={18} strokeWidth={1}/></button>
                    )}
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Title>Notifications</Dialog.Title>
                    <AlertContent />
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};

export default Alerts;
