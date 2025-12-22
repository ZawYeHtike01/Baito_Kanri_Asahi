import { useApp } from "./App";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const { isauth } = useApp();
    
	if (!isauth) {
		return <Navigate to="/login" replace />;
	}

	return children;
}