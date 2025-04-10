import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function getPlayers() {
  return await db.select().from(players);
}

async function createPlayer(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const nickname = formData.get("nickname") as string;
  const picture = formData.get("picture") as string;

  await db.insert(players).values({
    name,
    nickname,
    picture,
  });

  revalidatePath("/players");
}

async function deletePlayer(id: number) {
  "use server";
  await db.delete(players).where(eq(players.id, id));
  revalidatePath("/players");
}

export default async function PlayersPage() {
  const playersList = await getPlayers();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Players Management</h1>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Add New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPlayer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input id="name" name="name" className="bg-gray-800 border-gray-700 text-white" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-300">Nickname</Label>
              <Input id="nickname" name="nickname" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture" className="text-gray-300">Picture URL</Label>
              <Input id="picture" name="picture" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Player</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playersList.map((player) => (
          <Card key={player.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{player.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {player.nickname && <p className="text-gray-400">Nickname: {player.nickname}</p>}
              {player.picture && (
                <img src={player.picture} alt={player.name} className="w-full h-48 object-cover rounded" />
              )}
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 text-gray-300 hover:text-white" asChild>
                  <Link href={`/players/${player.id}`}>Edit</Link>
                </Button>
                <form action={async () => {
                  "use server";
                  await deletePlayer(player.id);
                }} className="flex-1">
                  <Button type="submit" variant="destructive" className="w-full">Delete</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 