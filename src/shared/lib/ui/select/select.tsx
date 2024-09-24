'use client'

import * as React from 'react'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'

import s from './select.module.scss'

import { ChevronDown } from './../../assets/icons/Chevron-down'

const Select = ({
  children,
  placeholder,
  portal = true,
  triggerIcon,
  triggerProps = {},
  ...props
}: {
  placeholder?: string
  portal?: boolean
  triggerIcon?: ReactNode
  triggerProps?: Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'>
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) => (
  <SelectPrimitive.Root {...props}>
    <SelectTrigger {...triggerProps}>
      <div className={s.triggerLabel}>
        {triggerIcon && triggerIcon}
        <SelectValue placeholder={placeholder} />
      </div>
    </SelectTrigger>
    <SelectContent portal={portal}>{children}</SelectContent>
  </SelectPrimitive.Root>
)

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Trigger className={clsx(s.selectTrigger, s.trigger, className)} ref={ref} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className={clsx(s.selectIcon, s.triggerChevron)} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  { portal?: boolean } & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ children, className, portal, position = 'popper', ...props }, ref) => (
  <>
    {portal ? (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={clsx(s.selectContent, s.content, className)}
          position={position}
          ref={ref}
          {...props}
        >
          <SelectPrimitive.Viewport className={clsx(s.viewport, s.selectViewport)}>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    ) : (
      <SelectPrimitive.Content
        className={clsx(s.selectContent, s.content, className)}
        position={position}
        ref={ref}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={clsx(s.selectViewport, position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full')}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    )}
  </>
))

SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label className={clsx(s.selectLabel, className)} ref={ref} {...props} />
))

SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Item className={clsx(s.selectItem, s.item, className)} ref={ref} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))

SelectItem.displayName = SelectPrimitive.Item.displayName

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue }
