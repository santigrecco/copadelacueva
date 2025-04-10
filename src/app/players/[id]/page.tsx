import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

async function getPlayer(id: number) {
  const result = await db.select().from(players).where(eq(players.id, id));
  return result[0];
}

async function updatePlayer(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const nickname = formData.get("nickname") as string;
  const picture = formData.get("picture") as string;

  await db
    .update(players)
    .set({
      name,
      nickname,
      picture,
    })
    .where(eq(players.id, id));

  revalidatePath("/players");
}

export default async function UpdatePlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const player = await getPlayer(parseInt(params.id));
  
  if (!player) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Update Player</h1>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Edit Player Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePlayer} className="space-y-4">
            <input type="hidden" name="id" value={player.id} />
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={player.name}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-300">Nickname</Label>
              <Input
                id="nickname"
                name="nickname"
                defaultValue={player.nickname || ""}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture" className="text-gray-300">Picture URL</Label>
              <Input
                id="picture"
                name="picture"
                defaultValue={player.picture || ""}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Update Player</Button>
              <Button type="button" variant="outline" className="text-gray-300 hover:text-white" asChild>
                <a href="/players">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 