"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Kopiert");
      }}
      aria-label={label}
    >
      <Copy className="h-3.5 w-3.5" />
    </Button>
  );
}
