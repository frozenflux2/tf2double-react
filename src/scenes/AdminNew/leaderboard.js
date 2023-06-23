import { useState } from 'react';
// import Button from '../../components/Button';
import { ArrowSwap } from '@styled-icons/fluentui-system-filled/ArrowSwap';
import styles from './index.module.css';
import unknown from '../../resources/images/unknown.png';
// import timeSince from '../../helpers/timeSince';

const suffix = num => {
  if(num === 1) return 'st';
  else if(num === 2) return 'nd';
  else if(num === 3) return 'rd';

  return 'th';
}

const Leaderboard = ({ latest, list }) => {
  const [current, setCurrent] = useState(latest);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState(0);

  const loadList = index => {
    setLoading(true);

    window.insolve.user.loadLeaderboardWinners(list[index]).then(data => {
      setActiveKey(index);
      setCurrent(data);
    }).catch(alert).finally(() => setLoading(false));
  }

  return list.length === 0 ? null : (
    <div className={styles.gameDistContainer} style={{marginTop: '40px'}}>
      <h1 className={styles.header}>
        <span>Last leaderboard winners</span>
      </h1>

      <div className={`${styles.gameDist} ${styles.bots}`} style={{borderRadius: '6px 6px 0 0', borderBottom: '0'}}>
        {(current?.players || []).length === 0 && (
          <p style={{color: 'var(--text-color-secondary)', lineHeight: '1.4em', fontSize: '14px', textAlign: 'center'}}>Looks like there were no players in the leaderboard during this period</p>
        )}

        <div className={styles.list}>
          {( current?.players || [] ).map(({ player, points }, key) => {
            return (
              <div key={key} className={styles.bot} data-online={true}>
                <img src={player?.avatar || unknown} alt="" onClick={() => window.insolve.events.emit('internal:toggleUserModal', player)} style={{cursor: 'pointer'}} />

                <div>
                  <p>{player?.name || '?'}</p>
                  <span>{key + 1}{suffix(key + 1)} place, {points || 0} point{points === 1 ? '' : 's'}</span>
                </div>

                <a className={styles.button} href={player?.tradelink} target="_blank" rel="noopener noreferrer">
                  <ArrowSwap />
                </a>
              </div>
            );
          })}
        </div>
      </div>
        
        {(list || []).length > 0 && (
          <div className={`${styles.gameDist} ${styles.bots} ${styles.rake2} ${styles.lbprev}`} style={{borderRadius: '0 0 6px 6px'}}>
            <div className={styles.withdrawals}>
              <h3>See previous winners</h3>

              <div className={styles.lbprevlist} data-loading={loading || null}>
                {list.reverse().map((filename, key) => (
                  <div key={key} onClick={() => loadList(key)} style={activeKey === key ? {color: 'var(--theme-color-contrast)'} : null}>
                    {new Date( parseInt(filename.split('-')[2].split('.')[0]) * 1000 ).toDateString().split(' ').filter((x, key) => key !== 0).join(' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default Leaderboard;