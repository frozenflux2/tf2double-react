import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
// import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import InventoryModal from './InventoryModal';
import usePrevious from '../../../hooks/usePrevious';
import { ReactComponent as Coins } from '../../../components/Coins.svg';
import { SteamSymbol } from '@styled-icons/fa-brands/SteamSymbol';
// import { Backpack } from '@styled-icons/fluentui-system-filled/Backpack';
import { User } from '@styled-icons/fa-solid/User';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { DotsHorizontal } from '@styled-icons/heroicons-outline/DotsHorizontal';
import { SignOut } from '@styled-icons/octicons/SignOut';
import { Gift } from '@styled-icons/fa-solid/Gift';

import logo from '../../../resources/images/logo.png';
import profile from '../../../resources/images/profile.png';

import styles from './index.module.css';

const { events, store } = window.insolve;

// todo: add a vertical offset depending how many changes there are
const Change = ({amount, index, remove}) => {
  useEffect(() => {
    const disappear = setTimeout(() => remove(index), 1000);

    return () => clearTimeout(disappear);
  }, [index, remove]);

  return isNaN(amount) ? null : (
    <div className={styles.change} data-profit={amount > 0}>
      <CountUp end={Math.abs(amount)} duration={0} decimals={2} separator=" " preserveValue={true} />
    </div>
  );
}

const Profile = () => {
  const [user, setUser] = useState(store.get('user') || undefined);
  const [dropdown, setDropdown] = useState(false);
  const [changes, setChanges] = useState([]);
  const prevUser = usePrevious(user);

  const openProfile = () => events.emit('internal:toggleUserModal', user);
  const openSettings = () => events.emit('internal:toggleUserModal:settings', user);
  // const openDeposit = () => events.emit('internal:toggleInventoryModal');

  const removeChangeAtIndex = index => {
    setChanges(prev => prev.filter(x => x.key !== index));
  }

  const updateBalance = balance => {
    setUser(prev => ({...prev, balance}));
  }

  const updateXp = xp => {
    setUser(prev => ({...prev, xp}));
  }

  const updateRank = rank => {
    setUser(prev => ({...prev, rank}));
  }

  const updateLevelProgress = data => {
    setUser(prev => ({...prev, ...data}));
  }

  const updateBanned = banned => {
    setUser(prev => ({...prev, banned}));
  }

  useEffect(() => {
    if(prevUser?.balance === user?.balance) return;

    setChanges(prev => [...prev, {change: user?.balance - prevUser?.balance, index: prev.length}]);
  }, [user, prevUser]);

  useEffect(() => {
    events.on('login', setUser);
    events.on('user:updateValue-balance', updateBalance);
    events.on('user:updateValue-rank', updateRank);
    events.on('user:updateValue-xp', updateXp);
    events.on('user:updateValue-banned', updateBanned);
    events.on('user:levelProgress', updateLevelProgress);

    return () => {
      events.off('login', setUser);
      events.off('user:updateValue-balance', updateBalance);
      events.off('user:updateValue-rank', updateRank);
      events.off('user:updateValue-xp', updateXp);
      events.off('user:updateValue-banned', updateBanned);
      events.off('user:levelProgress', updateLevelProgress);
    }
  }, []);

  return (
    <div className={styles.container}>
      {!!user ? (
        <>
          <div className={styles.bg} style={{background: `url(${profile})`}}>
            <DotsHorizontal onClick={() => setDropdown(prev => !prev)} />

            <Dropdown links={[
              {name: 'Profile', icon: <User />, onClick: openProfile},
              {name: 'Settings', icon: <Settings />, onClick: openSettings},
              {name: 'Sign out', icon: <SignOut />, onClick: window.insolve.user.signOut}
            ]} visible={dropdown} toggle={setDropdown} />
          </div>

          <div className={styles.content}>
            <div className={styles.user}>
              <img src={user.avatar} alt="" onClick={openProfile} />

              <div className={styles.info}>
                <h4>{user.name}</h4>

                <div className={styles.lvl}>
                  <p>Lvl {user?.level || 0}</p>
                  <p>Lvl {(user?.level || 0) + 1}</p>

                  <div className={styles.progress}>
                    <p>{user?.xp} / {user?.expForNextLevel || 0} XP</p>
                    <div style={{'--width': `${user?.levelCompletion || 0}%`}} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.balance}>
              <p>
                <Coins />
                <span>
                  <CountUp end={user?.balance || 0} duration={.5} decimals={2} separator=" " preserveValue={true} />
                </span>
              </p>

              <button>
                <Gift />
              </button>

              {changes.map(({ change, index }, key) => <Change index={index} amount={change} key={key} remove={removeChangeAtIndex} />)}
              {/* <div className={styles.change} data-profit="true">1.20</div> */}
            </div>

            {/* <button className={styles.inv} onClick={openDeposit} title="Inventory">
              <Backpack />
            </button> */}
            
            <InventoryModal />
          </div>
        </>
      ) : (
        <div className={styles.login}>
          {/* <h3>RustyRage</h3> */}
          <img src={logo} alt="" />
          <p>Sign in to get the best experience!</p>

          <Button type="button" onClick={window.insolve.user.signIn} variant="success" shiny>
            <SteamSymbol />
            <span>Sign in with Steam</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Profile;