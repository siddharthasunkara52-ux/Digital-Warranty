import API from "./api";


export const getMyWarrantyRecords = () =>
  API.get("/warranty/all").then((res) => res.data);


export const getWarrantyByProduct = (productId) =>
  API.get(`/warranty/${productId}`).then((res) => res.data);
