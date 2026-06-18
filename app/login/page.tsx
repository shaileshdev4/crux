import { Suspense } from "react";
import { LoginPanel } from "@/components/LoginPanel";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-sm text-ink-2">Loading…</div>}>
      <LoginPanel />
    </Suspense>
  );
}
