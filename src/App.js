import MapContainer from './MapContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <div class="sidebar-wrapper">

        <div class="sidebar-button">
          <svg xmlns="http://www.w3.org/2000/svg" 
            height="48" 
            width="48"
            id="sidebar-button">
            <path d="M20 44 0 24 20 4l2.8 2.85L5.65 24 22.8 41.15Z"/>
          </svg>
        </div>

        <div class="sidebar-menu" id="sidebar-menu">
          <div class="close-button" id="close-button">
            X
          </div>
          <div class="sidebar-data-wrapper">
            <div class="sidebar-data">
              Some pre-plan data
            </div>
            <div class="sidebar-data">
              Some more pre-plan data
            </div>
            <div class="sidebar-data">
              Even more pre-plan data
            </div>
            <div class="sidebar-data">
              Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
            </div>
          </div>
        </div>
      </div>

      <MapContainer />

    </div>
  );
}
export default App;