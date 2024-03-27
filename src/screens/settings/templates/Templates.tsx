import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';
import { TabView, SceneMap } from 'react-native-tab-view';
import { DeliveryTab } from './DeliveryTab';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { RenderTabBar } from './TabBar';

const renderScene = SceneMap({
  first: DeliveryTab,
});

export function Templates({ navigation, openInventory }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'first', title: 'Delivery' },
  ]);

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(null);
      }}
      screenName={'Templates'}
    >
      <TabView
        renderTabBar={(props) => <RenderTabBar {...props} />}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </BasicLayout>
  );
}
