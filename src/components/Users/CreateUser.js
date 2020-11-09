import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  createUserCard,
  createUserForm,
  emailInput,
  roleInput,
  formActions,
  confirmButton
} from './AdminUsers.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import PageTitle from '../PageTitle';
import Card from '../Card';
import Button from '../../components/Button';
import {
  EmailInput,
  SelectInput,
  getFormValues
} from '../../components/FormControls';
import { ADMIN_ROLES as adminRoles } from '../../config';
import Toast from '../../components/Toast';
import { DEFAULT_CREATE_FORM_FIELDS as defaultFormFields } from './AdminUsers.constants';

class CreateUser extends Component {
  state = {
    formFields: defaultFormFields,
    formKey: 0
  };

  onSubmit = e => {
    e.preventDefault();
    const { email, role } = getFormValues(this.state.formFields);
    this.setState({ createEmail: email });

    this.props.createUser({
      email,
      name: email,
      termsAgreed: true,
      roles: { add: [role] }
    });
  };

  onInputChange = (name, value, isValid) => {
    const formFields = {
      ...this.state.formFields,
      [name]: { value, isValid }
    };

    this.setState({ formFields });
  };

  resetForm = () => {
    const { formKey } = this.state;

    this.setState({
      formFields: defaultFormFields,
      formKey: formKey + 1
    });
  };

  componentDidUpdate(prevProps) {
    const { profileSuccess } = this.props;

    if (profileSuccess && !prevProps.profileSuccess) {
      this.resetForm();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
      authLoading,
      profileError,
      profileSuccess,
      resetAuthError,
      resetAuthSuccess
    } = this.props;
    const { formFields, createEmail, formKey } = this.state;
    const { email, role } = formFields;

    return (
      <>
        <PageTitle label="Direct Access Control List" />
        <Card title="Create Admin" className={createUserCard}>
          <form className={createUserForm} onSubmit={this.onSubmit}>
            <EmailInput
              key={`e-${formKey}`}
              className={emailInput}
              name="email"
              label="EMAIL ADDRESS"
              value={email.value}
              required={true}
              onChange={this.onInputChange}
              placeholder="Enter email address"
            />

            <SelectInput
              key={`r-${formKey}`}
              options={adminRoles}
              className={roleInput}
              name="role"
              label="ADMIN ROLE"
              value={role.value}
              onChange={this.onInputChange}
            />

            <div className={formActions}>
              <Link to="/admin-users">CANCEL</Link>
              <Button
                className={confirmButton}
                type="sm"
                disabled={authLoading || !email.isValid}
              >
                CONFIRM
              </Button>
            </div>
          </form>
        </Card>
        {profileError && (
          <Toast type="error" message={profileError} close={resetAuthError} />
        )}

        {profileSuccess && (
          <Toast
            message={`${createEmail} will receive an email with further setup instructions`}
            close={resetAuthSuccess}
          />
        )}
      </>
    );
  }
}

export default UserConsumer(CreateUser);
