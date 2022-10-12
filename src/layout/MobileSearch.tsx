import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment, useRef } from "react";
import Input from "src/components/Input";
import { useOnClickOutside } from "usehooks-ts";

type Props = React.PropsWithChildren<{
  show: boolean;
  onClose: () => void;
}>;

const MobileSearch: React.FC<Props> = ({ show, onClose }) => {
  const router = useRouter();

  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="relative z-20">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="ease-out duration-300"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div
            ref={ref}
            className="fixed inset-x-0 top-0 bg-white h-auto p-4 shadow-lg"
          >
            <Input
              placeholder="Søk ..."
              autoFocus
              onKeyUp={(event) => {
                const { value } = event.currentTarget;
                const { key } = event;

                if (key === "Enter") {
                  router.push(`/search?q=${encodeURIComponent(value)}`);
                  onClose();
                }
              }}
            />
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default MobileSearch;
