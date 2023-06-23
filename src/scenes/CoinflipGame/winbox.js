import { useState, useEffect } from "react";
import Button from "../../components/Button";
import LoadingSimple from '../../components/LoadingSimple';
import { Error } from '@styled-icons/material-rounded/Error';
import { Steam } from "styled-icons/bootstrap";
import styles from './index.module.css';

const { events, user } = window.insolve;

const WinBox = ({ data, ANIM_TIME }) => {
  const self = user.get();
  
  const [offerId, setOfferId] = useState(-1);
  const [visible, setVisible] = useState(self?.steamid === data?.winner?.steamid && data?.winner?.steamid);
  const [error, setError] = useState('');

  const onData = data => {
    console.log("\n\n\n\n\n\n\n\n", data);
    if(data.action === 'winnings-sent') {
      setOfferId(data['winnings-sent']);
    } else {
      setError(data?.error || data['winnings-sent-error']);
      setOfferId(-2);
    }
  }

  useEffect(() => {
    events.on('coinflip-win', onData);

    return () => {
      console.log('stop for coinflip-win');
      events.off('coinflip-win', onData);
      events.off('coinflip-win:winnings-sent', onData);
    }
  }, []);

  useEffect(() => {
    const self2 = user.get();
    let tmt;
    
    if(data?.status === 3 && !visible && self2?.steamid === data?.winner?.steamid) {
      tmt = setTimeout(() => {
        setVisible(true);
      }, ANIM_TIME * 1000);
    }

    return () => {
      clearTimeout(tmt);
    }
  }, [data]);

  // let tmt;
  if(!self?.steamid) return null;

  return !visible ? null : (
    <div className={styles.win}>
      <div className={styles.left2}>
        <h4>You win this game!</h4>
        <p style={{color: '#000'}}>Congratulations! The trade offer with your items will be sent shortly.</p>

        {error !== '' && <p className={styles.error2}>{error}</p>}
      </div>

      <div className={styles.right}>
        <Button variant={offerId === -2 ? 'danger' : 'theme'} type="external" newTab shiny={offerId !== -2} href={`https://steamcommunity.com/tradeoffer/${offerId}`} onClick={() => setVisible(false)} disabled={offerId === -1 || offerId === -2}>
          {offerId !== -1 ? (
            offerId === -2 ? (
              <>
                <Error />
                <span>Error</span>
              </>
            ) : (
              <>
                <Steam />
                <span>Open trade offer</span>
              </>
            )
          ) : (
            <>
              <LoadingSimple />
              <span>Loading...</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default WinBox;