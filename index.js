import vue from 'vue';
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";
import { SpinalMountExtention } from 'spinal-env-viewer-panel-manager-service';
import NodeInspectorModal from './src/node-inspector-modal.vue'
import { NodeInspectorButton } from "./src/button/NodeInspectorButton";


const sideBarName = "GraphManagerSideBar";
const circularMenu = "circularMenu";
spinalContextMenuService.registerApp(sideBarName, new NodeInspectorButton(),
  [7]);
spinalContextMenuService.registerApp(circularMenu, new NodeInspectorButton(),
  [7]);
SpinalMountExtention.mount( {
  name: 'plugin-node-inspector',
  vueMountComponent: vue.extend( NodeInspectorModal ),
  parentContainer: document.body
  
} );
