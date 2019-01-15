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

import React from 'react';

import {longDate} from 'gmp/locale/date';

import {shorten} from 'gmp/utils/string';

import SeverityBar from 'web/components/bar/severitybar';

import Comment from 'web/components/comment/comment';

import TableBody from 'web/components/table/body';
import TableRow from 'web/components/table/row';
import TableData from 'web/components/table/data';

import EntitiesActions from 'web/entities/actions';
import {RowDetailsToggle} from 'web/entities/row';

import PropTypes from 'web/utils/proptypes';
import {na} from 'web/utils/render';

const Row = ({
  entity,
  links = true,
  onToggleDetailsClick,
  ...props
}) => (
  <TableBody>
    <TableRow>
      <TableData
        rowSpan="2"
      >
        <RowDetailsToggle
          name={entity.id}
          onClick={onToggleDetailsClick}
        >
          {entity.name}
        </RowDetailsToggle>
        <Comment text={entity.comment}/>
      </TableData>
      <TableData>
        {na(entity.cvssAccessVector)}
      </TableData>
      <TableData>
        {na(entity.cvssAccessComplexity)}
      </TableData>
      <TableData>
        {na(entity.cvssAuthentication)}
      </TableData>
      <TableData>
        {na(entity.cvssConfidentialityImpact)}
      </TableData>
      <TableData>
        {na(entity.cvssIntegrityImpact)}
      </TableData>
      <TableData>
        {na(entity.cvssAvailabilityImpact)}
      </TableData>
      <TableData>
        {longDate(entity.creationTime)}
      </TableData>
      <TableData>
        <SeverityBar severity={entity.severity}/>
      </TableData>
      <EntitiesActions
        {...props}
        entity={entity}
      />
    </TableRow>
    <TableRow>
      <TableData colSpan="9">
        {shorten(entity.description, 250)}
      </TableData>
    </TableRow>
  </TableBody>
);

Row.propTypes = {
  entity: PropTypes.model,
  links: PropTypes.bool,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default Row;

// vim: set ts=2 sw=2 tw=80:
