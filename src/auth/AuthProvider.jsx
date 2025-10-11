import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, meRequest, signOutRequest } from "./dummyAuthApi";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await meRequest();
        if (alive) setUser(me);
      } finally {
        if (alive) setInitializing(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const value = {
    user,
    initializing,

    async signIn(username, password) {
      const { user } = await loginRequest({ username, password });
      setUser(user);
      return user;
    },

    async signUp(username, password, name) {
      const { user } = await registerRequest({ username, password, name });
      setUser(user);
      return user;
    },

    async signOut() {
      signOutRequest();
      setUser(null);
    },
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
