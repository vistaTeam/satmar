import React, { useState } from 'react';

import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import { Link } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import megamenuImg from "../../assets/images/megamenu-img.png";
import logo from "../../assets/images/logo.svg";
import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logoDark from "../../assets/images/logo-dark.png";

// import images
import github from "../../assets/images/brands/github.png";
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

//i18n
import { withNamespaces } from 'react-i18next';

// Redux Store
import {  showRightSidebarAction,toggleLeftmenu,changeSidebarType } from "../../store/actions";


const Header = (props) => {

  const [search, setsearch] = useState(false);
  const [megaMenu, setmegaMenu] = useState(false);
  const [socialDrp, setsocialDrp] = useState(false);

  const isMobile =  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

function tToggle()
{
       props.toggleLeftmenu(!props.leftMenu);
      if (props.leftSideBarType === "default") {
         props.changeSidebarType("condensed", isMobile);
    } else if (props.leftSideBarType === "condensed") {
         props.changeSidebarType("default", isMobile);
    }  
}
      return (
       <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logo} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoLightSvg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLightPng} alt="" height="19" />
                  </span>
                </Link>
              </div>

              <button type="button" onClick={() => {   tToggle() }} className="btn btn-sm px-3 font-size-16 header-item waves-effect" id="vertical-menu-btn">
                <i className="fa fa-fw fa-bars"></i>
              </button>
            </div>
              <div className='main-main-title'>רשימת אנ"ש דחסידי סאטמאר בארה"ק</div>
            <div className="d-flex">


            
              <div className='margin-left'>
              <div className="dropdown d-none d-lg-inline-block ml-1">
                <button type="button" onClick={() => { toggleFullscreen(); }} className="btn header-item noti-icon waves-effect" data-toggle="fullscreen">
                  <i className="bx bx-fullscreen"></i>
                </button>
              </div>

              {/* <NotificationDropdown /> */}
              <ProfileMenu />
              </div>
              {/* <div onClick={() => { props.showRightSidebarAction(!props.showRightSidebar); }} className="dropdown d-inline-block">
                <button type="button" className="btn header-item noti-icon right-bar-toggle waves-effect">
                  <i className="bx bx-cog bx-spin"></i>
                </button>
              </div> */}

            </div>
          </div>
        </header>
      </React.Fragment>
      );
    }
const mapStatetoProps = state => {
  const { layoutType,showRightSidebar,leftMenu,leftSideBarType } = state.Layout;
  return { layoutType,showRightSidebar,leftMenu,leftSideBarType };
};

export default connect(mapStatetoProps, { showRightSidebarAction,toggleLeftmenu,changeSidebarType })(withNamespaces()(Header));
