import "./404NotFound.css"

const RouteNotFound = () => {
    return (
        <div className="PageNotFound">
            <div className="PageNotFound-container" style = {{
                fontFamily: 'Arial',
                
            }}>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
    );
}

export default RouteNotFound;