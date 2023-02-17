import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

const HomeLayout = () => {
    const { userData } = useAuth();
    const outlet = useOutlet();

    if (userData.username) {
        return <Navigate to="/map" replace />;
    }

    return (
    <div>
        {outlet}
    </div>
    );
};
 
export default HomeLayout;