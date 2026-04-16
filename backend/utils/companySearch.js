import { companyData } from "../data/companyData.js";

// keyword map
const keywordMap = {
  men: ["men", "man", "male"],
  women: ["women", "woman", "female"],
  kids: ["kids", "kid", "child"],
  topwear: ["shirt", "tshirt", "top", "polo", "flannel", "denim"],
  bottomwear: ["pant", "jeans", "trouser", "short"],
  winterwear: ["jacket", "hoodie", "coat", "sweater"]
};

// helper
function detectKeyword(query, keywords) {
  return keywords.some(word => query.includes(word));
}

export function searchCompanyData(query) {
  if (!query) return JSON.stringify({ type: "none", data: [] });

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(" ");

  // =============================
  // 🔥 1. CATEGORY INTENT
  // =============================
  const isCategoryQuery =
    queryLower.includes("type of products") ||
    queryLower.includes("what do you sell") ||
    queryLower.includes("what are you selling") ||
    queryLower.includes("what categories") ||
    queryLower.includes("what kind of products");

  if (isCategoryQuery) {
    return JSON.stringify({
      type: "category",
      data: companyData.categories
    });
  }

  // =============================
  // 🔥 2. LIST INTENT
  // =============================
  const isListQuery =
    queryLower.includes("what products") ||
    queryLower.includes("show products") ||
    queryLower.includes("all products") ||
    queryLower.includes("available products");

  if (isListQuery) {
    return JSON.stringify({
      type: "list",
      data: companyData.products.map(p => ({
        name: p.name,
        category: p.category
      }))
    });
  }

  // =============================
  // 🔥 3. PRICE INTENT (NEW)
  // =============================
  const isPriceQuery =
    queryLower.includes("price") ||
    queryLower.includes("cost") ||
    queryLower.includes("how much");

  if (isPriceQuery) {
    const results = companyData.products.filter(p =>
      queryWords.some(word =>
        p.name.toLowerCase().includes(word)
      )
    );

    return JSON.stringify({
      type: "price",
      data: results.slice(0, 1)
    });
  }

  // =============================
  // 🔥 4. DETAIL INTENT
  // =============================

  let category = null;
  let subCategory = null;

  if (detectKeyword(queryLower, keywordMap.men)) category = "Men";
  else if (detectKeyword(queryLower, keywordMap.women)) category = "Women";
  else if (detectKeyword(queryLower, keywordMap.kids)) category = "Kids";

  if (detectKeyword(queryLower, keywordMap.topwear)) subCategory = "Topwear";
  else if (detectKeyword(queryLower, keywordMap.bottomwear)) subCategory = "Bottomwear";
  else if (detectKeyword(queryLower, keywordMap.winterwear)) subCategory = "Winterwear";

  const results = companyData.products.filter(product => {
    const nameMatch = queryWords.filter(word => word.length > 2).some(word =>
      product.name.toLowerCase().includes(word)
    );

    const categoryMatch = category ? product.category === category : true;
    const subCategoryMatch = subCategory ? product.subCategory === subCategory : true;

    return nameMatch && categoryMatch && subCategoryMatch;
  });

  return JSON.stringify({
    type: "detail",
    data: results.slice(0, 5)
  });
}