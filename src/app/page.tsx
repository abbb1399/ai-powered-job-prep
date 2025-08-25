import { SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <SignInButton />
      <UserButton />
      <ThemeToggle />
      <Button>Click me</Button>
    </>
  );
}
