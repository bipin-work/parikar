import CreateForm from "@/ui/recipe-form/create/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create",
};

export default function CreatePage() {
  return (
    <p>
      Create recipe <CreateForm />
    </p>
  );
}
