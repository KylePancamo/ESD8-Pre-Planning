import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { permission } from "../../permissions";
import { hasPermissions } from '../helpers';
import Unauthorized from "../../pages/404Unauthorized"

export const ProtectedLayout = () => {
  const { userData } = useAuth();
  const outlet = useOutlet();

  if (!userData.username) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  if (!hasPermissions(userData.permissions, permission.VIEW)) {
    // navigate to unauthorized page
    return <Unauthorized />
  }

  return (
    <>
      {outlet}
    </>
  );
};