"use client";

import { UpdateButton } from "@repo/ui/button";

export default function Home() {
  return (
    <UpdateButton onclick={() => alert(`Update button clicked`)}>
      Update
    </UpdateButton>
  );
}
