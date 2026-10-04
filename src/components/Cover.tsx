import type { Image } from 'velite'
import classes from './Cover.module.css'

interface CoverProps {
  cover: Image
}

/**
 * カバー画像.
 */
export const Cover: React.FC<CoverProps> = ({ cover }) => {
  return <img class={classes['Cover']} alt="" {...cover} />
}
