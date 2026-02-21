import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { backendUrl } from '../components/exportVariables'

const ListOrders = ({ token, currency = '$' }) => {

  const [orders, setOrders] = useState([])

  // Fetch all orders from the database
  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      // Endpoint to list all orders for admin
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse()) // Latest orders first
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Handle order status updates
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders() // Refresh list after update
        toast.success("Status Updated")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='p-4'>
      <h3 className='mb-4 text-xl font-bold text-gray-800'>Order Management</h3>
      <div className='flex flex-col gap-4'>
        {
          orders.map((order, index) => (
            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border-2 border-gray-100 p-5 md:p-8 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-sm'>
              
              {/* Icon */}
              <img className='w-12' src={assets.parcel_icon} alt="Parcel" />
              
              {/* Product and Shipping Info */}
              <div>
                <div className='font-semibold text-gray-900'>
                  {/* Handling nested item structure based on your database */}
                  {(Array.isArray(order.items[0]) ? order.items[0] : order.items).map((item, idx) => (
                    <p className='py-0.5' key={idx}>
                      {item.name} x {item.quantity} <span className='text-gray-500'>({item.size})</span>
                    </p>
                  ))}
                </div>
                
                <p className='mt-4 mb-1 font-bold text-gray-800 text-sm'>
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className='text-gray-600 italic'>
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className='mt-2 font-medium text-blue-600'>{order.address.phone}</p>
              </div>

              {/* Order Meta Data */}
              <div>
                <p className='text-sm sm:text-[15px] font-medium'>Total Items : {order.items[0]?.length || order.items.length}</p>
                <p className='mt-3'>Method : <span className='font-semibold uppercase'>{order.paymentMethod}</span></p>
                <p>Payment : <span className={order.payment ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {order.payment ? 'Verified' : 'Pending'}
                </span></p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>

              {/* Price */}
              <p className='text-sm sm:text-[15px] font-bold text-gray-900'>{currency}{order.amount}</p>

              {/* Status Controller */}
              <select 
                onChange={(e) => statusHandler(e, order._id)} 
                value={order.status} 
                className='p-2 font-semibold border border-gray-300 rounded bg-gray-50 cursor-pointer outline-none hover:border-blue-500'
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ListOrders