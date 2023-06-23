import { useState, useEffect } from "react";
import { ArrowRight } from '@styled-icons/bootstrap/ArrowRight';
import Button from '../../../../components/Button';
import { ReactComponent as Coins } from '../../../../components/Coins.svg';
import styles from './index.module.css';

const { events } = window.insolve;

const SendCoins = ({ user, self, close }) => {
  const [sure, setSure] = useState(false);
  const [amount, setAmount] = useState(0);

  const send = () => {
    if(sure) {
      events.emit('internal:sendChat', `/send ${user?.id} ${amount}`);
      return close();
    }

    setSure(true);
  }

  useEffect(() => setSure(false), [amount]);

  const disabled = parseFloat(amount) <= 0 || amount === '' || isNaN(amount);

  return (
    <div className={styles.sendCoins}>
      <div data-pos="mid">
        <div className={styles.users}>
          <img src={self?.avatar} alt="" />
          <ArrowRight />
          <img src={user?.avatar} alt="" />
        </div>

        <p className={styles.desc}>Sending coins to <span>{user?.name}</span></p>

        <div className={styles.input}>
          <Coins />
          <input type="text" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </div>

      <Button disabled={disabled} type="button" onClick={send} block>{sure ? 'Are you sure?' : 'Send coins'}</Button>
    </div>
  );
}

export default SendCoins;