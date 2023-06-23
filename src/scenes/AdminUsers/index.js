import styles_now from './index.module.css';
import styles from '../Jackpot/index.module.css';
import { useState, useEffect } from 'react';
import NotFound from '../NotFound';
import { Gun } from 'styled-icons/fa-solid';
import { User } from '@styled-icons/fa-solid/User';
import { TimeFive } from '@styled-icons/boxicons-solid/TimeFive';

import timeSince from '../../helpers/timeSince';

const { user, events } = window.insolve;

const UserBox = (props) => {
  const { avatar, steamid, name, joinDate } = props;

  return (
    <div className={styles.past} onClick={() => events.emit('internal:toggleUserModal', props)} style={{
      '--avatar': `url(${avatar})`
    }}>
      {/* <img src={past} alt="" className={styles.bg} /> */}

      <div className={styles.flex}>
        <div className={styles.avatar}>
          <img src={avatar} loading="lazy" alt="" />
        </div>
        <div className={styles.text}>
          <p>
            <span className={styles.bold}>{name || '?'} </span>
          </p>

          <div className={styles.descContainer}>

            <div className={styles.desc}>
              <TimeFive />
              <p>{timeSince(joinDate)}</p>
            </div>
          </div>
        </div>

        {/* <div className={styles.coin}>
          <img src={coin} alt="" />
          <p>{helpers.formatBalance(0)}</p>
        </div> */}
      </div>

      <div className={styles.summary}>
        <div>
          <User style={{transform: 'translateY(-1px)'}} />
          <p>{0}</p>
        </div>

        <div>
          <Gun style={{transform: 'translateY(-1px)'}} />
          <p>{0}</p>
        </div>

        <div>
          <TimeFive style={{transform: 'translateY(-1px)'}} />
          <p>0</p>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  // const [user, setUser] = useState({});

  useEffect(() => {
    if((user.get('rank') || 0) < 4) return;
    
    user.getAdminUsers({}).then(setUsers).catch(console.log);

  //   insolve_user.on('signed in', data => setUser(data));
  }, []);

  if((user.get('rank') || 0) < 4) {
    return <NotFound />; 
  }

  // if(user?.rank < 2 || typeof user?.rank !== 'number') return null;

  return (
    <>
      <h1 className={styles_now.header}>Admin panel - User list</h1>
      
      <div className={styles_now.list}>
        {users.map((u, key) => (
          <UserBox {...u} key={key} />
        ))}
      </div>
    </>
  );
}

export default Admin;