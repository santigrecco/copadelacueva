"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn("google")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sign in with Google
          </Button>
          <div className="text-center">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 