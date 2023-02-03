import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

const HomeLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();

    if (user) {
        return <Navigate to="/map" replace />;
    }

    return (
    <div>
        {outlet}
    </div>
    );
};
 
export default HomeLayout;