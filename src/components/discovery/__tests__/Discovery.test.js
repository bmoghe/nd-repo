import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { DiscoveryContainer } from '../..';

const mockStore = configureStore();
const initialState = { output: 10 };

let wrapper, store;
describe('Discovery Component', () => {
  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = shallow(<DiscoveryContainer store={store} docId='123' />);
  });

  it('should not crash', () => {
    expect(wrapper).toMatchSnapshot();
  });
})
