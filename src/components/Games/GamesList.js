import React, { Component } from 'react';
import moment from 'moment';

import styles from './Games.module.sass';
import { GamesConsumer } from '../../contexts/GamesContext';
import PageTitle from '../PageTitle';
import Card from '../Card';
import Table from '../Table';
import SideModal from '../SideModal';
import PillText from '../PillText';
import GameCard from './GameCard';
import Button, { LinkButton } from '../../components/Button';
import {
  SearchInput,
  SelectInput,
  DatePicker
} from '../../components/FormControls';
import { GAME_STATUSES as gameStatuses } from '../../config';
import { games } from './resources';

class GamesList extends Component {
  state = {
    query: '',
    gameStatus: '',
    statusOptions: [
      {
        value: '',
        label: 'Status'
      },
      ...gameStatuses
    ],
    startDate: null,
    endDate: null,
    order: 'startingAt',
    sortAsc: false,
    dataOffset: 0,
    tableData: [],
    tableMetadata: {}
  };

  queryTimeout = null;

  onQueryChange = (name, query) => {
    this.setState({ query });

    clearTimeout(this.queryTimeout);
    this.queryTimeout = setTimeout(() => {
      this.setState({ dataOffset: 0 }, this.fetchData);
    }, 500);
  };

  onStatusChange = (name, gameStatus) => {
    this.setState(
      {
        gameStatus,
        dataOffset: 0
      },
      this.fetchData
    );
  };

  onDateChange = (name, selectedDate) => {
    if (selectedDate) {
      this.setState(
        {
          [name]: selectedDate,
          dataOffset: 0
        },
        () => this.state.endDate && this.fetchData()
      );
    } else {
      this.setState(
        {
          startDate: null,
          endDate: null,
          dataOffset: 0
        },
        this.fetchData
      );
    }
  };

  setOrder = key => {
    const { order, sortAsc } = this.state;

    this.setState(
      {
        order: key,
        sortAsc: key === order && sortAsc ? false : true,
        dataOffset: 0
      },
      this.fetchData
    );
  };

  fetchData = () => {
    this.setState({ fetchingData: true });
    const {
      order,
      sortAsc,
      dataOffset,
      query,
      gameStatus,
      startDate,
      endDate
    } = this.state;

    const queryParams = {
      $order: `${sortAsc ? '+' : '-'}${order}`,
      $offset: dataOffset,
      $limit: 10,
      $searchFields: 'tableTitle'
    };

    if (gameStatus) {
      queryParams['gameStatus'] = gameStatus;
    }

    if (startDate && endDate) {
      queryParams['startingAt[$gt]'] = moment(startDate).format('YYYY-MM-DD');
      queryParams['startingAt[$lt]'] = moment(endDate).format('YYYY-MM-DD');
    }

    if (query) {
      queryParams['$q'] = query;
    }

    games
      .get(queryParams, true)
      .then(resp => {
        const { data, ...tableMetadata } = resp.data;

        this.setState({
          tableMetadata,
          tableData: data,
          fetchingData: false
        });
      })
      .catch(error => {
        this.setState({ fetchingData: false });
      });
  };

  onPageSelect = number => {
    this.setState({ dataOffset: (number - 1) * 10 }, this.fetchData);
  };

  setActiveGame = activeGame => {
    this.setState({ activeGame });
  };

  componentDidUpdate(prevProps) {
    const { gameSuccess, resetGameSuccess } = this.props;

    if (gameSuccess && !prevProps.gameSuccess) {
      this.setActiveGame(null);
      this.fetchData();
      resetGameSuccess();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchData();
  }

  render() {
    const {
      query,
      gameStatus,
      statusOptions,
      startDate,
      endDate,
      tableData,
      tableMetadata,
      order,
      sortAsc,
      fetchingData,
      activeGame
    } = this.state;
    const { updateGame, gameLoading } = this.props;

    const getStatusLabel = status => {
      const statusData = gameStatuses.find(({ value }) => value === status);
      return statusData ? statusData.label : '';
    };

    const columns = [
      {
        header: 'Date',
        render: ({ startingAt }) => (
          <>{startingAt ? moment(startingAt).format('DD MMM, YYYY') : ' - '}</>
        ),
        key: 'startingAt'
      },
      {
        header: 'Name',
        key: 'tableTitle'
      },
      {
        header: 'Amount Staked',
        render: ({ minStakeAmount }) => (
          <span>₦{minStakeAmount.toLocaleString()}</span>
        ),
        key: 'minStakeAmount'
      },
      {
        header: 'Total Prize',
        render: ({ stakeAmount }) => (
          <span>₦{stakeAmount.toLocaleString()}</span>
        ),
        key: 'stakeAmount'
      },
      {
        header: 'Profit',
        render: ({ profitAmount }) => (
          <span>₦{profitAmount.toLocaleString()}</span>
        ),
        key: 'profitAmount'
      },
      {
        header: 'Game type',
        render: ({ gameType }) => (
          <PillText className={styles.tableGameType}>{gameType}</PillText>
        ),
        key: 'gameType'
      },
      {
        header: 'Status',
        render: ({ gameStatus }) => (
          <PillText className={styles[gameStatus]}>
            {' '}
            {getStatusLabel(gameStatus)}{' '}
          </PillText>
        ),
        key: 'gameStatus'
      }
    ];

    const activeGameTableData = [
      {
        player: 'TERRY34',
        stakeAmount: 400,
        standing: 'Winner'
      },
      {
        player: 'JAKELK',
        stakeAmount: 400,
        standing: 'Runner'
      }
    ];

    const activeGameColumns = [
      {
        header: 'Player',
        key: 'player',
        preventSort: true
      },
      {
        header: 'Amount Staked',
        render: ({ stakeAmount }) => (
          <span>₦{stakeAmount.toLocaleString()}</span>
        ),
        preventSort: true
      },
      {
        header: 'Standing',
        key: 'standing',
        preventSort: true
      }
    ];

    return (
      <>
        <PageTitle label="Manage Games" />
        <Card title="Games List">
          <nav className={styles.listFilters}>
            <SearchInput
              name="query"
              value={query}
              onChange={this.onQueryChange}
              placeholder="Search by Game Name"
            />

            <SelectInput
              options={statusOptions}
              name="gameStatus"
              value={gameStatus}
              onChange={this.onStatusChange}
            />

            <div className={styles.dateFilter}>
              <DatePicker
                selected={startDate}
                maxDate={endDate}
                name="startDate"
                onChange={this.onDateChange}
                placeholder="Select Date range"
                dateFormat="dd-MM-yyyy"
                withIcon={true}
              />

              {startDate && (
                <>
                  <span> - </span>
                  <DatePicker
                    selected={endDate}
                    minDate={startDate}
                    name="endDate"
                    onChange={this.onDateChange}
                    placeholder="End Date"
                    dateFormat="dd-MM-yyyy"
                    isClearable
                  />
                </>
              )}
            </div>
          </nav>

          <Table
            className={styles.gamesTable}
            data={tableData}
            columns={columns}
            metadata={tableMetadata}
            onHeaderClick={this.setOrder}
            sortKey={order}
            sortAsc={sortAsc}
            onPageSelect={this.onPageSelect}
            isLoading={fetchingData}
            onRowClick={this.setActiveGame}
          />
        </Card>
        {activeGame && (
          <SideModal
            className={styles.gamesSideModal}
            close={() => this.setActiveGame(null)}
          >
            <GameCard {...activeGame} />
            <div className={styles.gameDetails}>
              <h3>GAME DETAILS</h3>
              <Table
                className={styles.gameDetailsTable}
                data={activeGameTableData}
                columns={activeGameColumns}
                isLoading={false}
                hideMetaData={true}
              />
            </div>
            {activeGame.gameStatus === gameStatuses[0].value && (
              <div className={styles.modalActions}>
                <LinkButton type="sm" to={`/games/${activeGame.id}`}>
                  EDIT GAME
                </LinkButton>
                <Button
                  type="sm"
                  disabled={gameLoading}
                  onClick={() =>
                    updateGame(activeGame.id, { gameStatus: 'cancelled' })
                  }
                >
                  CANCEL THIS GAME
                </Button>
              </div>
            )}
          </SideModal>
        )}
      </>
    );
  }
}

export default GamesConsumer(GamesList);
