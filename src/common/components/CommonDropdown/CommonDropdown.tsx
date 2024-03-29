import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

export type DropdownItem<T> = {
  value: T;
  displayLabel: string;
  secondaryLabel?: string;
  index: number;
};

export type DropdownData<T> = Array<DropdownItem<T>>;

interface Props<T> {
  data: DropdownData<T>;
  isCollpased?: boolean;
  placeholder?: string;
  onItemSelected?: (item: DropdownItem<T>) => void;
  containerStyle?: ViewStyle;
  width?: number;
  title?: string;
  textAlign?: 'left' | 'center' | 'right' | 'auto';
}

export const CommonDropdown = ({
  data,
  isCollpased = true,
  placeholder = '',
  containerStyle,
  onItemSelected,
  width = 130,
  title,
  textAlign = 'left',
}: Props<any>) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<null | DropdownItem<any>>(null);

  const renderTitle = () => {
    if (!title) {
      return null;
    }
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (isCollpased !== null) {
      if (isCollpased) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }
  }, [isCollpased]);

  const renderHeader = () => {
    return (
      <Pressable
        onPress={() => {
          setIsOpen(true);
        }}
        style={styles.header}
      >
        <Text>{selectedItem?.displayLabel ?? placeholder}</Text>
      </Pressable>
    );
  };

  const renderSecondaryLabel = (item: DropdownItem<any>) => {
    if (!item.secondaryLabel) {
      return null;
    }
    return (
      <View style={styles.secondaryLabel}>
        <Text style={{ flex: 1 }}>{item.secondaryLabel}</Text>
      </View>
    );
  };

  const renderData = () => {
    if (!isOpen) {
      return null;
    }
    return (
      <View>
        {data.map((item, index) => {
          const itemStyle = index === selectedItem?.index ? styles.itemSelected : styles.item;
          return (
            <Pressable
              key={index.toString()}
              style={{
                ...itemStyle,
                alignContent: 'stretch',
                alignSelf: 'stretch',
                flexDirection: 'row',
              }}
              onPress={() => {
                setSelectedItem(item);
                if (onItemSelected) {
                  onItemSelected(item as any);
                }
                setIsOpen(false);
              }}
            >
              <Text style={{ textAlign, flex: 1 }}>{item.displayLabel}</Text>
              {renderSecondaryLabel(item)}
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ ...containerStyle, width, backgroundColor: Colors.Neutrals.WHITE }}>
      {renderTitle()}
      {renderHeader()}
      {renderData()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.Neutrals.LIGHT_GRAY,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: Colors.Neutrals.LIGHT_GRAY,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    padding: 10,
  },
  itemSelected: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.Neutrals.LIGHT_GRAY,
    padding: 10,
  },
  secondaryLabel: {
    flex: 1,
    flexDirection: 'row',
  },
});
