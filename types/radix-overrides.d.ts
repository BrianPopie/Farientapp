export {};

import type * as React from "react";

declare module "@radix-ui/react-select" {
  interface SelectTriggerProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SelectContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SelectViewportProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SelectLabelProps {
    className?: string;
  }

  interface SelectItemProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SelectSeparatorProps {
    className?: string;
  }

  interface SelectIconProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
}

declare module "@radix-ui/react-dropdown-menu" {
  interface DropdownMenuContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface DropdownMenuSubTriggerProps {
    className?: string;
    children?: React.ReactNode;
    inset?: boolean;
  }

  interface DropdownMenuSubContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface DropdownMenuItemProps {
    className?: string;
    children?: React.ReactNode;
    inset?: boolean;
  }

  interface DropdownMenuCheckboxItemProps {
    className?: string;
    children?: React.ReactNode;
    checked?: boolean | "indeterminate";
  }

  interface DropdownMenuRadioItemProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface DropdownMenuLabelProps {
    className?: string;
    inset?: boolean;
  }

  interface DropdownMenuSeparatorProps {
    className?: string;
  }
}

declare module "@radix-ui/react-scroll-area" {
  interface ScrollAreaProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ScrollAreaViewportProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ScrollAreaScrollbarProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ScrollAreaThumbProps {
    className?: string;
  }
}

declare module "@radix-ui/react-switch" {
  interface SwitchProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SwitchThumbProps {
    className?: string;
  }
}

declare module "@radix-ui/react-tabs" {
  interface TabsListProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface TabsTriggerProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface TabsContentProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-toggle" {
  interface ToggleProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-dialog" {
  interface DialogOverlayProps {
    className?: string;
  }

  interface DialogContentProps {
    className?: string;
    children?: React.ReactNode;
  }
}
