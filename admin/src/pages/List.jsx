import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../components/exportVariables';
import { toast } from 'react-toastify';
import Add from './Add';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openEditModal = (product) => {
    setEditData(product);
    setShowEdit(true);
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className='p-5'>
      <h2 className='mb-4 font-bold text-xl text-gray-700'>Inventory Management</h2>

      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-800 text-white text-sm font-bold rounded-t-lg'>
        <b>Image</b><b>Name</b><b>Category</b><b>Price</b><b className='text-center'>Action</b>
      </div>

      <div className='flex flex-col border rounded-b-lg overflow-hidden'>
        {list.map((item, index) => (
          <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border-b last:border-b-0 text-sm hover:bg-gray-50 transition-colors'>
            <img className='w-14 h-14 object-cover rounded shadow-sm border' src={item.image[0]} alt="" />
            <p className='font-semibold text-gray-800'>{item.name}</p>
            <p className='text-gray-500'>{item.category}</p>

            <div className='flex flex-col'>
              {/* Actual Selling Price */}
              <p className='font-bold text-gray-900'>
                Rs {Number(item.discount) > 0 ? item.discountedPrice : item.price}
              </p>

              {/* Strikethrough Original Price (Only if discount exists) */}
              {Number(item.discount) > 0 && (
                <p className='text-[10px] text-red-500 line-through italic'>
                  Original: Rs {item.price} (-{item.discount}%)
                </p>
              )}
            </div>

            <div className='flex justify-center gap-6'>
              <button onClick={() => openEditModal(item)} className='text-blue-500 hover:text-blue-700 font-bold uppercase text-xs tracking-tighter'>Edit</button>
              <button onClick={() => removeProduct(item._id)} className='text-red-400 hover:text-red-600 font-bold uppercase text-xs tracking-tighter'>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {showEdit && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white w-full max-w-2xl rounded-xl p-6 shadow-2xl relative overflow-y-auto max-h-[95vh]'>
            <Add
              token={token}
              isEdit={true}
              editData={editData}
              setShowEdit={setShowEdit}
              fetchList={fetchList}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default List;