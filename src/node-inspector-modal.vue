<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <md-dialog style="min-width: 50vw;"
             :md-active="display">
    <md-dialog-title>{{ name }}</md-dialog-title>
    <node-inspector ref="nodeInspector"
                    class="node-inspector"
                    :edit-mode="editMode"
                    :child-info="childInfo"
                    :relation-names="relationNames"
                    :default-relation-name="defaultRelationName"
                    @get-children="getChildren($event)"
                    @remove-from-graph="removeFromGraph($event)"
                    @remove-from-parent="removeFromParent($event)" />
    <md-dialog-actions style="justify-content: space-between;">
      <md-button v-if="editMode===false"
                 class="md-fab md-mini md-primary"
                 style="min-width: 0;"
                 @click="startEditBtn">
        <md-icon>edit</md-icon>
      </md-button>
      <div v-else>
        <md-button class="md-fab md-mini"
                   style="min-width: 0;"
                   @click="cancelBtn">
          <md-icon>cancel</md-icon>
        </md-button>
        <md-button class="md-fab md-mini md-primary"
                   style="min-width: 0;"
                   @click="validBtn">
          <md-icon>check</md-icon>
        </md-button>
      </div>
      <!-- <md-button class="md-primary"
                 @click="display = false">
      </md-button> -->

      <md-button class="md-primary"
                 @click="display = false">
        close
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { NodeInspector } from "spinal-env-viewer-vue-components-lib";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileSystem } from "spinal-core-connectorjs_type";
import { reorderChildren } from "./reorderUtils";
export default {
  name: "NodeInspectorModal",
  components: { NodeInspector },
  data: function () {
    return {
      inspectedNode: {},
      relationNames: [],
      defaultRelationName: "",
      childInfo: [],
      childInfoBkp: [],
      editMode: false,
      display: false
    };
  },
  computed: {
    name: function () {
      if (this.inspectedNode.hasOwnProperty("name")) {
        return this.inspectedNode.name;
      }
      return "";
    }
  },
  watch: {
    inspectedNode: {
      handler: function (value) {
        if (value.hasOwnProperty("_server_id")) {
          this.relationNames = this.getRelationNames(value);
          if (this.relationNames.length > 0) {
            this.defaultRelationName = this.relationNames[0];
          }
          return this.getChildren(this.defaultRelationName);
        }
      },
      immediate: true
    }
  },

  methods: {
    getInfo(node) {
      const item = { _server_id: node._server_id };
      if (node.info.name) item.name = node.info.name.get();
      if (node.info.id) item.id = node.info.id.get();
      return item;
    },
    getInfoFromRef(nodeRef) {
      const realNode = SpinalGraphService.getRealNode(nodeRef.id.get());
      const item = { _server_id: realNode._server_id };
      if (realNode.info.name) item.name = realNode.info.name.get();
      if (realNode.info.id) item.id = realNode.info.id.get();
      return item;
    },
    getRelationNames(inspectedNode) {
      const node = FileSystem._objects[inspectedNode._server_id];
      return node.getRelationNames();
    },
    opened: function (option) {
      this.inspectedNode = this.getInfoFromRef(option.selectedNode);
      this.display = true;
    },
    closed: function () {},
    removeFromGraph: function (id) {
      SpinalGraphService.removeFromGraph(id.get());
      for (let i = 0; i < this.childInfo.length; i++) {
        const child = this.childInfo[i];
        if (child.id.get() == event.get()) this.childInfo.splice(i);
      }
    },
    removeFromParent: function (id) {
      console.log("removeFromParent NYI", id);
      // SpinalGraphService.removeFromGraph(id.get());
      // for (let i = 0; i < this.childInfo.length; i++) {
      //   const child = this.childInfo[i];
      //   if (child.id.get() == event.get()) this.childInfo.splice(i);
      // }
    },
    async getChildren(relationName) {
      const realNode = FileSystem._objects[this.inspectedNode._server_id];
      const children = await realNode.getChildren([relationName]);
      this.childInfo = children.map((node) => {
        const item = { _server_id: node._server_id };
        if (node.info.name) item.name = node.info.name.get();
        if (node.info.id) item.id = node.info.id.get();
        return item;
      });
    },
    cancelBtn() {
      this.editMode = false;
      // this.childInfo = this.childInfoBkp;
      this.$refs.nodeInspector.reset();
    },
    validBtn() {
      this.editMode = false;
      const realNode = FileSystem._objects[this.inspectedNode._server_id];
      console.log(realNode);
      const sortedArray = this.$refs.nodeInspector.returnSort();
      const relationName = this.$refs.nodeInspector.relationName;
      console.log(sortedArray, relationName);
      reorderChildren(realNode, relationName, sortedArray);
      // this.childInfo = data;
    },
    startEditBtn() {
      this.editMode = true;
      // this.$refs.nodeInspector.
      // this.childInfoBkp = this.childInfo.concat();
    }
    // reorder() {
    // }
    // getChildren: function (event) {
    //   SpinalGraphService.getChildren(this.inspectedNode.id.get(), [event]).then(
    //     (children) => {
    //       this.childInfo = [];
    //       this.childInfo.push(...children);
    //     }
    //   );
    // }
  }
};
</script>

<style scoped>
.node-inspector {
  margin: 16px;
  /* width: 30vw; */
}
</style>
