import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/src/lib/utils';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      default: 'button--default',
      outline: 'button--outline',
      ghost: 'button--ghost',
    },
    size: {
      default: 'button--default-size',
      sm: 'button--small',
      icon: 'button--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} type={type} {...props} />;
}

export { Button, buttonVariants };
