import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-center">
            You are not authorized to access this system. Please contact the administrator if you believe this is an error.
          </p>
          <div className="text-center">
            <Button asChild>
              <Link href="/" className="text-white">
                Back to home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 