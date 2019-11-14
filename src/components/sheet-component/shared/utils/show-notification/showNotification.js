import { message } from 'antd';
import { ERROR_TYPE, INFO_TYPE, SUCCESS_TYPE, WARN_TYPE, WARNING_TYPE } from '../../constants/messageTypes';

/**
 * @name showToastMessages
 * @param {String} msg - this is string/html param.
 * @param {String} TYPE
 * @desc This function will show the toast messages on type of inputs.
 */
export const showNotification = (msg, TYPE) => {
  message.destroy();
  switch (TYPE) {
    case ERROR_TYPE:
      message.error(msg);
      break;

    case WARN_TYPE:
    case WARNING_TYPE:
      message.warn(msg);
      break;

    case INFO_TYPE:
      message.info(msg);
      break;

    case SUCCESS_TYPE:
      message.success(msg);
      break;

    default:
      break;
  }
};
