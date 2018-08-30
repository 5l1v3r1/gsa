/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
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
import React from 'react';

import _ from 'gmp/locale';

import PropTypes from 'web/utils/proptypes';

import EntityPage from 'web/entity/page';
import EntityContainer, {
  permissions_resource_loader,
} from 'web/entity/container';
import {goto_details, goto_list} from 'web/entity/component';
import EntitiesTab from 'web/entity/tab';

import CloneIcon from 'web/entity/icon/cloneicon';
import CreateIcon from 'web/entity/icon/createicon';
import EditIcon from 'web/entity/icon/editicon';
import TrashIcon from 'web/entity/icon/trashicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout.js';

import ExportIcon from 'web/components/icon/exporticon';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import FilterDetails from './details';
import FilterComponent from './component';

const ToolBarIcons = ({
  entity,
  onFilterCloneClick,
  onFilterCreateClick,
  onFilterDeleteClick,
  onFilterDownloadClick,
  onFilterEditClick,
}) => (
  <Divider margin="10px">
    <IconDivider>
      <ManualIcon
        page="search"
        searchTerm="filter"
        title={_('Help: Filters')}
      />
      <ListIcon
        title={_('Filter List')}
        page="filters"
      />
    </IconDivider>
    <IconDivider>
      <CreateIcon
        entity={entity}
        onClick={onFilterCreateClick}
      />
      <CloneIcon
        entity={entity}
        onClick={onFilterCloneClick}
      />
      <EditIcon
        entity={entity}
        onClick={onFilterEditClick}
      />
      <TrashIcon
        entity={entity}
        onClick={onFilterDeleteClick}
      />
      <ExportIcon
        value={entity}
        title={_('Export Filter as XML')}
        onClick={onFilterDownloadClick}
      />
    </IconDivider>
  </Divider>
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onFilterCloneClick: PropTypes.func.isRequired,
  onFilterCreateClick: PropTypes.func.isRequired,
  onFilterDeleteClick: PropTypes.func.isRequired,
  onFilterDownloadClick: PropTypes.func.isRequired,
  onFilterEditClick: PropTypes.func.isRequired,
};

const Page = ({
  onChanged,
  onDownloaded,
  onError,
  ...props
}) => {
  return (
    <FilterComponent
      onCloned={goto_details('filter', props)}
      onCloneError={onError}
      onCreated={goto_details('filter', props)}
      onDeleted={goto_list('filters', props)}
      onDeleteError={onError}
      onDownloaded={onDownloaded}
      onDownloadError={onError}
      onSaved={onChanged}
    >
      {({
        clone,
        create,
        delete: delete_func,
        download,
        edit,
        save,
      }) => (
        <EntityPage
          {...props}
          detailsComponent={FilterDetails}
          sectionIcon="filter.svg"
          toolBarIcons={ToolBarIcons}
          title={_('Filter')}
          onFilterCloneClick={clone}
          onFilterCreateClick={create}
          onFilterDeleteClick={delete_func}
          onFilterDownloadClick={download}
          onFilterEditClick={edit}
          onFilterSaveClick={save}
          onPermissionChanged={onChanged}
          onPermissionDownloaded={onDownloaded}
          onPermissionDownloadError={onError}
        >
          {({
            activeTab = 0,
            permissionsComponent,
            permissionsTitle,
            tagsComponent,
            onActivateTab,
            entity,
            ...other
          }) => {
            return (
              <Layout grow="1" flex="column">
                <TabLayout
                  grow="1"
                  align={['start', 'end']}
                >
                  <TabList
                    active={activeTab}
                    align={['start', 'stretch']}
                    onActivateTab={onActivateTab}
                  >
                    <Tab>
                      {_('Information')}
                    </Tab>
                    <EntitiesTab entities={entity.userTags}>
                      {_('User Tags')}
                    </EntitiesTab>
                    <Tab>
                      {permissionsTitle}
                    </Tab>
                  </TabList>
                </TabLayout>

                <Tabs active={activeTab}>
                  <TabPanels>
                    <TabPanel>
                      <FilterDetails
                        entity={entity}
                      />
                    </TabPanel>
                    <TabPanel>
                      {tagsComponent}
                    </TabPanel>
                    <TabPanel>
                      {permissionsComponent}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Layout>
            );
          }}
        </EntityPage>
      )}
    </FilterComponent>
  );
};

Page.propTypes = {
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

const FilterPage = props => (
  <EntityContainer
    {...props}
    name="filter"
    loaders={[
      permissions_resource_loader,
    ]}
  >
    {cprops => <Page {...props} {...cprops} />}
  </EntityContainer>
);

export default FilterPage;

// vim: set ts=2 sw=2 tw=80:
