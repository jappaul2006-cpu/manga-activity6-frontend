import { useState } from 'react'
import api from '../api'

const emptyForm = { product_name: '', description: '', price: '', quantity: '' }

function ProductForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (initial && initial.id) {
        await api.post(`/products/update/${initial.id}`, form)
      } else {
        await api.post('/products', form)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{initial && initial.id ? 'Edit Product' : 'Add Product'}</h3>
      {error && <p className="error">{error}</p>}
      <input
        name="product_name"
        placeholder="Product name"
        value={form.product_name}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ProductForm
