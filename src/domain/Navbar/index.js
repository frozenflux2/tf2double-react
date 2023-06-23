import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../components/Button';

import { Menu } from '@styled-icons/heroicons-outline/Menu';
import { SettingsOutline } from '@styled-icons/evaicons-outline/SettingsOutline';
import { SignOut } from '@styled-icons/octicons/SignOut';
import { QuestionMarkCircle } from '@styled-icons/evaicons-solid/QuestionMarkCircle';
import { Trophy } from '@styled-icons/fa-solid/Trophy';
import { ShieldFillCheck } from '@styled-icons/bootstrap/ShieldFillCheck';
import { DocumentQuestionMark } from '@styled-icons/fluentui-system-filled/DocumentQuestionMark';
import { Envelope } from '@styled-icons/zondicons/Envelope';
import { Lock } from '@styled-icons/boxicons-solid/Lock';
import { SteamSymbol } from '@styled-icons/fa-brands/SteamSymbol';

import { ReactComponent as JackpotIcon } from '../../domain/Sidebar/resources/jackpot.svg';
import { ReactComponent as CoinflipIcon } from '../../domain/Sidebar/resources/coinflip.svg';

import logo from '../../resources/images/logo.png';

import styles from './index.module.css';

const { store, events, user } = window.insolve; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [self, setSelf] = useState(store.get('user') || undefined); // todo: this could be a useSelf hook

  const updateXp = xp => {
    setSelf(prev => ({...prev, xp}));
  }

  const updateRank = rank => {
    setSelf(prev => ({...prev, rank}));
  }

  const updateLevelProgress = data => {
    setSelf(prev => ({...prev, ...data}));
  }

  const openSettings = () => events.emit('internal:toggleUserModal:settings', self);
  const openProfile = () => events.emit('internal:toggleUserModal', self);

  useEffect(() => {
    events.on('login', setSelf);
    events.on('user:updateValue-rank', updateRank);
    events.on('user:updateValue-xp', updateXp);
    events.on('user:levelProgress', updateLevelProgress);

    return () => {
      events.off('login', setSelf);
      events.off('user:updateValue-rank', updateRank);
      events.off('user:updateValue-xp', updateXp);
      events.off('user:levelProgress', updateLevelProgress);
    }
  }, []);

  const isAdmin = self?.rank >= 4;

  return (
    <>
      <nav className={styles.navbar} data-open={isOpen ? true : null}>
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
        
        <a href="/" className={styles.logoMobileBig}><img src={logo} alt="" /></a>
        <Menu className={styles.menu} onClick={() => setIsOpen(prev => !prev)} />

        <div className={styles.links}>
          <a href="/" className={styles.logoMobile}><img src={logo} alt="" /></a>

          <div className={styles.linkContainer}>
            <div className={styles.left}>
              <NavLink onClick={() => setIsOpen(false)} to="/jackpot" className={({ isActive }) => `${styles.link} ${styles.mobileOnly} ${isActive ? styles.active : ''}`}>
                <JackpotIcon />
                <span>Jackpot</span>
              </NavLink>

              <NavLink onClick={() => setIsOpen(false)} to="/coinflip" className={({ isActive }) => `${styles.link} ${styles.mobileOnly} ${isActive ? styles.active : ''}`}>
                <CoinflipIcon />
                <span>Coinflip</span>
              </NavLink>

              <NavLink onClick={() => setIsOpen(false)} to="/mines" className={({ isActive }) => `${styles.link} ${styles.mobileOnly} ${isActive ? styles.active : ''}`}>
                <CoinflipIcon />
                <span>Mines</span>
              </NavLink>

              <NavLink onClick={() => setIsOpen(false)} to="/leaderboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                <Trophy />
                <span>Leaderboard</span>
              </NavLink>

              <NavLink onClick={() => setIsOpen(false)} to="/provably-fair" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                <ShieldFillCheck />
                <span>Provably fair</span>
              </NavLink>

              <NavLink onClick={() => setIsOpen(false)} to="/faq" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                <QuestionMarkCircle />
                <span>FAQ</span>
              </NavLink>

              <NavLink onClick={() => setIsOpen(false)} to="/tos" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                <DocumentQuestionMark />
                <span>TOS</span>
              </NavLink>
              
              <NavLink onClick={() => setIsOpen(false)} to="/support" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                <Envelope />
                <span>Support</span>
              </NavLink>

              {isAdmin && (
                <NavLink data-admin="true" onClick={() => setIsOpen(false)} to="/admin" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                  <Lock />
                  <span>Admin panel</span>
                </NavLink>
              )}
            </div>

            {!!self ? (
              <div className={styles.right}>
                <button title="Settings" onClick={openSettings}>
                  <SettingsOutline />
                </button>

                <button title="Sign out" onClick={user.signOut}>
                  <SignOut />
                </button>

                <div className={styles.level}>
                  <p className={styles.lvl}>Lvl {self?.level || 0}</p>
                  <p className={styles.percent}>{parseInt(self?.levelCompletion || 0)}%</p>

                  <div style={{height: `${self?.levelCompletion || 0}%`}} />
                </div>

                <img src={self?.avatar} alt="" className={styles.avatar} onClick={openProfile} />
              </div>
            ) : (
              <div className={styles.right}>
                <Button type="button" onClick={window.insolve.user.signIn} variant="success" className={styles.steam} shiny>
                  <SteamSymbol />
                  <span>Sign in with Steam</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;