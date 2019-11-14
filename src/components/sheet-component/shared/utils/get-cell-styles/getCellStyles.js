import { isNumber, toNumber } from 'lodash';

const iterateTokenItems = (j, tokenItems, columnIds, params) => {
  let xItem = '';
  const arrItems = [];
  for (let i = 0; i < tokenItems.length; i++) {
    if (tokenItems[i].indexOf('[M:' + columnIds[j].field + ']') !== -1) {
      xItem = tokenItems[i].split('[M:' + columnIds[j].field + ']').join(params.node.data[columnIds[j].field]);
      arrItems.push(xItem);
    }
    if (tokenItems[i].indexOf('[D:' + columnIds[j].field + ']') !== -1) {
      xItem = tokenItems[i].split('[D:' + columnIds[j].field + ']').join('\'' + params.node.data[columnIds[j].field] + '\'');
      arrItems.push(xItem);
    }
  }
  return arrItems;
};

const prepareColumnIds = (columnDefs, tokenItems) => {
  const columnIds = [];
  for (let z = 0; z < tokenItems.length; z++) {
    const col = tokenItems[z].slice(tokenItems[z].indexOf(':') + 1, tokenItems[z].indexOf(']'));
    const column1 = columnDefs.find(column => column.field === col);
    columnIds.push(column1);
  }
  return [ ...columnIds ];
};

/**
 * @name getCellStyles
 * @param {object} newSheet
 * @param params
 * @param measuresDimensions
 * @returns {object}
 * @desc function that returns object with appropriate cellStyle applied to it
 */
export function getCellStyles (rangesLists, columnDefs, params, measuresDimensions) {
  let numberStyle;
  let colorObject = null;
  const measures = measuresDimensions.filter(mea => mea.isMeasure === true);
  const dimensions = measuresDimensions.filter(dim => dim.isDimension === true);
  const measure = measures.find(item => item.id === params.colDef.field);
  const dimension = dimensions.find(item => item.id === params.colDef.field);

  numberStyle = measure && measure.isMeasure ? { textAlign: 'right' } : isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };

  if (dimension && dimension.isDimension && dimension.type === 'number') {
    numberStyle = { textAlign: 'right' };
  }
  const rangesList = { ...rangesLists };
  if (rangesList && rangesList[params.colDef.field]) {
    rangesList[params.colDef.field].forEach((item) => {
      if (item.rangeCondition) {
        const coId = item.tokenString.slice(item.tokenString.indexOf(':') + 1, item.tokenString.indexOf(']'));
        const column = columnDefs.find(col => col.field === coId);
        let newExp = '';
        if (item.tokenString) {
          if (item.tokenString.indexOf('&&') !== -1) {
            let tokenItems = [];
            tokenItems = item.tokenString.split('&&');
            const columnIds = prepareColumnIds(columnDefs, tokenItems);
            for (let j = 0; j < columnIds.length; j++) {
              if (columnIds[j]) {
                const arrItems = iterateTokenItems(j, tokenItems, columnIds, params);
                for (let l = 0; l < arrItems.length; l++) {
                  const newExpresion = arrItems[l] + '&&' + arrItems[l + 1];
                  try {
                    if (eval(newExpresion)) {
                      colorObject = { color: item.color, backgroundColor: item.backGroundColor };
                    }
                  } catch (ex) {
                    // console.log(ex);
                  }
                }
              }
            }
          } else if ((item.tokenString.indexOf('||') !== -1)) {
            let tokenItems = [];
            tokenItems = item.tokenString.split('||');
            const columnIds = prepareColumnIds(columnDefs, tokenItems);
            for (let j = 0; j < columnIds.length; j++) {
              if (columnIds[j]) {
                const arrItems = iterateTokenItems(j, tokenItems, columnIds, params);
                for (let l = 0; l < arrItems.length; l++) {
                  const newExpresion = arrItems[l] + '||' + arrItems[l + 1];
                  try {
                    if (eval(newExpresion)) {
                      colorObject = { color: item.color, backgroundColor: item.backGroundColor };
                    }
                  } catch (ex) {
                    // console.log(ex);
                  }
                }
              }
            }

          } else if (column) {
            if (item.tokenString.indexOf('[M:' + column.field + ']') !== -1) {
              newExp = item.tokenString.split('[M:' + column.field + ']').join(params.node.data[column.field]);
            }
            if (item.tokenString.indexOf('[D:' + column.field + ']') !== -1) {
              if (typeof (params.node.data[column.field]) === 'string') {
                newExp = item.tokenString.split('[D:' + column.field + ']').join('\'' + params.node.data[column.field] + '\'');
              } else {
                newExp = item.tokenString.split('[D:' + column.field + ']').join(params.node.data[column.field]);
              }
            }
            try {
              let exp = newExp;
              if (newExp.indexOf('=') !== -1) {
                exp = newExp.replace('=', '==');
              }
              if (eval(exp)) {
                colorObject = { color: item.color, backgroundColor: item.backGroundColor };
              }
            } catch (ex) {
              // console.log(ex);
            }
          }
        }
      } else if (toNumber(params.value)) {
        if (params.value >= item.rangeFrom && params.value <= item.rangeTo) {
          colorObject = { color: item.color, backgroundColor: item.backGroundColor };
        }
      }
    });
  }
  return Object.assign(numberStyle, colorObject);
}

