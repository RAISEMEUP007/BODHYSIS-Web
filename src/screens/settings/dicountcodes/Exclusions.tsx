import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  TouchableWithoutFeedback,
  Platform,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getExclusionsData, deleteExclusion, updateExclusion } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';

import { exclusionStyle } from './styles/ExclusionStyle';
import { TextMediumSize } from '../../../common/constants/Fonts';

const Exclusions = ({
  DiscountCodeId,
  updateExclusionTrigger,
  setUpdateExclusionTrigger,
  openExclusionModal,
  editExclusion,
}) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (updateExclusionTrigger == true) getTable();
  }, [updateExclusionTrigger, DiscountCodeId]);

  const removeExclusion = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteExclusion(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateExclusionTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    });
  };

  const getTable = () => {
    getExclusionsData(DiscountCodeId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateExclusionTrigger(false);
          setTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell]}>
              <Text>{item.description}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>
                {new Date(item.from_date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={[styles.cell]}>
              <Text>
                {new Date(item.to_date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editExclusion(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeExclusion(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    } else {
      <View style={{ alignItems: 'center', paddingTop: 10 }}>
        <Text>No Address</Text>
      </View>;
    }
    return <>{rows}</>;
  };

  return (
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <View>
        <TouchableOpacity style={styles.deliveryButton} onPress={openExclusionModal}>
          <Text>{'New exclusion'}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.tableContainer]}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader]}>{'Description'}</Text>
          <Text style={[styles.columnHeader]}>{'From'}</Text>
          <Text style={[styles.columnHeader]}>{'To'}</Text>
          <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
          <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
        </View>
        <ScrollView style={{ minHeight: 30 }}>{renderTableData()}</ScrollView>
      </View>
    </View>
  );
};

const styles = exclusionStyle;

export default Exclusions;
