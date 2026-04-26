import API from "./api";


export const getRecords = (productId) =>
  API.get(`/maintenance/${productId}`).then((res) => res.data);


export const addRecord = (data) =>
  API.post("/maintenance/add", data).then((res) => res.data);


export const updateRecord = (id, data) =>
  API.put(`/maintenance/${id}`, data).then((res) => res.data);


export const deleteRecord = (id) =>
  API.delete(`/maintenance/${id}`).then((res) => res.data);


export const getUpcoming = () =>
  API.get("/maintenance/upcoming").then((res) => res.data);
