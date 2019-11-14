import React, { Component } from 'react';
import { number, object, oneOf, string } from 'prop-types';
import './Scroll.scss';

const getStyleForActionButtons = position => {
  const pos = typeof position === 'string' ? position.toLowerCase() : null;

  switch (pos) {
    case 'left':
      return {
        flexDirection: 'row',
      };
    case 'right':
      return {
        flexDirection: 'row-reverse',
      };

    default:
      return {
        flexDirection: 'row-reverse',
      };
  }
};

/**
 * Scroll Component used for the horizontal scrolling using action buttons.
 * @version ./package.json
 */
export class Scroll extends Component {
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
    this.logRight = this.logRight.bind(this);
    this.logLeft = this.logLeft.bind(this);
  }

  logRight() {
    const {scrollRightBy} = this.props;
    const data = this.scrollContainer.current.scrollLeft;
    this.scrollContainer.current.scrollTo(data - scrollRightBy, 0);
  }

  logLeft() {
    const {scrollLeftBy} = this.props;
    const data = this.scrollContainer.current.scrollLeft;
    this.scrollContainer.current.scrollTo(data + scrollLeftBy, 0);
  }

  render() {
    const {style, className, actionBtnPosition} = this.props;
    const actionButtonPosition = getStyleForActionButtons(actionBtnPosition);

    return (
      <div
        style={ {...style, ...actionButtonPosition} }
        className={ `${ className || '' } scroll-container` }
      >
        <div className="scroll-action-buttons">
          <button className="scroll-btn-left" onClick={ this.logRight }>{ '<' }</button>
          <button className="scroll-btn-right" onClick={ this.logLeft }>{ '>' }</button>
        </div>
        <div
          ref={ this.scrollContainer }
          style={ style }
          className="scroll-element-container"
        >
          { this.props.children }
        </div>
      </div>
    );
  }
}

Scroll.propTypes = {

  /** Scroll the content to right*/
  scrollRightBy: number,

  /** Scroll the content to left*/
  scrollLeftBy: number,

  /** Style for scroll the button */
  style: object,
  actionBtnPosition: oneOf([ 'left', 'right' ]),
  className: string,
};

Scroll.defaultProps = {
  scrollRightBy: 50,
  scrollLeftBy: 50,
  actionBtnPosition: 'right',
};

