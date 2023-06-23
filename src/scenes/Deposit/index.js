import React from 'react';
import { Link } from 'react-router-dom';

import rust from '../../resources/images/payments/rust.png';
import csgo from '../../resources/images/payments/csgo.png';

import paypal from '../../resources/images/payments/paypal.png';
import skrill from '../../resources/images/payments/skrill.png';

import btc from '../../resources/images/payments/btc.png';
import eth from '../../resources/images/payments/eth.png';
import bch from '../../resources/images/payments/bth.png';
import ltc from '../../resources/images/payments/ltc.png';

import styles from './index.module.css';

const Option = ({ title, desc, image, link, color }) => {
  return (
    <Link to={link}>
      <div className={styles.option} style={{'--color': color}}>
        <div className={styles.image}>
          <img src={image} alt={title} />
        </div>

        <div className={styles.text}>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
      </div>
    </Link>
  )
}

export default class Deposit extends React.Component {
  render() {
    return (
      <>
        <p className={styles.section}>Deposit skins</p>
        <div className={styles.container}>
          <Option title="Rust" desc="via Steam" link="/deposit/rust" image={rust} color="#FF6130" />
          <Option title="CS:GO" desc="via Steam" link="/deposit/csgo" image={csgo} color="#9DE7FF" />
        </div>

        <p className={styles.section}>Deposit fiat</p>
        <div className={styles.container}>
          <Option title="Paypal" desc="Gift cards" link="/deposit/paypal" image={paypal} color="#2791C4" />
          <Option title="Skrill" desc="Gift cards" link="/deposit/skrill" image={skrill} color="#682260" />
        </div>

        <p className={styles.section}>Deposit crypto</p>
        <div className={styles.container}>
          <Option title="Bitcoin" desc="BTC • $20,051.50" link="/deposit/btc" image={btc} color="#FEA832" />
          <Option title="Ethereum" desc="ETH • $1127.89" link="/deposit/eth" image={eth} color="#62688F" />
          <Option title="Litecoin" desc="LTC • $52.25" link="/deposit/ltc" image={ltc} color="#4A7CCB" />
          <Option title="Bitcoin Cash" desc="BCH • $102.34" link="/deposit/bch" image={bch} color="#48BE43" />
        </div>
      </>
    );
  }
}