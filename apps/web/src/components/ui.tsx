import * as React from 'react'
import { cn } from '@/lib/utils'

export function Button({ className, variant = 'primary', size = 'md', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'; size?: 'sm' | 'md' | 'lg' | 'icon' }) {
  return <button className={cn('button', `button-${variant}`, `button-${size}`, className)} {...props} />
}
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('card', className)} {...props} /> }
export function Badge({ className, tone = 'neutral', ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand' }) { return <span className={cn('badge', `badge-${tone}`, className)} {...props} /> }
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn('input', props.className)} /> }
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={cn('input', props.className)} /> }
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={cn('input textarea', props.className)} /> }
export function Skeleton({ className }: { className?: string }) { return <div className={cn('skeleton', className)} aria-hidden="true" /> }
