/* Copyright (C) 2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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

import {RESET_FILTER, TASKS_FILTER_FILTER} from 'gmp/models/filter';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import {
  loadEntities,
  selector as entitiesSelector,
} from 'web/store/entities/audits';

import EntitiesPage from 'web/entities/page';
import withEntitiesContainer from 'web/entities/withEntitiesContainer';

import IconDivider from 'web/components/layout/icondivider';

import {DEFAULT_RELOAD_INTERVAL_ACTIVE} from 'web/utils/constants';

import NewIcon from 'web/components/icon/newicon';

import AuditComponent from './component';
import Table from './table';

import AuditIcon from 'web/components/icon/auditicon';

const ToolBarIcons = withCapabilities(({capabilities, onAuditCreateClick}) => (
  <IconDivider>
    {capabilities.mayCreate('task') && (
      <NewIcon title={_('New Audit')} onClick={onAuditCreateClick} />
    )}
  </IconDivider>
));

ToolBarIcons.propTypes = {
  onAuditCreateClick: PropTypes.func.isRequired,
};

const Page = ({onInteraction, onChanged, onDownloaded, onError, ...props}) => (
  <AuditComponent
    onCloned={onChanged}
    onCloneError={onError}
    onCreated={onChanged}
    onDeleted={onChanged}
    onDeleteError={onError}
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInteraction={onInteraction}
    onResumed={onChanged}
    onResumeError={onError}
    onSaved={onChanged}
    onStarted={onChanged}
    onStartError={onError}
    onStopped={onChanged}
    onStopError={onError}
  >
    {({
      clone,
      create,
      delete: deleteFunc,
      download,
      edit,
      start,
      stop,
      resume,
      reportDownload,
      gcrFormatDefined,
    }) => (
      <EntitiesPage
        {...props}
        filtersFilter={TASKS_FILTER_FILTER}
        gcrFormatDefined={gcrFormatDefined}
        sectionIcon={<AuditIcon size="large" />}
        table={Table}
        title={_('Audits')}
        toolBarIcons={ToolBarIcons}
        onError={onError}
        onInteraction={onInteraction}
        onReportDownloadClick={reportDownload}
        onAuditCloneClick={clone}
        onAuditCreateClick={create}
        onAuditDeleteClick={deleteFunc}
        onAuditDownloadClick={download}
        onAuditEditClick={edit}
        onAuditResumeClick={resume}
        onAuditStartClick={start}
        onAuditStopClick={stop}
      />
    )}
  </AuditComponent>
);

Page.propTypes = {
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const auditReloadInterval = ({entities = [], defaultReloadInterval}) =>
  entities.some(audit => audit.isActive())
    ? DEFAULT_RELOAD_INTERVAL_ACTIVE
    : defaultReloadInterval;

export default withEntitiesContainer('audit', {
  entitiesSelector,
  loadEntities,
  defaultFilter: RESET_FILTER,
  reloadInterval: auditReloadInterval,
})(Page);

// vim: set ts=2 sw=2 tw=80:
