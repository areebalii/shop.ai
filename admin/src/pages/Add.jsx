import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../components/exportVariables'
import { toast } from 'react-toastify'

const Add = ({ token, isEdit, editData, setShowEdit, fetchList }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    if (isEdit && editData) {
      setName(editData.name);
      setDescription(editData.description);
      setPrice(editData.price);

      // Explicitly check for null/undefined to prevent UI resets
      const savedDiscount = editData.discount !== undefined && editData.discount !== null
        ? editData.discount
        : 0;
      setDiscount(savedDiscount);

      setCategory(editData.category);
      setSubCategory(editData.subCategory);
      setBestSeller(editData.bestSeller || editData.bestseller);
      setSizes(editData.sizes || []);
    }
  }, [isEdit, editData]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // If editing, we MUST send the ID so the backend knows which product to update
      if (isEdit) {
        formData.append("id", editData._id);
      }

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", Number(discount));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // Dynamic URL based on mode
      const endpoint = isEdit ? "/api/product/update" : "/api/product/add";
      const response = await axios.post(backendUrl + endpoint, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);

        if (isEdit) {
          setShowEdit(false); // Close modal
          fetchList();        // Refresh the list
        } else {
          // Reset form only if adding new
          setName('');
          setDescription('');
          setImage1(false);
          setImage2(false);
          setImage3(false);
          setImage4(false);
          setPrice('');
          setDiscount(0);
          setSizes([]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 bg-white p-2 rounded-lg'>
      <div className='w-full flex justify-between items-center'>
        <p className='font-bold text-xl'>{isEdit ? "Edit Product" : "Add Product"}</p>
        {isEdit && <button type='button' onClick={() => setShowEdit(false)} className='text-gray-500 text-2xl'>&times;</button>}
      </div>

      <div>
        <p className='mb-2 font-medium'>Upload Images {isEdit && "(Leave empty to keep existing)"}</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20 h-20 object-cover cursor-pointer border-2 border-dashed p-1' src={image1 ? URL.createObjectURL(image1) : (isEdit && editData.image[0] ? editData.image[0] : assets.upload_area)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20 h-20 object-cover cursor-pointer border-2 border-dashed p-1' src={image2 ? URL.createObjectURL(image2) : (isEdit && editData.image[1] ? editData.image[1] : assets.upload_area)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20 h-20 object-cover cursor-pointer border-2 border-dashed p-1' src={image3 ? URL.createObjectURL(image3) : (isEdit && editData.image[2] ? editData.image[2] : assets.upload_area)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20 h-20 object-cover cursor-pointer border-2 border-dashed p-1' src={image4 ? URL.createObjectURL(image4) : (isEdit && editData.image[3] ? editData.image[3] : assets.upload_area)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded' placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 border rounded'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 border rounded'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full sm:w-[120px] px-3 py-2 border rounded' type="Number" placeholder='25' required />
        </div>
        <div>
          <p className='mb-2'>Discount (%)</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            className='w-full sm:w-[120px] px-3 py-2 border rounded border-orange-300 focus:border-orange-500 outline-none'
            type="Number"
            placeholder='13'
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-blue-100 border-blue-500 text-blue-700 font-bold" : "bg-slate-200"} px-3 py-1 cursor-pointer border transition-all`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer font-medium' htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type="submit" className='w-full max-w-[500px] py-3 mt-4 bg-black text-white rounded font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest'>
        {isEdit ? "Save Changes" : "Add Product"}
      </button>
    </form>
  )
}

export default Add