import { useEffect, useState } from 'react'
import api from './api'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Register from './components/Register'

function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data.status) setUser(res.data.data)
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  if (checking) return <p className="loading">Loading...</p>

  return (
    <div className="app">
      <h1>Product Manager</h1>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : showRegister ? (
        <Register onBack={() => setShowRegister(false)} />
      ) : (
        <Login onLogin={setUser} onAddUser={() => setShowRegister(true)} />
      )}
    </div>
  )
}

export default App
