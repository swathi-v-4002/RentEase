import React from 'react';
import './Footer.css'; // We'll create this CSS file next

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} RENT-EASE. All rights reserved.</p>
    </footer>
  );
}

export default Footer;