import React, { Fragment, useState } from "react";

import { Combobox, Transition } from "@headlessui/react";

import clsx from "clsx";

type Props<T extends object> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> & {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  items: T[];
  defaultValue?: T;
  getItemKey: (item: T) => string | number;
  getDisplayValue: (item?: T) => string;
  onItemSelected?: (item: T) => void;
};

function AutoCompleteInner<T extends object>(
  {
    items,
    defaultValue,
    getItemKey,
    getDisplayValue,
    onItemSelected,

    className,
    name,
    ...rest
  }: Props<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <Combobox name={name} defaultValue={defaultValue} onChange={onItemSelected}>
      <div className="relative mt-1 mb-3">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            ref={ref}
            className={clsx(
              "w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0",
              className
            )}
            {...rest}
            displayValue={getDisplayValue}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {items.map((item) => (
              <Combobox.Option
                key={getItemKey(item)}
                value={item}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  }`
                }
              >
                {getDisplayValue(item)}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

const Autocomplete = React.forwardRef(AutoCompleteInner) as <T extends object>(
  props: Props<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof AutoCompleteInner>;

export default Autocomplete;
