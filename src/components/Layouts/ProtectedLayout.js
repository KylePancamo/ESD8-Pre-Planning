import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

export const ProtectedLayout = () => {
  const { userData } = useAuth();
  const outlet = useOutlet();

  if (!userData.username) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return (
    <>
      {outlet}
    </>
  );
};