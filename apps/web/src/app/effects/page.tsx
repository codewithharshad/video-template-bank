import { redirect } from "next/navigation";

export default function EffectsPage() {
  redirect("/templates?kind=overlay");
}
