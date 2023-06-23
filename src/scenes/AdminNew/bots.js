import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { ShoppingCartOutline } from '@styled-icons/evaicons-outline/ShoppingCartOutline';
import styles from './index.module.css';
import unknown from '../../resources/images/unknown.png';
import timeSince from '../../helpers/timeSince';

const Bots = ({ bots = [] }) => {
  const [selectedBot, setSelectedBot] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [rake, setRake] = useState({});

  const withdraw = () => {
    setLoading(true);

    window.insolve.user.withdrawAdminRake(selectedBot).then(data => {
      if(data.success) {
        window.open(`https://steamcommunity.com/tradeoffer/${data.id}`, '_blank').focus();
      } else {
        alert(data.msg);
      }
    }).catch(alert).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    window.insolve.user.getAdminRake().then(setRake).catch(console.error);
  }, []);

  return bots.length === 0 ? null : (
    <div className={styles.gameDistContainer} style={{marginTop: '40px'}}>
      <h1 className={styles.header}>Rake & Bots</h1>

      <div className={`${styles.gameDist} ${styles.bots}`} style={selectedBot === -1 ? null : {borderRadius: '6px 6px 0 0', borderBottom: '0'}}>
        <div className={styles.list}>
          {bots.map((bot, key) => {
            const rakeBot = rake?.bots?.[bot?.steamid];

            return (
              <div key={key} className={styles.bot} data-online={!!bot?.online}>
                <a href={`https://steamcommunity.com/profiles/${bot.steamid}`} target="_blank" rel="noopener noreferrer">
                  <img src={bot?.avatar || unknown} alt="" />
                </a>

                <div>
                  <p>${window.insolve.helpers?.formatBalance( rakeBot?.amount )}</p>
                  <span>{bot?.name || 'Unknown bot'}</span>
                </div>

                <button onClick={() => setSelectedBot(prev => prev === bot?.steamid ? -1 : bot?.steamid)}>
                  <ShoppingCartOutline />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBot !== -1 && (
        <>
          <div className={`${styles.gameDist} ${styles.bots} ${styles.rake}`} style={{borderRadius: '0'}}>
            <p>This bot currently holds <span>{(rake.bots[selectedBot]?.items || []).length} item{(rake.bots[selectedBot]?.items || []).length === 1 ? '' : 's'}</span> worth <span>${window.insolve.helpers.formatBalance((rake.bots[selectedBot]?.amount || 0))}</span>.</p>

            <Button type="button" variant="theme" onClick={withdraw} disabled={(rake.bots[selectedBot]?.items || []).length === 0 || loading}>
              <span>Request withdrawal</span>
            </Button>
          </div>

          {(rake.bots[selectedBot]?.history && (rake.bots[selectedBot]?.history || []).length > 0) && (
            <div className={`${styles.gameDist} ${styles.bots} ${styles.rake2}`} style={{borderRadius: '0 0 6px 6px'}}>
              <div className={styles.withdrawals}>
                <h3>Last withdrawals</h3>

                {rake.bots[selectedBot]?.history.map((row, key) => key >= 4 ? null : (
                  <div className={styles.row}>
                    <div key={key}>
                      <p>{row?.user?.name || '?'}</p>
                      <span>{timeSince(row?.time)}</span>
                    </div>

                    <h4>${window.insolve.helpers.formatBalance(row?.amount)}</h4>
                  </div>
                ))}
              </div>
            </div>
            )}
        </>
      )}
    </div>
  );
}

export default Bots;