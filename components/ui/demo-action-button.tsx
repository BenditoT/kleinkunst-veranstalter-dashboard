"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type DemoActionButtonProps = {
  label: string;
  message: string;
};

export function DemoActionButton({ label, message }: DemoActionButtonProps) {
  const [notice, setNotice] = useState("");

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => setNotice(message)}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white"
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      {notice ? (
        <p role="status" className="rounded-md bg-teal-50 px-3 py-2 text-xs font-medium leading-5 text-teal-800">
          <CheckCircle2 className="mr-1 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
          {notice}
        </p>
      ) : null}
    </div>
  );
}
