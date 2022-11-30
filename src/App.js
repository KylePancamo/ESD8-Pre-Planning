import MapContainer from "./components/MapContainer/MapContainer";
import Legend from "./components/Legend";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar/Sidebar";
import IconUpload from "./components/Popup/IconUpload";
import Axios from "axios";
import {useState, useEffect} from "react";
import {useRecoilState} from 'recoil';
import {imagesState} from "./atoms";

function App() {
  const [sideBarValue, setSideBarValue] = useState(false);
  const [searchedSite, setSearchedSite] = useState("");
  const [images, setImages] = useRecoilState(imagesState);

  useEffect(() => {
    Axios.get("http://localhost:5000/api/get-uploaded-icons")
      .then((response) => {
        setImages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  return (
    <div className="webpage">
      <Sidebar
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
        searchedSite={searchedSite}
        setSearchedSite={setSearchedSite}
      />
      <MapContainer
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
        searchedSite={searchedSite}
        setSearchedSite={setSearchedSite}
      />
      <IconUpload />
      <Legend />
    </div>
  );
}
export default App;
