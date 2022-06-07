import { orange_main } from '../../../../shared/constants/colors';

const Footer = `
<footer
  style="
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
    text-align: center
">  
  <!-- Small logo -->
  <img
    src="https://www.histories.cc/logo/small.png"
    alt="logo"
    height="40px"
    width="40px"
    style="border-radius: 8px"
  />

  <!-- Link -->
  <a
    href="https://www.histories.cc"
    style="
      font-weight: bold;
      text-decoration: none;
      color: black; 
      display: block;
  ">
    histories.cc
  </a> 

  <!-- Unsubscribe -->
  <p style="color: #6a6a6a;">
    Don’t want to receive these emails?<br>

    <a
      href="https://www.histories.cc/settings/notifications"
      style="color: ${orange_main}; text-decoration: none"
    >
      Unsubscribe here
    </a>
  </p>

  <!-- Copyright -->
  <p>
    © ${new Date().getFullYear()} Kryštof Krátký. All rights reserved.
  </p>
</footer>`;

export default Footer;
