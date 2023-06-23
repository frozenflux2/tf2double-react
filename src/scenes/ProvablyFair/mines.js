import styles from './index.module.css';

const PageCoinflip = () => (
  <div className={styles.page}>
    <h3>The concept</h3>
    {/* <p>
      The final result is a list of numbers, generated from a <span>seed</span> which is created from the <span>server secret</span> and the <span>random.org hash</span>.
      The seed is changed slightly in each iteration until we achieve a desired amount of mines &#40;5&#41;.     
    </p> */}
    <p>
      We create a unique <span>seed</span> for each game that is used to generate a list of spots where the mines will be.
      Then we run a few code iterations, in each we slightly alter the seed by adding a dash and the iteration number at the end of it and hashing it again to get a random number between 0 and 35 &#40;for the 36 slots in the map&#41;.
    </p>

    <h3>Server secret</h3>
    <p>
      To prove that the server secret isn't being manipulated just before the roll to create
      a unfavorable outcome we commit to it by showing a <span>hashed version</span> of the secret (public server secret).
      You can view it by pressing the "provably fair" button at the top right.
    </p>
    <p>
      After the game is finished, we reveal the original server secret and it is possible
      to use the sha256 algorithm and compare the result to the hashed version shown earlier.
      To view it, press the "provably fair" button at the top right.
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
    {/* <p>That base seed is then used to create a new seed <pre>f34a4c074a22b3d388735e9acb4e8d60bae6a06d9f6d630eba13947800b3cc50-1</pre></p> */}

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

      <p>
        <span style={{color: '#8f8f9f'}}> // do not edit below this line</span>
      </p>
      <p style={{visibility: 'hidden'}}>-</p>

      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>TILES </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#ae81ff'}}>36</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>MINES </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#ae81ff'}}>6</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p>
        <span style={{color: '#66d9ef'}}>let </span>
        <span style={{color: '#a6e22e'}}>generated_mines </span>
        <span style={{color: '#f92672'}}> = </span>
        <span style={{color: '#f8f8f2'}}>&#91;&#93;</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p style={{visibility: 'hidden'}}>-</p>

      <p>
        <span style={{color: '#f92672'}}>for</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        {/* <span style={{color: '#f8f8f2'}}>for&#40;</span> */}
        <span style={{color: '#66d9ef'}}>let </span>
        <span style={{color: '#a6e22e'}}>i</span>
        <span style={{color: '#f92672'}}>=</span>
        <span style={{color: '#ae81ff'}}>0</span>
        <span style={{color: '#f8f8f2'}}>; </span>

        <span style={{color: '#a6e22e'}}>i</span>
        <span style={{color: '#f92672'}}>&lt;</span>
        <span style={{color: '#ae81ff'}}>1000</span>
        <span style={{color: '#f8f8f2'}}>; </span>

        <span style={{color: '#a6e22e'}}>i</span>
        <span style={{color: '#f92672'}}>++</span>
        <span style={{color: '#f8f8f2'}}>&#41; &#123;</span>
      </p>

      <p style={{marginLeft: '18px'}}>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>iteration_seed </span>
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

      <p style={{marginLeft: '18px'}}>
        <span style={{color: '#66d9ef'}}>const </span>
        <span style={{color: '#a6e22e'}}>mine </span>
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
        <span style={{color: '#a6e22e'}}>TILES</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p style={{visibility: 'hidden'}}>-</p>

      <p style={{marginLeft: '18px'}}>
        <span style={{color: '#f92672'}}>if</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        {/* <span style={{color: '#f8f8f2'}}>if&#40;</span> */}
        <span style={{color: '#f92672'}}>!</span>
        <span style={{color: '#a6e22e'}}>generated_mines</span>
        <span style={{color: '#f8f8f2'}}>.</span>
        <span style={{color: '#66d9ef'}}>includes</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#a6e22e'}}>mine</span>
        <span style={{color: '#f8f8f2'}}>&#41;</span>
        <span style={{color: '#f8f8f2'}}>&#41; </span>
        <span style={{color: '#f8f8f2'}}>&#123;</span>
      </p>

      <p style={{marginLeft: '36px'}}>
        <span style={{color: '#a6e22e'}}>generated_mines</span>
        <span style={{color: '#f8f8f2'}}>.</span>
        <span style={{color: '#66d9ef'}}>push</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#a6e22e'}}>mine</span>
        <span style={{color: '#f8f8f2'}}>&#41;;</span>
      </p>

      <p style={{marginLeft: '18px'}}>
        <span style={{color: '#f8f8f2'}}>&#125;</span>
      </p>

      <p style={{visibility: 'hidden'}}>-</p>

      <p style={{marginLeft: '18px'}}>
        <span style={{color: '#f92672'}}>if</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        {/* <span style={{color: '#f8f8f2'}}>if&#40;</span> */}
        <span style={{color: '#a6e22e'}}>generated_mines</span>
        <span style={{color: '#f8f8f2'}}>.length</span>
        {/* <span style={{color: '#66d9ef'}}>length</span> */}
        <span style={{color: '#f92672'}}> &gt;= </span>
        <span style={{color: '#a6e22e'}}>MINES</span>
        <span style={{color: '#f8f8f2'}}>&#41;</span>
        <span style={{color: '#ae81ff'}}> break</span>
        <span style={{color: '#f8f8f2'}}>;</span>
      </p>

      <p>
        <span style={{color: '#f8f8f2'}}>&#125;</span>
      </p>

      <p style={{visibility: 'hidden'}}>-</p>

      <p>
        <span style={{color: '#66d9ef'}}>console.</span>
        <span style={{color: '#a6e22e'}}>log</span>
        <span style={{color: '#f8f8f2'}}>&#40;</span>
        <span style={{color: '#a6e22e'}}>generated_mines</span>
        <span style={{color: '#f8f8f2'}}>&#41;;</span>
        <span style={{color: '#8f8f9f'}}> // &#91; 8, 28, 10, 5, 6, 27 &#93;</span>
      </p>

      {/* 
      state.finalHash = sha256(`${state.serverHash}-${state.randomorgResult.result}`);
      state.winningTicket = parseInt(state.finalHash.substr(0, 8), 16) % TOTAL_TICKETS + 1; */}
    </code>

    <p>This code can be easily executed on online Node.js runtimes such as <a href="https://replit.com/languages/nodejs" target="_blank" rel="noopener noreferrer">replit.com</a>.</p>
  </div>
);

export default PageCoinflip;