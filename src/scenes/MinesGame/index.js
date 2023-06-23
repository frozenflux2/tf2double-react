import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Button from "../../components/Button";
import { PlusOutline } from '@styled-icons/evaicons-outline/PlusOutline';
import { Bomb } from '@styled-icons/boxicons-regular/Bomb';
import { Check2 } from '@styled-icons/bootstrap/Check2';
import { Trash } from 'styled-icons/fa-solid';
import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';
import { ShieldFillCheck } from '@styled-icons/bootstrap/ShieldFillCheck';
import { QuestionMarkOutline } from '@styled-icons/evaicons-outline/QuestionMarkOutline';
import { ArrowheadDownOutline } from '@styled-icons/evaicons-outline/ArrowheadDownOutline';
import { Block } from 'styled-icons/boxicons-regular';
import coin from '../../resources/images/coin.png';
import TransactionModal from '../../components/TransactionModal';
import ProvablyFairModal from '../../components/ProvablyFairModal';
import UpdateEverySec from '../../components/UpdateEverySec';
import UpdateEverySec2 from '../../components/UpdateEverySec2';
import Winbox from './winbox';

import styles from './index.module.css';

import LoadingSimple from '../../components/LoadingSimple';

const { helpers, tf2_mines, events, user, store } = window.insolve;


const PLAYER_STATUS = {
  0: 'Alive',
  1: 'Dead',
  2: 'Winner',
  3: 'Waiting' // this should be index 0 but im too lazy to change it now
};

// game status: 0 = waiting for players, 1 = waiting for more players with a timer (60s), 2 = pre-game timer waiting for random.org (30s), 3 = in progress, 4 = over
const GAME_STATUS = {
  0: 'Waiting for players',
  1: 'Waiting for more players',
  2: 'Generating mines',
  3: 'In progress',
  4: 'Game over'
};

const MAX_PLAYERS = 4;

const Nav = (props) => {
  const { aid, status, timeCreated, timeUpdated, TIME_TO_JOIN } = props;

  return (
    <div className={styles.nav}>
      <Link to="/mines" className={styles.link}>
        <ChevronLeft />
      </Link>

      <div>
        <p>Mines <span>#{aid || 0}</span></p>
        <span className={styles.time}>
          <UpdateEverySec2 value={timeCreated} />
        </span>
      </div>

      <div className={styles.right}>
        <div className={styles.status}>
          {GAME_STATUS[status]}
          {[1,2].includes(status) && (
            <span style={{marginLeft: '4px'}}>
               &#40;<UpdateEverySec timeUpdated={timeUpdated} TIME_TO_JOIN={TIME_TO_JOIN} onlySeconds />&#41;
            </span>
          )}
        </div>

        <button className={styles.link} onClick={props.cancelGame}>
          <Trash style={{color: 'var(--roulette-red-single)'}} />
        </button>

        <button className={styles.link} onClick={() => events.emit('internal:togglePFmodal', {...props, game: 'mines'})}>
          <ShieldFillCheck style={{color: 'var(--roulette-green-single)'}} />
        </button>
      </div>
    </div>
  );
}

// mine status, 0 = not open, 1 = good, 2 = bad

const Mine = ({ status, index, id, myTurn }) => {
  // todo: if its not your turn or game didnt start yet show cursor not-allowed
  const getInitialAnimFromStatus = s => {
    return s === 0 ? 0 : 2;
  }

  const [anim, setAnim] = useState( getInitialAnimFromStatus(status) );
  

  const open = () => {
    if(anim !== 0 || !myTurn) return;

    tf2_mines.pickMine(id, index);
    setAnim(1);
  }

  // todo: dont use useffect, wait for server to respond
  /*useEffect(() => {
    if(anim !== 1) return;

    timeout = setTimeout(() => {
      setAnim(2);
    }, 1 * 1000);

    return () => clearTimeout(timeout);
  }, [anim]);*/

  // look for changes in minesPublic
  useEffect(() => {
    console.log(`status changed to ${status}`);
    setAnim(getInitialAnimFromStatus(status));
  }, [status]);

  return (
    <div
      className={styles.mine}
      data-status={status}
      data-anim={anim || null}
      onClick={open}
    >
      {/* {status === 0 && <QuestionMarkOutline />}
      {status === 1 && <Check2 />}
      {status === 2 && <Bomb />} */}
      <QuestionMarkOutline className={styles.q} />
      <div className={styles.l}><LoadingSimple /></div>
      <div className={styles.r}>
        {status === 1 && <Check2 />}
        {status === 2 && <Bomb />}
      </div>
    </div>
  );
}

const Mines = ({ minesPublic = [], mines = [], players = [], createGame, status, id, turn }) => {
  // minesPublic = [0,0,1,-1,0,-1,-1,-1,-1,0];
  // const [mines, setMines] = useState([]);

  const translateStatus = s => {
    if(s === 0) return 1;
    else if(s === 1) return 2;

    return 0;
  }

  // minesPublic = mines; // debug
  if(status === 4) {
    minesPublic = mines;
  }

  // const debugMines = () => {
    // setMines([0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0]);
    // setMines([-1,-1,0]);
  // }

  const self = user.get();
  const turnPlayer = players[turn];
  const myTurn = status === 3 ? self?.steamid === turnPlayer?.steamid : false;
  const amIinTheGame = players.map(x => x.steamid).includes(self?.steamid);

  return (
    <div className={styles.mines} data-status={status} data-myturn={myTurn} data-amiinthegame={amIinTheGame}>
      {/* <p onClick={debugMines}>aaaaaaaaaaaaaa</p> */}

      <div className={styles.wrapper}>
        {[...Array(36)].map((x, key) => <Mine key={key} id={id} myTurn={myTurn} status={translateStatus(minesPublic[key])} index={key} />)}
      
        {/* play game overlay */}
        {!amIinTheGame && (
          <div className={styles.overlay}>
            <h3>This game is open!</h3>
            <p>Up to {MAX_PLAYERS - players.length} players can still join it. Be one of them and test your luck!</p>

            <Button variant="theme" type="button" shiny onClick={createGame} className={styles.playerbutton}>
              <PlusOutline />
              <span>Join this game</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Player = (props) => {
  const { avatar, name, status, time, TIME_TO_JOIN, timeUpdated, turn, index, gameStatus } = props;

  return (
    <div className={styles.player} data-empty={!avatar} data-status={status} data-myturn={turn === index && gameStatus === 3} data-active={time !== -1 && time !== null && time !== undefined}>
      {/* this is the arrow that shows when its ur turn */}
      {!!avatar && <ArrowheadDownOutline className={styles.arrow} />}
      
      {!!avatar ? <img src={avatar} alt="" onClick={() => events.emit('internal:toggleUserModal', props)} /> : <Block />}
      
      <div>
        {!!avatar && <p>{name}</p>}
        <span>{!!avatar ? PLAYER_STATUS[status] : 'empty'}</span>
      </div>

      {(!!avatar && ( (time !== -1 && time !== undefined) || status === 3 || (turn === index && gameStatus === 3) )) && (
        <div className={styles.time}>
          <UpdateEverySec timeUpdated={timeUpdated} TIME_TO_JOIN={TIME_TO_JOIN} onlySeconds />
        </div>
      )}
      {/* {!!avatar && <div className={styles.status}>{time !== -1 ? time : null}</div>} */}
    </div>
  );
}

const Players = ({ players = [], turn, status }) => {
  return (
    <div className={styles.players}>
      {[...Array(4)].map((x, key) => (
        <Player {...players[key] || {}} key={key} index={key} turn={turn} gameStatus={status} />
      ))}
      {/* <Player status={1} name="hxtnv" avatar="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg" /> */}
      {/* <Player time={6} status={0} name="hxtnv" avatar="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg" /> */}
      {/* <Player status={0} name="hxtnv" avatar="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg" /> */}
    </div>
  );
};

const Summary = ({ players, value }) => (
  <div className={styles.summary}>
    <p>Total pot: <img src={coin} alt="" /> <span>{helpers.formatBalance(value)}</span></p>
    <p>Tiles: <span>{players ? 36 : '-'}</span></p>
    <p>Landmines: <span>{players ? 5 : '-'}</span></p>
  </div>
)

const MinesGame = () => {
  const { id } = useParams();
  const [data, setData] = useState(store.get('tf2_mines_current'));
  // const [error, setError] = useState('');

  const createGame = () => {
    events.emit('internal:toggleTransactionModal', {game: 'mines', id});
  };

  const onGameUpdated = d => {
    if(d?.id !== data?.id) return;

    setData(g => {
      // g = {...g, ...data};
      // todo
      g.status = d?.status;
      if(d?.players) g.players = d?.players;
      g.TIME_TO_JOIN = d?.TIME_TO_JOIN;
      g.timeUpdated = d?.timeUpdated;
      if(d?.value) g.value = d?.value;
      if(d?.turn !== undefined) g.turn = d?.turn;
      if(d?.mines) g.mines = d?.mines;
      if(d?.minesPublic) g.minesPublic = d?.minesPublic;
      // g.player2 = d?.player2;
      // g.player2_items = d?.player2_items;
      // g.player2_side = d?.player2_side;
      // g.TIME_TO_JOIN = d?.TIME_TO_JOIN;
      // g.timeUpdated = d?.timeUpdated;
      // g.value = d?.value;
      // g.winner = d?.winner;
      // g.winnerNum = d?.winnerNum;

      return {...g};
    });
  }

  const cancelGame = () => {
    if(window.confirm(`This action will remove your game from the site and send back your items. Are you sure you want to do it?`)) {
      tf2_mines.cancelGame(data?.id);
    }
  }

  const onCancelGameCallback = ({ err, id, offerId }) => {
    if(err) {
      return window.alert(`Failed to cancel your game (${err.toString()})`);
    }

    window.alert(`Your game has been cancelled, the trade offer link is https://steamcommunity.com/tradeoffer/${offerId}`);
  }

  // on load
  useEffect(() => {
    store.delete('tf2_mines_current');
    tf2_mines.getGame(id).then(setData).catch(console.error);
    tf2_mines.join();

    return () => {
      tf2_mines.leave();
    }
  }, []);

  useEffect(() => {
    events.on('tf2_mines:gameUpdated', onGameUpdated);
    events.on('tf2_mines:cancelGameCallback', onCancelGameCallback);

    return () => {
      events.off('tf2_mines:gameUpdated', onGameUpdated);
      events.off('tf2_mines:cancelGameCallback', onCancelGameCallback);
    }
  }, [data]);

  return (
    <div className={styles.lb}>
      <Winbox data={data} />

      <Nav {...data} cancelGame={cancelGame} />
      <Mines {...data} createGame={createGame} />
      <Players {...data} />
      <Summary {...data} />

      <TransactionModal />
      <ProvablyFairModal />
    </div>
  );
}

export default MinesGame;