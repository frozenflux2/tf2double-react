import { useState } from "react";
import Button from '../../../../components/Button';
import styles from './index.module.css';

const { events } = window.insolve;

const DURATION = [
  24,
  24 * 3,
  24 * 7,
  24 * 30,
  (24 * 30 * 6),
  0
];

const Ban = ({ user, close }) => {
  const [duration, setDuration] = useState(0);
  const [reason, setReason] = useState('');

  const ban = () => {
    events.emit('internal:sendChat', `/ban ${user?.id} ${DURATION[duration]}${reason !== '' ? ' ' + reason : ''}`);
    close();
  }

  const addZeros = num => num < 10 ? `0${num}` : num;

  const date = new Date(user?.ban_expires_at * 1000);
  const date_readable = `${addZeros(date.getDate())}/${addZeros(date.getMonth() + 1)}/${addZeros(date.getFullYear())}, ${addZeros(date.getHours())}:${addZeros(date.getMinutes())}`;
  const ban_length = user?.ban_length === 0 ? 'forever' : <>until <span>{date_readable}</span></>;
  const ban_reason = (user?.ban_reason === '' || !user?.ban_reason) ? '' : <>for "<span>{user?.ban_reason || '-'}</span>"</>;

  return (
    <div className={styles.edit}>
      <div data-pos="mid">
        {user?.banned ? (
          <>
            <p className={styles.desc}>
              This user is currently banned {ban_length} {ban_reason} by <img src={user?.banned_by?.avatar} alt="" style={{height: '20px', borderRadius: '50%', transform: 'translateY(5px)', margin: '0 5px'}} />
              <span>{user?.banned_by?.name || 'SYSTEM'}</span>.
            </p>
          </>
        ) : (
          <>
            <p className={styles.desc}>Banning a user will prevent them from withdrawing, playing games or even accessing the site.</p>

            <p className={styles.desc} style={{marginBottom: 0, color: 'var(--text-color-primary)'}}>Duration</p>
            <div className={styles.btns}>
              <button onClick={() => setDuration(0)} data-active={duration === 0}>24 hours</button>
              <button onClick={() => setDuration(1)} data-active={duration === 1}>3 days</button>
              <button onClick={() => setDuration(2)} data-active={duration === 2}>7 days</button>
              <button onClick={() => setDuration(3)} data-active={duration === 3}>30 days</button>
              <button onClick={() => setDuration(4)} data-active={duration === 4}>6 months</button>
              <button onClick={() => setDuration(5)} data-active={duration === 5}>Forever</button>
            </div>

            <p className={styles.desc} style={{marginBottom: 0, color: 'var(--text-color-primary)'}}>Reason (optional)</p>   
            <textarea placeholder="Banned for breaking TOS" value={reason} onChange={e => setReason(e.target.value)}></textarea>
          </>
        )}
      </div>

      <Button type="button" variant={user?.banned ? 'success' : 'danger'} onClick={ban} block>{user?.banned ? 'Unban' : 'Ban'} user</Button>
    </div>
  );
}

export default Ban;