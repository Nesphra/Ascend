//friends page
'use client';
import { useState, useEffect } from 'react';
import { TextField, Button, Text, Avatar } from '@radix-ui/themes';
import { createClient } from '@/utils/supabase/client';
import { Search, UserRoundPlus, Check } from 'lucide-react';

const ProfileLookup = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set());
  const [existingRelations, setExistingRelations] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchUserAndRelations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      if (!query) {
        setResults([]);
        setExistingRelations({});
        return;
      }

      setLoading(true);

      const [profilesRes, relationsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('profile_id, username, avatar_url')
          .ilike('username', `%${query}%`),
        supabase
          .from('relationships')
          .select('receiver, status')
          .eq('requester', user.id),
      ]);

      if (!profilesRes.error && profilesRes.data) {
        const relationsMap: Record<string, boolean> = {};
        relationsRes.data?.forEach((rel: any) => {
          relationsMap[rel.receiver] = rel.status; // true or false
        });

        const filteredResults = profilesRes.data.filter((profile: any) =>
          profile.profile_id !== user.id && relationsMap[profile.profile_id] !== true
        );

        setExistingRelations(relationsMap);
        setResults(filteredResults);
      }

      setLoading(false);
    };

    const debounce = setTimeout(fetchUserAndRelations, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const addFriend = async (receiverId: string) => {
    if (!userId || existingRelations[receiverId] !== undefined) return;

    const supabase = createClient();
    setLoadingUsers(prev => new Set(prev).add(receiverId));

    const { error } = await supabase
      .from('relationships')
      .insert({
        requester: userId,
        receiver: receiverId,
        status: false,
      });

    setLoadingUsers(prev => {
      const updated = new Set(prev);
      updated.delete(receiverId);
      return updated;
    });

    if (!error) {
      setExistingRelations(prev => ({ ...prev, [receiverId]: false }));
    } else {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <div className='flex w-full justify-center items-center'>
      <div className="flex flex-col w-full max-w-md gap-2">
        <TextField.Root 
            placeholder='Search by username...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        >
          <TextField.Slot>
            <Search size="18" />
          </TextField.Slot>
        </TextField.Root>

        {loading && <Text size="1">Loading...</Text>}
        {!loading && results.length === 0 && query && (
          <Text size="1" className="opacity-60">No users found</Text>
        )}

        <div className="flex flex-col gap-2">
          {results.map((user) => {
            const isLoading = loadingUsers.has(user.profile_id);
            const relationStatus = existingRelations[user.profile_id];

            return (
              <div key={user.profile_id} className="flex justify-between items-center border px-3 py-2 rounded">
                <div className="flex items-center gap-2">
                    <Avatar src={user.avatar_url} fallback={user.username.charAt(0) ?? "?"}
                    size="2"
                    />
                    <Text weight="bold">{user.username}</Text>
                </div>
                <Button
                  size="1"
                  variant="outline"
                  onClick={!relationStatus && !isLoading ? () => addFriend(user.profile_id) : undefined}
                  disabled={relationStatus !== undefined}
                  loading={isLoading}
                >
                  {relationStatus === false ? <Check size="18" /> : <UserRoundPlus size="18" />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileLookup;
