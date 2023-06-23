import { Link } from 'react-router-dom';

import { Twitter } from '@styled-icons/boxicons-logos/Twitter';
import { Instagram } from '@styled-icons/boxicons-logos/Instagram';
import { Tiktok } from '@styled-icons/boxicons-logos/Tiktok';
import { DiscordAlt as Discord } from '@styled-icons/boxicons-logos/DiscordAlt';

import logo from '../../resources/images/logo.png';
import styles from './index.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.left}>
      <img src={logo} className={styles.logo} alt="" />
      <p>We create and innovate the modern gambling experience.</p>

      <p style={{marginTop: '20px'}}>Do you have a question? Want to work with us? Contact us on Discord or email:</p>
      <p>
        <a href="mailto:contact@emeralds.gg">contact@emeralds.gg</a>
      </p>
    </div>



    {/* <div className={styles.marquee}>
      <marquee>
        <img src={logo} alt="" />
        <img src={logo} alt="" />
        <img src={logo} alt="" />
        <img src={logo} alt="" />
        <img src={logo} alt="" />
        <img src={logo} alt="" />
      </marquee>
    </div> */}



    <div className={styles.right}>
      <div>
        <p>Info</p>
        <ul>
          <li><Link to="/tos">TOS</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/provably-fair">Provably Fair</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
        </ul>
      </div>

      <div>
        <p>Misc</p>
        <ul>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/affiliates">Affiliates</Link></li>
          <li><Link to="/rewards">Rewards</Link></li>
        </ul>
      </div>

      <div>
        <p>Social</p>
        <ul>
          <li>  
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter /> <span>Twitter</span>
            </a>
          </li>

          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram /> <span>Instagram</span>
            </a>
          </li>

          <li>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <Tiktok /> <span>Tiktok</span>
            </a>
          </li>

          <li>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <Discord /> <span>Discord</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
)

export default Footer;