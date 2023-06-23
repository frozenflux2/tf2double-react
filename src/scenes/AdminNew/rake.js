import { useEffect } from 'react';
import useForceUpdate from '../../hooks/useForceUpdate';
import styles from './index.module.css';

import UpdateEverySec2 from '../../components/UpdateEverySec2';

const UpdateEverySec = ({ value }) => {
  const forceUpdate = useForceUpdate();
  let interval;

  useEffect(() => {
    interval = setInterval(forceUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  const e = value - Math.floor(new Date().getTime() / 1000);

  const h = Math.floor(e / 3600).toString().padStart(2,'0');
  const m = Math.floor(e % 3600 / 60).toString().padStart(2,'0');
  const s = Math.floor(e % 60).toString().padStart(2,'0');

  return `${h}:${m}:${s}`;
}

const Rake = ({ }) => {
  return (
    <div className={`${styles.gameDistContainer} ${styles.backupContainer}`} style={{marginTop: '40px'}}>
      <h1 className={styles.header}>Rake</h1>

      <div className={`${styles.gameDist} ${styles.backup}`}>
        <p>
          Last rake was transferred to 
          <span> hxtnv.</span>,
          it was sent <span><UpdateEverySec2 value={1676915443} /> </span>
          and contained <span>21 items </span>
          worth <span>$37.00</span>.
        </p>

        <div className={styles.timer}>
          <UpdateEverySec value={1676998239} />
        </div>
      </div>
    </div>
  );
}

export default Rake;