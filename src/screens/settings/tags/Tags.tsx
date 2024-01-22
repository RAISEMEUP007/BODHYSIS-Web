import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getTagsData, deleteTag } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { TagsStyle } from './styles/TagsStyle';
import AddTagModal from './AddTagModal';

const Tags = ({ navigation, openInventory }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateTagTrigger, setUpdateTagsTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const openAddTagModal = () => {
    setAddModalVisible(true);
    setSelectedTag(null);
  };
  const closeAddTagModal = () => {
    setAddModalVisible(false);
    setSelectedTag(null);
  };
  const editTag = (item) => {
    setSelectedTag(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateTagTrigger == true) getTable();
  }, [updateTagTrigger]);

  const removeTag = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteTag(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateTagsTrigger(true);
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
    getTagsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateTagsTrigger(false);
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
            <View style={[styles.cell, styles.categoryCell]}>
              <Text style={styles.categoryCell}>{item.tag}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editTag(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeTag(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(null);
      }}
      screenName={'Tags'}
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddTagModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, { width: 400 }]}>{'Tag'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
          </View>
          <ScrollView>{renderTableData()}</ScrollView>
        </View>

        <AddTagModal
          isModalVisible={isAddModalVisible}
          Tag={selectedTag}
          setUpdateTagsTrigger={setUpdateTagsTrigger}
          closeModal={closeAddTagModal}
        />
      </View>
    </BasicLayout>
  );
};

const styles = TagsStyle;

export default Tags;
