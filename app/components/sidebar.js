import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import Categorysvg from "../../public/icons/category.svg";
import Papersvg from "../../public/icons/paper.svg";
import Walletsvg from "../../public/icons/wallet.svg";
import Tarshlogo from "../../public/Tarshalogowhite.svg";

const Sidebar = () => {
  // Use the useRouter hook to get the current pathname
  const router = useRouter();

  return (
    <>
      <aside className="sidebar">
        <div className="logo">
          <a href="https://www.zaidexceldesign.com/" target={"_blank"}>
            <Image src={Tarshlogo} alt="Tar" />
          </a>
        </div>
        <ul className="sidebar__menu side-nav">
          <li
            className={
              router.pathname === "/dashboard"
                ? "side-nav-item active"
                : "side-nav-item"
            }
          >
            <Link href="/dashboard" className="side-nav-link">
              <Image className="in__svg" src={Categorysvg} alt="Right arrow" />
              <span>Dashboard</span>
            </Link>
          </li>

          <li
            className={
              router.pathname === "/companies" ||
              router.pathname === "/companies" ||
              (router.pathname && router.pathname.split("/")[1] === "companies")
                ? "side-nav-item active"
                : "side-nav-item"
            }
          >
            <Link href="/companies" className="side-nav-link">
              <Image className="in__svg" src={Papersvg} alt="Right arrow" />
              <span>Companies</span>
            </Link>
          </li>

          {/* <li
            className={
              (router.pathname === "/plans" ||
                router.pathname === "/plans" ||
                (router.pathname && router.pathname.split("/")[1] === "/plans"))
                ? "side-nav-item active"
                : "side-nav-item"
            }
          >
            <Link href="/plans" className="side-nav-link">
              <Image className="in__svg" src={Walletsvg} alt="Right arrow" />
              <span>Plans</span>
            </Link>
          </li> */}

          <li
            className={
              router.pathname === "/support" ||
              router.pathname === "/support" ||
              (router.pathname && router.pathname.split("/")[1] === "/support")
                ? "side-nav-item active"
                : "side-nav-item"
            }
          >
            <Link href="/support" className="side-nav-link">
              <Image className="in__svg" src={Walletsvg} alt="Right arrow" />
              <span>Support</span>
            </Link>
          </li>

          <li
            className={
              router.pathname === "/notification" ||
              router.pathname === "/notification" ||
              (router.pathname &&
                router.pathname.split("/")[1] === "/notification")
                ? "side-nav-item active"
                : "side-nav-item"
            }
          >
            <Link href="/notification" className="side-nav-link">
              <Image className="in__svg" src={Walletsvg} alt="Right arrow" />
              <span>Notification</span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
