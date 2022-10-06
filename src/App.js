import MapContainer from "./MapContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="webpage">
      <Sidebar />
      <MapContainer />
    </div>
  );
}
export default App;
