import axios from "axios";
import { baseUrl } from "./baseUrl";

const client = axios.create({
  baseURL: `${baseUrl()}Pizza`,
});

export const getPizzaCost = async (sizeId, toppingCounts) => {
  try {
    const url = `/getTotal?&sizeId=${sizeId}&toppingCounts=${toppingCounts}`;
    const response = await client.get(url);
    return response.data;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
export const createPizza = async (body) => {
  try {
    await client.post("/create", body);
    return true;
  } catch (err) {
    console.log(err.response);
    return err.response.data.errors;
  }
};
export const getOrderedPizzas = async () => {
    try {
        const response = await client.get("/getAllPizzas");
      return  response.data;
    } catch (err) {
      console.log(err.response);
      return err.response.data.errors;
    }
  };
