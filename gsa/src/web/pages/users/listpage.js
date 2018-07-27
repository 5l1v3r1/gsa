/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 - 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import 'core-js/fn/array/includes';

import React from 'react';

import {connect} from 'react-redux';

import _ from 'gmp/locale';

import {USERS_FILTER_FILTER, ALL_FILTER} from 'gmp/models/filter';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';
import compose from 'web/utils/compose';
import withCapabilities from 'web/utils/withCapabilities';
import withGmp from 'web/utils/withGmp';

import SelectionType from 'web/utils/selectiontype';

import EntitiesPage from 'web/entities/page';
import withEntitiesContainer from 'web/entities/withEntitiesContainer';

import ManualIcon from 'web/components/icon/manualicon';
import NewIcon from 'web/components/icon/newicon';

import IconDivider from 'web/components/layout/icondivider';

import {createFilterDialog} from 'web/components/powerfilter/dialog';

import {
  loadEntities,
  selector as entitiesSelector,
} from 'web/store/entities/users';

import ConfirmDeleteDialog from './confirmdeletedialog';
import UserComponent from './component';
import UsersTable, {SORT_FIELDS} from './table';

const ToolBarIcons = withCapabilities(({
  capabilities,
  onUserCreateClick,
}) => (
  <IconDivider>
    <ManualIcon
      page="gui_administration"
      anchor="user-management"
      title={_('Help: Users')}
    />
    {capabilities.mayCreate('user') &&
      <NewIcon
        title={_('New User')}
        onClick={onUserCreateClick}
      />
    }
  </IconDivider>
));

ToolBarIcons.propTypes = {
  onUserCreateClick: PropTypes.func.isRequired,
};

const UsersFilterDialog = createFilterDialog({
  sortFields: SORT_FIELDS,
});

class UsersPage extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {confirmDeleteDialogVisible: false};

    this.handleDeleteUser = this.handleDeleteUser.bind(this);

    this.closeConfirmDeleteDialog = this.closeConfirmDeleteDialog.bind(this);
    this.openConfirmDeleteDialog = this.openConfirmDeleteDialog.bind(this);
  }

  handleDeleteUser({deleteUsers, inheritorId}) {
    const {gmp, onChanged} = this.props;

    if (inheritorId === '--') {
      inheritorId = undefined;
    }

    if (deleteUsers.length === 1) {
      const {id} = deleteUsers[0]; // eslint-disable-line prefer-destructuring
      return gmp.user.delete({id, inheritorId}).then(onChanged);
    }

    return gmp.users.delete(deleteUsers, {inheritor_id: inheritorId})
      .then(onChanged);
  }

  openConfirmDeleteDialog(user) {
    const {loadAll, gmp} = this.props;

    loadAll();

    if (isDefined(user)) {
      this.setState({
        confirmDeleteDialogVisible: true,
        id: user.id,
        deleteUsers: [user],
        title: _('Confirm deletion of user {{name}}', user),
      });

    }
    else {
      const {selectionType} = this.props;
      let promise;

      if (selectionType === SelectionType.SELECTION_USER) {
        const {entitiesSelected} = this.props;
        promise = Promise.resolve([...entitiesSelected]);
      }
      else if (selectionType === SelectionType.SELECTION_PAGE_CONTENTS) {
        const {entities} = this.props;
        promise = Promise.resolve(entities);
      }
      else {
        const {filter} = this.props;
        // TODO these users should be loaded from the store too
        promise = gmp.users.getAll({filter}).then(resp => resp.data);
      }

      promise.then(deleteUsers => {
        this.setState({
          confirmDeleteDialogVisible: true,
          deleteUsers,
          title: _('Confirm deletion of users'),
        });
      });
    }
  }

  closeConfirmDeleteDialog() {
    this.setState({confirmDeleteDialogVisible: false});
  }

  render() {
    const {
      allUsers = [],
      onChanged,
      onDownloaded,
      onError,
      ...props
    } = this.props;

    const {
      confirmDeleteDialogVisible,
      deleteUsers = [],
      title,
    } = this.state;

    const deleteUserIds = deleteUsers.map(luser => luser.id);
    const inheritorUsers = allUsers.filter(
      user => !deleteUserIds.includes(user.id));

    return (
      <React.Fragment>
        <UserComponent
          onCreated={onChanged}
          onSaved={onChanged}
          onCloned={onChanged}
          onCloneError={onError}
          onDeleted={onChanged}
          onDeleteError={onError}
          onDownloaded={onDownloaded}
          onDownloadError={onError}
        >{({
          clone,
          create,
          download,
          edit,
          save,
        }) => (
          <EntitiesPage
            {...props}
            filterEditDialog={UsersFilterDialog}
            filtersFilter={USERS_FILTER_FILTER}
            sectionIcon="user.svg"
            table={UsersTable}
            title={_('Users')}
            toolBarIcons={ToolBarIcons}
            onChanged={onChanged}
            onDeleteBulk={this.openConfirmDeleteDialog}
            onDownloaded={onDownloaded}
            onError={onError}
            onUserCloneClick={clone}
            onUserCreateClick={create}
            onUserDeleteClick={this.openConfirmDeleteDialog}
            onUserDownloadClick={download}
            onUserEditClick={edit}
            onUserSaveClick={save}
          />
        )}
        </UserComponent>
        {confirmDeleteDialogVisible &&
          <ConfirmDeleteDialog
            deleteUsers={deleteUsers}
            title={title}
            inheritorUsers={inheritorUsers}
            onClose={this.closeConfirmDeleteDialog}
            onSave={this.handleDeleteUser}
          />
        }
      </React.Fragment>
    );
  }
}

UsersPage.propTypes = {
  allUsers: PropTypes.array,
  entities: PropTypes.array,
  entitiesSelected: PropTypes.set,
  filter: PropTypes.filter,
  gmp: PropTypes.gmp.isRequired,
  loadAll: PropTypes.func.isRequired,
  selectionType: PropTypes.string.isRequired,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const selector = entitiesSelector(state);
  return {
    allUsers: selector.getEntities(ALL_FILTER),
  };
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  loadAll: () => dispatch(loadEntities({gmp, filter: ALL_FILTER})),
});

export default compose(
  withGmp,
  withEntitiesContainer('user', {
    entitiesSelector,
    loadEntities,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(UsersPage);

// vim: set ts=2 sw=2 tw=80:
