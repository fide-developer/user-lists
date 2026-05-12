'use client'
import { useRouter } from "next/navigation";
import Button from "./components/Button";

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex gap-10 flex-col w-full text-2xl items-center justify-center p-[20%]">
      <span className="text-center">Hi There! Thank you for consider me as a candidate. I've done the test, hopefully we can continue to the next steps. Have a great time!</span>
      <Button onClick={() => router.push('/users')} intent="primary" size="md" className="font-semibold">Go to Users Page</Button>
    </div>
  );
}
