export const defaultJsPlumbInstance = {
  Endpoint: ['Dot', { radius: 1, cssClass: 'endpoint' }],
  Connector: 'Flowchart',
  maxConnections: -1,
  // anchor:'Right',
  HoverPaintStyle: { stroke: '#1e8151', strokeWidth: 1 },
  Container: 'canvas',
};

const type = 'basic';
const connector = ['Flowchart', { stub: [-80, 0], gap: 0, cornerRadius: 0, alwaysRespectStubs: true }];
const anchors = ['Right', 'Continuous'];
const overlays = [['Label', { label: '', id: 'label', cssClass: 'ae-overlay INNER_JOIN', location: -60 }]];

/**
 * Blend all type, connector, anchors, overlays properties together.
 */
export const connectionProperties = {
  type,
  connector,
  anchors,
  overlays,
};

export const DELETE_MSG1 = 'Dimensions and measures from ';
export const DELETE_MSG1_1 = 'are used in the ';
export const DELETE_MSG2 = 'If you delete it you may be loose data from above mentioned sheet(s).';
export const DELETE_MSG3 = 'If you delete it you may loose the connected report(s) on canvas.';
export const DELETE_MSG4 = 'Are you sure you want to delete ';
export const DELETE_REPORT_SHEET = 'Delete Report sheet';
export const AE_SINGLE_DATA_VIEW = 'Multiple data views are not allowed to join';
export const AE_JOIN_LIMIT_MSG = 'Join limit exceeded';
