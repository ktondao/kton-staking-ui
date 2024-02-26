'use client';

import { useTheme } from 'next-themes';
import { JetBrains_Mono } from 'next/font/google';
import { Toaster as Sonner } from 'sonner';

import { cn } from '@/lib/utils';

type ToasterOriginProps = React.ComponentProps<typeof Sonner>;

const fontJetBrainsMono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'] });

interface ToasterProps extends ToasterOriginProps {
  toastContainerClassName?: string;
  toastCloseButtonClassName?: string;
}
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      closeButton
      theme={theme as ToasterProps['theme']}
      className={`toaster group leading-6 ${fontJetBrainsMono.className}`}
      toastOptions={{
        classNames: {
          toast: cn(
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:border group-[.toaster]:border-primary group-[.toaster]:p-[1.25rem] group-[.toaster]:rounded-[0.3125rem]',
            props.toastOptions?.classNames?.toast
          ),
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          closeButton: cn(
            'group-[.toast]:bg-primary group-[.toast]:border group-[.toast]:border-primary group-[.toast]:hover:opacity-60 ',
            props.toastOptions?.classNames?.closeButton
          )
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
