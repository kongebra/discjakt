import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { FaTimes } from "react-icons/fa";

type DrawerSize =
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
  title: React.ReactNode;

  show: boolean;
  onClose: () => void;

  size?: DrawerSize;

  className?: string;
}>;

const Drawer: React.FC<Props> = ({
  title,
  children,
  show,
  onClose,
  size = "md",
  className,
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" open={show} onClose={onClose} className="relative z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-end">
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
                  "flex flex-col min-h-screen w-full transform overflow-hidden bg-white p-6 align-middle shadow-xl transition-all",
                  `max-w-${size}`
                )}
              >
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-3"
                >
                  <h3 className="text-xl font-semibold">{title}</h3>

                  <button type="button" onClick={onClose}>
                    <FaTimes />
                  </button>
                </Dialog.Title>

                <div className={clsx("flex-1", className)}>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Drawer;
