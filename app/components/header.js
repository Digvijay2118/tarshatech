import React from "react";
import Link from "next/link";

import Profilesvg from "../../public/icons/profile.svg";
import Papersvg from "../../public/icons/paper.svg";
import NotificationSvg from "../../public/icons/notification.svg";
import Image from "next/image";
import MobileMenusvg from "../../public/icons/mobile-menu.svg";
import Messagesvg from "../../public/icons/message.svg";
import User from "../../public/user.png";
import { useRouter } from "next/navigation";
import Support from "../components/support";

function header() {
  const router = useRouter();
  const doLogout = () => {
    localStorage.removeItem("userinfo");

    router.push("/");
  };
  return (
    <div>
      <header className="header navbar navbar-expand justify-content-between">
        <div class="page-title">{/* <h1 class="h4 mb-0">Dashboard</h1> */}</div>
        <div className="header-add-action dropdown">
          <a
            class="btn btn-sm"
            type="button"
            id="add-plus"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Add +
          </a>
          <ul
            className="list-unstyled dropdown-menu"
            aria-labelledby="add-plus"
          >
            <li className="dropdown-item">
              <Link href="/addcompanies">
                <Image src={Profilesvg} className="in__svg" alt="Employees" />{" "}
                Companies
              </Link>
            </li>
            <li className="dropdown-item">
              <Link href="/addnotification">
                <Image
                  src={NotificationSvg}
                  className="in__svg"
                  alt="notification"
                />{" "}
                Notification
              </Link>
            </li>
            <li className="dropdown-item">
              <Link href="/mstaddplans">
                <Image src={Papersvg} className="in__svg" alt="plans" /> Master
                Plans
              </Link>
            </li>
          </ul>
        </div>
        <ul className="navbar-nav topbar__menu list-unstyled align-items-center">
          <li>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
            >
              Support
            </button>
          </li>
          <li className="dropdown">
            <a
              type="button"
              id="notification"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="header-action-icon">
                <Image
                  src={NotificationSvg}
                  className="in__svg"
                  alt="Employees"
                />
              </span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="notification"
            >
              <h6 className="mb-3">
                <span className="float-right">
                  <a>{/* <small>Clear All</small> */}</a>
                </span>
                Notification
              </h6>
            </div>
          </li>
          <li className="dropdown">
            <a
              type="button"
              id="message"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="header-action-icon">
                <Image className="in__svg" src={Messagesvg} alt="Envelope" />
              </span>
              <span className="notification-icon-badge"></span>
            </a>
            <div
              className="notification__list dropdown-menu dropdown-menu-right"
              aria-labelledby="message"
            ></div>
          </li>
          <li className="dropdown">
            <a
              type="button"
              id="user-account"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {/* <span className="account-user-avatar"><Image src={`${FileUrl}/Image/user.png`} alt="User" /></span> */}
              <span className="account-user-avatar">
                {/* <img src={getUserProfilePic()} alt="User" className="w-100"/> */}
                <Image src={User} alt="User" className="w-100" />
              </span>
              {/* <span className="account-user-name">{getFullName()}</span> */}
            </a>
            <ul
              className="list-unstyled dropdown-menu"
              aria-labelledby="user-account"
            >
              <li className="dropdown-item">
                <a href="#" onClick={doLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </li>
          <li className="mobile-menu">
            <Image src={MobileMenusvg} className="in__svg" alt="Employees" />
          </li>
        </ul>
      </header>
      <Support />
    </div>
  );
}

export default header;
