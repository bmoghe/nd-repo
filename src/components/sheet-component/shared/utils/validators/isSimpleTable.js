import { getSheetData } from '../../context-model';

export const isSimpleTable = () => {
  const dataSheet = getSheetData();
  if (dataSheet) {
    const isDimensionInColumn = !!dataSheet.pivot.column.find(item => item.isDimension === true);
    const isDimensionInRow = !!dataSheet.pivot.row.find(item => item.isDimension === true);
    const isMeasureInRow = !!dataSheet.pivot.row.find(item => item.isMeasure === true);
    const isMeasureInColumn = !!dataSheet.pivot.column.find(item => item.isMeasure === true);
    return !(isDimensionInColumn && isDimensionInRow && (isMeasureInRow || isMeasureInColumn));
  }
  return true;
};
