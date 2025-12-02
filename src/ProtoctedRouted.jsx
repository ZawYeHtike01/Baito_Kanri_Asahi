import { useApp } from "./App";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const { auth } = useApp();
    
	if (!auth) {
		return <Navigate to="/" replace />;
	}

	return children;
}