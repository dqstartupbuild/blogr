import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4 text-black">
      <SignIn />
    </main>
  );
}
