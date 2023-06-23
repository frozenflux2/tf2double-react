import { useState, cloneElement } from 'react';
import styles from './index.module.css';

import PageJackpot from './jackpot';
import PageCoinflip from './coinflip';
import PageMines from './mines';

const TABS = [
  {title: 'Jackpot', element: <PageJackpot />},
  {title: 'Coinflip', element: <PageCoinflip />},
  {title: 'Mines', element: <PageMines />}
];

const ProvablyFair = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.pf} style={{'--tabs': TABS.length, '--current-tab': tab}} data-tab={tab}>
      <h3>Provably fair</h3>

      <div className={styles.menu}>
        {TABS.map((item, key) => (
          <div data-active={tab === key} onClick={() => setTab(key)} key={key}>{item.title}</div>
        ))}
      </div>

      <div className={styles.main}>
        <p>
          We use a trusted third party website <a href="https://random.org" target="_blank" rel="noopener noreferrer">random.org</a> as
          an independent source to determine the final outcome for all games.
          Random.org allows anyone to verify that the result was generated as a result of true
          randomness and wasn't tampered with the create unfavorable outcomes.
        </p>

        <div className={styles.pages}>
          {TABS.map((item, key) => (
            cloneElement(item.element, {key})
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProvablyFair;