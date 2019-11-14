export const isValidPivot = (column, row) => {
  if (column instanceof Array && row instanceof Array) {
    const isDimensionInColumn1 = !!column.find(item => item.isDimension === true);
    const isDimensionInRow1 = !!row.find(item => item.isDimension === true);
    const isMeasureInRow1 = !!row.find(item => item.isMeasure === true);
    const isMeasureInColumn1 = !!column.find(item => item.isMeasure === true);
    const arrayOfDimensionsInColumn = column.filter(item => item.isDimension === true);
    const isPivot = (isDimensionInColumn1 && isDimensionInRow1 && (isMeasureInRow1 || isMeasureInColumn1));
    // eslint-disable-next-line no-magic-numbers
    if (isPivot && !!(arrayOfDimensionsInColumn.length > 3)) {
      return false;
    }
  }
  return true;
};
