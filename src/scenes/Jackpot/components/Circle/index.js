import { PieChart } from 'react-minimal-pie-chart';

import planet from '../../resources/planet.png';

import styles from './index.module.css';


const DownArrow = ({ className }) => (
  <svg width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || null}>
    <path d="M21.9442 24.8084C19.5602 28.2761 14.4398 28.2761 12.0557 24.8084L1.46193 9.39917C-1.27501 5.41816 1.57511 3.56444e-06 6.40618 3.10432e-06L27.5938 1.08635e-06C32.4249 6.26229e-07 35.275 5.41816 32.5381 9.39917L21.9442 24.8084Z" fill="white"/>
  </svg>
);

const PlayerAvatars = ({ players, activePlayer }) => {
  return players.map((player, key) => {
    return (
      <div className={styles.avatarWrapper} key={key} style={{
        '--spin': `${player.center}deg`,
        '--color': player.color,
        opacity: activePlayer === -1 ? null : (activePlayer === key ? null : .4)
      }}>
        {/* <img src={player.avatar} style={key === 0 ? {transform: 'scale(2)'} : null} alt="" /> */}
        <img src={player.avatar} alt="" loading="lazy" />
        <div className={styles.border} />
      </div>
    );
  });
}

const Chart = ({ chartData, activePlayer, setActivePlayer }) => (
  <PieChart
    data={chartData}
    lineWidth={20}
    startAngle={-90}
    animate={false}
    segmentsStyle={index => ({
      opacity: activePlayer === -1 ? null : (activePlayer === index ? null : .4),
      transition: 'opacity 300ms',
      cursor: 'pointer'
    })}
    onMouseOver={(e, index) => setActivePlayer(index)}
    onMouseOut={(e, index) => setActivePlayer(-1)}
  />
)

const Circle = ({ parentWidth, players = [], items = [], activePlayer, setActivePlayer, time = 0, totalBank = 0, rotation = 0, rollPhase = 0 }) => {
  const scale = parentWidth / 868;
  const width = 1017 * scale;
  const widthDifferenceToOriginal = 1017 - width;
  const translate = (widthDifferenceToOriginal / 2) + (width * 0.18);

  const chartData = players.length === 0 ? [
    {title: '', value: 100, color: 'var(--theme-color-contrast)'}
  ] : players.map(player => {
    const playerTotal = window.insolve.helpers.sum(items.filter(x => x.owner?.id === player?.id) || [], 'price');

    return {title: player.name, value: ((playerTotal || 1) / (totalBank || 1)) * 100, color: player.color}
  });

  const timer = (time >= 10 ? time.toString() : `0${time}`).split('');

  // todo: to fix the afk spinning, maybe have it animate between 0deg and 360deg in a linear pattern, then change transition when we roll?

  return (
    <div className={styles.circleWrapper} data-animate={rotation === 0} data-rollphase={rollPhase} style={{
      marginLeft: `-${translate}px`,
      marginTop: `-${(width / 2) + (widthDifferenceToOriginal / 2)}px`,
      marginBottom: `-${Math.abs(widthDifferenceToOriginal / 2)}px`,
      transform: `scale(${scale})`, // translate(-${translate}px, -50%) scale(${scale})
      '--mobile': `-${Math.abs( (widthDifferenceToOriginal / 2) + ((width - parentWidth) / 2) )}px`,
      '--rotation': `${rotation}deg`
    }}>
      <div className={styles.circle}>
      <div className={styles.chartContainer}>
          {/* rotaty wheel */}
          <div className={styles.rotaty} data-default="false">
            <Chart chartData={chartData} activePlayer={activePlayer} setActivePlayer={setActivePlayer} />
            <PlayerAvatars players={players} activePlayer={activePlayer} />
          </div>

          <div className={styles.rotaty} data-default="true">
            <Chart chartData={chartData} activePlayer={activePlayer} setActivePlayer={setActivePlayer} />
            <PlayerAvatars players={players} activePlayer={activePlayer} />
          </div>
        </div>
        

        {/* dashed line below the planet */}
        <div className={styles.dashed} />

        {/* planet */}
        <div className={styles.planet}>
          <img src={planet} alt="" />

          <div className={styles.center}>
            <p className={styles.desc} data-visible={time > 0 || null}>Timer is on! Place your bets now!</p>

            <div className={styles.timer} data-visible={time > 0 || null}>
              {/* todo: we're going to blissfully ignore any possibility of the timer being more than 60 seconds */}
              <div>0</div>
              <div>0</div>
              <p>:</p>
              <div>{timer[0]}</div>
              <div>{timer[1]}</div>
            </div>
          </div>
        </div>

        {/* arrows to show winner */}
        <div className={styles.arrows}>
          <DownArrow className={styles.top} />
          <DownArrow className={styles.bottom} />
        </div>
      </div>
    </div>
  );
}

export default Circle;