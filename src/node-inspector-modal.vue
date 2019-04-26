<template>
    <md-dialog :md-active="display">
        <node-inspector
                class="node-inspector"
                :name="name"
                :childInfo="childInfo"
                :relationNames="relationNames"
                @get-children="getChildren($event)"
                @remove-from-parent="removed($event)"
        />
        <md-dialog-actions>
            <md-button class="md-primary" v-on:click="display = false">
                close
            </md-button>
        </md-dialog-actions>
    </md-dialog>

</template>

<script>
  import { NodeInspector } from "spinal-env-viewer-vue-components-lib";
  import { SpinalGraphService } from 'spinal-env-viewer-graph-service'

  export default {
    name: "node-inspector-modal",
    components: { NodeInspector },
    data: function () {
      return {
        inspectedNode: {},
        relationNames: [],
        childInfo: [],
        display: false
      }
    },
    computed: {
      name: function () {
        if (this.inspectedNode.hasOwnProperty( 'name' ))
          return this.inspectedNode.name.get();
        return '';
      },
    },

    methods: {

      opened: function ( option ) {
        this.inspectedNode = option.selectedNode;
        this.display = true;
      },
      closed: function () {
      },
      removed: function ( event ) {
        SpinalGraphService.removeFromGraph( event.get() )
        for (let i = 0; i < this.childInfo.length; i++) {
          const child = this.childInfo[i];
          if (child.id.get() == event.get())
            this.childInfo.splice(id)
        }
      },
      getChildren: function ( event ) {
        SpinalGraphService.getChildren( this.inspectedNode.id.get(), [event] )
          .then( children => {
            this.childInfo = [];
            this.childInfo.push( ...children );
          } )
      }
    },
    watch: {
      'inspectedNode': {
        handler: function ( value ) {
          if (value.hasOwnProperty( 'id' )) {
            this.childInfo = [];
            this.relationNames = [];
            this.relationNames.push( ...SpinalGraphService.getRelationNames(
              value.id.get() ) )
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>
    .node-inspector {
        margin: 16px;
        width: 30vw;
    }
</style>