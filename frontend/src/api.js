// Không bắt buộc phải dùng
const BASE_URL = "http://localhost:8000/api";

// Hàm GET
export const apiGet = async (url) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return await response.json();
};

// Hàm POST
export const apiPost = async (url, body) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return await response.json();
};

// Hàm DELETE
export const apiDelete = async (url) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${url}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return await response.json();
};
