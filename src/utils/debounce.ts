export const debounce = (fn: (...params: any[]) => any, delay: number) => {
  let timer: NodeJS.Timeout | undefined = undefined;

  return function (this: any, ...args: any[]) {
    clearTimeout(timer);

    timer = setTimeout(() => fn.apply(this, args), delay);

    return timer;
  };
};
