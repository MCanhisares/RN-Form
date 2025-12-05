import React, { useCallback, useRef } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native';
import { Keyboard, ScrollView } from 'react-native';

export type KeyboardAwareScrollViewProps = ScrollViewProps & {
  dismissOnScroll?: boolean;
};

export const KeyboardAwareScrollView = (
  props: KeyboardAwareScrollViewProps
): React.ReactNode => {
  const {
    dismissOnScroll = true,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    keyboardDismissMode,
    scrollEventThrottle,
    ...rest
  } = props;

  const dismissedDuringDragRef = useRef(false);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (dismissOnScroll && !dismissedDuringDragRef.current) {
        Keyboard.dismiss();
        dismissedDuringDragRef.current = true;
      }
      if (typeof onScroll === 'function') {
        onScroll(e);
      }
    },
    [dismissOnScroll, onScroll]
  );

  const handleScrollBeginDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (dismissOnScroll) {
        Keyboard.dismiss();
      }
      if (typeof onScrollBeginDrag === 'function') {
        onScrollBeginDrag(e);
      }
    },
    [dismissOnScroll, onScrollBeginDrag]
  );

  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      dismissedDuringDragRef.current = false;
      if (typeof onScrollEndDrag === 'function') {
        onScrollEndDrag(e);
      }
    },
    [onScrollEndDrag]
  );

  return (
    <ScrollView
      keyboardDismissMode={keyboardDismissMode ?? 'on-drag'}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      scrollEventThrottle={scrollEventThrottle ?? 16}
      {...rest}
    />
  );
};
