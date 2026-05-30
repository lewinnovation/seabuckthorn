import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

export type DialogProps = {
  triggerLabel: string;
  title: string;
  body: string;
  closeLabel: string;
};

export function Dialog({
  triggerLabel,
  title,
  body,
  closeLabel,
}: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md border border-border-default bg-surface-secondary px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-elevated"
      >
        {triggerLabel}
      </button>

      <HeadlessDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-[var(--dialog-overlay)]"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg border border-border-default bg-surface-elevated p-6 shadow-lg">
            <DialogTitle className="text-lg font-semibold text-text-primary">
              {title}
            </DialogTitle>
            <p className="mt-3 text-text-muted">{body}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground ui-focus-visible:outline-focus-ring"
              >
                {closeLabel}
              </button>
            </div>
          </DialogPanel>
        </div>
      </HeadlessDialog>
    </>
  );
}

export default Dialog;
