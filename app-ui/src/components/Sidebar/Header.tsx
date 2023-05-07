import { LocationTypes } from "../../types/location-types"; 
import { Button } from "react-bootstrap";
import { permission } from "../../permissions";
import { hasPermissions } from '../../helpers';
import { UserData } from "../../types/auth-types";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

type HeaderProps = {
  sidebarData: LocationTypes,
  toggleSideBar: () => void,
  userData: UserData | null,
  setEditLocation: (editLocation: boolean) => void
}

function Header({sidebarData, toggleSideBar, userData, setEditLocation}: HeaderProps) {
  let addressLineOne = "";

  if(sidebarData.occupancyaddress != null) {
    addressLineOne = sidebarData.google_formatted_address;
  }

  const userCanModify = hasPermissions(userData?.permissions as number, permission.MODIFY);

  function renderEditLocationButton() {
    if (!sidebarData.id) return;

    return (
      <Button
        size="sm"
        className="sidebar-edit-location"
        onClick={() => setEditLocation(true)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="35" 
          viewBox="0 96 960 960" 
          width="35"
          style={{
            fill: "white"
          }}
          >
            <path d="M480 936v-71l216-216 71 71-216 216h-71ZM120 726v-60h300v60H120Zm690-49-71-71 29-29q8-8 21-8t21 8l29 29q8 8 8 21t-8 21l-29 29ZM120 561v-60h470v60H120Zm0-165v-60h470v60H120Z"/>
        </svg>
      </Button>
    );
  }
  
  return (
    <>
      <Container className="sidebar-header">
        <Row>
          <Col xs={1} style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              className="close-button"
              onClick={toggleSideBar}
              style={{
                backgroundColor: "transparent",
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="35" 
                viewBox="0 96 960 960" 
                width="35"
                style={{
                  fill: "white",
                }}
              >
                  <path d="M480 896 160 576l320-320 42 42-248 248h526v60H274l248 248-42 42Z"/>
                </svg>
            </Button>
          </Col>
          {sidebarData.id ? (
            <>
              
              <Col xs={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <p className="sidebar-header__title">{sidebarData.occupancyname}</p>
              </Col>
              <Col xs={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <p className="sidebar-header__subtitle">{addressLineOne}</p>
              </Col>
              <Col xs={1}  style={{display: 'flex', justifyContent: 'flex-end'}}>  
                {userCanModify && renderEditLocationButton()}
              </Col>
            </>
          ) : 
          <>
            <Col xs={10}>
              <h1>Must search for a site</h1>
            </Col>
          </>
          }
        </Row>
      </Container>
    </>
  );
}

export default Header;