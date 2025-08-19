import { signIn } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { Github } from "@/components/ui/Github";

const GithubSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button
        size="md"
        className="w-full bg-white text-black cursor-pointer"
        variant="outline"
      >
        <Github />
        Continue with GitHub
      </Button>
    </form>
  );
};

export { GithubSignIn };
