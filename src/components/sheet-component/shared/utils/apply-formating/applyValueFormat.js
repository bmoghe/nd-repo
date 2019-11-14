import numeral from 'numeral';

// export const applyValueFormat = (gridData, formatConfig, meaDimList) => {
//   gridData.columnDefs.forEach(column => {
//     gridData.rowData.forEach(row => {
//       const formatConf = formatConfig.find(format => format.colId === column.field);
//       if (formatConf) {
//         row[formatConf.colId] = numeral(row[formatConf.colId]).format(formatConf.format);
//       } else {
//         const meaDim = meaDimList.find(item => item.id === column.field);
//         if (meaDim.displayProperties) {
//           row[meaDim.id] = numeral(row[meaDim.id]).format(meaDim.displayProperties.numberFormat);
//         }
//       }
//     });
//   });
//   console.log(gridData);
//   return gridData;
// };

export const applyValueFormat = (formatConfig, meaDimList, params) => {
  let value = params.value;
  const attr = meaDimList.find(item => item.id === params.colDef.field);
  if (attr.displayProperties) {
    value = numeral(value).format(attr.displayProperties.numberFormat);
  }
  if (formatConfig.length) {
    const formatConf = formatConfig.find(conf => conf.colId === params.colDef.field);
    if (formatConf) {
      value = numeral(value).format(formatConf.format);
    }
  }
  return value;
};
