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
  confirmButton,
  loadingMask
} from './Games.module.sass';
import { GamesConsumer } from '../../contexts/GamesContext';
import PageTitle from '../PageTitle';
import Card from '../Card';
import Button from '../../components/Button';
import {
  TextInput,
  MoneyInput,
  DatePicker,
  Checkbox,
  getFormValues,
  getUpdatedFormFields,
  isFormValid
} from '../../components/FormControls';
import Toast from '../../components/Toast';
import { GAME_TYPES as gameTypes } from '../../config';

class EditGame extends Component {
  state = {
    formFields: {
      tableTitle: { value: '', isValid: true },
      minStakeAmount: { value: '', isValid: true },
      stakeAmount: { value: '', isValid: true },
      startDate: { value: null, isValid: true },
      startTime: { value: null, isValid: true },
      featured: { value: false, isValid: true }
    },
    gameType: gameTypes[1],
    formKey: 0,
    loadingGame: true
  };

  onSubmit = e => {
    e.preventDefault();
    const { updateGame, match } = this.props;
    const { gameType, formFields } = this.state;
    const {
      tableTitle,
      featured,
      minStakeAmount,
      stakeAmount,
      startDate,
      startTime
    } = getFormValues(formFields);

    const startHour = moment(startTime).hour();
    const startMinute = moment(startTime).minute();

    const gameData = {
      featured,
      gameType,
      tableTitle,
      minStakeAmount,
      stakeAmount,
      startingAt: moment(startDate)
        .hours(startHour)
        .minute(startMinute)
    };

    updateGame(match.params.id, gameData);
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

  setFieldsData = data => {
    const { startingAt, playerCount } = data;
    data.startDate = moment(startingAt).toDate();
    data.startTime = moment(startingAt).toDate();
    const formFields = getUpdatedFormFields(this.state.formFields, data);

    this.setState({
      formFields,
      playerCount,
      loadingGame: false
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const { getGame, match } = this.props;
    getGame(match.params.id, this.setFieldsData);
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
    const { loadingGame, formFields, playerCount } = this.state;
    const {
      tableTitle,
      minStakeAmount,
      stakeAmount,
      startDate,
      startTime,
      featured
    } = formFields;
    const isValidForm = isFormValid(formFields);
    const isStartToday = moment(startDate.value).isSame(moment(), 'day');
    const stakeProfit = stakeAmount.value && stakeAmount.value * 0.15;

    return (
      <>
        <PageTitle label="Manage Games" />
        <Card title="Edit Game">
          <div className={gameTypeSelect}>
            <span>GAME TYPE</span>
            <div>
              <span className={cx(gameTypeOption, gameTypeSelected)}>
                {gameTypes[1]}
              </span>
            </div>
          </div>
          <form className={createGameForm} onSubmit={this.onSubmit}>
            <TextInput
              name="tableTitle"
              label="GAME NAME"
              value={tableTitle.value}
              required={true}
              onChange={this.onInputChange}
              placeholder="Enter game name"
            />

            <MoneyInput
              name="minStakeAmount"
              label="STAKE AMOUNT"
              value={minStakeAmount.value}
              required={true}
              disabled={Boolean(playerCount)}
              onChange={this.onInputChange}
              placeholder="Enter stake amount"
            />

            <MoneyInput
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

            <Checkbox
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
          {loadingGame && <div className={loadingMask} />}
        </Card>
        {gameError && (
          <Toast type="error" message={gameError} close={resetGameError} />
        )}

        {gameSuccess && (
          <Toast message="Game updated successfully" close={resetGameSuccess} />
        )}
      </>
    );
  }
}

export default GamesConsumer(EditGame);
