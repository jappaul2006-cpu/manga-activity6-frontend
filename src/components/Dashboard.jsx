import { useEffect, useState } from 'react'
import api from '../api'
import ProductForm from './ProductForm'

function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      if (res.data.status) {
        setProducts(res.data.data)
        setMessage('')
      } else {
        setProducts([])
        setMessage(res.data.message)
      }
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout()
      } else {
        setMessage(err.response?.data?.message || 'Failed to load products')
      }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      const res = await api.post(`/products/delete/${id}`)
      if (res.data.status) {
        fetchProducts()
      } else {
        alert(res.data.message)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    }
    onLogout()
  }

  return (
    <div className="dashboard">
      <header>
        <h2>Products</h2>
        <div>
          <span className="welcome">Hello, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {!showForm && !editing && (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Product
        </button>
      )}

      {showForm && (
        <ProductForm
          onCancel={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false)
            fetchProducts()
          }}
        />
      )}

      {editing && (
        <ProductForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            fetchProducts()
          }}
        />
      )}

      {message && <p className="error">{message}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.product_name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => setEditing(p)}>Edit</button>{' '}
                <button className="danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="6">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
