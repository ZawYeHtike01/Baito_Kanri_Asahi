import { Navigate } from "react-router-dom";
import { auth } from "./Firebase";
import { getIdTokenResult } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const check = async () => {
      const token = await getIdTokenResult(auth.currentUser);
      setAllowed(token.claims.admin === true);
    };
    check();
  }, []);

  if (allowed === null) return null;
  return allowed ? children : <Navigate to="/home" />;
}
