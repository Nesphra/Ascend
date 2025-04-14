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
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const supabase = createClient();
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_id, username, avatar_url')
        .ilike('username', `%${query}%`);

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const addFriend = async (receiverId: string) => {
    const supabase = createClient();
    setLoadingUsers(prev => new Set(prev).add(receiverId));

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("User not authenticated.");
      setLoadingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(receiverId);
        return updated;
      });
      return;
    }

    const { error } = await supabase
      .from('relationships')
      .insert({
        requester: user.id,
        receiver: receiverId,
        status: false,
      });

    setLoadingUsers(prev => {
      const updated = new Set(prev);
      updated.delete(receiverId);
      return updated;
    });

    if (!error) {
      setSentRequests(prev => new Set(prev).add(receiverId));
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
            const isSent = sentRequests.has(user.profile_id);

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
                  onClick={!isSent && !isLoading ? () => addFriend(user.profile_id) : undefined}
                  loading={isLoading}
                >
                  {isSent ? <Check size="18" /> : <UserRoundPlus size="18" />}
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
