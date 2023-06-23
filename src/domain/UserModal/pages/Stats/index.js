import { ReactComponent as Coins } from '../../../../components/Coins.svg';
import LoadingSimple from '../../../../components/LoadingSimple';
import { PersonMoney } from '@styled-icons/fluentui-system-regular/PersonMoney';
import { BuildingRetailMoney } from '@styled-icons/fluentui-system-filled/BuildingRetailMoney';
import { UserPlus } from '@styled-icons/boxicons-regular/UserPlus';
import styles from './index.module.css';
import { useEffect, useState } from 'react';
import getReadableDate from '../../../../helpers/getReadableDate';


const Box = ({ title, value }) => (
  <div className={styles.container}>
    <div className={styles.left}>
      <p><Coins /> <span style={title === 'Profit' ? {
        color: value === 0 ? '' : (value < 0 ? 'var(--roulette-red-single)' : 'var(--roulette-green-single)')
      } : null}>{window.insolve.helpers.formatBalance(value)}</span></p>
      <span>{title}</span>
    </div>

    {title === 'Winnings' && <BuildingRetailMoney className={styles.icon} />}
    {title === 'Wagered' && <PersonMoney className={styles.icon} />}
    {title === 'Profit' && <UserPlus className={styles.icon} />}
  </div>
);

const Stats = ({ user }) => {
  const [stats, setStats] = useState(undefined);

  const date = new Date(user?.joinDate * 1000);
  const now = new Date().getTime();

  const diff = (now - date) / 1000;
  const days = Math.floor(diff / (3600 * 24));
  // const hours = Math.floor(diff % (3600 * 24) / 3600);
  const hours = parseInt(days * 24);

  useEffect(() => {
    window.insolve?.user?.getStats().then(d => setStats(d?.stats));
  }, []);

  return (
    <div className={styles.stats}>
      <p>You've been with us since <span>{getReadableDate(date)}</span>. That's <span>{days} day{days === 1 ? '' : 's'}</span> or <span>{hours} hour{hours === 1 ? '' : 's'}</span>!</p>
    
      <div className={styles.boxes} data-loading={!stats}>
        <Box title="Wagered" value={stats?.depo || 0} />
        <Box title="Winnings" value={stats?.win || 0} />
        <Box title="Profit" value={stats?.profit || 0} />

        <div className={styles.loading}>
          <LoadingSimple />
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;