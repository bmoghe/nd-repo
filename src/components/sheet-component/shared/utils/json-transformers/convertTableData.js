import { get, split, find, isEmpty } from 'lodash';

export const convertTableData = (response, dimensionList) => {
  // object to construct and returned
  const result = {
    rowData: [],
    columnDefs: [],
  };
  const fields = get(response, 'metaData.fields', []);
  const fieldsLength = fields.length;
  const headersArray = [];
  // add all headers
  for (let index = 0; index < fieldsLength; index++) {
    // get header name
    const {name} = fields[ index ];
    const headerId = split(name, '|')[ 0 ] || '';
    const dimension = find(dimensionList, {'id': headerId});
    const headerName = (!isEmpty(dimension) && (dimension.name || dimension.attributeName)) || '';
    if (headerName) {
      // push header in columnDefs
      result.columnDefs.push({
        headerName,
        'field': headerId,
      });

      headersArray.push(headerId);
    }
  }

  const data = get(response, 'data', []);
  const dataLength = data.length;

  for (let index = 0; index < dataLength; index++) {
    const itemData = data[ index ];
    const itemDataLength = itemData.length;
    const dataObj = {};
    for (let i = 0; i < itemDataLength; i++) {
      dataObj[ headersArray[ i ] ] = itemData[ i ];
    }
    result.rowData.push(dataObj);
  }
  return result;
};
