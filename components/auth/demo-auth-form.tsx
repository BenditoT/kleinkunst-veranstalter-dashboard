"use client";

import { CheckCircle2 } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

type DemoAuthFormProps = {
  children: ReactNode;
  successMessage: string;
};

export function DemoAuthForm({ children, successMessage }: DemoAuthFormProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(successMessage);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {children}
      {message ? (
        <p role="status" className="rounded-md bg-teal-50 px-3 py-2 text-sm font-medium leading-5 text-teal-800">
          <CheckCircle2 className="mr-2 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
          {message}
        </p>
      ) : null}
    </form>
  );
}
