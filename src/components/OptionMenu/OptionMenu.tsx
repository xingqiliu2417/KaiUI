import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from 'react-dom';

import TextInput from "../TextInput/TextInput";
import SoftKey from '../SoftKey/SoftKey';
import OptionItem from "./OptionItem";
import './OptionMenu.scss';

const prefixCls = 'kai-menu';

interface LocalProps {
  header?: string
  children?: any[]
  onChangeIndex?: (index: number) => void
  isActive?: boolean
  softKeyText: string[]
  menuOptions: any[]
  onClose?: () => void
  close?: () => void
  enableSearch?: boolean
}

const OptionMenu = React.memo<LocalProps>(props => {
  const {
    header,
    children,
    onChangeIndex,
    isActive,
    softKeyText,
    menuOptions,
    close,
    enableSearch
  } = props;

  const itemRefs: any = [];
  const [selectedItem, setSelectedItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  let lastFocus: any = document.activeElement;

  const itemCls = prefixCls;

  const handleItemChange = useCallback(
    itemIndex => {
      if (onChangeIndex) {
        onChangeIndex(itemIndex);
      }
    },
    [onChangeIndex]
  );

  const setFocusToIndex = useCallback(
    index => {
      const elem: any | null = ReactDOM.findDOMNode(itemRefs[index].current);
      if (elem) {
        elem.focus();
        setSelectedItem(index);
      }
    },
    [itemRefs]
  );

  const focusLast = useCallback(() => {
    if (lastFocus && lastFocus.offsetParent) {
      lastFocus.focus();
    }
    lastFocus = null;
  }, [lastFocus]);

  const closeMenu = useCallback(() => {
    if (close) {
      close();
    }
    focusLast();
  }, [close]);

  const handleKeyDown = useCallback(
    e => {
      let index = selectedItem;
      if (!isActive) {
        return;
      }

      switch (e.key) {
        case 'Enter':
          closeMenu();
          if (menuOptions[index] && menuOptions[index].onSelect) {
            menuOptions[index].onSelect();
          }
          break;
        case 'SoftLeft':
        case 'ArrowRight':
          closeMenu();
          break;
        case 'ArrowUp':
          index = index > 0 ? --index : itemRefs.length - 1;
          setFocusToIndex(index);
          break;
        case 'ArrowDown':
          index = index < itemRefs.length - 1 ? index + 1 : 0;
          setFocusToIndex(index);
          break;
        case 'Backspace':
          closeMenu();
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    [itemRefs, isActive, selectedItem, setFocusToIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isActive) {
      setFocusToIndex(selectedItem);
    }
  }, [isActive, setFocusToIndex, selectedItem]);

  const childrenToRender = children ? [...children] : [];
  if (enableSearch === true) {
    childrenToRender.unshift(
      <TextInput
        id='optMenuSearch'
        initialValue={searchTerm || ''}
        index={0}
        onChange={ev => {
          setSearchTerm(ev.target.value);
        }}
      />
    );
  }

  const renderedItems = React.Children.map(childrenToRender, (item, idx) => {
    const itemRef = React.createRef();

    itemRefs[idx] = itemRef;

    return React.cloneElement(item, {
      index: idx,
      onFocusChange: handleItemChange,
      ref: itemRef
    });
  });

  const matchingSearchChildren = searchTerm
    ? childrenToRender.filter(
        child =>
          child.props.id === 'optMenuSearch' ||
          (child.props.text &&
            child.props.text.toLowerCase().indexOf(searchTerm.toLowerCase()) >
              -1)
      )
    : undefined;

  const filteredItems =
    matchingSearchChildren && matchingSearchChildren.length > 0
      ? React.Children.map(matchingSearchChildren, (item, idx) => {
          const itemRef = React.createRef();

          itemRefs[idx] = itemRef;

          return React.cloneElement(item, {
            index: idx,
            onFocusChange: handleItemChange,
            ref: itemRef
          });
        })
      : undefined;

  return (
    <>
      <div className={`${itemCls}-wrapper`}>
        <header className={`${itemCls}-header`}>{header}</header>
        <nav>
          {matchingSearchChildren && matchingSearchChildren.length > 0
            ? filteredItems
            : renderedItems}
        </nav>
      </div>
      <SoftKey
        leftText={softKeyText[0]}
        centerText={softKeyText[1]}
        rightText={softKeyText[2]}
      />
    </>
  );
});

export const OpenOptions = (config: any) => {
  const div = document.createElement('div');
  div.className = 'kai-menu';
  document.body.appendChild(div);

  function render(props: JSX.IntrinsicAttributes & LocalProps) {
    ReactDOM.render(<OptionMenu {...props} >
      {
        config.menuOptions.map((item: { id: string; }, index: number) => {
          return <OptionItem text={item.id} key={item.id + index} index={index} ></OptionItem>
        })
      }
    </OptionMenu>, div);
  }

  function close() {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    config.onClose && config.onClose();
  }

  render({ ...config, close });
}

export default OptionMenu;
