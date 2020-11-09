import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  profileEdit,
  profileEditContent,
  formActions
} from './Users.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import {
  PhoneInput,
  getFormValues,
  isFormValid
} from '../../components/FormControls';
import Button from '../../components/Button';
import { isValidPhone } from '../../utils';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    const { mobile } = props.profile;

    this.state = {
      formFields: {
        mobile: { value: mobile || '', isValid: Boolean(mobile) }
      }
    };
  }

  onSubmit = e => {
    e.preventDefault();
    const { profile, updatePlayer } = this.props;
    const userData = getFormValues(this.state.formFields);

    updatePlayer(profile.id, userData);
  };

  onInputChange = (name, value, isValid) => {
    const formFields = {
      ...this.state.formFields,
      [name]: { value, isValid }
    };

    this.setState({ formFields });
  };

  render() {
    const { profile, authLoading, close } = this.props;
    const { formFields } = this.state;
    const { mobile } = formFields;
    const isValidForm = isFormValid(formFields);

    return (
      <div className={profileEdit}>
        <div>
          <header>EDIT PROFILE - {profile.name}</header>
          <div className={profileEditContent}>
            <form onSubmit={this.onSubmit}>
              <PhoneInput
                name="mobile"
                label="PHONE NUMBER"
                value={mobile.value}
                validator={isValidPhone}
                onChange={this.onInputChange}
                placeholder="Set Phone Number"
                maxLength={14}
                required
              />
              <div className={formActions}>
                <span onClick={close}>CANCEL</span>
                <Button disabled={authLoading || !isValidForm} type="sm">
                  SAVE CHANGES
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ProfileEdit.propTypes = {
  profile: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired
};

export default UserConsumer(ProfileEdit);
