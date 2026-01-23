const KEY = "authUser";

export const setAuthUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

export const getAuthUser = () => {
  const raw = localStorage.getItem(KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  localStorage.removeItem(KEY);
};
