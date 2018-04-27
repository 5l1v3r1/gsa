/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
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

import _ from 'gmp/locale.js';

import EntitiesPage from '../../entities/page.js';
import withEntitiesContainer from '../../entities/withEntitiesContainer.js';

import withDashboard from '../../components/dashboard/withDashboard.js';

import DashboardControls from '../../components/dashboard2/controls';

import ManualIcon from '../../components/icon/manualicon.js';

import OvaldefCharts from './charts.js';
import OvaldefFilterDialog from './filterdialog.js';
import OvaldefsTable from './table.js';

import OvaldefDashboard, {OVALDEF_DASHBOARD_ID} from './dashboard/index.js';


const ToolBarIcons = props => {
  return (
    <ManualIcon
      page="vulnerabilitymanagement"
      anchor="oval"
      title={_('Help: OVAL Definitions')}/>
  );
};

const Dashboard = withDashboard({
  hideFilterSelect: true,
  configPrefId: '9563efc0-9f4e-4d1f-8f8d-0205e32b90a4',
  defaultControllersString: 'ovaldef-by-severity-class|ovaldef-by-created|' +
    'ovaldef-by-class',
  defaultControllerString: 'ovaldef-by-cvss',
})(OvaldefCharts);

export default withEntitiesContainer('ovaldef', {
  dashboard: Dashboard,
  dashboard2: OvaldefDashboard,
  dashboardControls: () => (
    <DashboardControls dashboardId={OVALDEF_DASHBOARD_ID}/>
  ),
  filterEditDialog: OvaldefFilterDialog,
  sectionIcon: 'ovaldef.svg',
  table: OvaldefsTable,
  title: _('OVAL Definitions'),
  toolBarIcons: ToolBarIcons,
})(EntitiesPage);

// vim: set ts=2 sw=2 tw=80:
