import { SeasonItem } from "@/types/SeasonItem";

const getToken = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return user?.token;
};

// GET ALL ITEMS BY SEASON ID
export const getItemsBySeasonId = async (id: number): Promise<SeasonItem[]> => {
  const res = await fetch(`/api/AdminEvents/event/${id}/items`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to load items");

  return await res.json();
};

// ADD ITEM
export const addItem = async (id: number, item: Partial<SeasonItem>) => {
  const res = await fetch(`/api/AdminEvents/${id}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: item.name,
      price: item.price
    })
  });

  if (!res.ok) throw new Error("Failed to add item");

  return await res.text(); 
};

// UPDATE ITEM

export const updateItem = async (itemId: number, item: Partial<SeasonItem>) => {
  const res = await fetch(`/api/AdminEvents/items/${itemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: item.name,
      price: item.price
    })
  });

  if (!res.ok) throw new Error("Failed to update item");
   return await res.text(); // 🔥 السيرفر يرجّع نص وليس JSON
};

// DELETE ITEM
export const deleteItem = async (itemId: number) => {
  const res = await fetch(`/api/AdminEvents/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to delete item");
  return await res.text(); 
};
// GET ONE ITEM BY ID
export const getItemById = async (id: number): Promise<SeasonItem> => {
  const res = await fetch(`/api/AdminEvents/items/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to load item");

  return await res.json();
};
