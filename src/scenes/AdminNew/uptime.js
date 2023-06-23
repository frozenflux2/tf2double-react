import { useEffect } from 'react';
import useForceUpdate from '../../hooks/useForceUpdate';
import Button from '../../components/Button';
import styles from './index.module.css';

import UpdateEverySec2 from '../../components/UpdateEverySec2';

const UpdateEverySec = ({ value }) => {
  const forceUpdate = useForceUpdate();
  let interval;

  useEffect(() => {
    interval = setInterval(forceUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  const e = Math.floor(new Date().getTime() / 1000) - value;

  const h = Math.floor(e / 3600).toString().padStart(2,'0');
  const m = Math.floor(e % 3600 / 60).toString().padStart(2,'0');
  const s = Math.floor(e % 60).toString().padStart(2,'0');

  return `${h}h ${m}m ${s}s`;
}


const Uptime = ({ uptime }) => {
  const restart = () => {
    if(window.confirm('This will restart the server, kick off any online users and potentially break things. Are you sure?')) {
      window.insolve.user.restartServerAdmin().then(data => {
        alert(data.msg);
      }).catch(e => {
        alert(e?.message || e);
      });
    }
  };

  return uptime === 0 ? null : (
    <div className={`${styles.gameDistContainer} ${styles.backupContainer}`} style={{marginTop: '40px'}}>
      <h1 className={styles.header}>Server uptime</h1>

      <div className={`${styles.gameDist} ${styles.backup}`}>
        <p>
          Last server restart happened <span><UpdateEverySec2 value={uptime} /></span>. Server has been running for:
        </p>

        <div className={styles.timer}>
          <UpdateEverySec value={uptime} />
        </div>

        <Button type="button" variant="theme" onClick={restart}>
          <span>Restart server</span>
        </Button>
      </div>
    </div>
  );
}

export default Uptime;