import { cn } from '@/utilis/cn'
import React from 'react'


export function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className={cn("w-full bg-white border rounded-xl flex py-4 shadow-sm", props.className)} />
  )
}

