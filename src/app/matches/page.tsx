import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/db";
import { matches, teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getMatches() {
  return await db.select().from(matches);
}

async function getTeams() {
  return await db.select().from(teams);
}

async function createMatch(formData: FormData) {
  "use server";
  const homeTeamId = parseInt(formData.get("home_team_id") as string);
  const awayTeamId = parseInt(formData.get("away_team_id") as string);
  const homeTeamScore = parseInt(formData.get("home_team_score") as string) || 0;
  const awayTeamScore = parseInt(formData.get("away_team_score") as string) || 0;

  await db.insert(matches).values({
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    home_team_score: homeTeamScore,
    away_team_score: awayTeamScore,
  });

  revalidatePath("/matches");
}

async function deleteMatch(id: number) {
  "use server";
  await db.delete(matches).where(eq(matches.id, id));
  revalidatePath("/matches");
}

export default async function MatchesPage() {
  const matchesList = await getMatches();
  const teamsList = await getTeams();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Matches Management</h1>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Add New Match</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="home_team_id" className="text-gray-300">Home Team</Label>
                <Select name="home_team_id" required>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {teamsList.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="away_team_id" className="text-gray-300">Away Team</Label>
                <Select name="away_team_id" required>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {teamsList.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="home_team_score" className="text-gray-300">Home Team Score</Label>
                <Input
                  id="home_team_score"
                  name="home_team_score"
                  type="number"
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="away_team_score" className="text-gray-300">Away Team Score</Label>
                <Input
                  id="away_team_score"
                  name="away_team_score"
                  type="number"
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Match</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchesList.map((match) => (
          <Card key={match.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {teamsList.find(t => t.id === match.home_team_id)?.name} vs {teamsList.find(t => t.id === match.away_team_id)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-400">
                Score: {match.home_team_score} - {match.away_team_score}
              </p>
              <form action={async () => {
                "use server";
                await deleteMatch(match.id);
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