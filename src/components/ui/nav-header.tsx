
"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4">
      <div className="flex items-center">
        <Link to="/" className="mr-8">
          <img 
            src="/lovable-uploads/6aebfbfd-ba13-4ef3-91a5-c262bd385900.png" 
            alt="chyll.ai logo" 
            className="h-12" 
          />
        </Link>
        <ul
          className="relative flex w-fit rounded-full border-2 border-brand-blue bg-white p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          <Tab setPosition={setPosition}>Home</Tab>
          <Tab setPosition={setPosition}>Pricing</Tab>
          <Tab setPosition={setPosition}>About</Tab>
          <Tab setPosition={setPosition}>Services</Tab>
          <Tab setPosition={setPosition}>Contact</Tab>

          <Cursor position={position} />
        </ul>
      </div>
      
      <Button 
        className="flex items-center gap-2" 
        variant="outline"
        asChild
      >
        <a href="https://app.generativschool.com/" target="_blank" rel="noopener noreferrer">
          <LogIn size={18} />
          <span>Login</span>
        </a>
      </Button>
    </div>
  );
}

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode;
  setPosition: any;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-brand-blue mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-brand-blue md:h-12"
    />
  );
};

export default NavHeader;
