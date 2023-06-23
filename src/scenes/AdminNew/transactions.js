import Button from '../../components/Button';
import timeSince from '../../helpers/timeSince';
import coin from '../../resources/images/coin.png';
import styles from './index.module.css';

const { helpers, user } = window.insolve;

const TYPE_MAP = {
  'deposit-steam': 'Deposit',
  'withdraw-steam': 'Withdraw',
  'winnings-steam': 'Winnings'
}

const Table = ({ txns, resend, translateType }) => {
  return (
    <div className={styles.txns}>
      <div className={styles.header}>
        <div>User</div>
        <div>Time</div>
        <div>Type</div>
        <div>Game</div>
        <div>Amount</div>
        <div>Action</div>
      </div>

      <div className={styles.content}>
        {txns.map((txn, key) => {
          const { type, game } = translateType(txn);

          return (
            <div className={styles.row} key={key} data-type={txn?.type}>
              <div>
                <img className={styles.avatar} src={txn?.user?.avatar} alt="" />
                <span>{txn?.user?.name}</span>
              </div>
              <div>{timeSince(txn?.time_created)}</div>
              <div className={styles.type}>
                {type}
                {/* <p>{type}</p> */}
                {/* <span>{game}</span> */}
              </div>
              <div className={styles.game} style={{textTransform: 'capitalize'}}>{game}</div>
              <div>
                <img className={styles.coin} src={coin} alt="" />
                <span style={{fontWeight: '500', color: '#fff'}}>{helpers.formatBalance(txn?.value || txn?.extra_data?.price || txn?.extra_data?.value || txn?.data?.value)}</span>
              </div>
              <div>
                {txn?.status === 3 && <Button onClick={() => resend(txn)} variant='primary' type='button' style={{height: '32px', lineHeight: '32px', fontSize: '12px'}}>Resend</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Transactions = ({ txns = [], txns_fail = [] }) => {
  const translateType = txn => {
    let game = txn?.extra_data?.game;

    if(txn?.extra_data?.why === 'jackpot-win') {
      game = 'Jackpot';
    } else if(txn?.extra_data?.why === 'coinflip-win') {
      game = 'Coinflip';
    } else if(txn?.extra_data?.why === 'mines-win') {
      game = 'Mines';
    }

    return {
      type: TYPE_MAP[txn?.type] || txn?.type,
      game
    }
  }

  const resend = txn => {
    user.resendOfferAdmin({
      game: txn.extra_data.game || (txn.extra_data.why || '').split('-')[0],
      userid: txn.user.id,
      type: txn.type,
      items: txn.extra_data?.items || txn.data?.items || [],

    }).then(data => alert(data.msg)).catch(data => alert(data.msg));
  }

  return (
    <div className={styles.txnsContainer}>
      <h1 className={styles.header}>Latest transactions</h1>
      <Table txns={txns} translateType={translateType} resend={resend} />

      {txns_fail.length > 0 && (
        <>
          <h1 className={styles.header} style={{marginTop: '30px'}}>Failed transactions</h1>
          <Table txns={txns_fail} translateType={translateType} resend={resend} />
        </>
      )}
    </div>
  );
}

export default Transactions;