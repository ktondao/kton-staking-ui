import * as React from 'react';

import { Button as BaseButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ButtonProps } from '@/components/ui/button';

const GhostButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const buttonClasses = cn(
    'h-[2.25rem]',
    'gap-[0.225rem]',
    'rounded-[0.3125rem]',
    'border',
    'border-primary',
    'bg-transparent',
    'px-[0.94rem]',
    'font-light',
    'text-white',
    'transition-opacity',
    'hover:bg-transparent',
    'hover:opacity-80',
    'focus-visible:ring-0',
    'active:bg-transparent',
    'active:opacity-60',
    'md:gap-[0.625rem]',
    props.className
  );
  return <BaseButton {...props} ref={ref} className={buttonClasses} />;
});

GhostButton.displayName = 'GhostButton';

export default GhostButton;
