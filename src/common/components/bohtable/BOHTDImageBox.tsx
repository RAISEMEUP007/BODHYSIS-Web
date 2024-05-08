import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, ViewProps, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface BOHTDImageBoxProps extends ViewProps {
  width?: number;
  imgURL?: string;
}

const BOHTDImageBox: React.FC<BOHTDImageBoxProps> = ({ width, imgURL, style, ...rest }) => {
  const [url, setURL] = useState(imgURL);
  return (
    <View
      {...rest}
      style={[styles.defaultTheme, width && {width:width}, style]}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          style={styles.cellImage}
          onError={() => {
            setURL(null);
          }}
        />
      ) : (
        <FontAwesome5 name="image" size={30} color="#666"></FontAwesome5>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    alignItems:'center',
    justifyContent:'center',
  },
  cellImage: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
  },
});

export default BOHTDImageBox;