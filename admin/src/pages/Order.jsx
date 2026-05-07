import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { backendUrl } from '../components/exportVariables'

const ListOrders = ({ token, currency = '$' }) => {

  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentImg, setCurrentImg] = useState('')

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Status Updated")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // New function to manually verify payment
  const togglePayment = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, payment: true }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Payment Verified")
      }
    } catch (error) {
      toast.error("Failed to verify payment")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='p-4'>
      <h3 className='mb-4 text-xl font-bold text-gray-800'>Order Management</h3>
      <div className='flex flex-col gap-4'>
        {orders.map((order, index) => (
          <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border-2 border-gray-100 p-5 md:p-8 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-sm'>

            <img className='w-12' src={assets.parcel_icon} alt="Parcel" />

            <div>
              <div className='font-semibold text-gray-900'>
                {(Array.isArray(order.items[0]) ? order.items[0] : order.items).map((item, idx) => (
                  <p className='py-0.5' key={idx}>
                    {item.name} x {item.quantity} <span className='text-gray-500'>({item.size})</span>
                  </p>
                ))}
              </div>
              <p className='mt-4 mb-1 font-bold text-gray-800 text-sm'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='text-gray-600 italic'>
                <p>{order.address.street}, {order.address.city}</p>
              </div>
              <p className='mt-2 font-medium text-blue-600'>{order.address.phone}</p>

              {/* SCREENSHOT BUTTON - Only shows if a screenshot exists */}
              {order.paymentScreenshot && (
                <button
                  onClick={() => { setCurrentImg(order.paymentScreenshot); setShowModal(true); }}
                  className='mt-3 bg-slate-900 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-all'
                >
                  View Receipt
                </button>
              )}
            </div>

            <div>
              <p className='text-sm sm:text-[15px] font-medium'>Items : {order.items[0]?.length || order.items.length}</p>
              <p className='mt-3'>Method : <span className='font-semibold uppercase'>{order.paymentMethod}</span></p>
              <div className='flex items-center gap-2'>
                <p>Payment : </p>
                <span className={order.payment ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {order.payment ? 'Verified' : 'Pending'}
                </span>
                {/* Checkmark button to verify payment if manual method was used */}
                {!order.payment && order.paymentMethod !== 'COD' && (
                  <button onClick={() => togglePayment(order._id)} className='text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 hover:bg-green-200'>Verify Now</button>
                )}
              </div>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px] font-bold text-gray-900'>{currency}{order.amount}</p>

            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
              className='p-2 font-semibold border border-gray-300 rounded bg-gray-50 outline-none'
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>

      {/* --- SCREENSHOT LIGHTBOX MODAL --- */}
      {showModal && (
        <div className='fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
          <div className='relative max-w-2xl w-full flex flex-col items-center'>
            <button
              onClick={() => setShowModal(false)}
              className='absolute -top-12 right-0 text-white text-3xl font-light hover:text-red-500 transition-colors'
            >
              ✕
            </button>
            <img src={currentImg} className='max-h-[85vh] w-auto rounded-lg shadow-2xl' alt="Payment Proof" />
            <a
              href={currentImg}
              target="_blank"
              rel="noreferrer"
              className='mt-4 text-white text-xs underline underline-offset-4 opacity-70 hover:opacity-100'
            >
              Open in new tab
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListOrders