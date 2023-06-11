import React, { useEffect } from 'react';
import TrainImage from '../images/trainnotrack.gif';
import TrainTrack from '../images/Track.png'
const Train = () => {
  useEffect(() => {}, []);

  return (
    <div style={{ marginBottom: 30 }} className='gif-container' speed='10ms'>
          <div className='train_mid_hold'>
            <div className='train_move-wrap'>
              <img src={TrainImage} alt=''/>
            </div>
            <div className='train_track-wrap'>
              <img src={TrainTrack} alt='' />
            </div>
          </div>
    </div>
  );
};

export default Train;
