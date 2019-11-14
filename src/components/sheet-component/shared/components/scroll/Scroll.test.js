import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure  } from 'enzyme';
import { Scroll} from './Scroll';

configure({ adapter: new Adapter() });

describe('<Scroll />', () => {
  it('Default props should get assigned', () => {
    const wrapper = mount(
      <Scroll
        style={{ width: 500 }}
      />);
    expect(wrapper.props().scrollLeftBy).toBe(50);
    expect(wrapper.props().scrollRightBy).toBe(50);
    expect(wrapper.props().actionBtnPosition).toBe('right');
  });

  it('action button should render at right side', () => {
    const wrapper = mount(
      <Scroll
        scrollLeftBy={50} scrollRightBy={50}
        actionBtnPosition="right"
        style={{ width: 500 }}
      />);
    expect(wrapper.props().actionBtnPosition).toBe('right');
  });

  it('action button should render at left side', () => {
    const wrapper = mount(
      <Scroll
        scrollLeftBy={50} scrollRightBy={50}
        actionBtnPosition="left"
        style={{ width: 500 }}
      />);
    expect(wrapper.props().actionBtnPosition).toBe('left');
  });
});
