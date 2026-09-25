import classes from './FrontMatter.module.css'

interface FrontMatterProps {
  date: string // ISO 8601 date
}

export const FrontMatter: React.FC<FrontMatterProps> = ({ date }) => {
  const humanDate = new Date(date).toLocaleDateString('ja', {
    dateStyle: 'long',
  })

  return (
    <div class={classes['FrontMatter']}>
      <meta itemprop="datePublished" content={date} />
      <time datetime={date}>{humanDate}</time>
    </div>
  )
}
