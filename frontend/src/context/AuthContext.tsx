import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Role } from "@/api/types";
import { loginUser, logoutUser, registerUser, fetchMe } from "@/api/auth";
import { tryRestoreSession } from "@/api/client";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load there's no access token in memory yet, but the refresh
  // cookie may still be valid — try silently restoring the session before
  // deciding the person is logged out.
  useEffect(() => {
    (async () => {
      const token = await tryRestoreSession();
      if (token) {
        try {
          const me = await fetchMe();
          setUser(me);
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginUser({ email, password });
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    const newUser = await registerUser(payload);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
