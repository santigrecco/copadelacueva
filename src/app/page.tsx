import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { tournaments } from "@/db/schema";
import Link from "next/link";

async function getTournaments() {
  return await db.select().from(tournaments);
}

export default async function HomePage() {
  const tournamentsList = await getTournaments();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto py-16">
        <h1 className="text-5xl font-bold text-white text-center mb-16">
          Copa de la Cueva
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournamentsList.map((tournament) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
              <Card className="bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors duration-300 h-full">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    {tournament.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-400 space-y-2">
                    <p>Matches: {tournament.matches.length}</p>
                    <p>Players: {tournament.players.length}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {tournamentsList.length === 0 && (
          <div className="text-center text-gray-400 mt-16">
            <p className="text-xl mb-4">No tournaments available</p>
            <Button asChild>
              <Link href="/tournaments">Create a Tournament</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
