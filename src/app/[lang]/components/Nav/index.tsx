"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "./logo.svg";
import Link from "next/link";
import Overlay from "../Overlay";
import { useMenu } from "../../menuContext";
import { Tween } from "react-gsap";
import "./style.css";

interface NavProps {
  children?: ReactNode;
}

const Nav: React.FC<NavProps> = ({ children }) => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const { menuOpen, setMenuOpen } = useMenu();

  return (
    <div className="nav">
      {children}
      <Link
        className="menu-link"
        href="/about"
        onClick={() => {
          setShowMenu(false);
          setMenuOpen(false);
        }}
      >
        About AMW
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
          showMenu ? setShowMenu(false) : setShowMenu(true);
          showMenu ? setMenuOpen(false) : setMenuOpen(true);
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
        <Overlay>
          <div className="main-menu">
            <ul
              onClick={() => {
                setTimeout(() => {
                  setShowMenu(false);
                }, 100);
                setMenuOpen(false);
              }}
              style={{
                listStyleType: "none",
                textAlign: "right",
                margin: "20px 0",
              }}
            >
              <Tween
                from={{ xPercent: 130 }}
                to={{ xPercent: 0 }}
                duration={0.8}
                stagger={0.07}
                ease="back.out(1.4)"
              >
                <li>
                  <Link href="/">Map</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/case-studies">Case Studies</Link>
                </li>
                <li>
                  <Link href="/methodology">Methodology</Link>
                </li>
                <li>
                  <Link href="/code">Data and Code</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </Tween>
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
        </Overlay>
      )}
    </div>
  );
};

export default Nav;
