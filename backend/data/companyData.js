export const companyData = {
  name: "WearWell",
  description:
    "WearWell is a modern ecommerce store offering stylish clothing for Men, Women and Kids with fast delivery and easy returns.",

  categories: [
    "Men",
    "Women",
    "Kids"
  ],

  products: [

    // ================= MEN =================

    {
      id: 1,
      category: "Men",
      subCategory: "Topwear",
      name: "Men Smart Fit Flannel Shirt",
      description: "Comfortable flannel shirt perfect for casual wear.",
      price: 35,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Red", "Blue", "Black"],
      stock: 50
    },

    {
      id: 2,
      category: "Men",
      subCategory: "Topwear",
      name: "Men Smart Fit Denim Shirt",
      description: "Stylish denim shirt for modern casual fashion.",
      price: 40,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue"],
      stock: 45
    },

    {
      id: 3,
      category: "Men",
      subCategory: "Topwear",
      name: "Men Smart Fit Polo Shirt",
      description: "Soft cotton polo shirt suitable for daily wear.",
      price: 30,
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Blue"],
      stock: 60
    },

    // MEN BOTTOMWEAR

    {
      id: 4,
      category: "Men",
      subCategory: "Bottomwear",
      name: "Man Chino Pants Bottom",
      description: "Comfortable chino pants for everyday style.",
      price: 38,
      sizes: ["30", "32", "34", "36"],
      colors: ["Khaki", "Black"],
      stock: 40
    },

    {
      id: 5,
      category: "Men",
      subCategory: "Bottomwear",
      name: "Man Cargo Trouser Bottom",
      description: "Durable cargo trousers with multiple pockets.",
      price: 42,
      sizes: ["30", "32", "34", "36"],
      colors: ["Olive", "Black"],
      stock: 35
    },

    {
      id: 6,
      category: "Men",
      subCategory: "Bottomwear",
      name: "Slim Fit Jeans For Men",
      description: "Modern slim fit denim jeans.",
      price: 45,
      sizes: ["30", "32", "34", "36"],
      colors: ["Blue"],
      stock: 55
    },

    {
      id: 7,
      category: "Men",
      subCategory: "Bottomwear",
      name: "Men Fit Short Bottom",
      description: "Lightweight shorts perfect for summer.",
      price: 25,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Gray", "Black"],
      stock: 30
    },

    // MEN WINTERWEAR

    {
      id: 8,
      category: "Men",
      subCategory: "Winterwear",
      name: "Men Smart Fit Hoodie",
      description: "Warm hoodie designed for winter comfort.",
      price: 50,
      sizes: ["M", "L", "XL"],
      colors: ["Black", "Gray"],
      stock: 28
    },

    {
      id: 9,
      category: "Men",
      subCategory: "Winterwear",
      name: "Man Zip Fit Jacket",
      description: "Stylish zip jacket for cold weather.",
      price: 65,
      sizes: ["M", "L", "XL"],
      colors: ["Black", "Navy"],
      stock: 22
    },


    // ================= WOMEN =================

    {
      id: 10,
      category: "Women",
      subCategory: "Topwear",
      name: "Women Fit Tunic Shirt",
      description: "Elegant tunic shirt for modern women.",
      price: 34,
      sizes: ["S", "M", "L"],
      colors: ["Pink", "White"],
      stock: 35
    },

    {
      id: 11,
      category: "Women",
      subCategory: "Topwear",
      name: "Women Fit Tee Shirt",
      description: "Comfortable casual tee shirt.",
      price: 22,
      sizes: ["S", "M", "L"],
      colors: ["Black", "White", "Blue"],
      stock: 50
    },

    {
      id: 12,
      category: "Women",
      subCategory: "Topwear",
      name: "Women Fit Half Zip SweaterShirt",
      description: "Stylish half zip sweater shirt.",
      price: 40,
      sizes: ["S", "M", "L"],
      colors: ["Beige", "Gray"],
      stock: 30
    },

    // WOMEN BOTTOMWEAR

    {
      id: 13,
      category: "Women",
      subCategory: "Bottomwear",
      name: "Women B-fit Pant Top",
      description: "Comfortable slim fit pants.",
      price: 36,
      sizes: ["S", "M", "L"],
      colors: ["Black", "Brown"],
      stock: 33
    },

    {
      id: 14,
      category: "Women",
      subCategory: "Bottomwear",
      name: "Women Fit Chinos Bottom",
      description: "Trendy chinos for daily wear.",
      price: 38,
      sizes: ["S", "M", "L"],
      colors: ["Khaki", "Black"],
      stock: 29
    },

    // WOMEN WINTERWEAR

    {
      id: 15,
      category: "Women",
      subCategory: "Winterwear",
      name: "Women Zip Fit Jacket",
      description: "Warm and stylish winter jacket.",
      price: 60,
      sizes: ["S", "M", "L"],
      colors: ["Black", "Gray"],
      stock: 20
    },


    // ================= KIDS =================

    {
      id: 16,
      category: "Kids",
      subCategory: "Topwear",
      name: "Kids Fit Slim Shirt Top",
      description: "Comfortable slim shirt for kids.",
      price: 20,
      sizes: ["XS", "S", "M"],
      colors: ["Blue", "White"],
      stock: 40
    }

  ],

  shipping: {
    standardDelivery: "3-5 business days",
    expressDelivery: "1-2 business days"
  },

  paymentMethods: [
    "Credit Card",
    "Debit Card",
    "Cash on Delivery"
  ],

  returnPolicy: {
    returnWindowDays: 30,
    condition: "Product must be unused and in original packaging."
  },

  customerSupport: {
    email: "support@wearwell.com",
    workingHours: "Monday-Saturday: 9AM - 8PM"
  }
};