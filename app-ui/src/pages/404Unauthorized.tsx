import './404Unauthorized.css';
import { useAuth } from "../hooks/AuthProvider";
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


const RouteUnauthorized = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="Unauthorized">
            <div className="Unauthorized-container" style = {{
                fontFamily: 'Arial',
                
            }}>
                <h1>404</h1>
                <h2>Unauthorized</h2>
                <p>Sorry, you do not have permissions to view this page.</p>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                }}>
                    <Button onClick={logout}>Logout</Button>
                    <strong>or</strong>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        </div>
    );
}

export default RouteUnauthorized;