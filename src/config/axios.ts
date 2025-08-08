import axios from "axios";

import config from "./api";

import { store } from "@/stores";

const http = axios.create({
  baseURL: config.api,
});

http.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export { http };

export const galery = axios.create({
  baseURL: config.gallery,
});
