import { Button as ButtonPrimitive } from '@ui-sdk/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from './utils';
import './styles.css';

const buttonVariants = cva(
  "ui-button inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'ui-button--default bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'ui-button--destructive bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'ui-button--outline border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary: 'ui-button--secondary bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'ui-button--ghost hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'ui-button--link text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'ui-button--default-size h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "ui-button--extra-small h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'ui-button--small h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'ui-button--large h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'ui-button--icon size-9',
        'icon-xs': "ui-button--icon-extra-small size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'ui-button--icon-small size-8',
        'icon-lg': 'ui-button--icon-large size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>;

function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} data-size={size} data-variant={variant} {...props} />
  );
}

export { Button, buttonVariants, type ButtonProps };
