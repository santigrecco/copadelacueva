import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { teams, players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getTeams() {
  return await db.select().from(teams);
}

async function getPlayers() {
  return await db.select().from(players);
}

async function createTeam(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const playerIds = formData.getAll("player_ids").map(id => parseInt(id as string));

  await db.insert(teams).values({
    name,
    player_ids: playerIds,
  });

  revalidatePath("/teams");
}

async function deleteTeam(id: number) {
  "use server";
  await db.delete(teams).where(eq(teams.id, id));
  revalidatePath("/teams");
}

export default async function TeamsPage() {
  const teamsList = await getTeams();
  const playersList = await getPlayers();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Teams Management</h1>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Add New Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Team Name</Label>
              <Input id="name" name="name" className="bg-gray-800 border-gray-700 text-white" required />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Select Players</Label>
              <div className="grid grid-cols-2 gap-2">
                {playersList.map((player) => (
                  <div key={player.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`player-${player.id}`}
                      name="player_ids"
                      value={player.id}
                      className="rounded border-gray-700 bg-gray-800 text-blue-600"
                    />
                    <Label htmlFor={`player-${player.id}`} className="text-gray-300">{player.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Team</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamsList.map((team) => (
          <Card key={team.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-400">Goals: {team.goals}</p>
              <form action={async () => {
                "use server";
                await deleteTeam(team.id);
              }}>
                <Button type="submit" variant="destructive" className="w-full">Delete</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 