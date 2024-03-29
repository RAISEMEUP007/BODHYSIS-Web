import { TabBar } from "react-native-tab-view";

export const RenderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor:'#007aFF'}}
    style={{
      backgroundColor:'transparent',
    }}
    labelStyle={{
      color:'black'
    }}
    activeColor={'#007aFF'}
    inactiveColor={'#b6b6b6'}
  />
);