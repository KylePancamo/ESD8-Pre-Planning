function Header(props) {
  let addressLineOne = "";
  let addressLineTwo = "";

  if(props.sidebarData.occupancyaddress != null) {
    const formattedAddress = props.sidebarData.occupancyaddress.split(",");
    addressLineOne = formattedAddress[0];
    addressLineTwo = formattedAddress[1] + formattedAddress[2] + formattedAddress[3];
  }
  
  return (
    <div className="sidebar-header">
      <p className="sidebar-header__title">{props.sidebarData.occupancyname}</p>
      <p className="sidebar-header__subtitle">{addressLineOne}</p>
    </div>
  );
}

export default Header;