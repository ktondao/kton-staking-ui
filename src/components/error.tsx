'use client';
import Image from 'next/image';

interface Props {
  title?: string;
  message?: string;
  buttonText?: string;
  action?: () => void;
}

const Error = ({ buttonText, action, title = '404', message = 'Sorry, Page not found' }: Props) => {
  return (
    <div
      className="flex flex-col items-center justify-center
        gap-[3.12rem] md:flex-row
    "
    >
      <Image
        width={230}
        height={200}
        alt={title}
        src="/images/common/error.png"
        className="h-[12.5rem] w-[14.36225rem] shrink-0"
      />

      <div className="flex flex-col items-start justify-start gap-[1.25rem]">
        <h5 className="w-full text-center text-[3.125rem] font-bold capitalize text-white md:w-auto md:text-left">
          {title}
        </h5>
        <span className="text-center text-sm font-bold  text-white md:text-left">{message}</span>
        {buttonText && action && (
          <button
            onClick={action}
            className="h-[2.25rem] w-full gap-[0.225rem] rounded-[0.3125rem] border border-primary bg-transparent px-[0.94rem] font-light text-white transition-opacity hover:bg-transparent hover:opacity-80 focus-visible:ring-0 active:bg-transparent active:opacity-60 md:w-auto md:gap-[0.625rem]"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
