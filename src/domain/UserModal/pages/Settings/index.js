import { useState } from 'react';
import Button from '../../../../components/Button';
import LoadingSimple from '../../../../components/LoadingSimple';
import styles from './index.module.css';

const EditBadge = ({ user }) => {
  const [tradelink, setTradelink] = useState(user?.tradelink || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const updateTradelink = () => {
    setLoading(true);
    setSuccess(false);
    setError('');
    
    window.insolve.user.updateTradelink(tradelink).then(() => {
      setError('');
      setSuccess(true);
    }).catch(e => {
      setError(e || 'Invalid tradelink, please try again.');
    }).finally(() => {
      setLoading(false);
    });
  }

  const submit = () => {
    updateTradelink();
  }

  return (
    <>
      <h5>Trade link <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener noreferrer">(How do I get it?)</a></h5>
      <input className={styles.input} type="text" value={tradelink} placeholder="https://steamcommunity.com/tradeoffer/new/?partner=252289723&token=yORPmBKd" onChange={e => setTradelink(e.target.value)} />
      {error !== '' && <p className={styles.error}>{error}</p>}

      <div className={styles.bottom}>
        {success && <p className={styles.success}>Your settings have been saved successfully.</p>}

        <Button type="button" block onClick={submit} disabled={loading}>
          {loading ? <LoadingSimple /> : 'Update settings'}
        </Button>
      </div>
    </>
  );
}

export default EditBadge;