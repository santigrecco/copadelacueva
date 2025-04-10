import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { tournaments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getTournament(id: number) {
  const result = await db.select().from(tournaments).where(eq(tournaments.id, id));
  return result[0];
}

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const tournament = await getTournament(parseInt(params.id));
  
  if (!tournament) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">{tournament.name}</h1>
          <Button variant="outline" className="text-gray-300 hover:text-white" asChild>
            <Link href="/">Back to Tournaments</Link>
          </Button>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Tournament Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-400 py-8">
              <p className="text-xl">Tournament table coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 