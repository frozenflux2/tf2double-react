import styles from './index.module.css';

const PageJackpot = () => (
  <div className={styles.page}>
    {/* <p>
      We use a trusted third party website <a href="https://random.org" target="_blank" rel="noopener noreferrer">random.org</a> as
      an independent source to determine the final outcome for all games.
      Random.org allows anyone to verify that the result was generated as a result of true
      randomness and wasn't tampered with the create unfavorable outcomes.
    </p> */}

    <h3>The concept</h3>
    <p>
      The final result is generated from a <span>seed</span> which is created from the <span>server secret</span> and the <span>random.org hash</span>.
      The seed is converted into a <span>winning ticket</span> by using simple math.      
    </p>

    <h3>Tickets</h3>
    <p>
      There is 100,000 tickets that are split between the users based on their chance to win percentage.
      The earlier you join the round, the lower your ticket number will start. For example, if you joined first 
      and your chance to win is 24% you will have 24% of the 100,000 tickets, so your tickets will be from #1 to #24000.
    </p>

    <h3>Server secret</h3>
    <p>
      To prove that the server secret isn't being manipulated just before the roll to create
      a unfavorable outcome we commit to it by showing a <span>hashed version</span> of the secret (public server secret).
      You can view it by pressing the "provably fair" link under the join button.
    </p>
    <p>
      After the round is finished, we reveal the original server secret and it is possible
      to use the sha256 algorithm and compare the result to the hashed version shown earlier.
      To view it, press on the latest round box at the top of the site.
    </p>


    <h3>Random.org hash</h3>
    <p>
      This value is requested from random.org after we stop accepting bets for the round and before
      the final outcome is determined. You can use this <a href="https://api.random.org/signatures/form" target="_blank" rel="noopener noreferrer">verification form</a> to
      to verify that it was generated at the correct time.
    </p>

    <h3>Seed</h3>
    <p>
      The seed is created by combining the <span>server secret</span> and <span>random.org hash</span> separated by a dash and the hashing the result using <span>sha256</span>.
    </p>

    <h3>Code</h3>
    <p>Below you will find the code that we use that creates the seed and generates the winning ticket for a given round.</p>

    {/* 
      green a6e22e
      blue 66d9ef
      white f8f8f2
      pink f92672
      purple ae81ff
      gold e6db74
    */}
    <code>
      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>sha256 </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#a6e22e'}}>require</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#e6db74'}}>'sha256'</span>
        <span style={{color: '#f8f8f2'}}>&#41;;</span>
      </p>

      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>server_secret </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#e6db74'}}>'FILL_IN_THIS_VALUE'</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>random_org_hash </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#e6db74'}}>'FILL_IN_THIS_VALUE'</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p style={{visibility: 'hidden'}}>-</p>

      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>seed </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#66d9ef'}}>sha256</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#a6e22e'}}>server_secret</span>
        <span style={{color: '#f92672'}}> + </span>
        <span style={{color: '#e6db74'}}>'-'</span>
        <span style={{color: '#f92672'}}> + </span>
        <span style={{color: '#a6e22e'}}>random_org_hash</span>
        <span style={{color: '#f8f8f2'}}>&#41;;</span>
      </p>

      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>ticket </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#66d9ef'}}>parseInt</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#a6e22e'}}>seed</span>
        <span style={{color: '#f8f8f2'}}>.</span>
        <span style={{color: '#a6e22e'}}>substr</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#ae81ff'}}>0</span>
        <span style={{color: '#f8f8f2'}}>, </span>
        <span style={{color: '#ae81ff'}}>8</span>
        <span style={{color: '#f8f8f2'}}>&#41;, </span>
        <span style={{color: '#ae81ff'}}>16</span>
        <span style={{color: '#f8f8f2'}}>&#41;</span>
        <span style={{color: '#f92672'}}> % </span>
        <span style={{color: '#ae81ff'}}>100000</span>
        <span style={{color: '#f92672'}}> + </span>
        <span style={{color: '#ae81ff'}}>1</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p style={{visibility: 'hidden'}}>-</p>

      <p>
        <span style={{color: '#66d9ef'}}>console.</span>
        <span style={{color: '#a6e22e'}}>log</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#a6e22e'}}>ticket</span>
        <span style={{color: '#f8f8f2'}}>&#41;;</span>
      </p>

      {/* 
      state.finalHash = sha256(`${state.serverHash}-${state.randomorgResult.result}`);
      state.winningTicket = parseInt(state.finalHash.substr(0, 8), 16) % TOTAL_TICKETS + 1; */}
    </code>

    <p>This code can be easily executed on online Node.js runtimes such as <a href="https://replit.com/languages/nodejs" target="_blank" rel="noopener noreferrer">replit.com</a>.</p>
  </div>
);

export default PageJackpot;