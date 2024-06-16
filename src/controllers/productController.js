const { getAllProducts } = require("../services/dataService");

const getLowestPrice = (product) => {
  const prices = product.prices
    .map((p) => parseFloat(p.price[0].replace(",", ".")))
    .filter((p) => !isNaN(p));
  return prices.length > 0 ? Math.min(...prices) : null;
};

exports.getAllProducts = async (req, res) => {
  try {
    let products = await getAllProducts();

    products = products.filter((product) => getLowestPrice(product) !== null);

    if (products.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error en getAllProducts:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};
