import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Debounce function to limit how often a function can fire
const debounce = (func, delay) => {
  let debounceTimer;
  return function (...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

// Images by skill level with all your Dropbox URLs updated for direct image loading
const imagesBySkillLevel = {
  'Easy': [
    'https://www.dropbox.com/scl/fi/qnjk3trxja1439e7bbjo9/ea-32104.png?rlkey=0o1a8rcxdsulsgd0g0c766jyq&dl=1',
    'https://www.dropbox.com/scl/fi/2lmudn0z5men0we347qij/ea-fac1f.png?rlkey=pvkkkvmbdf5cuf3zpnc0bqdli&dl=1',
    'https://www.dropbox.com/scl/fi/nuoclvr1yfekdt3jh518p/ea-7396e.png?rlkey=4rx04enhpdeug9h4s1h9njne0&dl=1'
  ],
  'Intermediate': [
    'https://www.dropbox.com/scl/fi/gn37rv3krdva8o5cq8k87/in-8dd89.png?rlkey=dpl1g51wdpdz78qvh942vzrly&dl=1',
    'https://www.dropbox.com/scl/fi/i2djpe0g87tg5m41llwde/in-9a1b1.png?rlkey=soxndiim0i15tjpjdnqs1tplv&dl=1',
    'https://www.dropbox.com/scl/fi/y6feuj55gsi42595bswxn/in-9bac9.png?rlkey=dbijcs5ti0od8hm9zx7zabtp6&dl=1',
    'https://www.dropbox.com/scl/fi/iknbuhyjconhnsgvo06rt/in-28c74.png?rlkey=v9oyc8pj9cqjtak4pfhaw1qdh&dl=1',
    'https://www.dropbox.com/scl/fi/uiv9icjacl5hy8utbbn2k/in-37e6d.png?rlkey=bs2r1wcpo3excsn51xiigc2p4&dl=1',
    'https://www.dropbox.com/scl/fi/2pfo76qg2bz89usouq8w2/in-52fd3.png?rlkey=s20f56pqktr37spremxo0m7ks&dl=1',
    'https://www.dropbox.com/scl/fi/ygdtdyne68wc4d3dxn6dp/in-94ba0.png?rlkey=xulmknd6ihz2ckkfvxbe8u6al&dl=1',
    'https://www.dropbox.com/scl/fi/771fcywk0ojs3s1s6v9ur/in-218f2.png?rlkey=ku7jg3s30zsm7s5i4fp4zbaij&dl=1',
    'https://www.dropbox.com/scl/fi/mkro6615j7hethhbw3qg4/in-606e1.png?rlkey=2nvmmvddj89tg98f99006j3hl&dl=1',
    'https://www.dropbox.com/scl/fi/5yafmdcqg38zs5bl9x2lv/in-942e3.png?rlkey=9emysyuhk09x54hwm6jekd1q1&dl=1',
    'https://www.dropbox.com/scl/fi/9s6t2hbxtpt2izllgj9q3/in-6150b.png?rlkey=8ed9bprm37fand5bwlm31dele&dl=1',
    'https://www.dropbox.com/scl/fi/1d07o01b6vguaf2ejcn4p/in-7502f.png?rlkey=xmeh0ecnztuuk8t0hjwubytlp&dl=1',
    'https://www.dropbox.com/scl/fi/kibws2gscn70lk9l0dh11/in-11177.png?rlkey=2pugdt81uo7b121jtr23a1s3l&dl=1',
    'https://www.dropbox.com/scl/fi/u9xlibzn0xea2wxy9tqzx/in-25476.png?rlkey=nbb7rdc84l285aj61ncsjxqbj&dl=1',
    'https://www.dropbox.com/scl/fi/jymrbsnsomx8ap1lu3zzm/in-29195.png?rlkey=8z8az2ehoughzrzr0h5smg6nj&dl=1',
    'https://www.dropbox.com/scl/fi/uq627dvsbr5b77pt3yshw/in-50907.png?rlkey=5mlavvz1j7kzgayeswluhupdn&dl=1',
    'https://www.dropbox.com/scl/fi/mnz1q7mak53hjz9yargpm/in-55576.png?rlkey=506opf1jz3o3ski3lutek5x3b&dl=1',
    'https://www.dropbox.com/scl/fi/k6loa8vnl8cdc9nh6vddj/in-56423.png?rlkey=n00x962rk7beyywn84lb4qceu&dl=1',
    'https://www.dropbox.com/scl/fi/vzg4uvl5xbaqnl5j0pueb/in-90703.png?rlkey=jgh8gn6jis0sqjd4jfvui51vd&dl=1',
    'https://www.dropbox.com/scl/fi/xzoqbvjj6xr9bfbasl5de/in-a6fe0.png?rlkey=gua49hjimxcbf08f0ch14jnsq&dl=1',
    'https://www.dropbox.com/scl/fi/eqftl98e06b4g3tja49eo/in-aa1cf.png?rlkey=yh2ume91cgmxtxqbwp4f1ezwn&dl=1',
    'https://www.dropbox.com/scl/fi/53129mk1j39q8owed58x4/in-b403c.png?rlkey=rnu2t41m7gxlnsiwmos9v34d7&dl=1',
    'https://www.dropbox.com/scl/fi/3ouej4q4jcr4gzsx7g22w/in-be71f.png?rlkey=uy6k5xoxfal76lsxabpn8cjcz&dl=1',
    'https://www.dropbox.com/scl/fi/n3pnrwxz08nkgpookhf9r/in-c891a.png?rlkey=xtkxb9ps3zzx23ii9nryqez25&dl=1',
    'https://www.dropbox.com/scl/fi/2xxb5yygxkanqlmw2ut8d/in-c5344.png?rlkey=vt2ugx8kpe2u6zyzwqn3thun3&dl=1',
    'https://www.dropbox.com/scl/fi/6pb5krzrgh1c5ygj114t1/in-cb2f3.png?rlkey=gdkb7771beqx76gxw2jole557&dl=1',
    'https://www.dropbox.com/scl/fi/j2c0j1k6vi0ti11v38xc6/in-cde71.png?rlkey=ue8epmlmndvhxpy164kksgvzk&dl=1',
    'https://www.dropbox.com/scl/fi/7ikre8mr0lmsf0pq6zrfx/in-e1c35.png?rlkey=xsk6586mguy9xqgc216edxqzg&dl=1',
    'https://www.dropbox.com/scl/fi/4vv6krd3vew720n81j2ac/in-e0214.png?rlkey=rftm81dufijn5596yur8q7v4p&dl=1',
    'https://www.dropbox.com/scl/fi/yg43ktz3mz1ny1qq41dlk/in-ed79f.png?rlkey=2klep1fq46tj32nipe1lhsbye&dl=1',
    'https://www.dropbox.com/scl/fi/9vad08kolt0gg15o0a6es/in-f6598.png?rlkey=ny0y1f9c5y883zbk0q6hp93qz&dl=1',
    'https://www.dropbox.com/scl/fi/dhowsbbs2cs9wf1xkx4s7/in-fd016.png?rlkey=tsg7zohidcjjkrl4v0p52buif&dl=1'
  ],
  'Advanced': [
    'https://www.dropbox.com/scl/fi/ggn60l8efyke79pc2tiim/ad-b3272.png?rlkey=2v16555fi2jlwxzcxv5rzqn8b&dl=1',
    'https://www.dropbox.com/scl/fi/pw2nb8op4wq4j11ipk424/ad-bb61e.png?rlkey=3aff80yftx3wfkozo63si74by&dl=1',
    'https://www.dropbox.com/scl/fi/rg3cx9ci5hs0byq27y1z2/ad-be8dd.png?rlkey=xvglekpwhswh7wrknurlq2pyn&dl=1',
    'https://www.dropbox.com/scl/fi/bygaliae6i3hp6baewjw8/ad-c13bb.png?rlkey=i64q7hgyggqfr6hpkebu1a4wc&dl=1',
    'https://www.dropbox.com/scl/fi/vjs7viy4sb3bohaysyu1d/ad-c692f.png?rlkey=uk9j2nxtr21roabijl063vexs&dl=1',
    'https://www.dropbox.com/scl/fi/6cbj719njh29d7oem3hj8/ad-d6804.png?rlkey=zflhdxog4be3ma0vgzc6wh85l&dl=1',
    'https://www.dropbox.com/scl/fi/snd1u4fa4vgu2qac39ea6/ad-da163.png?rlkey=j94ffm49wq49uno8q8xzlgnlv&dl=1',
    'https://www.dropbox.com/scl/fi/twfsez2rratkkioz5iq95/ad-db796.png?rlkey=q5q710bsaf9pppb3he7u9q2vz&dl=1',
    'https://www.dropbox.com/scl/fi/xlghjle112q1lg1p2wu4i/ad-ddc6c.png?rlkey=me6rxoszeusrentbk31rhgi0d&dl=1',
    'https://www.dropbox.com/scl/fi/zbumb82thevnllx6zhmy5/ad-df372.png?rlkey=j20hjm97ppql632zbqqj8bgqx&dl=1',
    'https://www.dropbox.com/scl/fi/yv8id12tu5vewjx1j6k74/ad-e8a5c.png?rlkey=j4a2yfh4txrhozbx824j7z609&dl=1',
    'https://www.dropbox.com/scl/fi/xnvlszl5hnngg21pylbpt/ad-e9e6d.png?rlkey=ai62y8r93rgcj1933oz9kstk8&dl=1',
    'https://www.dropbox.com/scl/fi/v0nf328w5sfhq0ajxkz8t/ad-e121.png?rlkey=jhf0gw67tz38wgwqs5g05tvdu&dl=1',
    'https://www.dropbox.com/scl/fi/z9tk0hi1f6acsigy3zbyy/ad-eab6e.png?rlkey=5qfexk1kiunl1qru312ybxmjt&dl=1',
    'https://www.dropbox.com/scl/fi/feb7iwzdo02eiriqzoadl/ad-eee87.png?rlkey=xmx9fnnz9q40umvyd6zyiku4r&dl=1',
    'https://www.dropbox.com/scl/fi/6cy63fp1a37mxyuqtl7wk/ad-f0d4a.png?rlkey=hrdwigv5l9cggiuc5up18hlal&dl=1',
    'https://www.dropbox.com/scl/fi/9a8tdaega0k37i5i4m8i0/ad-f5521.png?rlkey=pdc08j77etr4d401f2o6spuql&dl=1',
    'https://www.dropbox.com/scl/fi/hs5ezxdxqst8k6v88gbpu/ad-fb065.png?rlkey=tqg5afpoucghlwoxb30nv0psk&dl=1'
  ],
  'Expert': [
    'https://www.dropbox.com/scl/fi/l7qfuesms6eozz800se8v/ex-59ef0.png?rlkey=wx1zun2tnkv0cf89t2u4g0rz2&dl=1',
    'https://www.dropbox.com/scl/fi/2o9z9dqpa37ygwjubbb0x/ex-386de.png?rlkey=y35jtdm4h04ucw53j90vaokwd&dl=1',
    'https://www.dropbox.com/scl/fi/bndf6ns14cg8mjtxf6s1e/ex-d9a8b.png?rlkey=wkf48hajuqf58vme0dfqctwt5&dl=1'
  ]
};

function App() {
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [currentImageURL, setCurrentImageURL] = useState(null);
  const [skillLevel, setSkillLevel] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chartData, setChartData] = useState([]); 
  const [roundNumber, setRoundNumber] = useState(0);
  const [showIntro, setShowIntro] = useState(true); // New state for showing intro text
  const [showRules, setShowRules] = useState(false); // For showing rules
  const inputRefs = useRef([]);
  const lastValue = useRef({});

  const handlePlayerCountChange = (e) => {
    setPlayerCount(parseInt(e.target.value) || 0);
  };

  const addPlayerNames = () => {
    let newPlayers = [];
    for (let i = 0; i < playerCount; i++) {
      let name = prompt(`Enter name for Player ${i + 1}:`, `Player ${i + 1}`);
      newPlayers.push({ name: name || `Player ${i + 1}`, score: 0, color: getRandomColor() });
    }
    setPlayers(newPlayers);
    setGameStarted(true);
    setShowIntro(false); // Hide intro once players are set
  };

  const debouncedUpdateScore = useCallback(
    debounce((index, score) => {
      const newScore = parseInt(score, 10);
      if (!isNaN(newScore) && newScore !== players[index].score) {
        lastValue.current[index] = newScore;
        console.log(`Updating score for player ${index} with`, newScore);
        setPlayers(prevPlayers => {
          console.log('Previous state:', prevPlayers);
          const updatedPlayers = prevPlayers.map((player, i) => 
            i === index ? {...player, score: newScore} : player
          );
          console.log('New state:', updatedPlayers);
          setChartData(updatedPlayers);
          return updatedPlayers;
        });
      } else {
        console.log('Score update skipped because no change or invalid input');
      }
    }, 150),
    [players]
  );

  // Select image but do not update round number
  const selectImage = (url) => {
    setCurrentImageURL(url);
  };

  // Update round number only when starting the round
  const startRound = () => {
    if (currentImageURL) {
      setRoundNumber(prevRound => prevRound + 1);
    } else {
      console.error('No setup chosen to start the round');
    }
  };

  useEffect(() => {
    setChartData(players);
  }, [players]);

  const maxScore = Math.max(...chartData.map(player => player.score), 0);

  const goBackToGame = () => {
    setShowGraph(false);
  };

  const resetGame = () => {
    setPlayers([]);
    setPlayerCount(0);
    setCurrentImageURL(null);
    setSkillLevel('Easy');
    setGameStarted(false);
    setShowGraph(false);
    setRoundNumber(0);
    lastValue.current = {};
    setShowIntro(true); // Show intro again on reset
  };

  const endRound = () => {
    // Reset scores but keep players and other game state
    setPlayers(prevPlayers => prevPlayers.map(player => ({...player, score: 0})));
    setCurrentImageURL(null);
  };

  return (
    <div className="App">
      <header>
        <h1 style={{ color: 'blue' }}>Pattern Play Runouts</h1>
      </header>
      <main>
        {!gameStarted && showIntro ? (
          <div className="intro">
            <h2>Welcome to</h2>
            <h1 style={{ color: 'blue' }}>Pattern Play Runouts!</h1>
            <p>Get ready for an exciting pool challenge:</p>
            <ul>
              <li>Select your skill level to match your game.</li>
              <li>Choose or get a random pool table setup.</li>
              <li>Score points based on your performance each round.</li>
              <li>Track your progress with the in-game graph.</li>
            </ul>
            <button onClick={() => setShowIntro(false)}>Start Game</button>
          </div>
        ) : (!gameStarted) ? (
          <>
            <label>How Many Players? 
              <input type="number" min="1" max="8" onChange={handlePlayerCountChange} value={playerCount} />
            </label>
            <button onClick={addPlayerNames} disabled={playerCount <= 0}>Set Players</button>
          </>
        ) : (
          <>
            {!showGraph ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <select value={skillLevel} onChange={(e) => {
                    setSkillLevel(e.target.value);
                    setCurrentImageURL(null); // Clear image when changing skill level
                  }}>
                    <option value="Easy">Easy</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <span style={{ marginLeft: '10px' }}>Round {roundNumber}</span>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => {
                    const images = imagesBySkillLevel[skillLevel];
                    if (images && images.length > 0) {
                      // Open a prompt to choose from available images
                      const selected = prompt("Choose an image number (1 to " + images.length + ")", "1");
                      const index = parseInt(selected, 10) - 1; // Convert to 0-based index
                      if (!isNaN(index) && index >= 0 && index < images.length) {
                        selectImage(images[index]);
                      } else {
                        alert("Invalid selection");
                      }
                    }
                  }}>Choose Setup</button>
                  <button onClick={() => {
                    const images = imagesBySkillLevel[skillLevel];
                    if (images && images.length > 0) {
                      const randomImage = images[Math.floor(Math.random() * images.length)];
                      selectImage(randomImage);
                    }
                  }}>Random Setup</button>
                  <button onClick={startRound} disabled={!currentImageURL}>Start Round</button>
                </div>
                {currentImageURL && 
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <img src={currentImageURL} alt="Pool setup" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                  </div>
                }
                {players.length > 0 && players.map((player, index) => (
                  <div key={index} style={{ color: player.color }}>
                    {player.name}
                    <input 
                      ref={el => inputRefs.current[index] = el}
                      type="number" 
                      value={player.score}
                      step="1"
                      onChange={(e) => {
                        if (inputRefs.current[index]) {
                          inputRefs.current[index].value = e.target.value;
                        }
                        debouncedUpdateScore(index, e.target.value);
                      }}
                      onBlur={(e) => debouncedUpdateScore(index, e.target.value)} 
                      onWheel={(e) => {
                        e.preventDefault();
                        const delta = Math.sign(e.deltaY);
                        debouncedUpdateScore(index, (player.score - delta).toString());
                      }}
                      placeholder="Enter Points"
                    />
                  </div>
                ))}
                <button onClick={goBackToGame}>Back</button>
                <button onClick={endRound}>End Round</button>
                <button onClick={() => setShowGraph(!showGraph)}>{showGraph ? "Hide Graph" : "Show Graph"}</button>
              </>
            ) : (
              // Graph view
              <div>
                <BarChart width={500} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="white" />
                  <YAxis domain={[0, maxScore]} stroke="white" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ backgroundColor: 'black', color: 'white', padding: '5px', border: '1px solid white' }}>
                            <p>{`${payload[0].payload.name}: ${payload[0].payload.score}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {chartData.map((player, index) => (
                    <Bar key={index} dataKey="score" fill={player.color} />
                  ))}
                </BarChart>
                <button onClick={goBackToGame}>Back</button>
              </div>
            )}
          </>
        )}
      </main>
      <footer>
        <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
        {showSettings && (
          <div className="settings-menu">
            <button onClick={resetGame}>Reset Game</button>
            <button onClick={() => setShowRules(!showRules)}>Rules</button>
            {showRules && (
              <div className="rules-popup">
                <h2>Rules of Pattern Play Runouts</h2>
                <ul>
                  <li>Choose or randomly select a pool table setup for each round.</li>
                  <li>Points are awarded based on performance in each setup.</li>
                  <li>Negative scores are possible if a penalty is incurred.</li>
                  <li>The game continues until players decide to end it via settings.</li>
                  <li>Use the graph to see how scores evolve over rounds.</li>
                </ul>
                <button onClick={() => setShowRules(false)}>Close</button>
              </div>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;