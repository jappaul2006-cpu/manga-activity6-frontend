import { useState } from 'react'
import api from '../api'

function Register({ onBack }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      if (res.data.status) {
        setMessage('Account created! You can now log in.')
        setForm({ username: '', email: '', password: '', role: 'user' })
      } else {
        setError(res.data.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add User'}
        </button>
      </form>
      <button type="button" className="link-btn" onClick={onBack}>
        Back to Login
      </button>
    </div>
  )
}

export default Register
