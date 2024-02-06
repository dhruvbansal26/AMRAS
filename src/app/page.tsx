import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-semibold text-black">CareConnect</h1>
        <p className="text-md">Get started now.</p>
        <div>
          <LoginButton>
            <Button variant="outline">Sign In</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
