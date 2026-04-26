import API from "./api";


export const getAllAdminProducts = () =>
  API.get("/admin/all-products").then((res) => res.data);


export const getAllUsers = () =>
  API.get("/admin/users").then((res) => res.data);


export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`).then((res) => res.data);


export const getAdminDashboard = () =>
  API.get("/admin/dashboard").then((res) => res.data);
