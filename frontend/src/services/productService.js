import API from "./api";


export const getProducts = (params = {}) =>
  API.get("/products/all", { params }).then((res) => res.data);


export const getStats = () =>
  API.get("/products/stats").then((res) => res.data);


export const getProductById = (id) =>
  API.get(`/products/${id}`).then((res) => res.data);


export const addProduct = (data) =>
  API.post("/products/add", data).then((res) => res.data);


export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data).then((res) => res.data);


export const deleteProduct = (id) =>
  API.delete(`/products/${id}`).then((res) => res.data);


export const uploadInvoice = (productId, file) => {
  const formData = new FormData();
  formData.append("productId", productId);
  formData.append("invoice", file);
  return API.post("/products/upload-invoice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
};


export const getNotifications = () =>
  API.get("/products/notifications").then((res) => res.data);
