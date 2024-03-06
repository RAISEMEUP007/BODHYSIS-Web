import React, { useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BasicModalContainer from '../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../common/components/basicmodal/ModalFooter';
import { QuantitiesDetailsModalstyles } from './styles/QuantitiesDetailsModalStyle';


interface QuantitiesDetailsModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
  quantitiesData: [ { line:string; requested: number; available: number } ];
  onContinue: () => void;
}

const QuantitiesDetailsModal = ({
  isModalVisible,
  closeModal,
  quantitiesData,
  onContinue,
}: QuantitiesDetailsModalProps) => {

  const renderTableData = () => {
    const rows = [];
    if (quantitiesData.length > 0) {
      quantitiesData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell]}>
              <Text style={{ color: item.requested > item.available ? 'red' : 'black' }}>{item.line}</Text>
            </View>
            <View style={[styles.cell, { alignItems:'flex-end', width: 100 }]}>
              <Text style={{ color: item.requested > item.available ? 'red' : 'black' }}>{item.requested}</Text>
            </View>
            <View style={[styles.cell, { alignItems:'flex-end', width: 100 }]}>
              <Text style={{ color: item.requested > item.available ? 'red' : 'black' }}>{item.available}</Text>
            </View>
          </View>
        );
      });
    } else {
      <View style={{ alignItems: 'center', paddingTop: 10 }}>
        <Text>No items</Text>
      </View>;
    }
    return <>{rows}</>;
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={"Review Quantities"}
          closeModal={() => {
            closeModal();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <Text style={{color:'red'}}>{"Insufficient quantity for one or more items"}</Text>
          <View style={[styles.tableContainer]}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader]}>{'Product line'}</Text>
              <Text style={[styles.columnHeader, { width: 100 }]}>{'Requested'}</Text>
              <Text style={[styles.columnHeader, { width: 100 }]}>{'Available'}</Text>
            </View>
            <ScrollView style={{ }}>{renderTableData()}</ScrollView>
          </View>
        </ModalBody>
        <ModalFooter>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>{'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onContinue}>
              <Text style={styles.buttonText}>{'Continue'}</Text>
            </TouchableOpacity>
          </View>
        </ModalFooter>
      </BasicModalContainer>
    </View>
  ) : null;
};

const styles = QuantitiesDetailsModalstyles;

export default QuantitiesDetailsModal;
