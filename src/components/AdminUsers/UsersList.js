import React, { Component } from 'react';
import moment from 'moment';

import styles from './AdminUsers.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import PageTitle from '../PageTitle';
import Card from '../Card';
import Table from '../Table';
import SideModal from '../SideModal';
import PillText from '../PillText';
import UserCard from './UserCard';
import Button from '../../components/Button';
import { SearchInput, SelectInput } from '../../components/FormControls';
import { ADMIN_ROLES as adminRoles } from '../../config';
import { users } from './resources';

class UsersList extends Component {
  state = {
    query: '',
    role: '',
    roleOptions: [
      {
        value: '',
        label: 'Role'
      },
      ...adminRoles
    ],
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

  fetchData = () => {
    this.setState({ fetchingData: true });
    const { order, sortAsc, dataOffset, query, role } = this.state;

    const queryParams = {
      $order: `${sortAsc ? '+' : '-'}${order}`,
      $offset: dataOffset,
      $limit: 10,
      $include: 'roles.permissions',
      '$roles.permissions.id$': 'admin-app:read',
      $searchFields: 'firstName,lastName,email'
    };

    if (role) {
      queryParams['$roles.id$'] = role;
    }

    if (query) {
      queryParams['$q'] = query;
    }

    users
      .get(queryParams, true, '?$roles.permissions.id$=*')
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

  setActiveUser = activeUser => {
    this.setState({ activeUser });
  };

  componentDidUpdate(prevProps) {
    const { profileSuccess, deleteUserSuccess, resetAuthSuccess } = this.props;

    if (
      (deleteUserSuccess && !prevProps.deleteUserSuccess) ||
      (profileSuccess && !prevProps.profileSuccess)
    ) {
      deleteUserSuccess && this.setActiveUser(null);
      this.fetchData();
      resetAuthSuccess();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchData();
  }

  render() {
    const {
      query,
      role,
      roleOptions,
      tableData,
      tableMetadata,
      order,
      sortAsc,
      fetchingData,
      activeUser
    } = this.state;
    const { user, deleteUser, authLoading } = this.props;
    const isLoggedInUserActive = activeUser && user.id === activeUser.id;

    const getRoleGroup = roles => {
      if (!roles.length) {
        return {};
      }

      const role = roles[0].name;
      const roleData = adminRoles.find(({ value }) => value === role);
      const label = roleData ? roleData.label : '';

      return { role, label };
    };

    const columns = [
      {
        header: 'Date Created',
        render: ({ createdAt }) => (
          <>{moment(createdAt).format('DD MMM YYYY; mm:hh A')}</>
        ),
        key: 'createdAt'
      },
      {
        header: 'Full Name',
        render: ({ name }) => <span>{name}</span>,
        key: 'firstName'
      },
      {
        header: 'Email Address',
        key: 'email'
      },
      {
        header: 'Role',
        render: ({ roles }) => {
          const { role, label } = getRoleGroup(roles);
          return <PillText className={styles[role]}> {label} </PillText>;
        },
        key: 'roles.id'
      },
      {
        header: 'Status',
        render: ({ status }) => (
          <PillText className={styles[status]}> {status} </PillText>
        ),
        key: 'status'
      }
    ];

    return (
      <>
        <PageTitle label="Direct Access Control List" />
        <Card title="Admin User List">
          <nav className={styles.listFilters}>
            <SearchInput
              name="query"
              value={query}
              onChange={this.onQueryChange}
              placeholder="Search by Email or Name"
            />

            <SelectInput
              options={roleOptions}
              name="role"
              value={role}
              onChange={this.onRoleChange}
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
          <SideModal close={() => this.setActiveUser(null)}>
            <UserCard {...activeUser} />
            {!isLoggedInUserActive && (
              <Button
                className={styles.removeButton}
                type="sm"
                disabled={authLoading}
                onClick={() => deleteUser(activeUser.id)}
              >
                REMOVE ADMIN
              </Button>
            )}
          </SideModal>
        )}
      </>
    );
  }
}

export default UserConsumer(UsersList);
