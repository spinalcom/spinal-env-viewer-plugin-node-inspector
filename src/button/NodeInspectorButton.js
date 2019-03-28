import {
  SpinalContextApp,
} from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import {SPINAL_RELATION_PTR_LST_TYPE} from 'spinal-env-viewer-graph-service'

export  class NodeInspectorButton extends SpinalContextApp {
  
  constructor() {
    super( "Node Inspector", "Open NodeInspector", {
      icon: "crop_free",
      icon_type: "in",
      backgroundColor: "#ffebf8",
      
    } );
  }
  
  isShown( option ) {
    if (option.hasOwnProperty( 'selectedNode' )) {
      return Promise.resolve( true );
    }
    
    return Promise.resolve( -1);
  }
  
  action( option ) {
    const param = { selectedNode: option.selectedNode };
    spinalPanelManagerService.openPanel( "plugin-node-inspector", param );
  }
  
}
