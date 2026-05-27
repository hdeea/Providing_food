const getToken = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return user?.token;
};

// GET ACTIVE PRICE
export const getActiveBondPrice = async () => {
  const res = await fetch(`/api/GiftBond/active-price`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Failed to load price");
  return await res.json();
};

// SET PRICE (ADMIN)
export const setBondPrice = async (price: number) => {
  const res = await fetch(`/api/GiftBond/set-price`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: price.toString()
  });

  if (!res.ok) throw new Error("Failed to update price");
  return await res.json();
};


// GET ALL GIFT DONATIONS (ADMIN)
export const getAllGiftDonations = async () => {
  const res = await fetch(`/api/GiftBond/all gift donations`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Failed to load donations");
  return await res.json();
};

// CREATE GIFT SESSION (DONOR)
export const createGiftSession = async (dto: any) => {
  const res = await fetch(`/api/payment/create-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });

  if (!res.ok) throw new Error("Failed to create session");
  return await res.json();
};

