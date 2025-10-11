import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function AuthGate({ children }) {
  const { user, initializing } = useAuth();
  const loc = useLocation();
  if (initializing) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
