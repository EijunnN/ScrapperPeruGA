const axios = require("axios");
const cheerio = require("cheerio");

const categoriesFalabella = {
  laptops:
    "https://tottus.falabella.com.pe/tottus-pe/category/cat40712/Laptops",
  computo:
    "https://www.falabella.com.pe/falabella-pe/category/cat50678/Computadoras",
  // videojuegos:
  //   "https://www.falabella.com.pe/falabella-pe/category/cat40556/Videojuegos",
  tv: "https://www.falabella.com.pe/falabella-pe/category/cat210477/TV-Televisores",
  refrigeradoras:
    "https://www.falabella.com.pe/falabella-pe/category/CATG19032/Refrigeracion",
  cocina: "https://www.falabella.com.pe/falabella-pe/category/cat40538/Cocina",
  electrodomesticos:
    "https://www.falabella.com.pe/falabella-pe/category/cat6370558/Electrodomesticos-de-Cocina?sid=HO_MN_PED_4631",
  lavado: "https://www.falabella.com.pe/falabella-pe/category/cat40662/Lavado",
};

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const script = $("#__NEXT_DATA__");
    if (script.length) {
      const data = JSON.parse(script.html());
      return data.props.pageProps;
    } else {
      throw new Error("No se encontraron datos de __NEXT_DATA__");
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    return null;
  }
};

const getAllProducts = async () => {
  let allProducts = [];
  for (const [category, url] of Object.entries(categoriesFalabella)) {
    const data = await fetchData(url);
    if (data && data.results) {
      const productsWithCategory = data.results.map((product) => ({
        ...product,
        category,
      }));
      allProducts = allProducts.concat(productsWithCategory);
    }
  }
  return allProducts;
};

module.exports = { getAllProducts };
