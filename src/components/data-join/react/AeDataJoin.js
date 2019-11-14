/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { jsPlumb } from 'jsplumb';
import * as lodash from 'lodash';
import {
  defaultJsPlumbInstance, connectionProperties, DELETE_REPORT_SHEET,
  DELETE_MSG1, DELETE_MSG1_1, DELETE_MSG2, DELETE_MSG4,
  AE_SINGLE_DATA_VIEW, AE_JOIN_LIMIT_MSG
} from './AeDataJoin.constants';
import { createDomElement, removeConnectedNodes, getDependentNodeList, getDependentSheetList } from './AeDataJoin.util';
import { aeDiscoverDocData } from '../Constants';
import './aeDataJoin.scss';
import AeModal from '../ae-modal/AeModal';
import AeButton from '../ae-button/AeButton';
import { getClassName } from '../../utils/Utils';

/**
 * AeDataJoin class.
 * @class AeDataJoin
 */
export default class AeDataJoin extends Component {
  /**
   * AeDataJoin constructor.
   * @constructs AeDataJoin
   * @param {Props} firstNodePosition - This props is type of object {left: number, top: number}.
   * @param {Props} getJoinData - This props is type of function.
   * @param {Props} getAllDataJoins - This props is type of function.
   * @param {Props} getNodeData - This props is type of function.
   * @param {Props} removeNodes - This props is type of function.
   * @param {Props} createdNodeOnCanvas - this props is type of the function
   * @param {Props} message - This props is type of object of an Antd library
   */
  constructor(props) {
    super(props);
    this.state = {
      confirmationModal: false
    };
    /**
     * this is property of AeDataJoin.
     * @type {object}
     * @private
     */
    this.nodeList = {};
    /**
     * this is property of AeDataJoin.
     * @type {string}
     * @private
     */
    this.currentNodeId = null;
    /**
     * this is property of AeDataJoin.
     * @type {object}
     * @private
     */
    this.instance = null;
    this.createNodeOnCanvas = this.createNodeOnCanvas.bind(this);
    this.setPositionToNode = this.setPositionToNode.bind(this);
    this.saveData = this.saveData.bind(this);
    this.makeConnection = this.makeConnection.bind(this);
    this.sendNodeData = this.sendNodeData.bind(this);
    this.prepareJoins = this.prepareJoins.bind(this);
    this.removeSheet = this.removeSheet.bind(this);
  }

  /**
   * @method AeDataJoin#componentDidMount
   * @private
   * @description  life cycle method used to create jsPlumb Instance
   * */
  componentDidMount() {
    this.instance = jsPlumb.getInstance(defaultJsPlumbInstance);
    this.instance.bind('click', (conn, originalEvent) => {
      // const source = conn.getParameters().source;
      // const target = conn.getParameters().target;
      originalEvent.preventDefault();
      this.props.getJoinData(conn, this.getExistingJoinType(aeDiscoverDocData.data.join, conn.sourceId, conn.targetId));
    });
    this.props.setInstance(this.instance);
    this.prepareJoins();
  }

  /**
  * @method componentDidUpdate
  * @description  life cycle method that gets call on props updation
  **/
  componentDidUpdate() {
    if (this.props.closeModalEvent && this.props.targetNode) {
      this.removeSheet(this.props.targetNode.id);
    }
  }

  /**
   * @name AeDataJoin#getExistingJoinType
   * @param {array} join - this is string param.
   * @param {string} source
   * @returns {string} target
   * @desc function that returns Existing JoinType on the basis of join,source,target
   */
  getExistingJoinType(join, source, target) {
    let obj = lodash.find(join, { id: source });
    return lodash.find(obj.connections, { id: target }).joinType;
  }
  /**
   * @name AeDataJoin#setPositionToNode
   * @param {string} elementId - this is string param.
   * @param {object} item
   * @returns {object} createdNode
   * @desc Create html element using createDomElement function with style and return
   */
  setPositionToNode(elementId, item) {
    let node;
    if (elementId !== 'canvas') {
      if (!this.nodeList[item.from]) {
        if (!lodash.isUndefined(this.nodeList[elementId].connections) && this.nodeList[elementId].connections.length !== 0) {
          const lastNodeID = lodash.findLast(this.nodeList[elementId].connections);
          node = createDomElement(this.nodeList[elementId].left + 400, this.nodeList[lastNodeID.id].top + 50, item.sheetName, item.sheetId, this.sendNodeData);
        } else {
          node = createDomElement(this.nodeList[elementId].left + 400, this.nodeList[elementId].top, item.sheetName, item.sheetId, this.sendNodeData);
        }
      }
    } else if (lodash.keys(this.nodeList).length === 0 || lodash.keys(aeDiscoverDocData.data.join).length === 0) {
      node = createDomElement(this.props.firstNodePosition.left, this.props.firstNodePosition.top, item.sheetName, item.sheetId, this.sendNodeData);
    }
    return node;
  }

  validateForSingleDataView = (item) => {
    let allowToDrop = true;
    if (item.type === "DATA_VIEW") {
      lodash.forEach(this.nodeList, (node) => {
        if (node.data.type === "DATA_VIEW") {
          if (this.props.message instanceof Object) {
            this.props.message.destroy();
            this.props.message.warning(`${AE_SINGLE_DATA_VIEW}`);
          }
          allowToDrop = false;
        }
      });
    }
    return allowToDrop;
  }
  /**
   * @name AeDataJoin#createNodeOnCanvas
   * @param {Event} ev - this is event param.
   * @desc get the source and target data to create join between them.
   *       It Create the new node onDrop event append to view container.
   *       Also call the saveData method to save join in collection.
   */
  createNodeOnCanvas(ev) {
    const isDroppable = lodash.keys(aeDiscoverDocData.data.join).length < 5;
    if (!isDroppable) {
      this.props.message.destroy();
      this.props.message.warning(AE_JOIN_LIMIT_MSG);
      return true;
    }
    ev.preventDefault();
    let newNode;
    const item = lodash.isEmpty(ev.dataTransfer.getData('datasource')) ? '' : JSON.parse(ev.dataTransfer.getData('datasource'));
    if (item) {
      let elementId = ev.target.getAttribute('id');
      this.nodeList = this.props.collectionOfJoins;
      const nodeOnCanvas = [];
      if (elementId === 'canvas') {
        newNode = this.setPositionToNode(elementId, item);
        // this.props.initSheetList();
      } else if (!nodeOnCanvas.includes('AE_'.concat(item.from))) {
        if (this.validateForSingleDataView(item)) {
          elementId = ev.target.parentElement.getAttribute('id');
          newNode = this.setPositionToNode(elementId, item);
        }
      }
      if (newNode) {
        newNode.node.addEventListener('ondragover', this.allowDrop, false);
        newNode.node.addEventListener('ondrop', this.dropLeft, false);
        if (elementId === 'canvas') {
          if (lodash.keys(this.nodeList).length === 0 || lodash.keys(aeDiscoverDocData.data.join).length === 0) {
            this.instance.getContainer().appendChild(newNode.node);
            this.saveData(newNode, item);
            this.props.fetchReportSheetData(item);
          }
        } else if (this.nodeList[elementId]) {
          this.instance.getContainer().appendChild(newNode.node);
          this.nodeList[elementId].connections.push({ id: newNode.id, joinType: 'INNER_JOIN', mappedAttr: [] });
          this.saveData(newNode, item);
          // TODO :  Implement the API call to get the all the attributes of the selected data-source
          this.setState({
            joinModal: true,
          });
          this.makeConnection(elementId, newNode.id, {
            source: this.nodeList[elementId],
            target: this.nodeList[newNode.id],
          });
        }
        // this.instance.draggable(newNode.node);
        this.setState({
          showPlaceHolder: lodash.keys(this.nodeList).length === 0,
        });
        if (this.props.createdNodeOnCanvas instanceof Function) {
          this.props.createdNodeOnCanvas(item);
        }
      }
    }

  }

  /**
   * @name AeDataJoin#saveData
   * @param {object} node
   * @param {object} data
   * @desc Store the data into collection,
   */
  saveData(node, data) {
    if (node && data) {
      this.nodeList[node.id] = {
        joinType: '',
        id: node.id,
        name: node.name,
        data,
        connections: [],
        left: node.x,
        top: node.y,
      };
      // reactLocalStorage.setObject('node', this.nodeList);
      if (this.props.getAllDataJoins instanceof Function) {
        this.props.getAllDataJoins(this.nodeList);
      }
    }
  }

  /**
   * @name AeDataJoin#makeConnection
   * @param {string} sourceId
   * @param {string} targetId
   * @param {object} parameters
   * @desc Create the join (connection) between source and target.
   */
  makeConnection(sourceId, targetId, parameters, joinType) {
    let connectionProp = lodash.cloneDeep(connectionProperties);
    if (joinType) {
      connectionProp.overlays[0][1].cssClass = `ae-overlay  ${joinType}`;
    }
    this.instance.connect({
      source: sourceId,
      target: targetId,
      parameters,
      ...connectionProp,
    });
  }

  /**
   * @name prepareJoins
   * @desc render all joins from the saved collection
   */
  prepareJoins() {
    this.nodeList = this.props.collectionOfJoins;
    lodash.forEach(this.nodeList, (node) => {
      const createdNode = createDomElement(node.left, node.top, node.name, node.id, this.sendNodeData);
      createdNode.node.addEventListener('ondragover', this.allowDrop, false);
      createdNode.node.addEventListener('ondrop', this.dropLeft, false);
      this.instance.getContainer().appendChild(createdNode.node);
      // this.instance.draggable(createdNode.node, { containment: '#canvas' });
    });

    lodash.forEach(this.nodeList, (node) => {
      if (node.connections && node.connections.length > 0) {
        lodash.forEach(node.connections, (element) => {
          const joinType = lodash.find(this.nodeList[node.id].connections, { id: element.id });
          this.makeConnection(node.id, element.id, {
            source: this.nodeList[node.id],
            target: this.nodeList[element.id],
          }, joinType.joinType);
        });
      }
    });
    this.setState({ showPlaceHolder: lodash.keys(this.nodeList).length === 0 });
    this.instance.bind("connection", (i) => {
      this.props.getJoinData(i.connection, this.props.joinType, true);
    });
  }

  /**
   * @method AeDataJoin#allowDrop
   * @description function have ablility to handle the onDragOver event. It over come the event bubbling.
   * @param {Event} event
   * */
  allowDrop(event) {
    event.preventDefault();
  }

  //******************************REMOVE NODE FUNCTIONALITY*************************** */

  /**
   * @name AeDataJoin#sendNodeData
   * @desc Function will get called when node is clicked
   */
  sendNodeData(event) {
    this.currentNodeId = event.target.parentNode.id;
    let report = null;
    if (aeDiscoverDocData.data.REPORTID) {
      report = lodash.find(aeDiscoverDocData.data.publishedDataModel.dataObject.reports, { doid: this.currentNodeId.split('AE_')[1] });
    }
    if (this.props.getNodeData instanceof Function) {
      this.props.getNodeData(event.target.parentNode.id);
    }
    if (!report) {
      this.confirmationModalToggle(event.target.parentNode.id);
    } else {
      this.props.message.destroy();
      this.props.message.warn(`You can't modify the join`);
    }
  }

  /**
   * @name AeDataJoin#removeNodes
   * @param {string} nodeId
   * @desc Remove node from the canvas and give successcallback with prevNodelist and currentNodeList,
   */
  removeNodes(nodeId) {
    this.nodeList = this.props.collectionOfJoins;
    let prevNodeList = this.nodeList;
    let data = this.getUpdatedNodeList(prevNodeList, nodeId);
    this.nodeList = data.remainingNodes;
    if (this.props.removeNodes instanceof Function) {
      this.props.removeNodes(prevNodeList, this.nodeList, data.removedNodeList);
    }
    // saveDiscoverDocData("node", this.nodeList);
  }

  /**
   * @name AeDataJoin#deleteNodeFromCanvas
   * @param {array} removeNodeId
   * @param {string} currentNodeId
   * @desc Delete nodes and corresponding connection from canvas
   */
  deleteNodeFromCanvas = (removeNodeId, currentNodeId) => {
    const allConnections = this.instance.getAllConnections();
    if (removeNodeId.length) {
      lodash.forEach(removeNodeId, (id) => {
        this.instance.remove(id);
      });
    }
    if (allConnections.length) {
      this.instance.deleteConnection(lodash.find(allConnections, { sourceId: currentNodeId }));
      this.instance.deleteConnection(lodash.find(allConnections, { targetId: currentNodeId }));
    }
  }

  /**
   * @name AeDataJoin# getUpdatedNodeList
   * @desc getUpdatedNodeList function returns updated nodeList object with updated nodes and connection
   * @param {object} node
   * @param {string} currentNodeId
   */
  getUpdatedNodeList = (node, currentNodeId) => {
    let newnodelist = {};
    let removedNodeList = [];
    let connection = node[currentNodeId].connections;
    removeConnectedNodes(connection, node, removedNodeList);
    removedNodeList.push(currentNodeId);
    let remainingNodes = lodash.omit(node, removedNodeList);
    lodash.forEach(remainingNodes, function (value, key) {
      let conn = lodash.reject(remainingNodes[key].connections, { id: currentNodeId });
      remainingNodes[key].connections = conn;
    });
    if (!lodash.isEmpty(remainingNodes)) {
      Object.assign(newnodelist, remainingNodes);
    }
    this.deleteNodeFromCanvas(removedNodeList, currentNodeId);
    this.setState({
      showPlaceHolder: lodash.keys(remainingNodes).length === 0
    });
    return { remainingNodes, removedNodeList };
  }

  /**
   * @name AeDataJoin#confirmationModalToggle
   * @desc function that change the state of confirmationModal & updates the message variables by callin getDependentNodeList() & getDependentSheetList() of utils.
   * @param {string} item
   */
  confirmationModalToggle(item) {
    this.selectedItem = item;
    this.msg1 = this.msg2 = this.msg3 = this.msg4 = '';
    let reportSheet = aeDiscoverDocData.data.join[item];
    this.reportName = reportSheet.name;
    if (reportSheet) {
      let nodeList = getDependentNodeList(reportSheet);
      let sheetList = getDependentSheetList(reportSheet);

      if (sheetList.length > 0) {
        this.msg1 = `${DELETE_MSG1} "${reportSheet.name}" ${DELETE_MSG1_1} ${sheetList}.`;
        this.msg2 = `${DELETE_MSG2}`;
      }
      if (nodeList.length > 0) {
        this.msg3 = <div>{DELETE_MSG4} "<b>{reportSheet.name}</b>" ?<br /> If you delete "<b>{reportSheet.name}</b>" the other joined reports will also delete. </div>;
      }
    }
    this.setState({
      confirmationModal: !this.state.confirmationModal
    });
  }


  /**
   * @name AeDataJoin#removeSheet
   * @desc function that calls removeNodes() by passing selectedItem or targetNode & calls handleCancel to dismiss popup.
   */
  removeSheet = (targetNode) => {
    if (this.props.closeModalEvent) {
      this.removeNodes(targetNode);
      if (this.props.resetModalClose instanceof Function)
        this.props.resetModalClose();
    }
    else {
      this.removeNodes(this.selectedItem);
    }
    this.handleCancel();
  }

  /**
   * @name AeDataJoin#handleCancel
   * @desc function that updates state of confirmationModal to false to dismiss popover.
   */
  handleCancel = () => {
    this.setState({
      confirmationModal: false
    });
  }

  /**
   * Renders the component
   * @private
   * @method AeDataJoin#render
* @return {ReactElement} markup
  */
  render() {
    this.pointerClassName = getClassName(this.props.isEditable);
    return (
      <div className={`data-join-workspace ${this.pointerClassName}`}>
        <div
          className="ae-data-join-canvas"
          onDrop={this.createNodeOnCanvas}
          onDragOver={this.allowDrop} id="canvas" />
        <AeModal
          wrapClassName="data-src-confirm-modal"
          maskStyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)' }}
          visible={this.state.confirmationModal}
          closable={false}
          width={600}
          footer={null}
          destroyOnClose>
          <div className="ae-modal-header">
            <div className="ae-header-title">{DELETE_REPORT_SHEET}</div>
            <button type="button" className="ae-header-close" onClick={this.handleCancel} autoFocus={true} />
          </div>
          <div className="msg">
            {this.msg3 ? this.msg3 : <div>{DELETE_MSG4} "<b>{this.reportName}</b>" ?<br /></div>}
          </div>
          <div className="confirmation">
            <AeButton onClick={this.handleCancel} title="No" />
            <AeButton type="primary" onClick={this.removeSheet} title="Yes" />
          </div>
        </AeModal >
      </div >
    );
  }
}

AeDataJoin.propTypes = {
  collectionOfJoins: PropTypes.object,
  firstNodePosition: PropTypes.object,
  getJoinData: PropTypes.func,
  getAllDataJoins: PropTypes.func,
  getNodeData: PropTypes.func,
  removeNodes: PropTypes.func,
  createdNodeOnCanvas: PropTypes.func,
  fetchReportSheetData: PropTypes.func,
  setInstance: PropTypes.func,
  joinType: PropTypes.string,
  isEditable: PropTypes.bool,
  closeModalEvent: PropTypes.bool,
  targetNode: PropTypes.object,
  resetModalClose: PropTypes.func,
  initSheetList: PropTypes.func,
  readOnlyDataJoin: PropTypes.bool,
  message: PropTypes.object,
};
