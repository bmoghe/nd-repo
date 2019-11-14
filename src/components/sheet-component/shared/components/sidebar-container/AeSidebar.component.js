import React, { Component } from 'react';
import { AeSidebarDefaultProps, AeSidebarPropTypes } from './types';
import './AeSidebar.scss';

export class AeSidebar extends Component {

  /**
   * @name  AeSidebar#handleToggleState
   * @desc update the state of component and toggle the sidebar.
   */
  handleToggleState = () => {
    if (this.props.onToggleComplete instanceof Function) {
      this.props.onToggleComplete(!this.props.isExpanded);
    }
  };

  render() {
    const {children, isExpanded, direction, collapsedTitle, style} = this.props;
    const horizontalIcon = isExpanded ? 'outline-budicon-chevron-left' : 'outline-budicon-chevron-right';
    const verticalIcon = isExpanded ? 'outline-budicon-chevron-top' : 'outline-budicon-chevron-bottom';
    const icon = direction === 'vertical' ? verticalIcon : horizontalIcon;
    const sidebarClass = isExpanded ? 'expanded' : 'collapsed';
    const title = !isExpanded ? collapsedTitle : '';
    return (
      <div className={ `ae-sheet-sidebar ${ sidebarClass } ${ direction }` } style={ isExpanded ? style : {} }>
        <div className="sidebar-title" onClick={ this.handleToggleState }>{ title }</div>
        { isExpanded ? children ? children : 'Sidebar Body' : '' }
        <button
          onClick={ this.handleToggleState }
          type="button"
          className="btn btn-outline-secondary btn-sm">
          <i className={ icon }/>
        </button>
      </div>
    );
  }
}

AeSidebar.propTypes = AeSidebarPropTypes;

AeSidebar.defaultProps = AeSidebarDefaultProps;
