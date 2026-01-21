export const setAuthUser = (user) =>
  localStorage.setItem("authUser", JSON.stringify(user));

export const getAuthUser = () => {
  const raw = localStorage.getItem("authUser");
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthUser = () => localStorage.removeItem("authUser");
