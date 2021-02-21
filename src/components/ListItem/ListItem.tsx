import React from 'react';
import { useFocus } from '../../hooks/useFocus';
import './ListItem.scss';
import classNames from 'classnames';

// Just pure `list-item` component,
// it's used in the <ListView></ListView> tag.
// `list-item` can be wrapped inside any element.
// <ListItem>{item.children}</ListItem>

const prefixCls = 'kai-list-item';

interface LocalProps {
  children: any
  focusClass?: string
  forwardedRef?: any
  index?: number
  onFocusChange?: (index: number) => void
  className?: string
}

const ListItem = React.memo<LocalProps>(
  props => {
    const {
      children,
      focusClass,
      forwardedRef,
      index,
      onFocusChange,
      className
    } = props;

    const handleFocusChange = (isNowFocused?: boolean) => {
      if (isNowFocused) {
        if (onFocusChange && index !== undefined) {
          onFocusChange(index);
        }
      }
    }

    const isFocused = useFocus(forwardedRef, handleFocusChange, false);

    const itemCls = prefixCls;
    const focusedCls = isFocused ? `${prefixCls}-focused ${(focusClass || 'defaultFocusCls')}` : '';
    return (
      <div
        tabIndex={0}
        className={classNames(itemCls, (className || ''), focusedCls)}
        ref={forwardedRef}
      >
        {children}
      </div>
    );
  }
);

export default React.forwardRef((props: LocalProps, ref: any) => (
  <ListItem forwardedRef={ref} {...props} />
));
