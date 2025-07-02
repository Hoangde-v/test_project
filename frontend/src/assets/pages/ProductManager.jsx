import { useState } from 'react';

export default function ProductManager() {
  const [products, setProducts] = useState([
    {
      id: 1,
      images: 'https://placehold.co/100x100',
      calories: 100,
      protein: 10,
      carbs: 20,
      fats: 5,
    },
    {
      id: 2,
      images: 'https://placehold.co/100x100',
      calories: 200,
      protein: 15,
      carbs: 25,
      fats: 10,
    },
  ]);

  const [form, setForm] = useState({
    id: null,
    images: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
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

    setForm({ id: null, images: '', calories: '', protein: '', carbs: '', fats: '' });
  };

  const handleEdit = product => {
    setForm(product);
  };

  const handleDelete = id => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? 'UPDATE' : 'ADD'} PRODUCT INFORMATION</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input className="border p-2" name="images" placeholder="URL Images" value={form.images} onChange={handleChange} required />
        <input className="border p-2" name="calories" placeholder="Calories" value={form.calories} onChange={handleChange} required />
        <input className="border p-2" name="protein" placeholder="Protein" value={form.protein} onChange={handleChange} required />
        <input className="border p-2" name="carbs" placeholder="Carbs" value={form.carbs} onChange={handleChange} required />
        <input className="border p-2" name="fats" placeholder="Fats" value={form.fats} onChange={handleChange} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
          {isEditing ? 'Update' : 'Thêm'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">PRODUCT LIST</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Images</th>
            <th className="border p-2">Calories</th>
            <th className="border p-2">Protein</th>
            <th className="border p-2">Carbs</th>
            <th className="border p-2">Fats</th>
            <th className="border p-2">Options</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id}>
              <td className="border p-2">
                <img src={prod.images} alt="" className="w-16 h-16 object-cover" />
              </td>
              <td className="border p-2">{prod.calories}</td>
              <td className="border p-2">{prod.protein}</td>
              <td className="border p-2">{prod.carbs}</td>
              <td className="border p-2">{prod.fats}</td>
              <td className="border p-2">
                <td className="border p-2">
                <div className="flex gap-2">
                    <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition"
                    onClick={() => handleEdit(prod)}
                    >
                    ✏️ Sửa
                    </button>
                    <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
                    onClick={() => handleDelete(prod.id)}
                    >
                    🗑️ Xoá
                    </button>
                </div>
            </td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
