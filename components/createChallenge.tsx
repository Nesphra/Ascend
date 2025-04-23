//createChallenge component 
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button, Dialog, IconButton, TextField } from "@radix-ui/themes";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { DatePicker } from '@mantine/dates';

const CreateChallenge = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    return (
        <Dialog.Root>
            <Dialog.Trigger>
              <div>
                <div className="hidden lg:flex">
                  <Button variant="surface">Create a challenge</Button>
                </div>
                  <div className="flex lg:hidden absolute bottom-[200px] left-1/2 -translate-x-1/2 z-10">
                    <IconButton size="4" variant="solid">
                      <Plus />
                    </IconButton>
                  </div>
              </div>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Create a new challenge</Dialog.Title>
              <form>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <Label htmlFor="email">Title</Label>
                        <Input name="email" placeholder="Workout" required />
                    </div>
                    <div className="flex-5">
                        <Label htmlFor="email">Hours</Label>
                        <Input name="email" placeholder="12" required />
                    </div>
                </div>
                <div className="my-5 flex justify-between gap-4">
                  <div>
                    <Label>Set Goal Date</Label>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                  </div>
                  <div className="w-full">
                    <Label>Invite Friends</Label>
                    <TextField.Root 
                        placeholder='Search by username...'
                    >
                        <TextField.Slot>
                            <Search size="18" />
                        </TextField.Slot>
                    </TextField.Root>
                    {/* Here, add a scrollable list of the user's friends, and a button to add their friend ID to the friend invite array. */}
                  </div>
                </div>
                <Button type="submit" loading={loading}>Create</Button>
              </form>
            </Dialog.Content>
          </Dialog.Root>
    );
}
 
export default CreateChallenge;