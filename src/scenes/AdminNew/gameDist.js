import { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import styles from './index.module.css';
import Loading from './loading';

const Chart = ({ chartData, activeGame, setActiveGame }) => (
  <PieChart
    data={chartData}
    className={styles.chart}
    lineWidth={20}
    startAngle={180}
    lengthAngle={180}
    animate={false}
    segmentsStyle={index => ({
      opacity: activeGame === -1 ? null : (activeGame === index ? null : .4),
      transition: 'opacity 300ms',
      cursor: 'pointer'
    })}
    onMouseOver={(e, index) => setActiveGame(index)}
    onMouseOut={() => setActiveGame(-1)}
  />
);

const GameDist = ({ jackpot = 0, coinflip = 0, mines = 0, total = 0, loading }) => {
  const allEmpty = jackpot === 0 && coinflip === 0 && mines === 0;

  if(allEmpty) {
    jackpot = 1;
    coinflip = 1;
    mines = 1;
    total = 3;
  }
  const [activeGame, setActiveGame] = useState(-1);
  const chartData = [
    {title: 'Jackpot', value: (jackpot / total) * 100, color: 'var(--theme-gold)'},
    {title: 'Coinflip', value: (coinflip / total) * 100, color: 'var(--theme-color)'},
    {title: 'Mines', value: (mines / total) * 100, color: 'var(--theme-color-contrast)'},
  ];

  return (
    <div className={styles.gameDistContainer} data-loading={loading}>

      <h1 className={styles.header}>Game distribution</h1>

      <div className={styles.gameDist}>
        <Loading />
        <Chart chartData={chartData} activeGame={activeGame} setActiveGame={setActiveGame} />

        <div className={styles.legend}>
          {chartData.map((data, key) => (
            <div
              key={key}
              className={styles.box} 
              style={{
                '--color': data?.color,
                opacity: activeGame === -1 ? null : (
                  activeGame === key ? 1 : '.4'
                )
              }}
              onMouseOver={() => setActiveGame(key)}
              onMouseOut={() => setActiveGame(-1)}
            >
              <p>{data?.title || '-'}</p>
              <span>{parseFloat(allEmpty ? 0 : (data?.value || 0)).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameDist;