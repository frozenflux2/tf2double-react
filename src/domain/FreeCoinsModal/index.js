import React, { useState, useEffect } from 'react';

import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { ReactComponent as Coins } from '../../components/Coins.svg';

import styles from './index.module.css';

// const { helpers } = window.insolve;

const UserModal = () => {
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState('');

  const openModal = () => {
    setVisible(prev => !prev);
  }

  useEffect(() => {
    window.insolve.events.on('internal:toggleFreeCoinsModal', openModal);

    return () => window.insolve.events.off('internal:toggleFreeCoinsModal', openModal);
  }, []);

  return (
    <Modal visible={visible} toggle={setVisible} className={styles.modal} width="26%">
      <h3>Free coins</h3>

      <p>Use an affiliate code to receive free <span><Coins /> 0.50</span> coins! The person who referred you will receive a small percentage of every bet you make.</p>
      <p>Don't have a code? Use <span>EMERALDS</span>!</p>

      <div className={styles.input}>
        <input type="text" placeholder="Enter your code" value={code} onChange={e => setCode(e.target.value)} />
        <Button type="button" variant="success">Redeem</Button>
      </div>

      <p className={styles.discl}>
        To claim a referral code you must own Rust on your Steam account and play at least 5 hours in total.
        Make sure your game history is set to public.
      </p>
    </Modal>
  );
}

export default UserModal;