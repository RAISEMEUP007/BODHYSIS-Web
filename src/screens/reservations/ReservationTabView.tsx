import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TabType } from '../../common/components/TabView/CommonTabView';
import { CommonTabView } from '../../common/components/TabView/CommonTabView';
import { Colors } from '../../common/constants/Colors';
import { Text } from 'react-native';

const tabs: Array<TabType> = [
  {
    icon: 'lead-pencil',
    title: 'Notes',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Notes'}</Text>
        </View>
      );
    },
  },
  {
    icon: 'calendar-today',
    title: 'Events',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Events'}</Text>
        </View>
      );
    },
  },
  {
    icon: 'bank-transfer',
    title: 'Transactions',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Transactions'}</Text>
        </View>
      );
    },
  },
  {
    icon: 'chat',
    title: 'Comms',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Comms'}</Text>
        </View>
      );
    },
  },
  {
    icon: 'truck',
    title: 'Delivery',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Delivery'}</Text>
        </View>
      );
    },
  },
  {
    icon: 'file-document',
    title: 'Docs',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Docs'}</Text>
        </View>
      );
    },
  },
  {
    icon: 'book-plus',
    title: 'Extras',
    onPress: () => {},
    renderComponent: () => {
      return (
        <View style={{ ...styles.container, backgroundColor: Colors.Neutrals.LIGHT_GRAY }}>
          <Text>{'Extras'}</Text>
        </View>
      );
    },
  },
];

export const ReservationTabView = () => {
  return <CommonTabView width={600} tabs={tabs} />;
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: Colors.Neutrals.DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
