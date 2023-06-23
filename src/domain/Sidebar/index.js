import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Twitter } from '@styled-icons/boxicons-logos/Twitter';
import { DiscordAlt as Discord } from '@styled-icons/boxicons-logos/DiscordAlt';
// import { Vk } from '@styled-icons/entypo-social/Vk';


// import Button from '../../components/Button';

import { ReactComponent as JackpotIcon } from './resources/jackpot.svg';
import { ReactComponent as CoinflipIcon } from './resources/coinflip.svg';
import { ReactComponent as UpgraderIcon } from './resources/upgrader.svg';
import logo from '../../resources/images/logo-spin.gif';
import coin from '../../resources/images/coin.png';

import styles from './index.module.css';

const { helpers, events, tf2_jackpot, tf2_coinflip, tf2_mines } = window.insolve; 

const GameLink = ({ link, title, subtext, icon }) => (
  <NavLink to={link} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
    {icon}

    <p>{title}</p>
    {subtext && (
      <p className={styles.desc}>
        <img src={coin} alt="" />
        <span>{subtext}</span>
      </p>
    )}
  </NavLink>
)

const Navbar = () => {
  const [jackpotValue, setJackpotValue] = useState(0);
  const [coinflipValue, setCoinflipValue] = useState(0);
  const [minesValue, setMinesValue] = useState(0);

  // const onJackpotInit = data => {
  //   setJackpotValue(data.items.reduce((a, b) => +a + +b.price, 0));
  // }

  const onJackpotValue = data => {
    setJackpotValue(data);
  }

  const onCoinflipValue = data => {
    setCoinflipValue(data);
  }

  const onMinesValue = data => {
    setMinesValue(data);
  }

  useEffect(() => {
    // events.on('tf2_jackpot:init', onJackpotInit);
    events.on('tf2_jackpot:value', onJackpotValue);
    events.on('tf2_coinflip:value', onCoinflipValue);
    events.on('tf2_mines:value', onMinesValue);

    tf2_jackpot.requestValue();
    tf2_coinflip.requestValue();
    tf2_mines.requestValue();

    return () => {
      // events.off('tf2_jackpot:init', onJackpotInit);
      events.off('tf2_jackpot:value', onJackpotValue);
      events.off('tf2_coinflip:value', onCoinflipValue);
      events.off('tf2_mines:value', onMinesValue);
    }
  }, []);

  return (
    <>
      <nav className={styles.sidebar}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="" />
        </Link>

        <div className={styles.games}>
          <GameLink link="/jackpot" title="Jackpot" subtext={helpers.formatBalance(jackpotValue)} icon={<JackpotIcon className={styles.fillTheme} />} />
          <GameLink link="/coinflip" title="Coinflip" subtext={helpers.formatBalance(coinflipValue)} icon={<CoinflipIcon className={styles.strokeTheme} />} />
          <GameLink link="/mines" title="Mines" subtext={helpers.formatBalance(minesValue)} icon={<UpgraderIcon className={styles.fillTheme} />} />
        </div>

        <div className={styles.social}>
          <a href="https://twitter.com/tf2_double" target="_blank" rel="noopener noreferrer">
            <Twitter />
          </a>

          <a href="https://discord.gg/kjH4nPcBpD" target="_blank" rel="noopener noreferrer">
            <Discord />
          </a>

          {/* <a href="https://vk.com/tf2double" target="_blank" rel="noopener noreferrer">
            <Vk />
          </a> */}
        </div>
      </nav>
    </>
  );
}

export default Navbar;