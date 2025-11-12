"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FieldAdornment,
  FieldControl,
  useFieldProps,
} from "@/components/ui/form";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SelectProps = {
  options: SelectOption[];
  placeholder?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean; // <-- Add this line
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, placeholder, value, onChange, disabled }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const fieldProps = useFieldProps();
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter options by search
    const filteredOptions = React.useMemo(
      () =>
        options.filter(
          (opt) =>
            !search ||
            String(opt.label)
              .toLowerCase()
              .includes(search.toLowerCase())
        ),
      [options, search]
    );

    // Close dropdown on outside click
    React.useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      if (open) document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Get selected label
    const selected = options.find((opt) => opt.value === value);

    return (
      <FieldControl>
        <div
          ref={containerRef}
          className={cn("relative", className)}
          tabIndex={0}
        >
          <button
            type="button"
            className={cn(
              "appearance-none bg-white h-11 w-full rounded-[8px] border border-[#D0D5DD] px-3 text-[1rem] shadow-xs outline-none flex items-center justify-between transition-[color,box-shadow]",
              open && "ring-2 ring-[#AFAFAF]"
            )}
            onClick={() => setOpen((v) => !v)}
            disabled={disabled}
          >
            <span className={selected ? "" : "text-[#AFAFAF] text-xs md:text-sm"}>
              {selected ? selected.label : placeholder || "Select..."}
            </span>
            <ChevronDown size={18} className="text-[#AFAFAF]" />
          </button>
          {open && !disabled && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-[#D0D5DD] rounded-[8px] shadow-lg max-h-60 overflow-auto animate-fade-in">
              <div className="flex items-center px-3 py-2 border-b border-[#F0F0F0]">
                <Search size={16} className="text-[#AFAFAF] mr-2" />
                <input
                  type="text"
                  className="w-full outline-none bg-transparent text-sm"
                  placeholder="بحث..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <ul className="max-h-40 overflow-auto">
                {filteredOptions.length === 0 && (
                  <li className="px-4 py-2 text-[#AFAFAF] text-sm">لا توجد نتائج</li>
                )}
                {filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className={cn(
                      "px-4 py-2 cursor-pointer hover:bg-[#F6F8FE] text-sm",
                      opt.disabled && "text-[#AFAFAF] cursor-not-allowed",
                      value === opt.value && "bg-[#F6F8FE] font-bold"
                    )}
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange?.(opt.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </FieldControl>
    );
  }
);

Select.displayName = "Select";

export default Select;