import axios from "axios";

export const Axios = axios.create({
  baseURL: "https://api.disasterscans.com",
  timeout: 50000,
});
