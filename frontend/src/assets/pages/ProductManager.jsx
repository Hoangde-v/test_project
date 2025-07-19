import { useState } from 'react';

export default function ProductManager() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Grilled Chicken Salad',
      images: 'https://placehold.co/100x100',
      calories: 100,
      protein: 10,
      carbs: 20,
      fats: 5,
      price: 12.5,
      stock: 10,
      preparationTime: '15 min',
    },
    {
      id: 2,
      name: 'Beef Steak',
      images: 'https://placehold.co/100x100',
      calories: 200,
      protein: 25,
      carbs: 10,
      fats: 15,
      price: 20.0,
      stock: 5,
      preparationTime: '25 min',
    },
  ]);

  const [form, setForm] = useState({
    id: null,
    name: '',
    images: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    price: '',
    stock: '',
    preparationTime: '',
  });

  const isEditing = form.id !== null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEditing) {
      setProducts(prev =>
        prev.map(p => (p.id === form.id ? { ...form, id: p.id } : p))
      );
    } else {
      const newId = Date.now();
      setProducts(prev => [...prev, { ...form, id: newId }]);
    }
    setForm({
      id: null, name: '', images: '', calories: '', protein: '', carbs: '',
      fats: '', price: '', stock: '', preparationTime: ''
    });
  };

  const handleEdit = product => {
    setForm(product);
  };

  const handleDelete = id => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        {isEditing ? 'UPDATE' : 'ADD'} PRODUCT INFORMATION
      </h1>

      {/* Form nhập sản phẩm */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mb-8">
        <input className="border p-3 rounded" name="name" placeholder="Food Name" value={form.name} onChange={handleChange} required />
        <input className="border p-3 rounded" name="images" placeholder="Image URL" value={form.images} onChange={handleChange} required />
        <input className="border p-3 rounded" name="calories" placeholder="Calories" value={form.calories} onChange={handleChange} required />
        <input className="border p-3 rounded" name="protein" placeholder="Protein" value={form.protein} onChange={handleChange} required />
        <input className="border p-3 rounded" name="carbs" placeholder="Carbs" value={form.carbs} onChange={handleChange} required />
        <input className="border p-3 rounded" name="fats" placeholder="Fats" value={form.fats} onChange={handleChange} required />
        <input className="border p-3 rounded" name="price" placeholder="Price (USD)" value={form.price} onChange={handleChange} required />
        <input className="border p-3 rounded" name="stock" placeholder="Stock (Qty)" value={form.stock} onChange={handleChange} required />
        <input className="border p-3 rounded col-span-2" name="preparationTime" placeholder="Preparation Time (e.g., 15 min)" value={form.preparationTime} onChange={handleChange} required />
        
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition shadow"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      {/* Danh sách sản phẩm */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">PRODUCT LIST</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse shadow rounded overflow-hidden text-sm">
          <thead>
            <tr className="bg-green-100 text-gray-700 text-left">
              <th className="border p-3">Image</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Calories</th>
              <th className="border p-3">Protein</th>
              <th className="border p-3">Carbs</th>
              <th className="border p-3">Fats</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Stock</th>
              <th className="border p-3">Prep Time</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, index) => (
              <tr key={prod.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-2">
                  <img src={prod.images} alt="" className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="border p-2 font-semibold">{prod.name}</td>
                <td className="border p-2">{prod.calories}</td>
                <td className="border p-2">{prod.protein}</td>
                <td className="border p-2">{prod.carbs}</td>
                <td className="border p-2">{prod.fats}</td>
                <td className="border p-2 text-blue-700 font-semibold">
                  {Number(prod.price).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </td>
                <td className="border p-2">{prod.stock}</td>
                <td className="border p-2">{prod.preparationTime}</td>
                <td className="border p-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow-md transition font-medium"
                      onClick={() => handleEdit(prod)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded shadow-md transition font-medium"
                      onClick={() => handleDelete(prod.id)}
                    >
                      🗑️ Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
