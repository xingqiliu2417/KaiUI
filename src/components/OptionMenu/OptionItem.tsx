import React from "react";
import { SoftKeyConsumer } from '../SoftKey/withSoftKeyManager';
import { useFocus } from '../../hooks/useFocus';

const prefixCls = 'kai-menu';

interface LocalProps {
  index: number
  text: string
  onFocusChange?: (index: number) => void
  onClick?: () => void
  softKeyManager?: any
  forwardedRef?: any
}

const OptionItem = React.memo<LocalProps>(props => {
  const { index, text, onFocusChange, forwardedRef } = props;

  const itemCls = `${prefixCls}-item`;

  const handleFocusChange = () => {
    if (isFocused && onFocusChange) {
      onFocusChange(index);
    }
  };

  const isFocused = useFocus(forwardedRef, handleFocusChange, false);

  return (
    <div tabIndex={0} ref={forwardedRef} className={itemCls}>
      {text}
    </div>
  );
});

export default React.forwardRef((props: LocalProps, ref) => (
  <SoftKeyConsumer>
    {(context: any) => (
      <OptionItem softKeyManager={context} forwardedRef={ref} {...props} />
    )}
  </SoftKeyConsumer>
));
