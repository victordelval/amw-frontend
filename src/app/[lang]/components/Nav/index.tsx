"use client";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "./logo.svg";
import Link from "next/link";
import Overlay from "../Overlay";
import HowToUse from "../HowToUse";
import { useMenu } from "../../menuContext";
import { Tween } from "react-gsap";
import gsap from "gsap";
import "./style.css";

interface NavProps {
  children?: ReactNode;
  dictionary: { [key: string]: any };
}

const Nav: React.FC<NavProps> = ({ children, dictionary }) => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [animate, setAnimate] = useState("");
  const [showHowToUse, setShowHowToUse] = useState(false);
  const { menuOpen, setMenuOpen } = useMenu();
  const menuRef = useRef(null); // Ref for the menu to animate

  useEffect(() => {
    if (animate === "in") {
      gsap.from("li", {
        xPercent: 130,
        stagger: 0.07,
      });
      gsap.to("li", {
        xPercent: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "back.in(1.4)",
      });
    } else {
      gsap.from("li", {
        xPercent: 0,
        stagger: 0.07,
      });
      gsap.to("li", {
        xPercent: 130,
        duration: 0.8,
        stagger: 0.07,
        ease: "back.out(1.4)",
      });
    }
  }, [animate]);

  return (
    <div className="nav">
      {children}
      <a
       className="menu-link"
       href="#how-to-use"
       onClick={(e) => {
        e.preventDefault()
        showHowToUse ? setShowHowToUse(false) : setShowHowToUse(true)
       }}
      >
        How to use
      </a>
      <Link
        className="menu-link"
        href="/about"
        onClick={() => {
          setShowMenu(false);
          setMenuOpen(false);
        }}
      >
        {dictionary.menu.about_amw}
      </Link>

      <a className="menu-lang" href="/en">
        EN
      </a>
      <span className="divider">|</span>
      <a className="menu-lang" href="/es">
        ES
      </a>
      <span className="divider">|</span>
      <a className="menu-lang" href="/pt">
        PT
      </a>
      <a
        className="menu-link menu-link-last"
        href="#menu"
        onClick={(e) => {
          e.preventDefault();
          showMenu ? setMenuOpen(false) : setMenuOpen(true);
          showMenu ? setShowMenu(false) : setShowMenu(true);
          showMenu ? setAnimate("out") : setAnimate("in");
        }}
      >
        Menu
      </a>

      <Link
        href="/"
        className="amw-logo"
        onClick={() => {
          setShowMenu(false);
          setMenuOpen(false);
        }}
      >
        {/* @ts-ignore */}
        <Image src={Logo} />
      </Link>
      {showMenu && (
        <Overlay opacity={1}>
          <div className="main-menu">
            <div>
              <ul
                ref={menuRef}
                onClick={() => {
                  setMenuOpen(false);
                  setAnimate("out");
                  setTimeout(() => {
                    setShowMenu(false);
                  }, 800);
                }}
                style={{
                  listStyleType: "none",
                  textAlign: "right",
                  margin: "20px 0",
                }}
              >
                <li>
                  <Link href="/">{dictionary.menu.map}</Link>
                </li>
                <li>
                  <Link href="/about">{dictionary.menu.about}</Link>
                </li>
                <li>
                  <Link href="/case-studies">
                    {dictionary.menu.case_studies}
                  </Link>
                </li>
                <li>
                  <Link href="/methodology">{dictionary.menu.methodology}</Link>
                </li>
                <li>
                  <Link href="/code">{dictionary.menu.data_and_code}</Link>
                </li>
                <li>
                  <Link href="/contact">{dictionary.menu.contact}</Link>
                </li>
              </ul>
              <ul className="lang-menu">
                <li>
                  <a href="/en">ENGLISH</a>
                </li>
                <li>
                  <a href="/es">ESPAÑOLA</a>
                </li>
                <li>
                  <a href="/pt">PORTUGUÊS</a>
                </li>
              </ul>
            </div>
          </div>
        </Overlay>
      )}
      { showHowToUse &&
      <HowToUse 
        onClose={() => setShowHowToUse(false)}
      />
      }
    </div>
  );
};

export default Nav;
