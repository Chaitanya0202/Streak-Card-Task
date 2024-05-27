import React from "react";
import { FaEnvelope, FaHome, FaInfoCircle, FaProjectDiagram, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SideNav = () => {
  return (
    <div className="fixed top-0 pt-60 left-0 h-full w-5 bg-gray-900 text-white flex flex-col items-center py-1 shadow-lg">
      <NavItem to="/" icon={<FaHome />} />
      <NavItem to="/about" icon={<FaInfoCircle />} />
      <NavItem to="/contact" icon={<FaEnvelope />} />
      <NavItem to="/project" icon={<FaProjectDiagram />} />
      <NavItem to="/profile" icon={<FaUser />} />
    </div>
  );
};

const NavItem = ({ to, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full mb-4 flex items-center justify-center ${
          isActive ? "text-blue-500 border-r-2 border-blue-500" : ""
        }`
      }
    >
      <div className="w-12 h-5 flex items-center justify-center hover:bg-gray-700 rounded-md">
        {icon}
      </div>
    </NavLink>
  );
};

export default SideNav;
