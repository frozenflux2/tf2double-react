import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

import { PlusOutline } from '@styled-icons/evaicons-outline/PlusOutline';
import { Play } from '@styled-icons/ionicons-solid/Play';
import { Eye } from '@styled-icons/ionicons-outline/Eye';
import { QuestionCircle } from 'styled-icons/bootstrap';

import coin from '../../resources/images/coin.png';
import unknown from '../../resources/images/unknown.png';
import bank from '../Jackpot/resources/bank2.png';
import logo from '../../resources/images/logo.png';

import TransactionModal from '../../components/TransactionModal';
import ProvablyFairModal from '../../components/ProvablyFairModal';
import GameInfoModal from '../../components/GameInfoModal';
import CoinflipModal from '../../components/CoinflipModal';
import UpdateEverySec from '../../components/UpdateEverySec';
import LoadingSimple from '../../components/LoadingSimple';
import Button from "../../components/Button";

import styles from './index.module.css';



// const COLORS = ['', '#9055ddb3', '#4db3efb3'];
const COLORS = ['', '#4db3efb3', '#9055ddb3'];

const sum = (arr, key) => arr.reduce((a, b) => +a + +b[key], 0);
const { helpers, tf2_coinflip, events, user, store } = window.insolve;




const GameListed = (props) => {
  const { id, player1, player1_items, player1_side, player2, player2_items, maxDiff = 0, status = 0, winner, TIME_TO_JOIN, timeUpdated } = props;
  const items = [...(player1_items || []), ...(player2 ? player2_items || [] : [])];
  const msg = {
    0: null,
    1: <p>Waiting for <span>{player2?.name || '?'}</span>...</p>,
    2: <p>Countdown to flip...</p>,
    3: null
  };

  // const navigate = useNavigate();

  const openProfile = (e, data) => {
    e.stopPropagation();
    e.preventDefault();

    events.emit('internal:toggleUserModal', data);
  }

  const openGame = () => {
    store.set('tf2_cf_current', props);
    // navigate(`/coinflip/${id}`);
  }

  // debug
  // status = 1;
  // timeUpdated = Math.round(+new Date() / 1000) - 50;
  // end debug

  const value = player2 ? player1?.total + player2?.total : player1?.total;
  const self = user.get();
  
  


  

  // todo: show who won on past games

  return (
    <Link to={`/coinflip/${id}`} onClick={(e) => {
      e.preventDefault();
      events.emit('internal:toggleCfModal', id);
    }}>
      <div className={styles.row} data-status={status} onClick={openGame} style={
        ([player1?.steamid, player2?.steamid].includes(user.get('steamid')) && user.get('steamid') !== undefined) ? {
          border: '2px dashed var(--theme-color)'
      } : null}>
        {/* avatars */}
        <div className={styles.avatars}>
          <img style={{borderColor: COLORS[player1_side || 2]}} src={player1?.avatar || unknown} onClick={e => openProfile(e, player1)} alt="" />
          
          {status !== 0 && (<img style={{borderColor: COLORS[ player1_side === 1 ? 2 : 1 ]}} src={player2?.avatar || unknown} onClick={e => openProfile(e, player2)} alt="" />)}
          {status !== 0 && <p>vs</p>}
        </div>

        {/* items */}
        <div className={styles.items}>
          {items.sort((a,b) => b.value - a.value).map((item, key) => key > 2 ? null : (
            <div style={{'--color': item.color ? (item.color[0] === '#' ? item.color : `#${item.color}`) : 'var(--theme-color)'}} key={key}><img src={item.image} alt="" /></div>
          ))}

          {items.length > 3 && <div className={styles.plus}>+{items.length - 3}</div>}
        </div>
        
        {/* status */}
        <div className={styles.status}>
          <h3>{status === 0 ? '' : <UpdateEverySec timeUpdated={timeUpdated} TIME_TO_JOIN={TIME_TO_JOIN} />}</h3>
          {msg[status]}
        </div>

        {/* winner (shown only on status 3) */}
        {status === 3 && (
          <div className={styles.winner}>
            <img src={winner?.avatar} alt="" />
            <p>
              <span>{winner?.name || '?'}</span> won with a <span>{parseFloat(winner?.chance || 0).toFixed(2)}%</span> chance!
            </p>
          </div>
        )}
        
        {/* value */}
        <div className={styles.value}>
          <h3>
            <img src={coin} alt="" />
            {/* todo: add countup */}
            <span>{helpers.formatBalance(value)}</span>
          </h3>
          <p>
            {helpers.formatBalance(value * (1 - maxDiff))} - {helpers.formatBalance(value * (1 + maxDiff))}
          </p>
        </div>

        {/* action */}
        <div className={styles.actions}>
          <button>
            <Eye />
          </button>

          {self?.steamid !== player1?.steamid && (
            <button className={styles.play}>
              <Play />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

// status 0 = waiting for someone to join, 1 = waiting for player2 to accept offer, 2 = countdown to coinflip, 3 = over

const Coinflip = () => {
  const [games, setGames] = useState([]);

  const navigate = useNavigate();
  const createGame = () => {
    events.emit('internal:toggleTransactionModal', {game: 'coinflip'});
  };

  const onNewGame = data => {
    setGames(prev => [...prev, data]);

    if(data?.player1?.steamid === user.get('steamid')) {
      // navigate(`/coinflip/${data?.id}`);
      events.emit('internal:toggleCfModal', data?.id);
    }
  }

  const onGameUpdated = data => {
    setGames(prev => {
      prev.map(g => {
        if(g.id !== data?.id) return g;

        // g = {...g, ...data};
        g.status = data?.status;
        g.player2 = data?.player2;
        g.player2_items = data?.player2_items;
        g.player2_side = data?.player2_side;
        g.TIME_TO_JOIN = data?.TIME_TO_JOIN;
        g.timeUpdated = data?.timeUpdated;
        g.value = data?.value;

        return {...g};
      });

      return [...prev];
    });
  }

  // load games
  useEffect(() => {
    tf2_coinflip.getAllGames().then(setGames).catch(e => {});
    tf2_coinflip.join();

    events.on('tf2_coinflip:newGame', onNewGame);
    events.on('tf2_coinflip:gameUpdated', onGameUpdated);

    return () => {
      tf2_coinflip.leave();

      events.off('tf2_coinflip:newGame', onNewGame);
      events.off('tf2_coinflip:gameUpdated', onGameUpdated);
    }
  }, []);

  return (
    <div className={styles.cn}>
      <div className={styles.lb}>
        <div className={styles.stats} style={{background: `url(${bank})`}}>
            <div>
              <h3>{games.length}</h3>
              <p>Active game{games.length !== 1 ? 's' : ''}</p>
            </div>

            <div>
              <h3>
                <img src={coin} alt="" />
                {/* <span>{helpers.formatBalance( sum(games, 'value') )}</span> */}
                <span>
                  <CountUp end={sum(games, 'value')} duration={1} decimals={2} separator=" " preserveValue={true} />
                </span>
              </h3>

              <p>Value of games</p>
            </div>

            <div className={styles.join}>
              <Button variant="theme" type="button" shiny onClick={createGame}>
                <PlusOutline />
                <span>Create a game</span>
              </Button>

              <Button variant="primary" type="button" onClick={() => events.emit('internal:toggleGameInfoModal', 'coinflip')}>
                <QuestionCircle />
              </Button>
            </div>
        </div>

        <h2>Current games</h2>
        <p className={styles.desc}>The list will update automatically. Your games will always be highlighted.</p>

        <div className={styles.table}>
          {/*
          {games.filter(game => {
            return [game?.player1?.steamid, game?.player2?.steamid].includes(user.get('steamid')) && user.get('steamid') !== undefined
          }).sort((a,b) => b.value - a.value).map((game, key) => (
            <GameListed key={key} {...game} />
          ))}

          {games.filter(game => {
            return user.get('steamid') === undefined ? true : ![game?.player1?.steamid, game?.player2?.steamid].includes(user.get('steamid'))
          }).sort((a,b) => b.value - a.value).map((game, key) => (
            <GameListed key={key} {...game} />
          ))}
          */}
          {games.filter(x => x.status === 0).sort((a,b) => b.value - a.value).map((game, key) => (
            <GameListed key={key} {...game} />
          ))}

          {games.filter(x => x.status !== 0).sort((a,b) => b.value - a.value).map((game, key) => (
            <GameListed key={key} {...game} />
          ))}

          {games.length === 0 && (
            <div className={styles.empty}>
              <LoadingSimple />
              <p>No games yet - be the first to create one!</p>
              <img src={logo} alt="" />
            </div>
          )}
        </div>

        <TransactionModal />
        <GameInfoModal />
        <CoinflipModal />
        <ProvablyFairModal />
      </div>
    </div>
  );
}

export default Coinflip;