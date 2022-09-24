import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import clsx from "clsx";

type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full";

type Props = React.PropsWithChildren<{
  title?: React.ReactNode;

  show: boolean;
  onClose: () => void;

  preventClickOutside?: boolean;

  size?: ModalSize;
}>;

const Modal: React.FC<Props> = ({
  title,
  show,
  onClose,
  children,
  preventClickOutside,
  size = "md",
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={preventClickOutside ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div
            className={clsx(
              "flex min-h-full items-center justify-center text-center",
              {
                "p-4": size !== "full",
                "p-0": size === "full",
              }
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "w-full transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all",
                  {
                    "max-w-xs": size === "xs",
                    "max-w-sm": size === "sm",
                    "max-w-md": size === "md",
                    "max-w-lg": size === "lg",
                    "max-w-xl": size === "xl",
                    "max-w-2xl": size === "2xl",
                    "max-w-3xl": size === "3xl",
                    "max-w-4xl": size === "4xl",
                    "max-w-5xl": size === "5xl",
                    "max-w-6xl": size === "6xl",
                    "max-w-7xl": size === "7xl",
                    "w-full h-screen": size === "full",
                    "rounded-lg": size !== "full",
                  }
                )}
              >
                <Dialog.Title className="flex justify-between items-center mb-2">
                  {title ? (
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {title}
                    </h3>
                  ) : (
                    <div></div>
                  )}

                  <button type="button" onClick={onClose}>
                    <FaTimes />
                  </button>
                </Dialog.Title>

                <div className="">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
