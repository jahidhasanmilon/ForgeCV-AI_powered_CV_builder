"use client";

import { ReactNode, useState } from "react";

export default function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-card">
      <button className="accordion-head" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className={`accordion-chevron ${open ? "open" : ""}`}>⌄</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}
