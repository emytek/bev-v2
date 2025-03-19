import axios from "axios";
import { queryClient } from "../utils/reactQueryClient"; // React Query instance
import { storeData, getAllData } from "../utils/indexedDBService"; // ✅ Import IndexedDB functions

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export interface DataItem {
  id: string; 
  [key: string]: any; 
}

// ✅ Fetch Data with IndexedDB Fallback
export const fetchDataWithCache = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    await storeData(endpoint, response.data); // Store in IndexedDB
    return response.data;
  } catch (error) {
    console.warn(`Network failed, loading cached ${endpoint}`);
    return await getAllData(endpoint); // Load from IndexedDB
  }
};

// ✅ Create Data
export const createData = async (endpoint: string, newData: any) => {
  const response = await api.post(endpoint, newData);
  const existingData = await getAllData(endpoint);
  await storeData(endpoint, [...existingData, response.data]); // Store new data
  queryClient.invalidateQueries({ queryKey: [endpoint] });
  return response.data;
};

// ✅ Update Data
export const updateData = async (endpoint: string, id: string, updatedData: any) => {
  const response = await api.put(`${endpoint}/${id}`, updatedData);
  const existingData: DataItem[] = await getAllData(endpoint); // ✅ Apply Type

  const newDataArray: DataItem[] = existingData.map((item: DataItem) =>
    item.id === id ? response.data : item
  );

  await storeData(endpoint, newDataArray);
  queryClient.invalidateQueries({ queryKey: [endpoint] });
  return response.data;
};


// ✅ Delete Data
export const deleteData = async (endpoint: string, id: string) => {
  await api.delete(`${endpoint}/${id}`);
  const newDataArray = (await getAllData(endpoint)).filter((item) => item.id !== id);
  await storeData(endpoint, newDataArray);
  queryClient.invalidateQueries({ queryKey: [endpoint] });
};
