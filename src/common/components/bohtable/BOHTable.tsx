import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet, ViewProps, ActivityIndicator } from 'react-native';

interface BOHTableProps extends ViewProps {
  children?: ReactNode;
  isLoading?: boolean;
}

const BOHTable: React.FC<BOHTableProps> = ({ children, isLoading, style, ...rest }) => {

  const loadingComponent = useMemo(()=>(<View style={[styles.overlay, !isLoading && {display:"none"}]}>
    <ActivityIndicator size={32} color="#0000ff" />
  </View>), [isLoading])

  return (
    <View
      {...rest}
      style={[styles.defaultTheme, style]}
    >
      {children}
      {loadingComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    flex:1,
    marginVertical: 10,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
    borderLeftWidth: 1,
    borderLeftColor: '#bfBFbf',
    borderRightWidth: 1,
    borderRightColor: '#bfBFbf',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});

export default BOHTable;