import axios from 'axios';
import { baseUrl } from "./baseUrl";

const client = axios.create({
    baseURL: `${baseUrl()}Size`
  });

  export const getSizes = async () => {
    try {
      const response = await client.get(`/getAll`);
      return response.data;
    } catch (err) {
      console.error(err.message);
      return [];
    }
  };
