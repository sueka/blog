import { clsx } from 'clsx/lite'
import type { HTMLAttributes } from 'preact'
import classes from './Center.module.css'

type CenterProps = HTMLAttributes

export const Center: React.FC<CenterProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div class={clsx(classes['Center'], className)} {...props}>
    {children}
  </div>
)
