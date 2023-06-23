import banGif from './ban.gif';
import styles from './index.module.css';

const { user } = window.insolve;

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h3>Banned!</h3>
      <p>
        Your account has been banned <span>{parseInt(user.get('ban_length')) === 0 ? 'forever' : 'until ' + user.get('ban_expires_at_readable')}</span>
        {user.get('ban_reason') !== '' && user.get('ban_reason') ? <> for "<span>{user.get('ban_reason')}</span>"</> : ''}.
      </p>
      <p style={{marginTop: '0px'}}>If you wish to appeal, you can contact us on our Discord or on email.</p>

      <img src={banGif} alt="" />
    </div>
  );
}

export default NotFound;