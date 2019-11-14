import * as utils from '../Discovery.utils';
import { aeDiscoverDocData } from "../../../shared/constants";

describe('Discovery.utils tests', () => {
  it('should set provided params to "aeDiscoverDocData" by updateDiscoveryAfterSaveAndPublish method', () => {
    const data = {
      dataObject: {
        dataobjectID: 'test_dataobjectID',
        bioid: 'test_bioid',
        dataobjectName: 'test_dataobjectName',
        description: 'test_description',
      }
    };

    utils.updateDiscoveryAfterSaveAndPublish(data, 'testCoprporate');
    expect(aeDiscoverDocData.data.REPORTID).toBe('test_dataobjectID');
    expect(aeDiscoverDocData.id).toBe('test_bioid');
    expect(aeDiscoverDocData.name).toBe('test_dataobjectName');
    expect(aeDiscoverDocData.description).toBe('test_description');
    expect(aeDiscoverDocData.corporate).toBe('testCoprporate');
  });
})
