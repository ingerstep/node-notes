document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm')

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault()

      const formData = new FormData(loginForm)
      const login = formData.get('login')
      const password = formData.get('password')

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password }),
        })

        if (!response.ok) {
          const error = await response.json()
          alert(error.message || 'Ошибка авторизации')
          return
        }

        const { token } = await response.json()

        console.log(token)

        localStorage.setItem('token', token)

        window.location.href = '/dashboard'
      } catch (error) {
        console.error('Ошибка при авторизации:', error)
      }
    })
  }

  const signupForm = document.getElementById('signupForm')

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault()

      const formData = new FormData(signupForm)
      const login = formData.get('login')
      const password = formData.get('password')

      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password }),
        })

        if (!response.ok) {
          const error = await response.json()
          alert(error.message || 'Ошибка регистрации')
          return
        }

        alert('Регистрация успешна. Теперь вы можете войти.')
      } catch (error) {
        console.error('Ошибка при регистрации:', error)
      }
    })
  }
})
