const requestPayloadData = {
  bioid: '',
  col: '',
  currency: '',
  currencyDate: 'T',
  dir: '',
  fid: '',
  filter: '',
  // eslint-disable-next-line camelcase
  in_val: [],
  mea: '',
  page: 1,
  plimit: 20,
  pstart: 0,
  rate: '',
  requestID: '',
  row: '',
  serviceName: 'ExecuteBIObjectData',
  sheetid: '',
  sort: '',
  source: 'discovery',
};
export const getRequestPayload = () => {
  return { ...requestPayloadData };
};
