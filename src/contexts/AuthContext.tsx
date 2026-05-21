import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { registerUser } from "@/api/User/register";
import { getUserProfile } from "@/api/User/getUserProfile";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string,
    role?: string
  ) => Promise<User | null>;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user + token from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsed = JSON.parse(storedUser);
      parsed.token = storedToken;
      setUser(parsed);
    }

    setIsLoading(false);
  }, []);

  // ---------------- LOGIN ----------------
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch("/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      console.log("Server response data:", data);

      // Map role
      let role:
        | "admin"
        | "restaurant"
        | "individual"
        | "store owner"
        | "donor"
        | "shelter owner"
        | "beneficiary" = "individual";

      if (data.userTypeId === 1) role = "restaurant";
      else if (data.userTypeId === 2) role = "admin";
      else if (data.userTypeId === 3) role = "donor";
      else if (data.userTypeId === 4) role = "shelter owner";
      else if (data.userTypeId === 5) role = "store owner";
      else if (data.userTypeId === 6) role = "beneficiary";

      const mappedUser: User = {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: role,
        token: data.token,
        userTypeId: data.userTypeId,
      };

      // Save user + token
      setUser(mappedUser);
      sessionStorage.setItem("user", JSON.stringify(mappedUser));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("justLoggedIn", "true");

      return mappedUser;
    } catch (error) {
      console.error("AuthContext login error:", error);
      return null;
    }
  };

  // ---------------- REGISTER ----------------
  const register = async (
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string,
    roleParam: string = "shelter owner"
  ): Promise<User | null> => {
    try {
      await registerUser({
        fullName,
        email,
        password,
        phoneNumber,
        role: roleParam,
      });

      // Auto-login after register
      return await login(email, password);
    } catch (error) {
      console.error("AuthContext register error:", error);
      return null;
    }
  };

  // ---------------- REFRESH USER ----------------
  const refreshUser = async (): Promise<User | null> => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const data = await getUserProfile(token);

      let role:
        | "admin"
        | "restaurant"
        | "individual"
        | "store owner"
        | "donor"
        | "shelter owner"
        | "beneficiary" = "individual";

      if (data.userTypeId === 1) role = "restaurant";
      else if (data.userTypeId === 2) role = "admin";
      else if (data.userTypeId === 3) role = "donor";
      else if (data.userTypeId === 4) role = "shelter owner";
      else if (data.userTypeId === 5) role = "store owner";
      else if (data.userTypeId === 6) role = "beneficiary";

      const mappedUser: User = {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: role,
        token: token,
        userTypeId: data.userTypeId,
      };

      setUser(mappedUser);
      sessionStorage.setItem("user", JSON.stringify(mappedUser));

      return mappedUser;
    } catch (error) {
      console.error("AuthContext refreshUser error:", error);
      return null;
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
