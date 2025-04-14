'use client';
import { useEffect, useState } from "react";
import { Bell, BellDot, Check, X } from "lucide-react";
import { Button, HoverCard, Text, useThemeContext } from "@radix-ui/themes";
import { createClient } from "@/utils/supabase/client";

const Alerts = () => {
    const [incomingRelations, setIncomingRelations] = useState<any[]>([]);
    const accentColor = useThemeContext().accentColor;

    
    const fetchRelations = async () => {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const {data: incomingRelations} = await supabase
        .from('relationships')
        .select(`relation_id,profiles!requester (username)`)
        .eq('receiver', user?.id)
        .eq('status', false)

        console.log(incomingRelations)

        if (incomingRelations) setIncomingRelations(incomingRelations);
    };

    useEffect(() => {
        fetchRelations();
    }, []);

    const acceptRequest = async (relationId: string) => {
        const supabase = createClient();
        
        const { error } = await supabase
            .from('relationships')
            .update({ status: true })
            .eq('relation_id', relationId);

        if (!error) {
            // remove from state so UI updates
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
            // Update UI by removing the denied request
            setIncomingRelations(prev => prev.filter(r => r.relation_id !== relationId));
        }
    };    

    const hasAlerts = incomingRelations.length > 0;

    return (
        <HoverCard.Root>
            <div className="flex justify-center items-center">
                <HoverCard.Trigger>
                    {hasAlerts ? (
                        <button className="p-2"><BellDot size={18} color={accentColor} strokeWidth={3} /></button>
                    ) : (
                        <button className="p-2"><Bell size={18} strokeWidth={1} /></button>
                    )}
                </HoverCard.Trigger>
                <HoverCard.Content>
                    {!hasAlerts ? (
                        <Text size="1" className="opacity-50">You have no notifications.</Text>
                    ) : (
                        incomingRelations.map((request: any) => (
                            <div key={request.relation_id} className="flex flex-row w-full justify-between items-center gap-2">
                                <Text size="1">
                                    Friend request from: {request.profiles?.username ?? request.requester}
                                </Text>
                                <div className="flex gap-1">
                                    <Button size="1" onClick={() => acceptRequest(request.relation_id)}><Check size={11} /></Button>
                                    <Button size="1" onClick={() => denyRequest(request.relation_id)}><X size={11} /></Button>
                                </div>
                            </div>
                        ))
                    )}
                </HoverCard.Content>
            </div>
        </HoverCard.Root>
    );
};

export default Alerts;
