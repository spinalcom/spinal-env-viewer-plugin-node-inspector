/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {SpinalContextApp} from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import {
  SpinalNode,
  SpinalGraphService
} from 'spinal-env-viewer-graph-service';

export class NodeInspectorButton extends SpinalContextApp {
  constructor() {
    super("Node Inspector", "Open NodeInspector", {
      icon: "crop_free",
      icon_type: "in",
      backgroundColor: "#ffebf8"
    });
  }

  isShown(option) {
    if (option.hasOwnProperty('selectedNode')) {
      return Promise.resolve(true);
    }
    if (option.exist || option.hasOwnProperty('selectedNode')) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(-1);
    }
  }

  action(option) {
    let selectedNode = option.selectedNode;

    if (option.selectedNode instanceof SpinalNode) {
      SpinalGraphService._addNode(option.selectedNode);
      selectedNode = SpinalGraphService.getInfo(option.selectedNode.getId());
    }
    const param = {
      selectedNode: selectedNode
    };
    spinalPanelManagerService.openPanel("plugin-node-inspector", param);
  }

}
