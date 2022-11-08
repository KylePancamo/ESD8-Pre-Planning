function Content(props) {
  let hazardList = [];

  if(props.sidebarData.hazards != null) {
    const hazards = props.sidebarData.hazards.split(";");
    hazardList = hazards.map((hazard) =>
      <span key={hazard}>{hazard}</span>
    );
  }

  let accessList = [];

  if(props.sidebarData.access != null) {
    const access = props.sidebarData.access.split(";");
    accessList = access.map((acc) =>
      <span key={acc}>{acc}</span>
    );
  }


  return (
    <div className="sidebar__content">
      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">
            Occupancy Type
            <span className="sidebar__block-text" id="occupancy-type">
              TYPE
            </span>
          </div>
          <div className="filler"></div>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">
            Construction Type
            <span className="sidebar__block-text" id="construction-type">
              {props.sidebarData.constructiontype}
            </span>
          </div>
          <div className="filler"></div>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Mutual Aid</div>
          <p className="sidebar__block-box" id="mutual-aid">
            
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Hazards</div>
          <p className="sidebar__block-box" id="hazards">
            {hazardList}
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Hydrant Location</div>
          <p className="sidebar__block-box" id="hydrant-location">
            {props.sidebarData.hydrant_address} <br></br>
            ({props.sidebarData.hydrant_distance} ft away) <br></br>
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Access</div>
          <p className="sidebar__block-box" id="access">
            {accessList}
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Emergency Contact</div>
          <p className="sidebar__block-box" id="emergency-contact">
            Contact Name <br></br>
            {props.sidebarData.emergency_contact_number} <br></br>
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Notes</div>
          <p className="sidebar__block-box" id="notes">
            {props.sidebarData.other_notes}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Content;
