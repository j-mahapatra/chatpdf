import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateStringByBytes(str: string, bytes: number) {
  const encoder = new TextEncoder();
  return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes));
}

export function convertToASCII(str: string) {
  return str.replace(/[^\x00-\x7F]/g, '');
}
