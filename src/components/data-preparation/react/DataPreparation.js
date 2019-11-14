import React, { Component } from "react";
import PropTypes from "prop-types";
//import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { message } from 'antd';
import * as lodash from 'lodash';
import uuid from 'uuid/v4';
import * as constant from '../constants/DataPreparationConstant';
import {
  aeDiscoverDocData,
  saveDiscoverDocData,
  saveMappedAttrInDoc,
  saveJoinType,
  getClassName
} from '../../../shared/constants/discovery-doc-data/Discovery-doc-data';
import { READ_ONLY_MSG } from '../../../shared/constants/messages/Messages.constant';
import * as ParamsGenerator2 from '../../../shared/utils/params-generator/ParamsGenerator2';
//import AeDataJoin from '../ae-data-join';
//import AeDataJoinModal from '../ae-data-join-modal';
//import DiscoverySheetsListContainer from '../../containers/DiscoverySheetsListContainer';
//import AeSelectedDatasource from "../ae-selected-datasource/AeSelectedDatasource";
//import AeDataJoinTable from '../ae-data-join-table/AeDataJoinTable';
//import AeModal from '../../../shared/components/ae-modal/AeModal';
//import { removeConnectedNodes } from '../ae-data-join/AeDataJoin.util';
//import AeLoader from '../../../shared/components/ae-loader/AeLoader';
import initialState from '../../../reducers/initialState';
// import AeAddReportContainer from '../../containers/AeAddReportContainer';
import { AE_DATA_SOURCE_LIMIT } from '../../../shared/constants/messages/Messages.constant';
//import AeAddDataviewContainer from "../../containers/AeAddDataviewContainer";
//import { previewDataOfDataJoinRequest, prepareJoinRequest } from "../../utils/PrepareGridData";
//import AePublishDataModel from "../ae-publish-data-model";
//import ListOfMappedAttributes from "../ae-data-join-modal/ListOfMappedAttributes";

//const TabPane = Tabs.TabPane;

/**
 * AeDataPreparation class.
 * @class AeDataPreparation
 */
export default class AeDataPreparation extends Component {
  static propTypes = {
    data: PropTypes.object,
    fetchDataSourceList: PropTypes.func,
    removeDataSource: PropTypes.func,
    disableDataSource: PropTypes.func,
    enableDataSource: PropTypes.func,
    getDataJoinFacts: PropTypes.func,
    removeJoinTableContent: PropTypes.func,
    loadReport: PropTypes.func,
    updateDrawerState: PropTypes.func,
    initSheetList: PropTypes.func,
    previewDataViewData: PropTypes.func,
    publishDataModel: PropTypes.func,
    getDataSourceDetails: PropTypes.func,
    handleNavigation: PropTypes.func,
  };

  /**
   * AeDataPreparation constructor.
   * @constructs AeDataPreparation
   * @param {Props} data -  PropTypes.object | provides reducer Data
   * @param {Props} fetchDataSourceList -  PropTypes.func | function to call the API to get Data Source list
   * @param {Props} removeDataSource -  PropTypesfunc | action function to remove data source from the list and update the state
   * @param {Props} disableDataSource -  PropTypes.func | actino fuction to disable dropped data sourcce by update reducer state
   * @param {Props} enableDataSource -  PropTypes.func | actino fuction to enable dropped data sourcce by update reducer state
   * @param {Props} getDataJoinFacts -  PropTypes.func | action fuction to call API to get the join facts
   * @param {Props} previewDataViewData -  PropTypes.func | action fuction to call API to get the join data view data
   * @param {Props} handleNavigation -  PropTypes.func | function to navigate to the other sheet
   */
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      tabsValue: constant.tabsValue.DATA_JOIN,
      gridData: this.gridData,
      showDataSourceCountPopup: false,
      preSelectedJoin: constant.joinTypes[0].id,
      isSidebarOpen: false,
      customDimension: false,
      customMeasure: false,
      isPublishModal: false,
      attributePopover: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.Check_Add_DataSourceCount = this.Check_Add_DataSourceCount.bind(this);
    this.toggleTabs = this.toggleTabs.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.createdNodeOnCanvas = this.createdNodeOnCanvas.bind(this);
    this.getJoinData = this.getJoinData.bind(this);
    this.getJoinType = this.getJoinType.bind(this);
    this.saveAction = this.saveAction.bind(this);
    this.removeNodes = this.removeNodes.bind(this);

    this.toggleDataJoinSideBar = this.toggleDataJoinSideBar.bind(this);
    if (aeDiscoverDocData.data.REPORTID && !aeDiscoverDocData.data.publishedDataModel) {
      this.props.getDataSourceDetails(aeDiscoverDocData.data.REPORTID);
    }
  }

  /**
   * @method AeDataPreparation#componentDidMount
   * @private
   * @description  life cycle method used fetch the data source list API
   * */
  componentDidMount() {
    let previewRequest = aeDiscoverDocData.data.previewRequest;
    this.props.fetchDataSourceList();
    if (!lodash.isEmpty(previewRequest)) {
      this.props.previewDataViewData();
    }
  }

  /**
   * @method AeDataPreparation#toggleModal
   * @private
   * @description update state to open/close modal and switch the tabs
   * */
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
      checked:
        this.props.data.dataSourceListReducer.selectedDatasource.length <= 1
          ? "DATA_TABLE"
          : "DATA_JOIN"
    });
  }

  /**
   * @method AeDataPreparation#Check_Add_DataSourceCount
   * @private
   * @description update state of tabs on basis of count of selected datasources.
   * */
  Check_Add_DataSourceCount() {
    if (
      this.props.data.dataSourceListReducer.selectedDatasource.length <
      constant.DATA_SOURCE_COUNT
    ) {
      this.setState({
        modal: !this.state.modal,
        checked:
          this.props.data.dataSourceListReducer.selectedDatasource.length <= 1
            ? "DATA_TABLE"
            : "DATA_JOIN"
      });
    } else {
      this.setState({
        modal: false,
        showDataSourceCountPopup: true
      });
    }
  }

  /**
   * @method AeDataPreparation#confirmationModalToggle
   * @private
   * @description update state to open/close confimation modal/popup
   * */
  confirmationModalToggle = () => {
    this.setState({
      showDataSourceCountPopup: !this.state.showDataSourceCountPopup
    });
  }

  /**
   * @name AeDataPreparation#toggleTabs
   * @private
   * @desc It will switch tab by updating state
   */
  toggleTabs(activeKey) {
    this.setState({
      tabsValue: activeKey
    });
  }

  /****************************************DATA_JOIN FUNCTIONS START****************************************/
  /**
  * @name AeDataPreparation#createdNodeOnCanvas
  * @private
  * @param {object} node
  * @desc  Function for the data-join: successCallback on creation of node on canvas .
  */
  createdNodeOnCanvas(node) {
    this.props.disableDataSource(node.sheetId);
  }

  /**
  * @name AeDataPreparation#removeNodes
  * @private
  * @param {object} node
  * @desc  Function for the data-join: successCallback on creation of node on canvas .
  */
  removeNodes(prevNodeList, currentNodeList, removedNodeList) {
    saveDiscoverDocData('node', currentNodeList);
    this.props.enableDataSource(removedNodeList);
    this.updateOnDeleteNode(currentNodeList);
    // updateDiscoverySheets();
  }

  /**
  * @name AeDataPreparation#getJoinData
  * @private
  * @param {object} conn
  * @desc   Function for the data-join: To get the conneciton(join) data after click on join of two nodes.
  */
  getJoinData(conn, type, modalOnDrop) {
    this.connection = conn;
    this.setState({
      preSelectedJoin: type,
      modalOnDrop: modalOnDrop,
      selectedJointType: type
    });
    this.openModal();
  }

  prepareAutoMap = (conn) => {
    let mappedAttr = [];
    const srcTarget = conn.getParameters();
    if (srcTarget) {
      lodash.each(srcTarget.source.data.dimensions, (leftItem) => {
        lodash.each(srcTarget.target.data.dimensions, (rightItem) => {
          if (lodash.head(lodash.split(rightItem.id, '_', 1)) === lodash.head(lodash.split(leftItem.id, '_', 1))) {
            const mapping = {
              id: `MAPPED_ATTR_${uuid().toUpperCase()}`,
              rightItem,
              leftItem,
              generatedBy: 'Auto'
            };
            mappedAttr.push(mapping);
          }
        });
      });
    }
    return mappedAttr;
  }
  /**
  * @name AeDataPreparation#getJoinData
  * @private
  * @param {object} conn
  * @desc Function for the data-join: To get the All joins. It will call on very node/join creation.
  */
  getAllDataJoins(collection) {
    saveDiscoverDocData('node', collection);
  }
  /****************************************DATA_JOIN FUNCTIONS END****************************************/

  /****************************************DATA_JOIN_MODAL FUNCTIONS START *************************************/
  /**
  * @name AeDataPreparation#openModal
  * @private
  * @desc Function for the data-join-modal: open modal.
  */
  openModal() {
    if (!aeDiscoverDocData.editable) {
      this.prepareMappedAttributes();
      this.setState({ attributePopover: true });
    }
    else {
      this.prepareMappedAttributes();
      this.setState({ dataJoinModal: true });
    }
  }

  toggleAttributePopover = () => {
    this.setState({ attributePopover: false });
  }

  /**
  * @name AeDataPreparation#closeModal
  * @private
  * @param {boolean} afterSave
  * @desc Function for the data-join-modal: close modal
  */
  closeModal(afterSave) {
    this.setState({ dataJoinModal: false, closeModalEvent: afterSave ? false : this.state.modalOnDrop ? true : false, targetNode: this.connection.target });
  }

  /**
  * @name AeDataPreparation#resetModalClose
  * @private
  * @desc Function to update closeModalEvent state once modal is closed
  */
  resetModalClose = () => {
    this.setState({
      closeModalEvent: false
    });
  }

  /**
  * @name AeDataPreparation#saveAction
  * @private
  * @desc Function for the data-join-modal: function get call when user click on save button
  */
  saveAction(mappedAttributes, type) {
    this.closeModal(true);
    saveMappedAttrInDoc(this.connection, mappedAttributes);
    const parameters = this.connection.getParameters();
    saveJoinType(parameters.source.id, parameters.target.id, type);
    //previewDataOfDataJoinRequest();
    //this.join = prepareJoinRequest(parameters, mappedAttributes, type);
    // this.props.initSheetList();
    this.props.previewDataViewData();
  }

  /**
  * @name AeDataPreparation#prepareMappedAttributes
  * @private
  * @desc Function for the data-join-modal: prepare mapping attributes
  */
  prepareMappedAttributes() {
    const parameters = this.connection.getParameters();
    if (parameters) {
      // let mappAttr = lodash.find(parameters.source.connections, { id: parameters.target.id });
      // if (mappAttr.mappedAttr.length === 0) {
      let mappAttr = lodash.find(aeDiscoverDocData.data.join[parameters.source.id].connections, { id: parameters.target.id });
      // }
      this.setState({ mappedAttributes: mappAttr.mappedAttr.length === 0 ? this.prepareAutoMap(this.connection) : mappAttr.mappedAttr });
    }
  }

  /**
  * @name AeDataPreparation#getJoinType
  * @private
  * @desc Function for the data-join-modal: get the mapped attr on click of add button
  */
  // Function for the data-join-modal: get the join type on selection of join type
  getJoinType(selectedJointType) {
    if (this.state.selectedJointType) {
      this.connection.getOverlays().label.removeClass(this.state.selectedJointType);
    }
    this.connection.getOverlays().label.addClass(selectedJointType.id);
    this.setState({ selectedJointType: selectedJointType.id });
  }


  checkJoinAlreadyExists = (join, newJoin) => {
    let isExists = false;
    lodash.forEach(join, function (item) {
      if (lodash.isEqual(newJoin, item)) {
        isExists = true;
      }
    });
    return isExists;
  }

  /**
  * @name AeDataPreparation#previewAction
  * @private
  * @desc Function for the data-join-modal: function get call when user click on preview button.
  *       Toggle join modal & makes API call with selected options from UI.
  */
  previewAction = (mappedAttributes, type) => {
    saveMappedAttrInDoc(this.connection, mappedAttributes);
    const parameters = this.connection.getParameters();
    saveJoinType(parameters.source.id, parameters.target.id, type);
    //previewDataOfDataJoinRequest();
    this.closeModal(true);
    this.toggleTabs(constant.tabsValue.DATA_TABLE);
    // this.props.initSheetList();
    //  this.join = prepareJoinRequest(parameters, mappedAttributes, type);
    this.props.previewDataViewData();
  };

  /**
   * @name fetchReportSheetData
   * @desc function that creates reqeuset to get data for single report sheet & calls calllback function  getDataJoinFacts().
   * @param {string} mea
   * @returns {string} mea
   */
  fetchReportSheetData = (reportSheet) => {
    //previewDataOfDataJoinRequest();
    reportSheet.columns = reportSheet.dimensions;
    reportSheet.groups = [];
    reportSheet.filters = "";
    let request = ParamsGenerator2.ParamsGenerator2.getParams(reportSheet);
    request.sheetid = reportSheet.sheetId;
    //request.mea = request.mea;
    request.bioid = "";
    request.page = constant.pageConfig.page;
    request.pstart = constant.pageConfig.pstart;
    request.plimit = constant.pageConfig.plimit;
    request.source = "report";
    request.in_val = [];
    request.sort = "";
    request.dir = "";
    request.currency = "";
    request.rate = "";
    request.col = "";
    request.currencyDate = "T";
    request.requestID = "9F7F7829-8735-4E1D-97B5-65E6BDEAD195";
    //this.props.getDataJoinFacts(request);
    saveDiscoverDocData("joinRequest", ...request);
    this.props.previewDataViewData();
  }

  /**
   * @name updateOnDeleteNode
   * @desc function that updates joinRequest.reports On Delete Node from join
   * @param {string} mea
   * @returns {string} mea
   */
  updateOnDeleteNode = (currentNodeList) => {
    let joinRequest = aeDiscoverDocData.data.joinRequest;
    let keys = [];
    lodash.forOwn(currentNodeList, function (value, key) {
      keys.push(key);
    });

    //no node exists on canvas after deleting node
    if (keys.length === 0) {
      this.props.removeJoinTableContent();
      saveDiscoverDocData("DataJoinData", { columnDefs: [], rowData: [] });
      let sheets = aeDiscoverDocData.data.sheets;
      let initDataSheet = initialState.dataSheet;
      lodash.forEach(sheets, function (sheet) {
        if (sheet.type === "DISCOVERY_SHEET") {
          sheet.joinRequest = null;
          sheet.pivot = initDataSheet.pivot;
          sheet.chart = initDataSheet.chart;
          if (sheet.gridData instanceof Object) {
            sheet.gridData.columnDefs = [];
            sheet.gridData.rowData = [];
          }
        }
      });
      saveDiscoverDocData("dataSheet", sheets);
      saveDiscoverDocData("join", {});
      saveDiscoverDocData("joinRequest", {});
    }

    //single node exists on canvas after deleting node - will treated as single report
    else if (keys.length === 1) {
      this.fetchReportSheetData(currentNodeList[keys[0]].data);
      if (joinRequest) {
        lodash.forEach(joinRequest.reports, function (report) {
          if (report.sheetId === currentNodeList[keys[0]].data.sheetId) {
            lodash.remove(joinRequest.reports, function (n) {
              return n.sheetid === currentNodeList[keys[0]].data.sheetId;
            });
          }
        });
      }
      saveDiscoverDocData("join", this.nodeList);
    }

    //two or more nodes exists on canvas after deleting node - will treated as join
    else if (keys.length > 1) {
      let sheetIds = [];
      lodash.forEach(currentNodeList, (node) => {
        sheetIds.push(node.data.sheetId);
      });
      lodash.remove(joinRequest.reports, function (n) {
        return sheetIds.indexOf(n.sheetid) === -1;
      });
      joinRequest.join = this.prepareJoinOnDeleteNode(currentNodeList);
      saveDiscoverDocData("join", this.nodeList);
      //  previewDataOfDataJoinRequest();
      this.props.previewDataViewData();
    }
    // if (!this.state.closeModalEvent) {
    //   this.props.initSheetList();
    // }
  }

  prepareJoinOnDeleteNode(currentNodeList) {
    let join = aeDiscoverDocData.data.joinRequest.join;
    let sheetIds = [];
    lodash.forEach(currentNodeList, (node) => {
      sheetIds.push(node.data.sheetId);
    });
    lodash.forEach(sheetIds, (id) => {
      lodash.remove(join, function (n) {
        return n.sIds.indexOf(id) === -1;
      });
    });
    return join;
  }

  getMappedAttribute = (mappedAttribute) => {
    if (mappedAttribute === null) {
      message.error('Join clause already in use.');
    } else {
      this.setState({ mappedAttributes: mappedAttribute });
    }
  }

  /**
   * @name AeDataPreparation#callJoinApiForPagination
   * @param {object} pageConfig
   * @desc function that updates joinRequest On pagination
   */
  callJoinApiForPagination = (pageConfig) => {
    let joinRequest = aeDiscoverDocData.data.joinRequest;
    this.callJoinAPI(joinRequest, pageConfig);
  }


  /**
   * @name AeDataPreparation#updateJoinCanvas
   * @param {object} item
   * @desc function that calls removeDataSource() of parent component & updateNodeList().
   */
  updateJoinCanvas = (item) => {
    this.props.removeDataSource(item);
    this.updateNodeList("AE_" + item.sheetId);
  }

  /**
   * @name AeDataPreparation#updateNodeList
   * @param {string} nodeId
   * @desc function that calls getUpdatedNodeList() and removeNodes().
   */
  updateNodeList(nodeId) {
    let prevNodeList = aeDiscoverDocData.data.join;
    let data = this.getUpdatedNodeList(prevNodeList, nodeId);
    this.nodeList = data.remainingNodes;
    this.removeNodes(prevNodeList, this.nodeList, data.removedNodeList);
  }

  /**
   * @name AeDataPreparation# getUpdatedNodeList
   * @desc getUpdatedNodeList function returns updated nodeList object with updated nodes and connection
   * @param {object} node
   * @param {string} currentNodeId
   */
  getUpdatedNodeList = (node, currentNodeId) => {
    let newnodelist = {};
    let removedNodeList = [];
    if (node[currentNodeId]) {
      //let connection = node[currentNodeId].connections;
      //removeConnectedNodes(connection, node, removedNodeList);
    }
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
   * @name AeDataPreparation#setInstance
   * @param {object} instance
   * @desc function that sets instance of JSPlumb to this.instance
   */
  setInstance = (instance) => {
    this.instance = instance;
  }

  /**
   * @name AeDataPreparation#deleteNodeFromCanvas
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

  /****************************************DATA_JOIN_MODAL FUNCTIONS END *************************************/

  /**
    * @method AeDataPreparation#toggleAddReportModal
    * @private
    * @description action fuction help to toggle add report modal by updating state
    **/
  toggleAddReportModal = () => {
    if (getClassName(this.props.data.headerReducer.isEditable)) {
      message.destroy();
      message.warning(`"${aeDiscoverDocData.name}" ${READ_ONLY_MSG}`);
      return;
    }
    if (this.props.data.dataSourceListReducer.selectedDatasource.length <= 10) {
      this.setState((prevState) => {
        return { isAddReportModal: !prevState.isAddReportModal };
      });
    } else {
      message.destroy();
      message.info(AE_DATA_SOURCE_LIMIT);
    }
  }

  /**
   * @name AeDataPreparation#toggleDataJoinSideBar
   * @desc function that updates state of isSidebarOpen
   */
  toggleDataJoinSideBar = () => {
    this.props.updateDrawerState();
  }

  /**
   * @name AeDataPreparation#togglePublishDatViewModal
   * @desc function that updates state of Publish Data View
   */
  togglePublishDataViewModal = () => {
    this.setState((prevState) => {
      return { isPublishModal: !prevState.isPublishModal };
    });
  }

  publishDataModel = (dataModelName) => {
    // TODO call the api to save the data model
    if (this.props.publishDataModel instanceof Function) {
      this.props.publishDataModel(dataModelName, this.props.getDataSourceDetails, this.props.handleNavigation);
    }
    this.togglePublishDataViewModal();
  }

  /**
   * Renders the AeDataPreparation component
   * @private
   * @method AeDataPreparation#render
   * @return {ReactElement} markup
   */
  render() {
    return <div>Data prepare</div>
  }
}