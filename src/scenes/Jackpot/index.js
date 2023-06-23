import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import CountUp from 'react-countup';

import Button from '../../components/Button';
import ScrollingContainer from '../../components/ScrollingContainer';
import TransactionModal from '../../components/TransactionModal';
import ProvablyFairModal from '../../components/ProvablyFairModal';
import GameInfoModal from '../../components/GameInfoModal';
import Circle from './components/Circle';
import Round from './components/Round';

import bank from './resources/bank2.png';
// import past from './resources/past.png';
import coin from '../../resources/images/coin.png';

import timeSince from '../../helpers/timeSince';

import styles from './index.module.css';
import stylesCF from '../Coinflip/index.module.css';
// import { I, X } from 'styled-icons/fa-solid';
import { Steam } from 'styled-icons/bootstrap';
import { QuestionCircle } from 'styled-icons/bootstrap';
import LoadingSimple from '../../components/LoadingSimple';
import { Error } from 'styled-icons/boxicons-regular';
import { Gun } from 'styled-icons/fa-solid';
// import { Gamepad } from '@styled-icons/fa-solid/Gamepad';
import { User } from '@styled-icons/fa-solid/User';
import { TimeFive } from '@styled-icons/boxicons-solid/TimeFive';
// import { Link } from 'react-router-dom';

const { helpers, events, tf2_jackpot } = window.insolve;


const Item = ({ name, price, image, owner, color }) => (
  <div className={styles.item} style={{'--color': color || '#7d6d00'}}>
    <div className={styles.image}>
      <img src={image} alt="" />
    </div>

    <div className={styles.text}>
      <p className={styles.price}>
        <img src={coin} alt="" />
        <span>{helpers.formatBalance(price)}</span>
      </p>
      <p className={styles.name}>{name}</p>
    </div>

    {/* player preview */}
    <div className={styles.preview}>
      <img src={owner?.avatar} alt="" />
      <p>{owner?.name}</p>
    </div>
  </div>
)

const PastRound = (props) => {
  // const [offset, setOffset] = useState(-1);
  const { winner, timeRolled, players, items, total, index } = props;

  useEffect(() => {
    // setOffset(index);
  }, [index]);
  return (
    <div className={styles.past} onClick={() => events.emit('internal:togglePFmodal', {...props, game: 'jackpot'})} style={{
      '--avatar': `url(${winner?.avatar})`
    }}>
      {/* <img src={past} alt="" className={styles.bg} /> */}

      <div className={styles.flex}>
        <div className={styles.avatar} onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          events.emit('internal:toggleUserModal', winner);
        }}>
          <img src={winner?.avatar} loading="lazy" alt="" />
        </div>
        <div className={styles.text}>
          <p>
            <span className={styles.bold}>{winner?.name || '?'} </span>
            {/* <span> won with a </span> */}
            {/* <span className={styles.bold}>{parseFloat((winner?.chance || 1) * 100).toFixed(2)}%</span> */}
            {/* <span> chance!</span> */}
          </p>

          <div className={styles.descContainer}>
            {/* <div className={styles.desc}>
              <Gamepad />
              <p>Round <span>#{roundId}</span></p>
            </div>

            <div className={styles.desc}>
              <User style={{transform: 'translateY(1px)'}} />
              <p><span>{players.length}</span></p>
            </div> */}

            <div className={styles.desc}>
              <TimeFive />
              <p>{timeSince(timeRolled)}</p>
            </div>
          </div>
        </div>

        <div className={styles.coin}>
          <img src={coin} alt="" />
          <p>{helpers.formatBalance(total)}</p>
        </div>
      </div>

      <div className={styles.summary}>
        <div>
          <User style={{transform: 'translateY(-1px)'}} />
          <p>{players.length}</p>
        </div>

        <div>
          <Gun style={{transform: 'translateY(-1px)'}} />
          <p>{items.length}</p>
        </div>

        <div>
          <TimeFive style={{transform: 'translateY(-1px)'}} />
          <p>{parseFloat((winner?.chance || 1) * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};


const WinBox = () => {
  const [offerId, setOfferId] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const onData = data => {
    console.log("\n\n\n\n\n\n\n\n", data);
    if(data.action === 'winnings-sent') {
      setOfferId(data['winnings-sent']);
    } else {
      setError(data?.error || data['winnings-sent-error']);
      setOfferId(-2);
    }
  }
  
  const onWinner = data => {
    const self = window?.insolve?.user?.get('id');

    if(data?.winner?.id === self) {
      const tmt = setTimeout(() => {
        setVisible(true);
      }, 6000 + 600);
    }
  }

  useEffect(() => {
    events.on('jackpot-win', onData);
    events.on('tf2_jackpot:winner', onWinner);

    return () => {
      events.off('jackpot-win:winnings-sent', onData);
      events.off('jackpot-win', onData);
      events.off('tf2_jackpot:winner', onWinner);

      // clearTimeout(tmt);
    }
  }, []);

  return !visible ? null : (
    <div className={styles.winBox}>
      <div className={styles.left2}>
        <h3>You win this round!</h3>
        <p>Congratulations! The trade offer with your items will be sent shortly.</p>

        {error !== '' && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.right2}>
        <Button variant={offerId === -2 ? 'danger' : 'theme'} type="external" newTab shiny={offerId !== -2} href={`https://steamcommunity.com/tradeoffer/${offerId}`} onClick={() => setVisible(false)} disabled={offerId === -1 || offerId === -2}>
          {offerId !== -1 ? (
            offerId === -2 ? (
              <>
                <Error />
                <span>Error</span>
              </>
            ) : (
              <>
                <Steam />
                <span>Open trade offer</span>
              </>
            )
          ) : (
            <>
              <LoadingSimple />
              <span>Loading...</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


/*
const GET_PLAYERS = () => {
  // return [
  //   {id: 'id1', steamid: 'id1', name: 'xx', color: '#ff0000', avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg'},
  //   {id: 'id2', steamid: 'id2', name: 'xx', color: '#00ff00', avatar: 'https://avatars.akamai.steamstatic.com/11040c92ab051559710c68029bff6b2a61f7bdbd_full.jpg'}
  // ]
  // return [
    // {"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","badge":"YOUTUBER","badge_color":"#df4343","badge_text_color":"white","banned":false,"chance":.5,"color":"#4db3ef","exp":16665.64,"expForCurrLevel":16250,"expForNextLevel":17550,"id":"iid1","joinDate":1651600201,"level":26,"levelCompletion":31.97230769230765,"name":"hxtnv.","rank":"4","steamid":"id1","tickets":[1,50000],"total":14.189999999999998},
    // {"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","badge":"YOUTUBER","badge_color":"#df4343","badge_text_color":"white","banned":false,"chance":.5,"color":"#ff0000","exp":16665.64,"expForCurrLevel":16250,"expForNextLevel":17550,"id":"iid2","joinDate":1651600201,"level":26,"levelCompletion":31.97230769230765,"name":"hxtnv.222","rank":"4","steamid":"id2","tickets":[1,50000],"total":14.189999999999998}
  // ]

  return [{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","badge":"YOUTUBER","badge_color":"#df4343","badge_text_color":"white","banned":false,"chance":0.75,"color":"#4db3ef","exp":16665.64,"expForCurrLevel":16250,"expForNextLevel":17550,"id":"id1","joinDate":1651600201,"level":26,"levelCompletion":31.97230769230765,"name":"hxtnv.","rank":"4","steamid":"id1","tickets":[1,75001],"total":14.189999999999998},{"avatar":"https://i.imgur.com/6sXcS9I.jpg","banned":false,"chance":0.25,"color":"#8f54dd","exp":"9999","expForCurrLevel":9500,"expForNextLevel":10500,"id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","joinDate":1673127383,"level":20,"levelCompletion":49.9,"name":"hxtnv.","rank":4,"steamid":"0","tickets":[75002,100000],"total":4.7299999999999995}];
}


const GET_ITEMS = () => {
  // return [
    //   {name: 'xx', price: 1, owner: {id: 'iid1', steamid: 'iid1', name: 'xxxx'}},
  //   {name: 'xx', price: 1, owner: {id: 'iid2', steamid: 'iid2', name: 'xxxx'}},
  //   {name: 'xx', price: 1, owner: {id: 'iid2', steamid: 'iid2', name: 'xxxx'}}
  // ]
  return [{"amount":1,"appid":"440","assetid":"11799455959","classid":"237182231","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i1Mv6NGucF1dkw5pJQ2248kFAqMraxMzE-c1HBUKNbDqBioA64DH9kv5JgVtbmor5IOVK4z5i9Hes","name":"Reinforced Robot Emotion Detector","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"id1","name":"hxtnv.","price":5},"price":5},{"amount":1,"appid":"440","assetid":"12170061242","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"10034854916","classid":"3051917503","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDbQsdUgznvTYR2Jm-MvGNG-U_l9sn4pUbim88kgAtY-XnNWdiJFKTAqUIWaFsoVC7DH4xvsQ6BtW0ou1VLQi5vZyGbedz97Kp4g","name":"Violet Vermin Case","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.24},"price":0.24},{"amount":1,"appid":"440","assetid":"11955135786","classid":"237182229","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i-Mv6NGucF1YxmtZYCizNvxgd_NbWwZjZhcVWSA_AOWPRtrFC7UCVj6Z4zANG3r-tIOVK4uvXQm80","name":"Battle-Worn Robot Money Furnace","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.04},"price":0.04},{"amount":1,"appid":"440","assetid":"12170061536","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"12181252099","classid":"4585824989","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDewlDDUmzhztMhdjzGeCDBt8Mmsgy4N5QgDAyk1ErZeezZDUxIFWRUKEOD6VirVq0WiMxupUwUISypr0HcATsqsKYZGT-UoFl","name":"Computron 5000","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.14},"price":0.14},{"amount":1,"appid":"440","assetid":"11799455959","classid":"237182231","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i1Mv6NGucF1dkw5pJQ2248kFAqMraxMzE-c1HBUKNbDqBioA64DH9kv5JgVtbmor5IOVK4z5i9Hes","name":"Reinforced Robot Emotion Detector","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.03},"price":0.03},{"amount":1,"appid":"440","assetid":"12170061242","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"10034854916","classid":"3051917503","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDbQsdUgznvTYR2Jm-MvGNG-U_l9sn4pUbim88kgAtY-XnNWdiJFKTAqUIWaFsoVC7DH4xvsQ6BtW0ou1VLQi5vZyGbedz97Kp4g","name":"Violet Vermin Case","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.24},"price":0.24},{"amount":1,"appid":"440","assetid":"11955135786","classid":"237182229","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i-Mv6NGucF1YxmtZYCizNvxgd_NbWwZjZhcVWSA_AOWPRtrFC7UCVj6Z4zANG3r-tIOVK4uvXQm80","name":"Battle-Worn Robot Money Furnace","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.04},"price":0.04},{"amount":1,"appid":"440","assetid":"12170061536","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"12181252099","classid":"4585824989","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDewlDDUmzhztMhdjzGeCDBt8Mmsgy4N5QgDAyk1ErZeezZDUxIFWRUKEOD6VirVq0WiMxupUwUISypr0HcATsqsKYZGT-UoFl","name":"Computron 5000","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.14},"price":0.14},{"amount":1,"appid":"440","assetid":"11799455959","classid":"237182231","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i1Mv6NGucF1dkw5pJQ2248kFAqMraxMzE-c1HBUKNbDqBioA64DH9kv5JgVtbmor5IOVK4z5i9Hes","name":"Reinforced Robot Emotion Detector","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.03},"price":0.03},{"amount":1,"appid":"440","assetid":"12170061242","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"10034854916","classid":"3051917503","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDbQsdUgznvTYR2Jm-MvGNG-U_l9sn4pUbim88kgAtY-XnNWdiJFKTAqUIWaFsoVC7DH4xvsQ6BtW0ou1VLQi5vZyGbedz97Kp4g","name":"Violet Vermin Case","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.24},"price":0.24},{"amount":1,"appid":"440","assetid":"11955135786","classid":"237182229","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i-Mv6NGucF1YxmtZYCizNvxgd_NbWwZjZhcVWSA_AOWPRtrFC7UCVj6Z4zANG3r-tIOVK4uvXQm80","name":"Battle-Worn Robot Money Furnace","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.04},"price":0.04},{"amount":1,"appid":"440","assetid":"12170061536","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"12181252099","classid":"4585824989","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDewlDDUmzhztMhdjzGeCDBt8Mmsgy4N5QgDAyk1ErZeezZDUxIFWRUKEOD6VirVq0WiMxupUwUISypr0HcATsqsKYZGT-UoFl","name":"Computron 5000","owner":{"avatar":"https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.14},"price":0.14},{"amount":1,"appid":"440","assetid":"11799455959","classid":"237182231","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i1Mv6NGucF1dkw5pJQ2248kFAqMraxMzE-c1HBUKNbDqBioA64DH9kv5JgVtbmor5IOVK4z5i9Hes","name":"Reinforced Robot Emotion Detector","owner":{"avatar":"https://i.imgur.com/6sXcS9I.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.03},"price":0.03},{"amount":1,"appid":"440","assetid":"12170061242","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://i.imgur.com/6sXcS9I.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"10034854916","classid":"3051917503","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDbQsdUgznvTYR2Jm-MvGNG-U_l9sn4pUbim88kgAtY-XnNWdiJFKTAqUIWaFsoVC7DH4xvsQ6BtW0ou1VLQi5vZyGbedz97Kp4g","name":"Violet Vermin Case","owner":{"avatar":"https://i.imgur.com/6sXcS9I.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.24},"price":0.24},{"amount":1,"appid":"440","assetid":"11955135786","classid":"237182229","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEGegouTxTgsSxQt5i-Mv6NGucF1YxmtZYCizNvxgd_NbWwZjZhcVWSA_AOWPRtrFC7UCVj6Z4zANG3r-tIOVK4uvXQm80","name":"Battle-Worn Robot Money Furnace","owner":{"avatar":"https://i.imgur.com/6sXcS9I.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.04},"price":0.04},{"amount":1,"appid":"440","assetid":"12170061536","classid":"101785959","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","name":"Mann Co. Supply Crate Key","owner":{"avatar":"https://i.imgur.com/6sXcS9I.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":2.14},"price":2.14},{"amount":1,"appid":"440","assetid":"12181252099","classid":"4585824989","contextid":"2","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDewlDDUmzhztMhdjzGeCDBt8Mmsgy4N5QgDAyk1ErZeezZDUxIFWRUKEOD6VirVq0WiMxupUwUISypr0HcATsqsKYZGT-UoFl","name":"Computron 5000","owner":{"avatar":"https://i.imgur.com/6sXcS9I.jpg","id":"f1c67fb4-cbc8-4479-b4d3-d5fc521b4751","name":"hxtnv.","price":0.14},"price":0.14}]
}

*/

function addCirclePosToList(players, items2) {
  console.log('addCirclePosToList');
  console.log('players', players);
  console.log('items2', items2);
  items2 = items2.filter(x => !x.steamid);
  // const totalBank2 = items2.reduce((a, b) => +a + +b.price, 0);
  const totalBank2 = helpers.sum(items2, 'price');

  players.map((player, key) => {
    const prevPlayer = players[key - 1];
    // player.total = (items2.filter(x => x.owner?.id === player.id).reduce((a, b) => +a + +b.price, 0) / totalBank2) || 0;
    const playerTotal = helpers.sum(items2.filter(x => x.owner?.id === player?.id) || [], 'price');
    player.total = playerTotal;
    player.chance = playerTotal / totalBank2;
    
    // todo: this can probably be simplified
    if(prevPlayer) {
      player.start = parseFloat(prevPlayer.end);
      player.end = (360 * player.chance) + player.start;
      player.center = player.start + ((player.end - player.start) / 2);
    } else {
      player.start = 0;
      player.end = 360 * player.chance;
      player.center = (player.end - player.start) / 2;
    }

    return {...player};
  });

  return [...players];
}

const Jackpot = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [activePlayer, setActivePlayer] = useState(-1);
  // const [players, setPlayers] = useState( addCirclePosToList(GET_PLAYERS(), GET_ITEMS()) );
  // const [items, setItems] = useState( GET_ITEMS() );
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [roundId, setRoundId] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [rotation, setRotation] = useState(0); // for circle
  const [rollPhase, setRollPhase] = useState(0); // 0 = waiting, 1 = rolling winner, 2 = correction to center
  const [pastGames, setPastGames] = useState([]);
  const [publicServerHash, setPublicServerHash] = useState('-');
  const [internalCounter, setInternalCounter] = useState(0);

  const ref = useRef(null);
  const totalBank = items.reduce((a, b) => +a + +b.price, 0);
  let timeout;

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
      // setSize([window.innerWidth, window.innerHeight]);
    }
    
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);

  }, []);

  const joinGame = () => {
    events.emit('internal:toggleTransactionModal', {game: 'jackpot'});
  }

  const roll = (index = 1, random = 0.5) => {
    console.log(`roll to ${index} with offset ${random}`);
    clearTimeout(timeout);
    setRollPhase(1);

    if(index === -1) {
      console.warn(`Trying to roll negative index! This is a no-op - setting index to 0`);
      index = 0;
    }

    const iterations = 5 + internalCounter;

    const diff = (players[index]?.end || 0) - (players[index]?.start || 0);
    const num = (players[index]?.start || 0) + (diff * random);

    console.log(`Current rotation is ${rotation}, we will change it to ${(180 - num) + (360 * iterations)}`);
    console.log('players', players);

    setActivePlayer(-1);
    setRotation((180 - num) + (360 * iterations));
    setInternalCounter(prev => prev + 5);

    timeout = setTimeout(() => {
      console.log('2nd phase of animation, setting rotation to', (180 - players[index]?.center) + (360 * iterations))
      setActivePlayer(index);
      setRollPhase(2);
      setRotation((180 - players[index]?.center) + (360 * iterations));

      // debug - to be removed
      /*
      setTimeout(() => {
        setPlayers([]);
        setItems([]);
        setRoundId(prev => prev + 1);
        setRollPhase(0);
        setActivePlayer(-1);
      }, 4000);
      */
    }, 6000 + 600);
  }

  const onNewPlayer = data => {
    console.log('onNewPlayer', data);
    data.items = data.items.map(y => ({...y, owner: data.player}));
    setItems(prevItems => {
      setPlayers(prevPlayers => {
        if(prevPlayers.filter(p => p.steamid === data.player?.steamid).length > 0) {
          prevPlayers.map(p => {
            if(p.steamid === data.player?.steamid) {
              p.total += parseFloat(data?.sum || 0);
            }

            return p;
          });

          return [...prevPlayers];
        } else {
          return addCirclePosToList([...prevPlayers, data.player], [...prevItems, ...data.items]);
        }
      });

      return [...prevItems, ...data.items];
    });

    
  }

  const onWinner = data => {
    console.log('onWinner', data, players);
    const index1 = players.map(player => player.id).indexOf(data.winner.id);
    let index2 = 0;

    players.forEach((player, key) => {
      if(player.steamid === data.winner.steamid || data.id === data.winner.id) {
        index2 = key;
      }
    });

    roll(index2, data.random);
  }

  const onTimer = data => {
    setCurrentTime(data.current);
    setTotalTime(data.total);
  }

  const onInit = data => {
    tf2_jackpot.getPastGames().then(setPastGames);

    setPlayers(addCirclePosToList(data.players, data.items));
    setItems(data.items);
    setRoundId(data.roundId);
    setCurrentTime(data.timeCurrent);
    setTotalTime(data.timeTotal);
    setPublicServerHash(data.publicServerHash);

    setActivePlayer(-1);
    setRotation(0);
    setRollPhase(0);
    
  }

  // idle animation
  /*
  useEffect(() => {
    clearInterval(animInterval);

    if(rollPhase !== 0) {
      return;
    }

    setRotation(prev => prev + 360);

    animInterval = setInterval(() => {
      setRotation(prev => prev + 360);
    }, 80 * 1000);
  }, [rollPhase]);
  */

  // on load
  useEffect(() => {
    events.on('tf2_jackpot:newPlayer', onNewPlayer);
    events.on('tf2_jackpot:winner', onWinner);
    events.on('tf2_jackpot:timer', onTimer);
    events.on('tf2_jackpot:init', onInit);

    return () => {
      events.off('tf2_jackpot:newPlayer', onNewPlayer);
      events.off('tf2_jackpot:winner', onWinner);
      events.off('tf2_jackpot:timer', onTimer);
      events.off('tf2_jackpot:init', onInit);
    }
  }, [players, items, onNewPlayer, onWinner, onTimer, onInit]);

  // join/leave
  useEffect(() => {
    tf2_jackpot.join();

    // tf2_jackpot.getPastGames().then(setPastGames);

    return () => tf2_jackpot.leave();
  }, []);

  return (
    <div className={styles.jackpot} data-players={players.length}>
      <div className={styles.itemsTop}>
        <ScrollingContainer height="67px" speed={200}>
          {items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).map((item, key) => (
              <Item {...item} key={key} />
          ))}
        </ScrollingContainer>
      </div>
      
      {/* style={{transform: 'translate(100px, 280px) scale(0.7)'}} */}
      <div className={styles.left} ref={ref}>
        <Circle
          players={players}
          parentWidth={width}
          activePlayer={activePlayer}
          setActivePlayer={rollPhase === 0 ? setActivePlayer : () => {}}
          time={currentTime}
          totalBank={totalBank}
          items={items}
          rotation={rotation}
          rollPhase={rollPhase}
        />

        {/* items */}
        <div className={styles.content}>
          {/* <p className={styles.title}>Items in current game</p> */}
          

        </div>
      </div>



      <div className={styles.right}>
        <WinBox />
        
        <div className={styles.rc}>
          {/* current value */}
          <div className={styles.value} style={{background: `url(${bank})`}}>
            <div>
              <p>Current round value</p>
              <h4>
                <img src={coin} alt="" onClick={() => roll(-1, .1)} />
                <span>
                  {/* {helpers.formatBalance(totalBank)} */}
                  <CountUp end={totalBank} duration={1} decimals={2} separator=" " preserveValue={true} />
                </span>
              </h4>
            </div>
            
            <div className={styles.btns}>
              <Button variant="theme" type="button" shiny onClick={joinGame}>
                Join game
              </Button>

              <Button variant="primary" type="button" onClick={() => events.emit('internal:toggleGameInfoModal', 'jackpot')}>
                <QuestionCircle />
              </Button>
            </div>
          </div>

          
          <Round
            players={players}
            totalBank={totalBank}
            activePlayer={activePlayer}
            setActivePlayer={rollPhase === 0 ? setActivePlayer : () => {}}
            items={items}
            roundId={roundId}
            time={currentTime}
            totalTime={totalTime}
            publicServerHash={publicServerHash}
          />
        </div>
        {/* <p className={styles.sectionTitle} style={pastGames.length === 0 ? {opacity: 0} : null}>Previous games</p>
          
        <div className={styles.pastContainer}>
          {pastGames.map((game, key) => (
            <PastRound {...game} key={key} />
          ))}
        </div> */}
        {/* <Round players={players} totalBank={totalBank} activePlayer={activePlayer} setActivePlayer={rollPhase === 0 ? setActivePlayer : () => {}} /> */}
      </div>






      <div className={styles.full} style={pastGames.length === 0 ? {opacity: 0} : null}>
        <p className={styles.sectionTitle}>Previous games</p>
        {/* <Link to="/jackpot/history">View all</Link> */}
      </div>

      <div className={styles.pastContainer}>
        {pastGames.map((game, key) => (
          <PastRound {...game} key={key} />
        ))}
        {/* {pastGames.map((game, key) => (
          <PastRound {...game} key={key} />
        ))}
        {pastGames.map((game, key) => (
          <PastRound {...game} key={key} />
        ))} */}
      </div>

      <TransactionModal />
      <ProvablyFairModal />
      <GameInfoModal />
    </div>
  );
}

export default Jackpot;