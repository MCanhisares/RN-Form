import React, { FC, PropsWithChildren } from 'react';
import { StatusBar } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type BaseScreenProps = {} & PropsWithChildren;

export const BaseScreen: FC<BaseScreenProps> = ({ children }) => {
  const { rt } = useUnistyles();
  const edges = ['left', 'right'];

  return (
    <SafeAreaView edges={edges as Edges} style={styles.container}>
      <StatusBar
        barStyle={rt.themeName === 'light' ? 'dark-content' : 'light-content'}
        translucent={true}
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
}));
