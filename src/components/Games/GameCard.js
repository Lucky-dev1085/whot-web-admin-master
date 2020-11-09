import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { gameCard, gameCardSummary } from './Games.module.sass';
import { GamesConsumer } from '../../contexts/GamesContext';
import { GAME_STATUSES as gameStatuses } from '../../config';

const GameCard = ({
  tableTitle,
  startingAt,
  minStakeAmount,
  stakeAmount,
  gameType,
  gameStatus
}) => {
  const statusData = gameStatuses.find(({ value }) => value === gameStatus);
  const statusLabel = statusData ? statusData.label : '.';

  return (
    <div className={gameCard}>
      <h3>{tableTitle}</h3>
      <div>
        <div className={gameCardSummary}>
          {startingAt && (
            <span>{moment(startingAt).format('DD MMM, YYYY')}</span>
          )}
          <span>TERRY3</span>
        </div>
        {startingAt && <span>{moment(startingAt).format('h:mm A')}</span>}
      </div>
      <div>
        <div>
          <span>TOTAL PRIZE</span>
          <h4>₦{stakeAmount.toLocaleString()}</h4>
        </div>
        <div>
          <span>AMOUNT STAKED</span>
          <h4>₦{minStakeAmount.toLocaleString()}</h4>
        </div>
        <div>
          <span>GAME TYPE</span>
          <h4>{gameType}</h4>
        </div>
        <div>
          <span>STATUS</span>
          <h4>{statusLabel}</h4>
        </div>
      </div>
    </div>
  );
};

GameCard.propTypes = {
  tableTitle: PropTypes.string.isRequired,
  startingAt: PropTypes.string,
  minStakeAmount: PropTypes.number,
  stakeAmount: PropTypes.number,
  gameType: PropTypes.string,
  gameStatus: PropTypes.string
};

export default GamesConsumer(GameCard);
