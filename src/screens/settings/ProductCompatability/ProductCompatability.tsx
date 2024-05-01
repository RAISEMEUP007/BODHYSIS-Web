import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity,} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// import { getProductCompatabilityData, deleteProductCompatability } from '../../../api/Settings';
import { TextMediumSize } from '../../../common/constants/Fonts';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { ProductCompatabilityStyle } from './styles/ProductCompatabilityStyle';
import { BOHTable, BOHTHead, BOHTBody, BOHTR, BOHTH, BOHTD } from '../../../common/components/bohtable';

const ProductCompatability = ({ navigation, openInventory }) => {

  const [tableData, setTableData] = useState([]);
  const [updateProductCompatabilityTrigger, setUpdateProductCompatabilityTrigger] = useState(true);

  useEffect(() => {
    if (updateProductCompatabilityTrigger == true) getTable();
  }, [updateProductCompatabilityTrigger]);

  const getTable = () => {
    // getProductCompatabilityData((jsonRes, status, error) => {
    //   switch (status) {
    //     case 200:
    //       setUpdateProductCompatabilityTrigger(false);
    //       setTableData(jsonRes);
    //       break;
    //     case 500:
    //       showAlert('error', msgStr('serverError'));
    //       break;
    //     default:
    //       if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
    //       else showAlert('error', msgStr('unknownError'));
    //       break;
    //   }
    // });
  };

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR>
            <BOHTD>
              
            </BOHTD>
          </BOHTR>
        );
      });
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(null);
      }}
      screenName={'ProductCompatability'}
    >
      <View style={styles.container}>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={300}>{'ProductCompatability'}</BOHTH>
              <BOHTH>{'Edit'}</BOHTH>
              <BOHTH lastCell>{'DEL'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>
      </View>
    </BasicLayout>
  );
};

const styles = ProductCompatabilityStyle;

export default ProductCompatability;
