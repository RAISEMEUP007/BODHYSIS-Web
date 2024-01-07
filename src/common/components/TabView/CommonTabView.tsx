import React, { ReactElement, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/Colors';

export type TabType = {
  icon: string;
  title: string;
  onPress: () => void;
  renderComponent: () => ReactElement;
};

interface Props {
  tabs: Array<TabType>;
  width?: number;
}

export const CommonTabView = ({ tabs, width = 600 }: Props) => {
  const [selectedTab, setSelectedTab] = useState<TabType>(tabs[0]);

  const renderTabs = () => {
    return (
      <View style={styles.tabs}>
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => {
                setSelectedTab(tab);
              }}
              style={{ ...styles.label, width: width / tabs.length }}
            >
              <Text style={styles.title}>{tab.title}</Text>
              <Icon name={tab.icon} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    return <View style={{ flex: 1 }}>{selectedTab.renderComponent()}</View>;
  };

  return (
    <View style={{ ...styles.container, width }}>
      {renderTabs()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  tabs: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 0.5,
    borderColor: Colors.Neutrals.DARK,
  },
  label: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingVertical: 5,
  },
});
