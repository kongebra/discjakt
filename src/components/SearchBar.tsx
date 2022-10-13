import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Container from "./Container";
import Input from "./Input";

type Props = {
  show: boolean;
  onClose?: () => void;
};

const SearchBar: React.FC<Props> = ({ show, onClose }) => {
  const router = useRouter();

  const { handleSubmit, register } = useForm<{ query: string }>({});

  const onSubmit = handleSubmit(({ query }) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  });

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="relative z-20">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-x-0 top-0 bg-white border-b border-t">
            <form onSubmit={onSubmit}>
              <Container className="flex py-2">
                <Input
                  placeholder="Søk ..."
                  className="rounded-r-none"
                  autoFocus
                  onKeyUp={(event) => {
                    const { key } = event;

                    if (key === "Escape" || key === "Enter") {
                      onClose?.();
                    }
                  }}
                  {...register("query")}
                />
                <Button
                  type="submit"
                  color="secondary"
                  className="rounded-l-none shadow-sm"
                >
                  Søk
                </Button>
              </Container>
            </form>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SearchBar;
