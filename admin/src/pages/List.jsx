import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../components/exportVariables'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])

  // Function to fetch all products
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.data); 
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Function to remove a product
  const removeProduct = async (id) => {
    try {
      // Confirm before deleting
      if (!window.confirm("Are you sure you want to delete this product?")) return;

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-4 font-semibold text-lg'>All Products List</p>

      <div className='flex flex-col gap-2'>
        
        {/* ------- List Table Title ---------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-bold'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------- Product List ---------- */}
        {
          list.length > 0 ? (
            list.map((item, index) => (
              <div 
                className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-sm hover:bg-gray-50 transition-all' 
                key={index}
              >
                <img className='w-14 h-14 object-cover rounded' src={item.image[0]} alt={item.name} />
                <p className='font-medium'>{item.name}</p>
                <p className='hidden md:block'>{item.category}</p>
                <p className='font-semibold'>$ {item.price}</p>
                <div className='flex justify-center'>
                  <p 
                    onClick={() => removeProduct(item._id)} 
                    className='text-center cursor-pointer text-red-500 hover:text-red-700 font-bold text-lg p-2'
                  >
                    X
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-10 text-gray-400'>No products found.</div>
          )
        }

      </div>
    </>
  )
}

export default List