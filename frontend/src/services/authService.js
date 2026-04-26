import API from "./api";


export const login = (email, password) =>
  API.post("/auth/login", { email, password }).then((res) => res.data);


export const signup = (name, email, password) =>
  API.post("/auth/signup", { name, email, password }).then((res) => res.data);


export const getProfile = () =>
  API.get("/auth/me").then((res) => res.data);


export const updateProfile = (data) =>
  API.put("/auth/profile", data).then((res) => res.data);
