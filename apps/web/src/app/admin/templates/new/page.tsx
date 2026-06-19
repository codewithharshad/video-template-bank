"use client";

import { AdminTemplateForm } from "@/components/admin-template-form";

export default function NewAdminTemplatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">New template</h1>
      <AdminTemplateForm />
    </div>
  );
}
