import React, {useEffect, useState} from 'react';
import TrainImage from '../images/newTrainTrack.gif';
import TrainTrack from '../images/Track.png';
import TrainRock from '../images/Stoneandgrass.png';
import GifPlayer from 'react-gif-player';
import {PetraWallet} from 'petra-plugin-wallet-adapter';
import {BloctoWallet} from '@blocto/aptos-wallet-adapter-plugin';

const Train = ({tpsValue}) => {
  const [tps, setTps] = useState(tpsValue);
  const [tpsSpeedClass, setTpsSpeedClass] = useState('');

  useEffect(() => {
    setTps(() => tpsValue);

    if (tps >= 0 && tps <= 15) {
      setTpsSpeedClass('train-low');
    } else if (tps >= 16 && tps <= 20) {
      setTpsSpeedClass('train-low_med');
    } else if (tps >= 21 && tps <= 30) {
      setTpsSpeedClass('train-medium');
    } else if (tps >= 31) {
      setTpsSpeedClass('train-high');
    }
  }, [tpsValue]);
  // 0 20-20 50-50 100 100+
  // train-low, train-low_med,train-medium,train-high

  return (
    <div style={{marginBottom: 30}} className="gif-container" speed="10ms">
      <div className="train_mid_hold">
        <div className="train_move-wrap">
          {/* <img src={TrainImage} alt='' />
           */}
          <GifPlayer gif={TrainImage} autoplay={true} />
        </div>
        <div className={`train_track-wrap ${tpsSpeedClass}`}>
          <img src={TrainTrack} alt="" />
          <img src={TrainTrack} alt="" />
        </div>
        <div className={`train_track-wrap train-rocks ${tpsSpeedClass}`}>
          <img src={TrainRock} alt="" />
          <img src={TrainRock} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Train;
