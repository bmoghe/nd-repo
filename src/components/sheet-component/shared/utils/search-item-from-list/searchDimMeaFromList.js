export function searchDimMeaFromList(list, searchValue, dimensionFlag) {
  let newList = [];
  if (dimensionFlag) {
    newList = list.filter((dimensionElem) => {
      return dimensionElem.attributeName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
    });
  } else {
    newList = list.filter((element) => {
      return element.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
    });
  }
  return newList;
}
