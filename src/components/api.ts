const PREFIX = 'http://localhost:3000'

type RequestOptions = {
  body?: any
  headers?: Record<string, string>
  method?: string
}

const req = async (url: string, options: RequestOptions = {}): Promise<any> => {
  const { body } = options
  const token = localStorage.getItem('token')

  if (!token) {
    window.location.href = '/'
  }

  try {
    const response = await fetch((PREFIX + url).replace(/\/\/$/, ''), {
      ...options,
      body: body ? JSON.stringify(body) : null,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
    })

    if (response.ok) {
      return response.json()
    } else {
      const message = await response.text()
      throw new Error(message)
    }
  } catch (error) {
    throw new Error(`Network request failed: ${error}`)
  }
}

type Note = {
  id: number
  title: string
  text: string
}

export const getNotes = async ({ age, search, page }: { age: string; search: string; page: number }) => {
  return req(`/notes?age=${age}&search=${search}&page=${page}`)
}

export const createNote = async (title: string, text: string): Promise<Note> => {
  return req('/notes', {
    method: 'POST',
    body: { title, text },
  })
}

export const getNote = async (id: number): Promise<Note> => {
  return req(`/notes/${id}`)
}

export const archiveNote = async (id: number) => {
  return req(`/notes/${id}/archive`, { method: 'POST' })
}

export const unarchiveNote = async (id: number) => {
  return req(`/notes/${id}/unarchive`, { method: 'POST' })
}

export const editNote = async (id: number, title: string, text: string): Promise<Note> => {
  return req(`/notes/${id}`, {
    method: 'PUT',
    body: { title, text },
  })
}

export const deleteNote = async (id: number) => {
  return req(`/notes/${id}`, { method: 'DELETE' })
}

export const deleteAllArchived = async () => {
  return req('/notes/archived', { method: 'DELETE' })
}

export const notePdfUrl = async (id: number): Promise<string> => {
  return req(`/notes/${id}/pdf`)
}
