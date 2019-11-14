// eslint-disable-next-line no-unused-vars
export const getQueryStringValue = (url, key) => {
  const data = decodeURIComponent(
    url.replace(
      new RegExp(
        `^(?:.*[&?]${encodeURIComponent(key)
          // eslint-disable-next-line no-useless-escape
          .replace(/[\.\+\*]/g, '\\$&')}(?:=([^&]*))?)?.*$`,
        'i'
      ),
      '$1'
    )
  );
  return data;
};

export const getSlashSeparatedValue = (url, key, splitter) => {
  let retVal;
  if (url && key && splitter) {
    url = url.split(splitter)[1];
    if (url) {
      url.split('/').forEach((val, ind, arr) => {
        if (ind % 2 === 0 && arr[ind - 1] === key) {
          retVal = val;
        }
      });
    }
  }
  return retVal;
}
export default getQueryStringValue;
