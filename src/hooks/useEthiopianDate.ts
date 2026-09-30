import { useMemo } from 'react'
import { gregorianToEthiopian, type EthiopianDate } from '@/lib/ethiopianCalendar'

/**
 * Returns the current Ethiopian date, computed on mount.
 * Memoized — re-renders don't re-compute unless the component remounts.
 */
export function useEthiopianDate(): EthiopianDate {
  return useMemo(() => gregorianToEthiopian(new Date()), [])
}

/**
 * Returns just the Ethiopian year as a string — used in the hero headline.
 */
export function useEthiopianYear(): string {
  const date = useEthiopianDate()
  return String(date.year)
}
