import {
  SpinalContextApp,
} from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import {
  SpinalNode,
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from 'spinal-env-viewer-graph-service'

export  class NodeInspectorButton extends SpinalContextApp {
  
  constructor() {
    super( "Node Inspector", "Open NodeInspector", {
      icon: "crop_free",
      icon_type: "in",
      backgroundColor: "#ffebf8",
      
    } );
  }
  
  isShown( option ) {
    if (option.hasOwnProperty('selectedNode')) {
      return Promise.resolve(true);
    }
    if (option.exist || option.hasOwnProperty('selectedNode')) {
        return Promise.resolve(true);
    } else {
      return Promise.resolve(-1);
    }
  }
  
  action( option ) {
    let selectedNode = option.selectedNode;

    if (option.selectedNode instanceof SpinalNode) {
      SpinalGraphService._addNode(option.selectedNode);
      selectedNode = SpinalGraphService.getInfo(option.selectedNode.getId());
    }
    const param = {
      selectedNode: selectedNode
    };
    spinalPanelManagerService.openPanel( "plugin-node-inspector", param );
  }
  
}
