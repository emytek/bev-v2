import { DataItem } from "../services/axiosService";

export const storeData = async (key: string, data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyAppDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains("cache")) {
          db.createObjectStore("cache", { keyPath: "key" });
        }
      };
  
      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction("cache", "readwrite");
        const store = transaction.objectStore("cache");
        store.put({ key, data });
  
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  
  export const getAllData = async (key: string): Promise<DataItem[]> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyAppDB", 1);
  
      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction("cache", "readonly");
        const store = transaction.objectStore("cache");
        const getRequest = store.get(key);
  
        getRequest.onsuccess = () => {
          resolve(getRequest.result ? (getRequest.result.data as DataItem[]) : []);
        };
  
        getRequest.onerror = () => reject(getRequest.error);
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  
  