import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

import { PlusOutline } from '@styled-icons/evaicons-outline/PlusOutline';
import { QuestionCircle } from 'styled-icons/bootstrap';
import { Plus } from 'styled-icons/fa-solid';

import coin from '../../resources/images/coin.png';
import unknown from '../../resources/images/unknown.png';
import bank from '../Jackpot/resources/bank2.png';
import logo from '../../resources/images/logo.png';

import TransactionModal from '../../components/TransactionModal';
import GameInfoModal from '../../components/GameInfoModal';
import UpdateEverySec from '../../components/UpdateEverySec';
import LoadingSimple from '../../components/LoadingSimple';
import Button from "../../components/Button";

import styles from '../Coinflip/index.module.css';
import styles2 from './index.module.css';


const sum = (arr, key) => arr.reduce((a, b) => +a + +b[key], 0);
const { helpers, tf2_mines, events, user, store } = window.insolve;







const GameListed = (props) => {
  const { id, players, maxDiff = 0, status = 0, TIME_TO_JOIN, timeUpdated } = props;

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

  // todo: value is wrong, it should combine all users
  // const value = sum(players, 'total');
  const value = players[0]?.total;
  const self = user.get();
  
  // todo: show who won on past games

  return (
    <Link to={`/mines/${id}`}>
      <div className={styles2.row} data-status={status} onClick={openGame} style={
        (players.map(x => x.steamid).includes(user.get('steamid')) && user.get('steamid') !== undefined) ? {
          border: '2px dashed var(--theme-color)'
      } : null}>
        <div className={styles2.top}>
          {/* avatars */}
          <div className={styles2.avatars}>
            {players.map((player, key) => (
              <img src={player?.avatar || unknown} onClick={e => openProfile(e, player)} key={key} alt="" />
            ))}

            {([0,1].includes(status) && !players.map(p => p.steamid).includes(self.steamid)) && <div className={styles2.join}>
              <Plus />
            </div>}
          </div>

          {/* items */}
          {/* <div className={styles.items}>
            {items.sort((a,b) => b.value - a.value).map((item, key) => key > 2 ? null : (
              <div style={{'--color': item.color}} key={key}><img src={item.image} alt="" /></div>
            ))}

            {items.length > 3 && <div className={styles.plus}>+{items.length - 3}</div>}
          </div> */}
          <div className={styles2.status}>
            <UpdateEverySec timeUpdated={timeUpdated} TIME_TO_JOIN={TIME_TO_JOIN} />
          </div>


          {/* value */}
          <div className={styles2.value}>
            <h3>
              <img src={coin} alt="" />
              {/* todo: add countup */}
              <span>{helpers.formatBalance(value)}</span>
            </h3>
            <p>
              {helpers.formatBalance(value * (1 - maxDiff))} - {helpers.formatBalance(value * (1 + maxDiff))}
            </p>
          </div>
        </div>

        {/* action */}
        {/* <div className={styles.actions}>
          <button>
            <Eye />
          </button>

          {self?.steamid !== player1?.steamid && (
            <button className={styles.play}>
              <Play />
            </button>
          )}
        </div> */}
      </div>
    </Link>
  );
}

const Coinflip = () => {
  const [games, setGames] = useState([]);

  const navigate = useNavigate();
  const createGame = () => {
    events.emit('internal:toggleTransactionModal', {game: 'mines'});
  };

  const onNewGame = data => {
    setGames(prev => [...prev, data]);

    if(data?.player1?.steamid === user.get('steamid')) {
      navigate(`/coinflip/${data?.id}`);
    }
  }

  const onGameUpdated = data => {
    setGames(prev => {
      prev.map(g => {
        if(g.id !== data?.id) return g;

        // g = {...g, ...data};
        g.status = data?.status;
        if(data?.players) g.players = data?.players;
        g.TIME_TO_JOIN = data?.TIME_TO_JOIN;
        g.timeUpdated = data?.timeUpdated;
        if(data?.value) g.value = data?.value;

        return {...g};
      });

      return [...prev];
    });
  }

  // load games
  useEffect(() => {
    tf2_mines.getAllGames().then(setGames).catch(e => {});
    tf2_mines.join();

    events.on('tf2_mines:newGame', onNewGame);
    events.on('tf2_mines:gameUpdated', onGameUpdated);

    return () => {
      tf2_mines.leave();

      events.off('tf2_mines:newGame', onNewGame);
      events.off('tf2_mines:gameUpdated', onGameUpdated);
    }
  }, []);

  const openGames = games.filter(x => [0,1].includes(x.status));
  const inProgressGames = games.filter(x => [2,3].includes(x.status));

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

              <Button variant="primary" type="button" onClick={() => events.emit('internal:toggleGameInfoModal', 'mines')}>
                <QuestionCircle />
              </Button>
            </div>
        </div>

        <h2>Open games</h2>
        <p className={styles.desc}>These games are open and you're free to join them. Your games will always be highlighted.</p>

        {games.length === 0 && (
          <div className={styles.empty}>
            <LoadingSimple />
            <p>No games yet - be the first to create one!</p>
            <img src={logo} alt="" />
          </div>
        )}

        <div className={`${styles2.table} ${styles.table}`}>
          {openGames.sort((a,b) => b.value - a.value).map((game, key) => (
            <GameListed key={key} {...game} />
          ))}
        </div>


        {/* 
          past games
        */}
        {inProgressGames.length > 0 && (
          <>
            <h2 style={{marginTop: '60px'}}>In progress</h2>
            <p className={styles.desc}>These games are in progress or finished but you can still spectate them.</p>

            <div className={`${styles2.table} ${styles.table}`}>
              {inProgressGames.sort((a,b) => b.value - a.value).map((game, key) => (
                <GameListed key={key} {...game} />
              ))}
            </div>
          </>
        )}


        <TransactionModal />
        <GameInfoModal />
        {/* <ProvablyFairModal /> */}
      </div>
    </div>
  );
}

export default Coinflip;