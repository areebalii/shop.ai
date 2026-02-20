import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          // Check if items exists and is an array
          if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
              // Sometimes backend items are nested in another array [ [{...}] ]
              const product = Array.isArray(item) ? item[0] : item;
              
              if (product && typeof product === 'object') {
                allOrdersItem.push({
                  ...product,
                  status: order.status,
                  paymentMethod: order.paymentMethod,
                  payment: order.payment,
                  date: order.date
                });
              }
            });
          }
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className='mt-8'>
        {
          orderData.length > 0 ? (
            orderData.map((item, index) => (
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                
                {/* --- Left Section: Image and Product Details --- */}
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20 rounded shadow-sm' src={item.image?.[0]} alt={item.name} />
                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p>{currency}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                      <p className='px-2 border bg-slate-50'>Size: {item.size}</p>
                    </div>
                    <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment: <span className='text-gray-400'>{item.status}</span></p>
                  </div>
                </div>

                {/* --- Right Section: Status and Action --- */}
                <div className='md:w-1/2 flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <p className={`min-w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400'}`}></p>
                    <p className='text-sm md:text-base font-medium capitalize'>{item.status}</p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-black hover:text-white transition-all duration-300'
                  >
                    Track Order
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className='text-center py-20 text-gray-400'>
              <p>You haven't placed any orders yet.</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Orders;