export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function ReadingTimeDisplay({ text, className = "" }: { text: string; className?: string }) {
  const minutes = calculateReadingTime(text)
  return <span className={className}>{minutes} min read</span>
}
