// ================= BASE URL =================
// alamat backend Flask
const BASE_URL = "http://127.0.0.1:5000";

// ================= EXPENSE =================

// ambil semua data transaksi
export const getExpenses = async () => {
  const res = await fetch(`${BASE_URL}/expenses`);
  return res.json();
};

// ambil summary (income, expense, saldo)
export const getSummary = async () => {
  const res = await fetch(`${BASE_URL}/summary`);
  return res.json();
};

// tambah data baru
export const addExpense = async (data) => {
  await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

//  UPDATE DATA
export const updateExpense = async (id, data) => {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

// hapus data
export const deleteExpense = async (id) => {
  await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });
};

// ================= PREDICTION =================

// ambil hasil prediksi budget
export const predictBudget = async (data) => {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

// ================= AUTH =================

// LOGIN USER
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login gagal");

  return res.json();
};

// REGISTER USER
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register gagal");

  return res.json();
};

// ================= AI WISATA =================
export const predictWisata = async (data) => {
  const res = await fetch("http://127.0.0.1:5000/predict-wisata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// ================= NEARBY TOURISM =================

export const getNearbyTourism = async (data) => {
  const res = await fetch(`${BASE_URL}/nearby-tourism`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
