import App from './App.svelte'

async function app() {
  const data = await fetchWithAuth()

  const main = document.getElementById('main')

  if (!main) {
    throw new Error("Element with id 'main' not found.")
  }

  new App({
    target: main,
  })
}

app()

async function fetchWithAuth() {
  const token = localStorage.getItem('token')

  if (!token) {
    window.location.href = '/'
  }

  const response = await fetch('http://localhost:3000/dashboard/auth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      alert('Authorization failed. Please login again.')

      localStorage.removeItem('token')

      window.location.href = '/'
    } else if (response.status === 403) {
      alert('You do not have access to this resource.')
    }
  }

  return response.json()
}
