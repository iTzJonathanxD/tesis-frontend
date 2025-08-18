import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white shadow hover:bg-primary-700 focus-visible:ring-primary-500',
        destructive:
          'bg-error-600 text-white shadow-sm hover:bg-error-700 focus-visible:ring-error-500',
        outline:
          'border border-primary-200 bg-white shadow-sm hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-primary-500',
        secondary:
          'bg-secondary-100 text-secondary-900 shadow-sm hover:bg-secondary-200 focus-visible:ring-secondary-500',
        ghost:
          'hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-primary-500',
        link: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
        success:
          'bg-success-600 text-white shadow hover:bg-success-700 focus-visible:ring-success-500',
        warning:
          'bg-warning-600 text-white shadow hover:bg-warning-700 focus-visible:ring-warning-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
