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
/* eslint-disable no-await-in-loop */
import { SpinalNode } from "spinal-env-viewer-graph-service";

/**
 * @param {SpinalNode} node
 * @param {string} relationName
 * @param {{id: string, name: string, _server_id: number}[] } orderArr
 */
export async function reorderChildren(node, relationName, orderArr) {
  for (const [relationType, map] of node.children) {
    for (const [relName, relation] of map) {
      if (relName === relationName) {
        if (relationType === "Ref") {
          reorderRef(relation, orderArr);
        } else if (relationType === "PtrLst") {
          await reorderPtrLst(relation, orderArr);
        } else if (relationType === "LstPtr") {
          await reorderLstPtr(relation, orderArr);
        }
      }
    }
  }
}

function reorderRef(relation, orderArr) {
  const arr = [];
  for (const item of orderArr) {
    for (let i = 0; i < relation.children.length; i++) {
      const lstChild = relation.children[i];
      if (item._server_id === lstChild._server_id) {
        arr.push(lstChild);
        break;
      }
    }
  }
  relation.children.clear();
  arr.forEach(itm => relation.children.push(itm));
}

async function reorderPtrLst(relation, orderArr) {
  const arr = [];
  const children = await relation.children.load();
  for (const item of orderArr) {
    for (let i = 0; i < children.length; i++) {
      const lstChild = children[i];
      if (item._server_id === lstChild._server_id) {
        arr.push(lstChild);
        break;
      }
    }
  }
  children.clear();
  relation.children.info.ids.clear();
  arr.forEach(itm => {
    relation.children.info.ids.push(itm.info.id.get());
    children.push(itm);
  });

}

async function reorderLstPtr(relation, orderArr) {
  const arr = [];
  for (const item of orderArr) {
    for (let i = 0; i < relation.children.length; i++) {
      const lstChild = relation.children[i];
      const child = await lstChild.load();
      if (item._server_id === child._server_id) {
        arr.push(lstChild);
        break;
      }
    }
  }
  relation.children.clear();
  arr.forEach(itm => relation.children.push(itm));
}
