import { Backpack } from '@styled-icons/fluentui-system-filled/Backpack';
import { useEffect, useState } from 'react';
import { Checkmark, Close } from 'styled-icons/evaicons-solid';

import LoadingSimple from '../../../components/LoadingSimple';
import coin from '../../../resources/images/coin.png';
import timeSince from '../../../helpers/timeSince';

import styles from './index.module.css';
import Button from '../../../components/Button';
import { Reload } from 'styled-icons/ionicons-outline';

const { helpers } = window.insolve;

const TYPES = {
  'deposit-steam': 'Deposit',
  'withdraw-steam': 'Withdraw',
  'winnings-steam': 'Winnings'
}

const TYPES_WHY = {
  'jackpot-win': 'Jackpot win',
  'coinflip-win': 'Coinflip win',
  'mines-win': 'Mines win'
}

const TYPES_GAME = {
  'jackpot-deposit-steam': 'Jackpot deposit',
  'coinflip-deposit-steam': 'Coinflip deposit',
  'mines-deposit-steam': 'Mines deposit'
}

const Trade = data => {
  const type = data?.extra_data?.why ? (
    `${TYPES_WHY[data?.extra_data?.why]}${data?.extra_data?.roundId ? ' #' + data?.extra_data?.roundId : ''}`
  ) : (
    data?.extra_data?.data?.game ? (
      `${TYPES_GAME[data?.extra_data?.data?.game + '-' + data.type]}`
    ) : (
      TYPES[data.type]
    )
  );
  const value = (data.value || data.extra_data.price) || helpers.sum(data?.data?.items || [], 'price');

  return (
    <>
      <div className={styles.trade} data-status={data.status} data-error={!!(data.status === 3 && data.extra_data?.error_reason) || null}>
        <div className={styles.status}>
          {[0,1].includes(data.status) && <LoadingSimple />}
          {data.status === 2 && <Checkmark />}
          {data.status === 3 && <Close />}
        </div>

        <div className={styles.text}>
          <h3>{type}</h3>
          <p>{timeSince(data.last_updated)}</p>
        </div>

        <div className={styles.amount}>
          <img src={coin} alt="" />
          <span>{helpers.formatBalance(value)}</span>
        </div>
      </div>

      {(data.status === 3 && data.extra_data?.error_reason) && (
        <div className={styles.error}>
          {data.extra_data?.error_reason}
        </div>
      )}
    </>
  );
}

const TradeList = ({ active }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getList = () => {
    if(loading) return;
    setLoading(true);
    // setList([]);

    window.insolve.user.getTransactions().then(data => {
      setList(data.data);
    }).catch(e => {
      setList([]);
      setError(e?.message || e);
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => getList, [active]);

  return list.length === 0 ? (
    <div className={styles.empty}>
      {loading ? <LoadingSimple className={styles.loading} /> : <Backpack className={styles.bigIcon} />}
      <h4>{loading ? 'Loading...' : 'No trades yet'}</h4>
      <p>All of your deposit and withdrawal history will be shown here.</p>

      <div className={styles.float} style={{marginTop: '30px'}}>
        <Button type="button" variant="theme2" block disabled={loading} onClick={getList}>
          <Reload />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  ) : (
    <div className={styles.list}>
      <div className={styles.float}>
        <Button type="button" variant="theme2" block disabled={loading} onClick={getList}>
          <Reload />
          <span>Refresh</span>
        </Button>
      </div>

      {error !== '' && <p className={styles.errorBig}>{error}</p>}

      {list.map((item, key) => (
        <Trade key={key} {...item} />
      ))}
    </div>
  );
}

export default TradeList;