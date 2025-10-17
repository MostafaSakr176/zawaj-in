"use client";

import * as React from "react";
import PhoneInputLib from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

export type PhoneInputProps = {
  value?: string;
  onChange?: (value: string, data: any, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => void;
  country?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};


export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, country = "sa", inputProps, disabled, placeholder, className }, ref) => {
    return (
      <PhoneInputLib
        country={country}
        value={value}
        onChange={onChange}
        inputProps={{
          disabled,
          placeholder,
          ...inputProps,
        }}
        inputClass={"placeholder:text-[#AFAFAF] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-11 w-full min-w-0 rounded-[8px] border border-[#D0D5DD] bg-white px-4 text-[1rem] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " + className }
        containerClass="w-full"
        buttonClass=""
        enableSearch
        disableDropdown={false}
        masks={{ sa: '.. ... ....' }}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
