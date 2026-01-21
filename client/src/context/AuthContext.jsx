import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";
import { clearAuthUser, getAuthUser, setAuthUser } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getAuthUser());
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      const u = res.data?.data?.user;

      if (u) {
        setUser(u);
        setAuthUser(u);
      } else {
        setUser(null);
        clearAuthUser();
      }
    } catch {
      setUser(null);
      clearAuthUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = getAuthUser();
    if (saved) fetchMe();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password, role }) => {
    const res = await api.post("/auth/login", { email, password, role });
    await fetchMe(); // ✅ populates user for Student/College/Admin
    return res.data;
  };

  const register = async ({ name, email, password, role }) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    clearAuthUser();
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh: fetchMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
