import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * CSS/Tailwind class merger
 */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
