"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => value ?? defaultValue ?? [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-white/[0.08] relative h-1.5 w-full grow overflow-hidden rounded-full border border-white/[0.04]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, oklch(0.72 0.19 220), oklch(0.65 0.17 240))',
            boxShadow: '0 0 10px oklch(0.72 0.19 220 / 0.35)',
          }}
        />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block h-4.5 w-4.5 shrink-0 rounded-full border-2 border-[oklch(0.85_0.15_220)] bg-[oklch(0.72_0.19_220)] shadow-[0_0_10px_oklch(0.72_0.19_220_/_0.5)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none hover:scale-110 hover:shadow-[0_0_16px_oklch(0.72_0.19_220_/_0.7)] active:scale-95 cursor-pointer"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
