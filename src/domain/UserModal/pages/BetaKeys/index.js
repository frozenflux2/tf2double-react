import { Fragment } from 'react';
import styles from './index.module.css';

const BetaKeys = () => {
  const betaKeys = window.insolve.store.get('betaKeys') || [];

  return (
    <Fragment>
      <h4>Your Beta Access keys</h4>
      <p style={{margin: '1em 0', textAlign: 'center'}}>Share them with your friends or anyone else :&#41;</p>

      <div className={styles.keys}>
        {betaKeys.map((key, index) => (
          <div className={styles.code} key={index} style={key.unlimited ? null : (
            (key.usedBy || []).length > 0 ? {textDecoration: 'line-through', color: 'var(--roulette-red-single)'} : {color: 'var(--roulette-green-single)'}
          )}>
            {key.code}
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default BetaKeys;