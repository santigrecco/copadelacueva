"use client";

import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white font-bold">
              Copa de la Cueva
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === "authenticated" && session.user.role === "admin" && (
              <>
                <Link href="/players">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Players
                  </Button>
                </Link>
                <Link href="/teams">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Teams
                  </Button>
                </Link>
                <Link href="/matches">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Matches
                  </Button>
                </Link>
                <Link href="/tournaments">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Tournaments
                  </Button>
                </Link>
              </>
            )}
            {status === "authenticated" ? (
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
                onClick={() => signIn()}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 