import React, { useMemo } from 'react';
import { FlatList, ViewStyle } from 'react-native';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ProductRquestType } from '../../../types/ProductTypes';

export type BOH_ID = number | string;

export type ColumnType<T> = {
  value: T;
};

export interface ObjectWithId {
  id: number;
}

export type RowType<T> = {
  id: BOH_ID;
  values: Array<ColumnType<T>>;
};

export type RowHeaderType = Array<string>;

export interface TableData {
  rowHeader: RowHeaderType;
  tableData: Array<ObjectWithId>;
  keys: Array<string>;
}

interface Props {
  data: TableData;
  width?: number;
  rowContainerStyle?: ViewStyle;
  onTapRemove?: (item: BOH_ID) => void;
}

export const CommonTable = ({ data, width = 600, rowContainerStyle, onTapRemove }: Props) => {
  const { rowHeader, tableData } = data;

  const keys = useMemo(() => {
    return data.keys;
  }, [data]);

  const renderHeader = () => {
    return (
      <View key={'header'} style={styles.header}>
        {rowHeader.map((column, colIndex) => {
          return (
            <View key={`header_${colIndex.toString()}`} style={styles.column}>
              <Text style={styles.headerText}>{column}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderRow = ({ item, index }: { item: ObjectWithId; index: number }) => {
    return (
      <View key={'row' + index.toString()} style={styles.row}>
        {keys.map((key, index) => {
          const renderDeleteButton = () => {
            if (index > 0) {
              return null;
            }
            return (
              <Pressable
                key={`preesable_$row${index} col${index}`}
                onPress={() => {
                  if (onTapRemove) {
                    onTapRemove(item.id);
                  }
                }}
              >
                <AntDesign style={{ marginRight: 5 }} size={15} name={'closesquare'} />
              </Pressable>
            );
          };

          return (
            <View style={styles.column} key={`view_$row${index} col${index}`}>
              {renderDeleteButton()}
              <Text style={styles.columnText}>{item[key]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderData = () => {
    return <FlatList data={tableData} renderItem={renderRow} />;
  };

  return (
    <View style={{ ...styles.container, width, ...rowContainerStyle }}>
      {renderHeader()}
      {renderData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    borderColor: Colors.Neutrals.DARK,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  column: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
  },
  columnText: {},
  row: {
    flex: 1,
    height: 80,
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: '600',
  },
});
