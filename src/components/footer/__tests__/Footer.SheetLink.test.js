import React from 'react';
import { shallow } from "enzyme";
import { Sheet } from "../Footer.SheetLink";
import toJson from 'enzyme-to-json';

describe('Footer SheetLink Component', () => {
  it('should not crash', () => {
    const props = {
      sheet: {
        name: 'test'
      }
    };
    const wrapper = shallow(<Sheet {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should display correct number of sheets', () => {
    const props = {
      sheet: {
        name: 'test'
      }
    };
    const wrapper = shallow(<Sheet {...props} />);
    expect(wrapper).not.doBe(undefined);
  });

  it('should be selected default sheet', () => {
    const props = {
      sheet: {
        name: 'test'
      }
    };
    const wrapper = shallow(<Sheet {...props} />);
  });

  it('should open action popup to make duplicate/delete/set default', () => {
    
  });

  it('should navigate to "sheet/:id" upon click, validate the url', () => {
    
  });
})
