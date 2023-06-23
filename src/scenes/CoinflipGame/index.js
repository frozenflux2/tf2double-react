import React, { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Button from "../../components/Button";
import { PlusOutline } from '@styled-icons/evaicons-outline/PlusOutline';
// import { Play } from '@styled-icons/ionicons-solid/Play';
// import { Eye } from '@styled-icons/ionicons-outline/Eye';
import { Trash } from 'styled-icons/fa-solid';
import { Warning } from '@styled-icons/ionicons-solid/Warning';
import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';
import { X } from '@styled-icons/fa-solid/X';
import { ShieldFillCheck } from '@styled-icons/bootstrap/ShieldFillCheck';
import coin from '../../resources/images/coin.png';
import coin1 from '../../resources/images/coin1.png';
import coin2 from '../../resources/images/coin2.png';
import unknown from '../../resources/images/unknown.png';
import TransactionModal from '../../components/TransactionModal';
import ProvablyFairModal from '../../components/ProvablyFairModal';
import UpdateEverySec from '../../components/UpdateEverySec';
import UpdateEverySec2 from '../../components/UpdateEverySec2';
import Item from '../../components/Item';
import Winbox from './winbox';
// import timeSince from '../../helpers/timeSince';
// import CoinflipModal from '../../components/CoinflipModal';
// import { connect } from 'react-context-global-store';
// import past from './resources/past.png';
// import bank from '../Jackpot/resources/bank2.png';

// import blue from './resources/blue-min.png';
// import red from './resources/red-min.png';

import styles from './index.module.css';
import styles2 from '../MinesGame/index.module.css';

import blue_webm from './resources/blue.webm';
import red_webm from './resources/red.webm';

// const COLORS = ['', '#9055ddb3', '#4db3efb3'];
// const COLORS = [
//   '#4db3ef',
//   '#8f54dd',
//   '#F22A82',
//   '#CA2E73',
//   '#FFDE6B',
//   '#F99423',
//   '#12cb5a',
//   '#04963d',
// ];
function Clip({ url, play = false }) {
  const videoRef = React.useRef();

  useEffect(() => {    
    videoRef.current?.load();
    // console.log('play because url change');
    // videoRef.current?.play();
  }, [url]);

  useEffect(() => {
    if(play) {
      console.log('play because play change');
      videoRef.current?.play();
    }
  }, [play]);

  return (
    <video ref={videoRef} className={styles.coin}>
      <source src={url} />
      Video tag is unsupported! To see the animation please update your browser.
    </video>
  );
}


// status 0 = waiting for someone to join, 1 = waiting for player2 to accept offer, 2 = countdown to coinflip, 3 = over
const STATUSES = {
  0: 'Waiting for someone to join',
  1: 'Waiting for player to accept the trade offer',
  2: 'Countdown',
  3: 'Game over'
};
const ANIM_TIME = 4; // in seconds, TODO: if this changes it should also change on server

// const sum = (arr, key) => arr.reduce((a, b) => +a + +b[key], 0);
const { helpers, tf2_coinflip, events, user, store } = window.insolve;

const Player = (props) => {
  const { avatar, name, items, side = 1, sum, is2, createGame, p1_steamid } = props;
  const self = user.get();

  return (
    <>
      <div className={styles.player} data-side={side} data-isplayer={!!name} style={{'--avatar': `url(${avatar || unknown})`}}>
        <img className={styles.avatar} src={avatar || unknown} alt="" onClick={() => events.emit('internal:toggleUserModal', props?.id ? props : undefined)} />
        <p>{name || 'Waiting for player...'}</p>

        <p className={styles.price}>
          <img src={coin} alt="" />
          <span>{helpers.formatBalance( sum )}</span>
        </p>

        <img src={side === 1 ? coin1 : coin2} alt="" className={styles.coin} />

        <div className={styles.border} />
      </div>


      {/* join button */}
      {(is2 && !avatar && self?.steamid !== p1_steamid) && (
        <Button variant="theme" type="button" shiny onClick={createGame} className={styles.playerbutton}>
          <PlusOutline />
          <span>Join this game</span>
        </Button>
      )}

      {items.length > 0 && (
        <>
          <p className={styles.itemsTitle}>Total of {items.length} item{items.length !== 1 ? 's' : ''}</p>
          <div className={styles.items}>
            {items.sort((a,b) => b.price - a.price).map((item, key) => <Item key={key} item={item} isGame={true} select={() => {}} />)}
          </div>
        </>
      )}
    </>
  );
};




const CoinflipGame = ({ id }) => {
  // const { id } = useParams();
  const [data, setData] = useState(store.get('tf2_cf_current'));
  const [circle, setCircle] = useState([0, 0]);
  const [error, setError] = useState('');
  const [anim, setAnim] = useState(false);
  const [animOver, setAnimOver] = useState(false);

  let interval;
  const self = window.insolve.user.get();

  const createGame = () => {
    events.emit('internal:toggleTransactionModal', {game: 'coinflip', id});
  };

  const onGameUpdated = d => {
    if(d?.id !== data?.id) return;

    setData(g => {
      // g = {...g, ...data};
      g.status = d?.status;
      g.player2 = d?.player2;
      g.player2_items = d?.player2_items;
      g.player2_side = d?.player2_side;
      g.TIME_TO_JOIN = d?.TIME_TO_JOIN;
      g.timeUpdated = d?.timeUpdated;
      g.value = d?.value;
      g.winner = d?.winner;
      g.winnerNum = d?.winnerNum;

      return {...g};
    });
  }

  const updateCircleTimer = () => {
    if(data?.status !== 1) {
      return clearInterval(interval);
    }

    const now = Math.round(+new Date() / 1000);
    const timeOverAt = (data?.timeUpdated || 0) + (data?.TIME_TO_JOIN || 0); // todo: replace now and 120
    const time = timeOverAt - now >= 0 ? timeOverAt - now : 0; 

    setCircle([
      time,
      data?.TIME_TO_JOIN - time
    ]);

    if(time <= 0) {
      return clearInterval(interval);
    }
  }

  const cancelGame = () => {
    if(window.confirm(`This action will remove your game from the site and send back your items. Are you sure you want to do it?`)) {
      tf2_coinflip.cancelGame(data?.id);
    }
  }

  const onCancelGameCallback = ({ err, id, offerId }) => {
    if(err) {
      return window.alert(`Failed to cancel your game (${err.toString()})`);
    }

    window.alert(`Your game has been cancelled, the trade offer link is https://steamcommunity.com/tradeoffer/${offerId}`);
  }

  // const play = color => {
    // if(!animRef?.current) return console.log(`Fatar error! Ref for video element was not found`);

    // animRef?.current?.setAttribute('src', 'red'); // todo
    // animRef?.current.play();
    // setAnim(prev => !prev);
  // }

  
  const p1_sum = helpers.sum(data?.player1_items || [], 'price');
  const p2_sum = helpers.sum(data?.player2_items || [], 'price');
  const total = p1_sum + p2_sum;
  const p1_chance = data?.player2 ? parseFloat( (p1_sum / total) * 100 ).toFixed(2) : 50;
  const p2_chance = data?.player2 ? parseFloat( (p2_sum / total) * 100 ).toFixed(2) : 50;

  // the middle circle values, they can change depending on status
  /*
  let circle = [parseFloat(p1_chance), parseFloat(p2_chance)];

  if(data?.status === 1) { // waiting for player
    const now = Math.round(+new Date() / 1000);
    const timeOverAt = (data?.timeUpdated || 0) + (data?.TIME_TO_JOIN || 0); // todo: replace now and 120
    const time = timeOverAt - now >= 0 ? timeOverAt - now : 0; 

    circle = [
      time,
      data?.TIME_TO_JOIN - time
    ];
  }
  */
  // circle
  useEffect(() => {
    clearInterval(interval);

    if([0,2,3].includes(data?.status)) {
      setCircle([parseFloat(p1_chance), parseFloat(p2_chance)]);
    } else if(data?.status === 1) {
      updateCircleTimer();
      interval = setInterval(updateCircleTimer, 1000);
    }
  }, [data]);

  // play animation
  useEffect(() => {
    let tmt;

    if(data?.status === 3 && !anim) {
      console.log("ANIMATION!!!!\n\n\n");
      setAnim(true);

      tmt = setTimeout(() => setAnimOver(true), 3200); // anim length is in css
    }

    return () => clearTimeout(tmt);
  }, [data]);

  // on load
  useEffect(() => {
    store.delete('tf2_cf_current');
    tf2_coinflip.getGame(id).then(setData).catch(setError);
    tf2_coinflip.join();

    return () => {
      tf2_coinflip.leave();
    }
  }, []);

  useEffect(() => {
    events.on('tf2_coinflip:gameUpdated', onGameUpdated);
    events.on('tf2_coinflip:cancelGameCallback', onCancelGameCallback);

    return () => {
      events.off('tf2_coinflip:gameUpdated', onGameUpdated);
      events.off('tf2_coinflip:cancelGameCallback', onCancelGameCallback);
    }
  }, [data]);

  // const winnerSide = data?.winnerNum !== undefined ? (
  //   data?.winnerNum === 0 ? data?.player1_side : data?.player2_side
  // ) : -1;

  // console.log(`winnerSide`, winnerSide, data?.player1_side, data?.player2_side, data?.winnerNum);

  return (
    <div className={styles.game} data-status={data?.status || 0} data-animover={animOver} data-winner={data?.winnerNum !== undefined ? data?.winnerNum : null}>
      <Winbox data={data} ANIM_TIME={ANIM_TIME} />
      
      {error !== '' && (
        <div className={styles.error}>
          <Warning />
          <div>
            <h4>An error occured</h4>
            <p>{error.toString()}</p>
          </div>
        </div>
      )}

      <div className={styles2.nav}>
        <Link to="/coinflip" className={styles2.link} onClick={e => {
          e.preventDefault();
          events.emit('internal:toggleCfModal', undefined);
        }}>
          {/* <ChevronLeft /> */}
          <X style={{height: '14px'}} />
        </Link>

        <div>
          <p onClick={() => setAnim(prev => !prev)}>Coinflip <span>#{data?.aid || 0}</span></p>
          <span className={styles2.time}>
            <UpdateEverySec2 value={data?.timeCreated} />
          </span>
        </div>

        <div className={styles2.right}>
          <div className={styles2.status}>{STATUSES[data?.status]}</div>
          <div className={styles2.btns}>
            {(( self?.steamid === data?.player1?.steamid || parseInt(self?.rank) >= 2 ) && data?.status === 0 ) && (
              <button className={styles2.link} onClick={cancelGame}>
                <Trash style={{color: 'var(--roulette-red-single)'}} />
              </button>
            )}

            <button className={styles2.link} onClick={() => events.emit('internal:togglePFmodal', {...data, game: 'coinflip'})}>
              <ShieldFillCheck style={{color: 'var(--roulette-green-single)'}} />
            </button>
          </div>
          
        </div>
      </div>

      {/* chart */}
      <div className={styles.chart} data-anim={anim ? true : null}>
        <p>{parseFloat(p1_chance).toFixed(2)}%</p>

        <PieChart
          data={[
            { title: 'One', value: circle[0], color: data?.player1_side === 1 ? '#4db3ef' : '#752bd5' },
            { title: 'Two', value: circle[1], color: data?.player1_side === 1 ? '#752bd5' : '#4db3ef' },
          ]}
          lineWidth={6}
          startAngle={50 + 90}
          lengthAngle={260}
          animate={true}
          animationDuration={300}
        />

        <p>{parseFloat(p2_chance).toFixed(2)}%</p>

        {/* here be coin animation */}
        <Clip url={data?.winnerNum === 'p1' ? (
          data?.player1_side === 1 ? blue_webm : red_webm
        ) : (
          data?.player2_side === 1 ? blue_webm : red_webm
        )} play={anim} />
        {/* <div style={{background: `url(${winnerSide === 1 ? blue : red})`}} className={styles.coin} /> */}
        {/* <div className={styles.blast} /> */}
      </div>

      {/* timer */}
      <div className={styles.timer} style={[0,3].includes(data?.status) ? null : {opacity: 1}}>
        <p><UpdateEverySec timeUpdated={data?.timeUpdated} TIME_TO_JOIN={data?.TIME_TO_JOIN} /></p>
      </div>


      {/* players */}
      <div className={styles.players}>
        <div className={styles.left}>
          <Player createGame={createGame} items={data?.player1_items || []} sum={p1_sum} side={data?.player1_side || 1} {...data?.player1 || {}} />
        </div>

        <div className={styles.right}>
          <Player createGame={createGame} p1_steamid={data?.player1?.steamid} items={data?.player2 ? data?.player2_items || [] : []} sum={p2_sum} side={data?.player1_side === 1 ? 2 : 1} {...data?.player2 || {}} is2 />
        </div>
      </div>

      {/* <TransactionModal /> */}
      {/* <ProvablyFairModal /> */}

      {/* load so they are cached for when the animation should play */}
      <div style={{display: 'none'}}>
        <video style={{display: 'none'}}>
          <source src={blue_webm} type="video/webm" />
        </video>

        <video style={{display: 'none'}}>
          <source src={red_webm} type="video/webm" />
        </video>
      </div>
    </div>
  );
}

export default CoinflipGame;