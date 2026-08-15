import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any;
  // isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  // Helper function to check token validity
  const isTokenValid = (jwtToken: string | null) => {
    if (!jwtToken) return false;
    try {
      const decoded = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000; // in seconds
      return decoded.exp ? decoded.exp > currentTime : false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    if (token && isTokenValid(token)) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } else {
      logout(); // Token is missing or expired
    }
    setLoading(false);
  }, [token]);

  const login = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    setToken(accessToken);
    setUser(jwtDecode(accessToken));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    // isAuthenticated: !!user && isTokenValid(token),
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
