import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

const HomeLayout = () => {
    const { userData } = useAuth();
    const outlet = useOutlet();

    if (!userData || !userData.username) {
        return (
            <>
                {outlet}
            </>
        );
    }

    return <Navigate to="/map" replace />;
};
 
export default HomeLayout;