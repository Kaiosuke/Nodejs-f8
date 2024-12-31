const url = "http://localhost:3000/products";
const headers = { "Content-Type": "Application/json" };

const errorHandler = (res, error) => {
  return res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
};

const handleStatus200 = (res, message, data) => {
  return res.status(200).json({
    message,
    data,
  });
};

const handleStatus400 = (res) => {
  return res.status(400).json({
    message: "Invalid input data",
  });
};

const handleStatus404 = (res, message) => {
  return res.status(404).json({
    message,
  });
};

const ProductController = {
  // Get Products
  getProducts: async (req, res) => {
    try {
      const response = await fetch(`${url}`, {
        method: "GET",
        headers,
      });
      if (response.status === 404) {
        return handleStatus404(res, "Not found products");
      }
      const products = await response.json();

      if (response.status === 200) {
        return handleStatus200(res, "Get products success", products);
      }
    } catch (error) {
      return errorHandler(res, error);
    }
  },

  // Get Product
  getProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${url}/${id}`, {
        method: "GET",
        headers,
      });

      if (response.status === 404) {
        return handleStatus404(res, "Not found product");
      }
      const products = await response.json();

      if (response.status === 200) {
        return handleStatus200(res, "Get product success", products);
      }
    } catch (error) {
      return errorHandler(res, error);
    }
  },

  // Add Product
  addProduct: async (req, res) => {
    try {
      const data = req.body;

      if (!data.title || !data.price) {
        return handleStatus400(res);
      }

      const response = await fetch(`${url}`, {
        method: "POST",
        headers,
        body: JSON.stringify(req.body),
      });

      const product = await response.json();

      if (response.status === 201) {
        return handleStatus200(res, "add product success", product);
      }
    } catch (error) {
      return errorHandler(res, error);
    }
  },

  // update Product
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data.title || !data.price) {
        return handleStatus400(res);
      }

      const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(req.body),
      });

      if (response.status === 404) {
        return handleStatus404(res, "Not Found Product");
      }

      const product = await response.json();

      if (response.status === 200) {
        return handleStatus200(res, "Update product success", product);
      }
    } catch (error) {
      return errorHandler(res, error);
    }
  },

  // Delete Product
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 404) {
        return handleStatus404(res, "Not Found Product");
      }

      if (response.status === 200) {
        return handleStatus200(res, "Delete product success", id);
      }
    } catch (error) {
      return errorHandler(res, error);
    }
  },
};

export default ProductController;
