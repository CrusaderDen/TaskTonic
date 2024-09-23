import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

import s from './button.module.scss'

type Props = {
  asChild?: boolean
  fullWidth?: boolean
  variant?: 'ghost' | 'outlined' | 'primary' | 'secondary'
} & ComponentPropsWithoutRef<'button'>

export const Button = forwardRef<ElementRef<'button'>, Props>(
  ({ asChild, className, fullWidth, variant = 'primary', ...rest }, ref) => {
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        className={clsx(s.buttonRoot, s[variant], fullWidth && s.fullWidth, className, rest.disabled && s.disabled)}
        ref={ref}
        {...rest}
      />
    )
  }
)
