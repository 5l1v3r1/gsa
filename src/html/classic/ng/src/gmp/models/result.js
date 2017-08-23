/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2017 Greenbone Networks GmbH
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

import {for_each, is_defined} from '../utils.js';

import Model from '../model.js';
import {parse_severity} from '../parser.js';

import Nvt from './nvt.js';

import {parse_notes} from './note.js';

import {parse_overrides} from './override.js';

class Result extends Model {

  static entity_type = 'result';

  parseProperties(elem) {
    const copy = super.parseProperties(elem);

    const {
      detection,
      host,
      name,
      notes,
      nvt = {},
      original_severity,
      overrides,
      report,
      severity,
      task,
    } = elem;

    copy.host = {
      name: host.__text,
      id: is_defined(host.asset) ? host.asset._asset_id : undefined, // for openvas 8 where host.asset doesn't exist
    };

    copy.nvt = new Nvt(nvt);

    if (is_defined(severity)) {
      copy.severity = parse_severity(severity);
    }

    copy.vulnerability = is_defined(name) ? name : nvt.oid;

    if (is_defined(report)) {
      copy.report = new Model(report, 'report');
    }

    if (is_defined(task)) {
      copy.task = new Model(task, 'task');
    }

    if (is_defined(detection) && is_defined(detection.result)) {
      const details = {};

      if (is_defined(detection.result.details)) {
        for_each(detection.result.details.detail, detail => {
          details[detail.name] = detail.value;
        });
      }

      copy.detection = {...detection}; // create shallow copy

      copy.detection.result = {
        id: detection.result._id,
        details: details,
      };

    }

    if (is_defined(original_severity)) {
      copy.original_severity = parse_severity(original_severity);
    }

    copy.notes = parse_notes(notes);
    copy.overrides = parse_overrides(overrides);

    return copy;
  }
}

export default Result;

// vim: set ts=2 sw=2 tw=80:
