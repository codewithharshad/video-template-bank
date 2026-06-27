import { redirect } from "next/navigation";

export default function HooksPage() {
  redirect("/templates?kind=hook");
}
