import { parseISO } from 'date-fns/parseISO'
import { format } from 'date-fns/format'
import { parse } from 'regexparam'

// routing
export const routePatterns = {
  new: '/new',
  edit: '/:id/edit',
  view: '/:id',
}

export const routerPrefix = '/note'

const routeRegexes = Object.keys(routePatterns).reduce(
  (acc, p) => {
    acc[p] = parse(routePatterns[p])
    return acc
  },
  {} as Record<string, any>
)

const matchPattern = (path: string, { keys, pattern }: { keys: string[]; pattern: RegExp }) => {
  const matches = pattern.exec(path)

  if (!matches) {
    return null
  }

  const params: Record<string, string | null> = {}
  let i = 0
  while (i < keys.length) {
    params[keys[i]] = matches[++i] || null
  }

  return params
}

export const getActiveNoteId = ($location: string): string | null => {
  const loc = $location.replace(new RegExp('^' + routerPrefix), '')

  for (const p of [routeRegexes.view, routeRegexes.edit]) {
    const m = matchPattern(loc, p)
    if (m && m.id) {
      return m.id
    }
  }
  return null
}

export const formatDate = (date: string): string => {
  if (!date) {
    return ''
  }
  const d = parseISO(date)
  return format(d, 'dd.MM.yyyy')
}

export const formatSearchResult = (e: { highlights?: string; title: string }): string => {
  const hl = e.highlights
  if (!hl) {
    return e.title
  }
  return hl.replace(/<mark>/g, '<strong>').replace(/<\/mark>/g, '</strong>')
}
