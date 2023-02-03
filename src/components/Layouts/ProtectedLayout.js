import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return (
    <div>
      {outlet}
    </div>
  );
};