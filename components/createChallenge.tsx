//createChallenge component 
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Avatar, Button, Dialog, IconButton, Text, TextField } from "@radix-ui/themes";
import { Plus, Search, UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { DatePicker } from '@mantine/dates';

interface Friend {
    profile_id: string;
    username: string;
    avatar_url: string | null;
}

const CreateChallenge = () => {
    const [title, setTitle] = useState('');
    const [hours, setHours] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [query, setQuery] = useState('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

    // Fetch all friends
    useEffect(() => {
      const fetchFriends = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
    
        // Get all confirmed relationships where user is requester or receiver
        const { data: relationships } = await supabase
          .from('relationships')
          .select('*')
          .or(`requester.eq.${user.id},receiver.eq.${user.id}`)
          .eq('status', true);
    
        if (!relationships) return;
    
        // Extract friend IDs
        const friendIds = relationships.map(rel =>
          rel.requester === user.id ? rel.receiver : rel.requester
        );
    
        if (friendIds.length === 0) {
          setFriends([]);
          return;
        }
    
        // Fetch friend profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('profile_id, username, avatar_url')
          .in('profile_id', friendIds);
    
        setFriends(profiles || []);
      };
    
      fetchFriends();
    }, []);
    
    // Filter friends based on search query
    const filteredFriends = query === ''
        ? friends
        : friends.filter(friend =>
            friend.username.toLowerCase().includes(query.toLowerCase()) &&
            !selectedFriends.some(selected => selected.profile_id === friend.profile_id)
        );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Create the challenge
        const { data: challenge, error: challengeError } = await supabase
            .from('challenges')
            .insert({
                title,
                goal_time: hours,
                goal_date: selectedDate?.toISOString(),
                creator_id: user.id,
                community: false
            })
            .select()
            .single();

        if (challengeError) {
            console.error('Error creating challenge:', challengeError);
            setLoading(false);
            return;
        }

        // Add creator as participant (automatically accepted)
        await supabase
            .from('participants')
            .insert({
                user_id: user.id,
                challenge_id: challenge.challenge_id,
                accepted: true,
                progress: 0
            });

        // Add selected friends as participants (pending acceptance)
        const participantPromises = selectedFriends.map(friend =>
            supabase
                .from('participants')
                .insert({
                    user_id: friend.profile_id,
                    challenge_id: challenge.challenge_id,
                    accepted: false,
                    progress: 0
                })
        );

        await Promise.all(participantPromises);
        setLoading(false);
        window.location.reload();
    }
    
    return (
        <Dialog.Root>
            <Dialog.Trigger>
              <div>
                <div className="hidden lg:flex">
                  <Button variant="surface">Create a challenge</Button>
                </div>
                  <div className="flex lg:hidden fixed bottom-[100px] left-1/2 -translate-x-1/2 z-10">
                    <IconButton size="4" variant="solid">
                      <Plus />
                    </IconButton>
                  </div>
              </div>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Create a new challenge</Dialog.Title>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            name="title" 
                            placeholder="Workout" 
                            required 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex-5">
                        <Label htmlFor="hours">Hours</Label>
                        <Input 
                            name="hours" 
                            type="number"
                            placeholder="12" 
                            required 
                            value={hours}
                            onChange={(e) => setHours(parseInt(e.target.value))}
                        />
                    </div>
                </div>
                <div className="my-5 flex lg:flex-row flex-col items-center lg:items-start justify-between gap-4">
                  <div>
                    <Label>Set Goal Date</Label>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                  </div>
                  <div className="w-full">
                    <Label>Invite Friends</Label>
                    <TextField.Root className="w-full">
                        <TextField.Slot>
                            <Search size="18" />
                        </TextField.Slot>
                        <input
                            placeholder='Search by username...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none"
                        />
                    </TextField.Root>

                    {/* Selected friends */}
                    {selectedFriends.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFriends.map((friend) => (
                                <div 
                                    key={friend.profile_id}
                                    className="flex items-center gap-1 bg-foreground/10 rounded-full pl-1 pr-2 py-0.5"
                                >
                                    <Avatar
                                        src={friend.avatar_url || undefined}
                                        fallback={friend.username.charAt(0)}
                                        size="1"
                                    />
                                    <Text size="1">{friend.username}</Text>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFriends(prev => 
                                            prev.filter(f => f.profile_id !== friend.profile_id)
                                        )}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Friend search results */}
                    <div className="max-h-[200px] overflow-y-auto mt-2">
                        {filteredFriends.map((friend) => (
                            <div
                                key={friend.profile_id}
                                className="flex items-center justify-between p-2 hover:bg-foreground/5 cursor-pointer"
                                onClick={() => {
                                    if (!selectedFriends.some(f => f.profile_id === friend.profile_id)) {
                                        setSelectedFriends(prev => [...prev, friend]);
                                        setQuery('');
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={friend.avatar_url || undefined}
                                        fallback={friend.username.charAt(0)}
                                        size="1"
                                    />
                                    <Text size="2">{friend.username}</Text>
                                </div>
                                <UserPlus size={16} />
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Challenge"}
                </Button>
              </form>
            </Dialog.Content>
          </Dialog.Root>
    );
}
 
export default CreateChallenge;