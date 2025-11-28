import { useApp } from "./App";
import { Link } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const { auth } = useApp();
    
	if (!auth) {
		return <Link to="/"/>;
	}

	return children;
}