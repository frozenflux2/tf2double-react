import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';

import Button from '../../components/Button';
// import Dropdown from '../../components/Dropdown';
import Modal from '../../components/Modal';
// import { ReactComponent as Coins } from '../../components/Coins.svg';

import { SteamSymbol } from '@styled-icons/fa-brands/SteamSymbol';
// import { ArrowRight } from '@styled-icons/fa-solid/ArrowRight';
// import { ArrowRight } from '@styled-icons/bootstrap/ArrowRight';
import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';
// import { User } from '@styled-icons/fa-solid/User';
import { Key, VolumeOff } from '@styled-icons/fa-solid';
import { VolumeHigh } from '@styled-icons/fa-solid';
import { Settings as SettingsIcon } from '@styled-icons/fluentui-system-filled/Settings';
// import { DotsHorizontal } from '@styled-icons/heroicons-outline/DotsHorizontal';
import { SignOut } from '@styled-icons/octicons/SignOut';
// import { Gift } from '@styled-icons/fa-solid/Gift';
import { ChartBar } from '@styled-icons/fa-regular/ChartBar';

import profile from '../../resources/images/profile.png';

import styles from './index.module.css';
import stylesProfile from '../Chat/Profile/index.module.css';

// pages
import SendCoins from './pages/SendCoins';
import Preview from './pages/Preview';
import EditRank from './pages/EditRank';
import EditBadge from './pages/EditBadge';
import EditBalance from './pages/EditBalance';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Ban from './pages/Ban';
import BetaKeys from './pages/BetaKeys';

const { helpers } = window.insolve;

const PAGES = {
  COINS: <SendCoins />,
  PREVIEW: <Preview />,
  EDIT_RANK: <EditRank />,
  EDIT_BADGE: <EditBadge />,
  EDIT_BALANCE: <EditBalance />,
  STATS: <Stats />,
  BAN: <Ban />,
  SETTINGS: <Settings />,
  BETA_KEYS: <BetaKeys />
}

const NewTab = ({ tab, setTab, user, self, close }) => {
  return (
    <div className={`${styles.container} ${styles.newTab}`} data-tab={tab}>
      <div className={styles.back} onClick={() => setTab(undefined)}>
        <ChevronLeft />
        <p>Go back</p>
      </div>

      <div className={styles.content} style={PAGES[tab] ? null : {flexDirection: 'row'}}>
        {PAGES[tab] ? React.cloneElement(PAGES[tab], {user, self, close}) : <h4>Nothing to see here</h4>}
      </div>
    </div>
  );
}

const UserModal = () => {
  const [visible, setVisible] = useState(false);
  // const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(undefined);
  const [self, setSelf] = useState(window.insolve.store.get('user') || undefined);
  const [tab, setTab] = useState(undefined);
  const [muted, setMuted] = useState(false);

  const betaKeys = window.insolve.store.get('betaKeys');

  const openModalAndLoadData = useCallback(data => {
    if(!data) return;

    setUser(data);
    setVisible(prev => !prev);
    requestNewUserData(data.id);
  }, []);

  const requestNewUserData = async id => {
    const res = await helpers.requestAPI(`/user/public/${id}`, {}, {cache: false, cacheLife: 1});

    if(res.success) return setUser(res.user);
    // else return setVisible(false); // todo
  }

  const openSettings = useCallback(data => {
    openModalAndLoadData(data);
    setTab('SETTINGS');
  }, [openModalAndLoadData]);

  const openSendCoins = useCallback(data => {
    openModalAndLoadData(data);
    setTab('COINS');
  }, [openModalAndLoadData]);

  const updateRank = rank => {
    setSelf({...self, rank});
  }

  const updateBanned = banned => {
    setSelf({...self, banned});
  }

  const updateUser = usr => {
    setSelf(usr);
    
    if(user?.id === usr?.id) {
      setUser(usr);
    }
  }

  const close = () => setVisible(false);

  useEffect(() => !visible && setTab(undefined), [visible]);

  useEffect(() => {
    window.insolve.events.on('login', updateUser);
    window.insolve.events.on('user:updateValue-rank', updateRank);
    window.insolve.events.on('user:updateValue-banned', updateBanned);
    window.insolve.events.on('internal:toggleUserModal', openModalAndLoadData);
    window.insolve.events.on('internal:toggleUserModal:settings', openSettings);
    window.insolve.events.on('internal:toggleUserModal:sendCoins', openSendCoins);

    return () => {
      window.insolve.events.off('login', updateUser);
      window.insolve.events.off('user:updateValue-rank', updateRank);
      window.insolve.events.off('user:updateValue-banned', updateBanned);
      window.insolve.events.off('internal:toggleUserModal', openModalAndLoadData);
      window.insolve.events.off('internal:toggleUserModal:settings', openSettings);
      window.insolve.events.off('internal:toggleUserModal:sendCoins', openSendCoins);
    }
  }, [openModalAndLoadData, openSettings, openSendCoins]);

  return !user ? null : (
    <Modal visible={visible} toggle={setVisible} className={styles.modal} width="20%">
      <div className={styles.tabsContainer}>
        <div className={`${stylesProfile.container} ${styles.container}`} data-tab={tab ? tab : null}>
          <div className={`${stylesProfile.bg} ${styles.bg}`} style={{background: `url(${profile})`}}>
            {/*
            <DotsHorizontal onClick={() => setDropdown(prev => !prev)} />

            <Dropdown links={[
              {name: 'Profile', icon: <User />},
              {name: 'Settings', icon: <Settings />},
              {name: 'Sign out', icon: <SignOut />, onClick: window.insolve.user.signOut}
            ]} visible={dropdown} toggle={setDropdown} />
            */}
          </div>

          <div className={stylesProfile.content}>
            <div className={stylesProfile.user}>
              
              {!!user?.steamid && user?.steamid?.toString() !== '0' ? (
                <a href={`https://steamcommunity.com/profiles/${user?.steamid}`} target="_blank" rel="noopener noreferrer">
                  <img src={user?.avatar} alt="" />
                </a>
              ) : (
                <img src={user?.avatar} alt="" />
              )}

              <div className={stylesProfile.info}>
                <h4 className={styles.name}>{user?.name}</h4>

                <div className={stylesProfile.lvl}>
                  <p>Lvl {user?.level || 0}</p>
                  <p>Lvl {(user?.level || 0) + 1}</p>

                  <div className={stylesProfile.progress}>
                    <p>{parseInt(user?.xp)} / {user?.expForNextLevel || 0} XP</p>
                    <div style={{'--width': `${user?.levelCompletion || 0}%`}} />
                  </div>
                </div>
              </div>
            </div>


            <div className={styles.actions}>
              {/* signed in, not your profile */}
              {(!!self && self?.id !== user?.id) && (
                <>
                  {/* <Button type="button" onClick={() => setTab('COINS')}>
                    <Gift />
                    <span>Send coins</span>
                  </Button> */}

                  <Button type="button" variant="primary" onClick={() => setMuted(prev => !prev)}>
                    {muted ? <VolumeHigh /> : <VolumeOff />}
                    <span>{muted ? 'Unmute' : 'Mute'} player</span>
                  </Button>
                  
                  {!!user?.steamid && user?.steamid?.toString() !== '0' && (
                    <Button type="external" href={`https://steamcommunity.com/profiles/${user?.steamid}`} newTab variant="primary">
                      <SteamSymbol />
                      <span>Steam Profile</span>
                    </Button>
                  )}
                </>
              )}

              {/* signed in, your profile */}
              {(!!self && self?.id === user?.id) && (
                <>
                  {betaKeys !== undefined && (
                    <Button type="button" variant="primary" onClick={() => setTab('BETA_KEYS')}>
                      <Key style={{color: 'var(--theme-color-contrast)'}} />
                      <span style={{color: 'var(--theme-color-contrast)'}}>Beta keys</span>
                    </Button>
                  )}
                  <Button type="button" variant="primary" onClick={() => setTab('STATS')}>
                    <ChartBar />
                    <span>Statistics</span>
                  </Button>

                  <Button type="button" variant="primary" onClick={() => setTab('SETTINGS')}>
                    <SettingsIcon />
                    <span>Settings</span>
                  </Button>

                  <Button type="button" variant="primary" onClick={window.insolve.user.signOut}>
                    <SignOut />
                    <span>Sign out</span>
                  </Button>
                </>
              )}

              {/* admin stuff */}
              {(!!self && parseInt(self?.rank) >= 2) && (
                <>
                  <p className={styles.adminTitle}>Admin tools</p>
                  <div className={styles.admin}>
                    <Button type="button" variant="primary" onClick={() => setTab('EDIT_RANK')}>
                      <span>Edit rank</span>
                    </Button>

                    <Button type="button" variant="primary" onClick={() => setTab('EDIT_BADGE')}>
                      <span>Edit badge</span>
                    </Button>

                    <Button type="button" variant="primary" onClick={() => setTab('EDIT_XP')}>
                      <span>Edit XP</span>
                    </Button>

                    <Button type="button" variant="primary" onClick={() => setTab('MUTE')}>
                      <span>Mute player</span>
                    </Button>

                    <Button type="button" variant="primary" onClick={() => setTab('PREVIEW')}>
                      <span>Preview info</span>
                    </Button>

                    <Button type="button" variant={user?.banned ? 'success' : 'danger'} onClick={() => setTab('BAN')}>
                      <span>{user?.banned ? 'Unban' : 'Ban'} player</span>
                    </Button>
                  </div>
                </>
              )}

              {/* not signed */}
              {!self && (
                <>
                  <Button type="button" variant="primary" onClick={() => setMuted(prev => !prev)}>
                    {muted ? <VolumeHigh /> : <VolumeOff />}
                    <span>{muted ? 'Unmute' : 'Mute'} player</span>
                  </Button>

                  {!!user?.steamid && user?.steamid?.toString() !== '0' && (
                    <Button type="external" href={`https://steamcommunity.com/profiles/${user?.steamid}`} newTab variant="primary">
                      <SteamSymbol />
                      <span>Steam Profile</span>
                    </Button>
                  )}
                </>
              )}

              {user?.banned && <p className={styles.ban}>This user is currently banned.</p>}
            </div>
          </div>
        </div>

        <NewTab tab={tab} setTab={setTab} user={user} self={self} close={close} />
      </div>
    </Modal>
  );
}

export default UserModal;