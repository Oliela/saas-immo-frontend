// lib/api/auth.js

import axiosInstance from "../axios"


export const getUser = async () => {
  try {
    const res = await axiosInstance.get("/api/user/authenticated")
    return res.data
  } catch (error) {
    return null
  }
}