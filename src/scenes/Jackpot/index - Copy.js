import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import CountUp from 'react-countup';

import Button from '../../components/Button';
import ScrollingContainer from '../../components/ScrollingContainer';
import TransactionModal from '../../components/TransactionModal';
import ProvablyFairModal from '../../components/ProvablyFairModal';
import Circle from './components/Circle';
import Round from './components/Round';

// import { Gamepad } from '@styled-icons/fa-solid/Gamepad';
import { User } from '@styled-icons/fa-solid/User';
import { TimeFive } from '@styled-icons/boxicons-solid/TimeFive';

import bank from './resources/bank2.png';
// import past from './resources/past.png';
import coin from '../../resources/images/coin.png';

import timeSince from '../../helpers/timeSince';

import styles from './index.module.css';
// import { I, X } from 'styled-icons/fa-solid';
import { Steam } from 'styled-icons/bootstrap';
import LoadingSimple from '../../components/LoadingSimple';
import { Error } from 'styled-icons/boxicons-regular';
import { Gun } from 'styled-icons/fa-solid';
// import { Link } from 'react-router-dom';

const { helpers, events, tf2_jackpot } = window.insolve;


const Item = ({ name, price, image, owner, color }) => (
  <div className={styles.item} style={{'--color': color || '#7d6d00'}}>
    <div className={styles.image}>
      <img src={image} alt="" />
    </div>

    <div className={styles.text}>
      
      <p className={styles.name}>{name}</p>
    </div>

    <p className={styles.price}>
      <img src={coin} alt="" />
      <span>{helpers.formatBalance(price)}</span>
    </p>

    {/* player preview */}
    <div className={styles.preview}>
      <img src={owner?.avatar} alt="" />
      <p>{owner?.name}</p>
    </div>
  </div>
)

const PastRound = (props) => {
  const [offset, setOffset] = useState(-1);
  const { winner, timeRolled, players, items, total, index } = props;

  useEffect(() => {
    // setOffset(index);
  }, [index]);
  return (
    <div className={styles.past} onClick={() => events.emit('internal:togglePFmodal', {...props, game: 'jackpot'})} style={{
      transform: offset !== -1 ? `translateY(calc(${offset * 100}% + ${offset * 10}px))` : null,
      opacity: offset !== -1 ? 1 : null,
      '--avatar': `url(${winner?.avatar})`
    }}>
      {/* <img src={past} alt="" className={styles.bg} /> */}

      <div className={styles.flex}>
        <div className={styles.avatar} onClick={() => events.emit('internal:toggleUserModal', winner)}>
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
      tmt = setTimeout(() => {
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

      clearTimeout(tmt);
    }
  }, []);

  let tmt;

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
  return [
    {id: 'id1', steamid: 'id1', name: 'xx', color: '#ff0000', avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c570e9097ba46677da64845997527ccd9340321a_full.jpg'},
    {id: 'id2', steamid: 'id2', name: 'xx', color: '#00ff00', avatar: 'https://avatars.akamai.steamstatic.com/11040c92ab051559710c68029bff6b2a61f7bdbd_full.jpg'}
  ]
}

const GET_ITEMS = () => {
  return [
    {name: 'xx', price: 1, owner: {id: 'id1', steamid: 'id1', name: 'xxxx'}},
    {name: 'xx', price: 1, owner: {id: 'id2', steamid: 'id2', name: 'xxxx'}},
    {name: 'xx', price: 1, owner: {id: 'id2', steamid: 'id2', name: 'xxxx'}}
  ]
}
*/

function addCirclePosToList(players, items2) {
  // const totalBank2 = items2.reduce((a, b) => +a + +b.price, 0);
  const totalBank2 = helpers.sum(items2, 'price');

  players.map((player, key) => {
    const prevPlayer = players[key - 1];
    // player.total = (items2.filter(x => x.owner?.id === player.id).reduce((a, b) => +a + +b.price, 0) / totalBank2) || 0;
    const playerTotal = helpers.sum(items2.filter(x => x.owner?.id === player?.id) || [], 'price');
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

    return player;
  });

  return players;
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

  const roll = (index = 0, random = 0.5) => {
    console.log(`roll to ${index} with offset ${random}`);
    clearTimeout(timeout);
    setRollPhase(1);

    const iterations = 5 + internalCounter;

    // console.log(`end: ${players[index]?.end}`);
    // console.log('');
    const diff = (players[index]?.end || 0) - (players[index]?.start || 0);
    const num = (players[index]?.start || 0) + (diff * random);

    console.log(`Current rotation is ${rotation}, we will change it to ${(180 - num) + (360 * iterations)}`);
    setActivePlayer(-1);
    setRotation((180 - num) + (360 * iterations));
    setInternalCounter(prev => prev + 5);

    timeout = setTimeout(() => {
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
    setPlayers(prev => {
      if(prev.filter(p => p.steamid === data.player?.steamid).length > 0) {
        prev.map(p => {
          if(p.steamid === data.player?.steamid) {
            p.total += parseFloat(data?.sum || 0);
          }

          return p;
        });

        return [...prev];
      } else {
        return addCirclePosToList([...prev, data.player], [...prev, ...data.items]);
      }
    });

    setItems(prev => [...prev, ...data.items]);
  }

  const onWinner = data => {
    const index = players.map(player => player.id).indexOf(data.winner.id);

    roll(index, data.random);
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
  }, [players, items]);

  // join/leave
  useEffect(() => {
    tf2_jackpot.join();

    // tf2_jackpot.getPastGames().then(setPastGames);

    return () => tf2_jackpot.leave();
  }, []);

  return (
    <div className={styles.jackpot} data-players={players.length}>
      <div className={styles.itemsTop}>
        <ScrollingContainer height="110px" speed={200}>
          {items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).map((item, key) => (
              <Item {...item} key={key} />
          ))}
        </ScrollingContainer>
      </div>

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
                <img src={coin} alt="" onClick={() => roll(0, .1)} />
                <span>
                  {/* {helpers.formatBalance(totalBank)} */}
                  <CountUp end={totalBank} duration={1} decimals={2} separator=" " preserveValue={true} />
                </span>
              </h4>
            </div>
            
            <Button variant="theme" type="button" shiny onClick={joinGame}>
              Join game
            </Button>
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
    </div>
  );
}

export default Jackpot;