import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';

import {
  gameTypeSelect,
  gameTypeOption,
  gameTypeSelected,
  createGameForm,
  gameDateTime,
  platformFee,
  formActions,
  confirmButton
} from './Games.module.sass';
import { GamesConsumer } from '../../contexts/GamesContext';
import PageTitle from '../PageTitle';
import Card from '../Card';
import Button from '../../components/Button';
import {
  TextInput,
  MoneyInput,
  SelectInput,
  DatePicker,
  Checkbox,
  getFormValues,
  isFormValid
} from '../../components/FormControls';
import Toast from '../../components/Toast';
import {
  DEFAULT_CREATE_FORM_FIELDS as defaultFormFields,
  PLAYERS_OPTIONS as playersOptions
} from './Games.constants';
import { GAME_TYPES as gameTypes } from '../../config';

class CreateGame extends Component {
  state = {
    formFields: defaultFormFields,
    playersOptions: [
      {
        value: '',
        label: 'Number of players'
      },
      ...playersOptions
    ],
    gameType: gameTypes[0],
    formKey: 0
  };

  onSubmit = e => {
    e.preventDefault();
    const { createGame, createTournament } = this.props;
    const { gameType, formFields } = this.state;
    const isPublic = gameType === gameTypes[0];
    const {
      tableTitle,
      maxPlayerCount,
      featured,
      minStakeAmount,
      stakeAmount,
      startDate,
      startTime
    } = getFormValues(formFields);
    this.setState({ createTitle: tableTitle });

    if (isPublic) {
      const publicGameData = {
        featured,
        maxPlayerCount,
        gameType,
        tableTitle,
        minStakeAmount
      };

      return createGame(publicGameData);
    }

    if (!isPublic) {
      const startHour = moment(startTime).hour();
      const startMinute = moment(startTime).minute();
      const startingAt = moment(startDate)
        .hours(startHour)
        .minute(startMinute);

      const tournamentData = {
        featured,
        startingAt,
        tournamentTitle: tableTitle,
        stakeAmount: minStakeAmount,
        prizeAmount: stakeAmount
      };

      return createTournament(tournamentData);
    }
  };

  onInputChange = (name, value, isValid) => {
    const formFields = {
      ...this.state.formFields,
      [name]: { value, isValid }
    };

    this.setState({ formFields });
  };

  onStartDateChange = async (name, value, isValid) => {
    await this.onInputChange(name, value, isValid);
    const isStartToday = moment(value).isSame(moment(), 'day');
    const startTimeIsPast =
      isStartToday &&
      moment(new Date()).isAfter(moment(this.state.formFields.startTime.value));
    startTimeIsPast && this.onInputChange('startTime', null, false);
  };

  setGameType = async gameType => {
    this.setState({ gameType });
    const isPublic = gameType === gameTypes[0];
    await this.onInputChange('maxPlayerCount', '', !isPublic);
    await this.onInputChange('stakeAmount', '', isPublic);
    await this.onInputChange('startDate', null, isPublic);
    this.onInputChange('startTime', null, isPublic);
  };

  resetForm = () => {
    const { formKey } = this.state;

    this.setState({
      formFields: defaultFormFields,
      gameType: 'public',
      formKey: formKey + 1
    });
  };

  componentDidUpdate(prevProps) {
    const { gameSuccess } = this.props;

    if (gameSuccess && !prevProps.gameSuccess) {
      this.resetForm();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    const {
      gameError,
      gameSuccess,
      resetGameError,
      resetGameSuccess
    } = this.props;
    gameError && resetGameError();
    gameSuccess && resetGameSuccess();
  }

  render() {
    const {
      gameLoading,
      gameError,
      gameSuccess,
      resetGameError,
      resetGameSuccess
    } = this.props;
    const {
      formFields,
      playersOptions,
      gameType,
      createTitle,
      formKey
    } = this.state;
    const {
      tableTitle,
      minStakeAmount,
      stakeAmount,
      startDate,
      startTime,
      maxPlayerCount,
      featured
    } = formFields;
    const isValidForm = isFormValid(formFields);
    const isStartToday = moment(startDate.value).isSame(moment(), 'day');
    const stakeProfit = stakeAmount.value && stakeAmount.value * 0.15;
    const isPublic = gameType === gameTypes[0];

    return (
      <>
        <PageTitle label="Manage Games" />
        <Card title="Create Game">
          <div className={gameTypeSelect}>
            <span>GAME TYPE</span>
            <div>
              {gameTypes.map((type, index) => (
                <span
                  key={index}
                  onClick={() => this.setGameType(type)}
                  className={cx(gameTypeOption, {
                    [gameTypeSelected]: gameType === type
                  })}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <form className={createGameForm} onSubmit={this.onSubmit}>
            <TextInput
              key={`n-${formKey}`}
              name="tableTitle"
              label="GAME NAME"
              value={tableTitle.value}
              required={true}
              onChange={this.onInputChange}
              placeholder="Enter game name"
            />

            <MoneyInput
              key={`s-${formKey}`}
              name="minStakeAmount"
              label="STAKE AMOUNT"
              value={minStakeAmount.value}
              required={true}
              onChange={this.onInputChange}
              placeholder="Enter stake amount"
            />

            {!isPublic && (
              <>
                <MoneyInput
                  key={`t-${formKey}`}
                  name="stakeAmount"
                  label="TOTAL PRIZE AMOUNT"
                  value={stakeAmount.value}
                  required={true}
                  onChange={this.onInputChange}
                  placeholder="Enter total prize amount"
                />

                {stakeProfit && (
                  <span className={platformFee}>
                    <strong>Platform fee (15%):</strong> ₦
                    {stakeProfit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                )}

                <div className={gameDateTime}>
                  <DatePicker
                    name="startDate"
                    label="START DATE"
                    selected={startDate.value}
                    onChange={this.onStartDateChange}
                    placeholder="Select date"
                    minDate={new Date()}
                    required={true}
                  />
                  <DatePicker
                    name="startTime"
                    label="START TIME"
                    selected={startTime.value}
                    onChange={this.onInputChange}
                    placeholder="Select time"
                    minTime={isStartToday && new Date()}
                    maxTime={isStartToday && new Date().setHours(23, 59)}
                    timeSelect={true}
                    required={true}
                  />
                </div>
              </>
            )}

            {isPublic && (
              <SelectInput
                key={`r-${formKey}`}
                options={playersOptions}
                name="maxPlayerCount"
                label="MAXIMUM PLAYERS ALLOWED"
                value={maxPlayerCount.value}
                required={true}
                onChange={this.onInputChange}
              />
            )}

            <Checkbox
              key={`f-${formKey}`}
              name="featured"
              checked={featured.value}
              onChange={this.onInputChange}
            >
              FEATURED GAME
            </Checkbox>

            <div className={formActions}>
              <Button
                className={confirmButton}
                type="sm"
                disabled={gameLoading || !isValidForm}
              >
                CONFIRM
              </Button>
            </div>
          </form>
        </Card>
        {gameError && (
          <Toast type="error" message={gameError} close={resetGameError} />
        )}

        {gameSuccess && (
          <Toast
            message={`${createTitle} created successfully`}
            close={resetGameSuccess}
          />
        )}
      </>
    );
  }
}

export default GamesConsumer(CreateGame);
