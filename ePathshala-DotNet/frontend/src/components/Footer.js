// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => (
//   <footer className="bg-primary text-white mt-5 py-4" style={{ minHeight: '80px', position: 'fixed', left: 0, bottom: 0, width: '100%', zIndex: 100 }}>
//     <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
//       <div>
//         &copy; {new Date().getFullYear()} Student ERP. All rights reserved.
//       </div>
//       <div>
//         <Link to="/about" className="text-white me-3">About Us</Link>
//         <Link to="/contact" className="text-white">Contact Us</Link>
//       </div>
//     </div>
//   </footer>
// );

// export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  // <footer className="bg-primary text-white mt-5 py-4" style={{ position: 'static', width: '100%' }}>
  //   <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
  //     <div>&copy; {new Date().getFullYear()} Student ERP. All rights reserved.</div>
  //     <div>
  //       <Link to="/about" className="text-white me-3">About Us</Link>
  //       <Link to="/contact" className="text-white">Contact Us</Link>
  //     </div>
  //   </div>
  // </footer>

  <footer className="footer-custom py-4">
  <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
    <div>&copy; {new Date().getFullYear()} ePathshala. All rights reserved.</div>
    <div>
      <Link to="/about" className="me-3">About Us</Link>
      <Link to="/contact">Contact Us</Link>
    </div>
  </div>
</footer>

);

export default Footer;
