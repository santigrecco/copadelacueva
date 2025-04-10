import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/db";
import { tournaments, matches, players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getTournaments() {
  return await db.select().from(tournaments);
}

async function getMatches() {
  return await db.select().from(matches);
}

async function getPlayers() {
  return await db.select().from(players);
}

async function createTournament(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const matchIds = formData.getAll("matches").map(id => parseInt(id as string));
  const playerIds = formData.getAll("players").map(id => parseInt(id as string));

  await db.insert(tournaments).values({
    name,
    matches: matchIds,
    players: playerIds,
  });

  revalidatePath("/tournaments");
}

async function deleteTournament(id: number) {
  "use server";
  await db.delete(tournaments).where(eq(tournaments.id, id));
  revalidatePath("/tournaments");
}

export default async function TournamentsPage() {
  const tournamentsList = await getTournaments();
  const matchesList = await getMatches();
  const playersList = await getPlayers();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Tournaments Management</h1>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Add New Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTournament} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Tournament Name</Label>
              <Input id="name" name="name" className="bg-gray-800 border-gray-700 text-white" required />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Select Matches</Label>
              <div className="grid grid-cols-1 gap-2">
                {matchesList.map((match) => (
                  <div key={match.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`match-${match.id}`}
                      name="matches"
                      value={match.id}
                      className="rounded border-gray-700 bg-gray-800 text-blue-600"
                    />
                    <Label htmlFor={`match-${match.id}`} className="text-gray-300">
                      Match {match.id}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Select Players</Label>
              <div className="grid grid-cols-2 gap-2">
                {playersList.map((player) => (
                  <div key={player.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`player-${player.id}`}
                      name="players"
                      value={player.id}
                      className="rounded border-gray-700 bg-gray-800 text-blue-600"
                    />
                    <Label htmlFor={`player-${player.id}`} className="text-gray-300">
                      {player.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Tournament</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournamentsList.map((tournament) => (
          <Card key={tournament.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{tournament.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-400">
                Matches: {tournament.matches.length}
              </p>
              <p className="text-gray-400">
                Players: {tournament.players.length}
              </p>
              <form action={async () => {
                "use server";
                await deleteTournament(tournament.id);
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