import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";
import { clearAuthUser, getAuthUser, setAuthUser } from "../utils/storage";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getAuthUser());

  const [meLoading, setMeLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const fetchMe = async () => {
    setMeLoading(true);
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
      return u;
    } catch (error) {
      setUser(null);
      clearAuthUser();
      return null;
    } finally {
      setMeLoading(false);
    }
  };

  useEffect(() => {
    const saved = getAuthUser();
    if (saved) fetchMe();
    else setMeLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ REGISTER
  const register = async ({ name, email, password, confirmPassword, role }) => {
    setRegisterLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Registered! Please verify your email.");
      }

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  };

  // ✅ LOGIN
  const login = async ({ email, password, role }) => {
    setLoginLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, role });

      if (res.data.success) {
        toast.success(res.data.message || "Logged in successfully.");
      }

      await fetchMe();
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    setLogoutLoading(true);
    try {
      const res = await api.post("/auth/logout");

      toast.success(res.data?.message || "Logged out");
      setUser(null);
      clearAuthUser();

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      throw error;
    } finally {
      setLogoutLoading(false);
    }
  };

  // ✅ FORGOT PASSWORD
  const forgotPassword = async (email) => {
    setForgotPasswordLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });

      if (res.data.success) {
        toast.success(res.data.message);
      }

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send reset email");
      throw error;
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // ✅ RESET PASSWORD
  const resetPassword = async ({ token, newPassword, confirmPassword }) => {
    setResetPasswordLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
      }

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      throw error;
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      meLoading,
      loginLoading,
      registerLoading,
      logoutLoading,
      forgotPasswordLoading,
      resetPasswordLoading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      refresh: fetchMe,
    }),
    [
      user,
      meLoading,
      loginLoading,
      registerLoading,
      logoutLoading,
      forgotPasswordLoading,
      resetPasswordLoading,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);