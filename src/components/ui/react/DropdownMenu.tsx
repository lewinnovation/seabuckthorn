import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

export type MenuLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type DropdownMenuProps = {
  buttonLabel: string;
  items: MenuLinkItem[];
  align?: "left" | "right";
};

export function DropdownMenu({
  buttonLabel,
  items,
  align = "left",
}: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex items-center gap-2 rounded-md border border-border-default bg-surface-secondary px-3 py-2 text-sm font-medium text-text-primary ui-focus-visible:outline-focus-ring">
        {buttonLabel}
        <span aria-hidden="true">▾</span>
      </MenuButton>

      <MenuItems
        transition
        className={[
          "absolute z-50 mt-2 min-w-48 origin-top rounded-md border border-border-default bg-surface-elevated p-1 shadow-lg focus:outline-none",
          align === "right" ? "right-0" : "left-0",
          "transition data-closed:scale-95 data-closed:opacity-0",
        ].join(" ")}
      >
        {items.map((item) => (
          <MenuItem key={`${item.href}-${item.label}`}>
            {({ focus }) => (
              <a
                href={item.href}
                className={[
                  "block rounded-sm px-3 py-2 text-sm text-text-primary",
                  focus ? "bg-surface-secondary" : "",
                ].join(" ")}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.label}
              </a>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

export default DropdownMenu;
