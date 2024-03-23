import React from 'react';
import "./Navbar.css";

const Navbar = () => {
  return (
   <div>
    <div className='header'>
    <div className="logo-title">
      <img className="logo" src="https://img.freepik.com/free-vector/logo-real-estate-home-solutions-that-is-home-solution_527952-33.jpg?w=740&t=st=1711142924~exp=1711143524~hmac=484d9d7374031a82386cf19f4df4679e0a09b8da18d9f5ab6f6abf0bc18767a5"></img>
      <h1 className="title">Smart City Real Estate</h1>
    </div>
    <div className='home-map'>
      <h2 className="title">Home</h2>
      <h2 className="title">Map</h2>
    </div>
    </div>
   </div>
     );
};

export default Navbar;
