import React, { useState, useEffect, useCallback } from "react";
import { Backpack } from '@styled-icons/fluentui-system-filled/Backpack';
import { CircleQuestion } from '@styled-icons/fa-solid';
import { CheckCircle } from '@styled-icons/bootstrap/CheckCircle';
import { ExclamationCircle } from '@styled-icons/bootstrap/ExclamationCircle';
import { Steam } from '@styled-icons/fa-brands/Steam';
import Button from "../../../../components/Button";
import Loader from "../../../../components/Loader";
import Modal from "../../../../components/Modal";
import { ReactComponent as Coins } from "../../../../components/Coins.svg";

import styles from "./index.module.css";


const { events } = window.insolve;

const TransactionModal = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [id, setId] = useState(0);
  // const [count, setCount] = useState(1);
  const [type, setType] = useState('deposit');
  const [code, setCode] = useState('-');
  const [tradeId, setTradeId] = useState(0);
  const [error, setError] = useState('');
  const [dinoFact, setDinoFact] = useState('that lizards, turtles, snakes and crocodiles all descend from dinosaurs?');

  const nextStep = () => setStep(prev => prev >= 2 ? 0 : prev + 1);
  const onStatus = ({ status, extra_data }) => {
    if(status === 1 && extra_data.offerid) {
      setTradeId(extra_data.offerid);
      setStep(1);
    }

    if(status === 2) {
      setStep(2);
    } else if(status === 3) {
      setError(extra_data.error_reason);
      setStep(1);
    }
  }
  const open = useCallback(data => {
    setStep(0);
    setId(data.id);
    setCode(data.code);
    setDinoFact(data.dino_fact);
    setVisible(true);
    setError('');
    setType(data.type);

    events.on(`transactions:${data.id}-status`, onStatus);
  }, []);

  const close = () => setVisible(false);

  // reset everything on close
  useEffect(() => {
    if(!visible) events.on(`transactions:${id}-status`, onStatus);
  }, [visible, id]);

  // listen for events
  useEffect(() => {
    events.on("internal:toggleTransactionModal", open);
    return () => events.off("internal:toggleTransactionModal", open);
  }, [open]);


  return (
    <Modal
      visible={visible}
      toggle={setVisible}
      className={styles.modal}
      width="34%"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.left}>
            <h4>{type === 'deposit' ? 'Deposit' : 'Withdraw'} #{id}</h4>
            <p>Security code: {code}</p>
          </div>

          <Button variant="primary" type="button" onClick={nextStep}>
            <CircleQuestion />
            <span>I need help</span>
          </Button>
        </div>

        <div className={styles.center} style={{marginLeft: `-${100 * step}%`}}>
          {/* step 1 */}
          <div className={styles.stepContainer}>
            <Loader variant="circle" />
            <h3>Preparing your offer...</h3>
            <p>Did you know... {dinoFact}</p>
          </div>

          {/* step 2 */}
          <div className={styles.stepContainer}>
            {error === '' ? (
              <>
                <CheckCircle className={styles.icon} style={{color: '#46c77a'}} />
                <h3>Your offer is ready!</h3>
                <p>You have 5 minutes to accept it. {type === 'deposit' ? 'Your account will be credited as soon as the offer is accepted.' : 'After that the offer will be cancelled and your balance refunded.'}</p>
              
                <Button shiny variant="theme" type="external" newTab href={`https://steamcommunity.com/tradeoffer/${tradeId}`} className={styles.offerBtn}>
                  <Steam />
                  <span>Open the offer</span>
                </Button>
              </>
            ) : (
              <>
                <ExclamationCircle className={styles.icon} style={{color: '#CB4339'}} />
                <h3>There's been an error...</h3>
                <p>{error}</p>
              </>
            )}
          </div>

          {/* step 3 */}
          <div className={styles.stepContainer}>
            <h3>Which currency do you want to receive?</h3>
            <p>Your balance have been updated with the amount you deposited. If you wish, you can add the items directly to your on-site inventory to use on games like coinflip or upgrader.</p>
          
            <div className={styles.btns}>
              <div style={{marginRight: '10px'}}>
                <Coins />
                <p>Keep my coins</p>
              </div>

              <div>
                <Backpack />
                <p>Add to inventory</p>
              </div>

              <Button variant="primary" type="button" onClick={close} block>Close</Button>
            </div>
          </div>
        </div>

        <div className={styles.steps}>
          <div data-checked={step >= 0 ? true : null} />
          <div data-checked={step >= 1 ? true : null} />
          <div data-checked={step >= 2 ? true : null} />
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;
