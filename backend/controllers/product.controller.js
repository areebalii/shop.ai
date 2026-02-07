
// function to add products
export const addProduct = async (req, res) => {
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Raw Body:", req.body);
  console.log("All Files:", req.files);
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

    const image2 = req.files.image1 && req.files.image2[0]
    const image1 = req.files.image2 && req.files.image1[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]
    console.log(name, description, price, category, subCategory, sizes, bestSeller)
    console.log(image1, image2, image3, image4)
    res.json({})
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// function for list products
export const listProducts = async (req, res) => { }

// function to get single product info
export const singleProduct = async (req, res) => { }

// function to remove product details
export const removeProduct = async (req, res) => { }