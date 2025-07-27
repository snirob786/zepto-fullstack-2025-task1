const API_URL = "http://localhost:5000/api";

export const getFonts = () =>
  fetch(`${API_URL}/fonts`).then((res) => res.json());

export const uploadFont = (formData) =>
  fetch(`${API_URL}/fonts/upload`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

export const getFontGroups = () =>
  fetch(`${API_URL}/font-groups`).then((res) => res.json());

export const createFontGroup = (data) =>
  fetch(`${API_URL}/font-groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deleteFontGroup = (id) =>
  fetch(`${API_URL}/font-groups/${id}`, { method: "DELETE" });

export const updateFontGroup = (id, data) =>
  fetch(`${API_URL}/font-groups/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
