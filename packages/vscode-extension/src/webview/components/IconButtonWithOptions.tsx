import { forwardRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";
import IconButton, { IconButtonProps } from "./shared/IconButton";
import "./IconButtonWithOptions.css";
import { DropdownMenuRoot } from "./DropdownMenuRoot";

export type ButtonOption = [any, () => void];

interface IconButtonWithOptionsProps extends IconButtonProps {
  options?: Array<ButtonOption>;
  disabled?: boolean;
}

export const IconButtonWithOptions = forwardRef<HTMLButtonElement, IconButtonWithOptionsProps>(
  (props, ref) => {
    const { options, disabled, children, ...iconButtonProps } = props;

    const [optionsOpen, setOptionsOpen] = useState(false);

    return (
      <div className="icon-button-with-options-container">
        <IconButton ref={ref} disabled={disabled} side="left" size="none" {...iconButtonProps}>
          {children}
        </IconButton>
        {options && (
          <IconButton
            ref={ref}
            onClick={() => {
              setOptionsOpen(!optionsOpen);
            }}
            disabled={disabled}
            side="right"
            size="none">
            <DropdownMenuRoot open={optionsOpen} onOpenChange={setOptionsOpen}>
              <DropdownMenu.Trigger asChild disabled={disabled}>
                <div
                  className={classNames(
                    "dropdown-arrow codicon codicon-triangle-down",
                    disabled && "dropdown-arrow-disabled"
                  )}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="dropdown-menu-content"
                  side="bottom"
                  align="start"
                  sideOffset={12}
                  alignOffset={0}>
                  {options.map(([label, action], index) => (
                    <DropdownMenu.Item className="dropdown-menu-item" key={index} onSelect={action}>
                      {label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenuRoot>
          </IconButton>
        )}
      </div>
    );
  }
);
