import { useState, useEffect } from "react";
import Button from '../../../../components/Button';
import { ReactComponent as Coins } from '../../../../components/Coins.svg';
import styles from './index.module.css';

const { events } = window.insolve;

const EditBalance = ({ user, close }) => {
  const [amount, setAmount] = useState(0);
  const [action, setAction] = useState('add');

  const edit = () => {
    events.emit('internal:sendChat', `/balance ${action} ${amount} ${user?.id}`);
    close();
  }

  useEffect(() => {
    if(action === 'set') setAmount(user?.balance || 0);
    else setAmount(amount === (user?.balance || 0) ? 0 : amount);
  }, [action, amount, user?.balance]);

  return (
    <div className={styles.edit}>
      <div data-pos="mid">
        <p className={styles.desc}>Changing this user's balance will not affect yours.</p>

        <div className={styles.input}>
          <Coins />
          <input type="text" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div className={styles.action}>
          <button data-selected={action === 'add'} onClick={() => setAction('add')}>Add</button>
          <button data-selected={action === 'set'} onClick={() => setAction('set')}>Set</button>
          <button data-selected={action === 'remove'} onClick={() => setAction('remove')}>Remove</button>
        </div>
      </div>

      <Button type="button" onClick={edit} block>Edit balance</Button>
    </div>
  );
}

export default EditBalance;