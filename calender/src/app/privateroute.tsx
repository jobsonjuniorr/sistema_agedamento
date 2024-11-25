import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirecionar para login caso não tenha token
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
