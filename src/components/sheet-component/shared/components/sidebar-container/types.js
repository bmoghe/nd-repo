import { bool, func, oneOf, node } from 'prop-types';

export const AeSidebarPropTypes = {
  isExpanded: bool,
  onToggleComplete: func,
  direction: oneOf([ 'horizontal', 'vertical' ]),
  collapsedTitle: node
};

export const AeSidebarDefaultProps = {
  isExpanded: true,
  direction: 'horizontal'
};
