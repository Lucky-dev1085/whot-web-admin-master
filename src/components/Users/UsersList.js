import React, { Component } from 'react';
import moment from 'moment';

import styles from './Users.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import PageTitle from '../PageTitle';
import Card from '../Card';
import Table from '../Table';
import SideModal from '../SideModal';
import Toast from '../../components/Toast';
import UserCard from './UserCard';
import ProfileEdit from './ProfileEdit';
import Button from '../../components/Button';
import { SearchInput } from '../../components/FormControls';
import { players } from './resources';

class UsersList extends Component {
  state = {
    query: '',
    order: 'createdAt',
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

  onRoleChange = (name, role) => {
    this.setState(
      {
        role,
        dataOffset: 0
      },
      this.fetchData
    );
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

  fetchData = callBack => {
    this.setState({ fetchingData: true });
    const { order, sortAsc, dataOffset, query } = this.state;

    const queryParams = {
      $order: `${sortAsc ? '+' : '-'}${order}`,
      $offset: dataOffset,
      $limit: 10,
      $include: 'user',
      $searchFields: 'name, $user.email$'
    };

    if (query) {
      queryParams['$q'] = query;
    }

    players
      .get(queryParams, true)
      .then(resp => {
        const { data, ...tableMetadata } = resp.data;

        this.setState(
          {
            tableMetadata,
            tableData: data,
            fetchingData: false
          },
          () => {
            callBack && callBack();
          }
        );
      })
      .catch(error => {
        this.setState({ fetchingData: false });
      });
  };

  onPageSelect = number => {
    this.setState({ dataOffset: (number - 1) * 10 }, this.fetchData);
  };

  setActiveUser = activeUser => {
    this.setState({ activeUser });
  };

  updateActiveUserProfile = () => {
    const { activeUser, tableData } = this.state;
    const updatedProfile = tableData.find(({ id }) => activeUser.id === id);
    this.setState({ activeUser: updatedProfile });
  };

  componentDidUpdate(prevProps) {
    const { profileSuccess, deleteUserSuccess, resetAuthSuccess } = this.props;
    const { activeUser } = this.state;

    if (
      (deleteUserSuccess && !prevProps.deleteUserSuccess) ||
      (profileSuccess && !prevProps.profileSuccess)
    ) {
      if (deleteUserSuccess) {
        this.setActiveUser(null);
        resetAuthSuccess();
      }

      if (profileSuccess && activeUser) {
        this.setState({ editProfile: false });
        this.fetchData(this.updateActiveUserProfile);
      } else {
        this.fetchData();
      }
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchData();
  }

  componentWillUnmount() {
    const {
      profileError,
      profileSuccess,
      resetAuthError,
      resetAuthSuccess
    } = this.props;
    profileError && resetAuthError();
    profileSuccess && resetAuthSuccess();
  }

  render() {
    const {
      query,
      tableData,
      tableMetadata,
      order,
      sortAsc,
      fetchingData,
      activeUser,
      editProfile
    } = this.state;
    const {
      deleteUser,
      authLoading,
      profileSuccess,
      resetAuthSuccess
    } = this.props;

    const columns = [
      {
        header: 'Date Created',
        render: ({ createdAt }) => (
          <>{moment(createdAt).format('DD MMM YYYY; mm:hh A')}</>
        ),
        key: 'createdAt'
      },
      {
        header: 'Username',
        key: 'name'
      },
      {
        header: 'Email Address',
        render: ({ user }) => <> {user && user.email} </>,
        key: 'user.email'
      },
      {
        header: 'Total Balance',
        render: ({ withdrawalBalance }) => (
          <> ₦{withdrawalBalance.toLocaleString()} </>
        ),
        key: 'withdrawalBalance'
      }
    ];

    const activeGameTableData = [
      {
        date: '12-02-19',
        name: `Jack's Game Final`,
        stakeAmount: 400,
        outcome: -400,
        result: 'Winner'
      },
      {
        date: '12-02-19',
        name: `Jack's Game Final`,
        stakeAmount: 400,
        outcome: 4400,
        result: 'Winner'
      }
    ];

    const activeGameColumns = [
      {
        header: 'Date',
        key: 'date',
        preventSort: true
      },
      {
        header: 'Game Name',
        key: 'name',
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
        header: 'Amount Won/Lost',
        render: ({ outcome }) => (
          <span className={outcome < 0 ? styles.loss : styles.profit}>
            {outcome < 0 ? '-' : '+'} ₦{Math.abs(outcome).toLocaleString()}
          </span>
        ),
        preventSort: true
      },
      {
        header: 'Result',
        key: 'result',
        preventSort: true
      }
    ];

    return (
      <>
        <PageTitle label="Users" />
        <Card title="Manage Users">
          <nav className={styles.listFilters}>
            <SearchInput
              name="query"
              value={query}
              onChange={this.onQueryChange}
              placeholder="Search by Username or Email"
            />
          </nav>

          <Table
            data={tableData}
            columns={columns}
            metadata={tableMetadata}
            onHeaderClick={this.setOrder}
            sortKey={order}
            sortAsc={sortAsc}
            onPageSelect={this.onPageSelect}
            isLoading={fetchingData}
            onRowClick={this.setActiveUser}
          />
        </Card>
        {activeUser && (
          <SideModal
            className={styles.usersSideModal}
            close={() => this.setActiveUser(null)}
          >
            <UserCard
              {...activeUser}
              editUser={() => this.setState({ editProfile: true })}
            />
            <div className={styles.gameDetails}>
              <h3>GAME HISTORY</h3>
              <Table
                className={styles.gameDetailsTable}
                data={activeGameTableData}
                columns={activeGameColumns}
                isLoading={false}
                hideMetaData={true}
              />
            </div>

            <Button
              className={styles.removeButton}
              type="sm"
              disabled={authLoading}
              onClick={() => activeUser.user && deleteUser(activeUser.user.id)}
            >
              DELETE USER
            </Button>
          </SideModal>
        )}
        {editProfile && (
          <ProfileEdit
            profile={activeUser}
            close={() => this.setState({ editProfile: false })}
          />
        )}
        {profileSuccess && (
          <Toast
            message="Profile updated successfully"
            close={resetAuthSuccess}
          />
        )}
      </>
    );
  }
}

export default UserConsumer(UsersList);
