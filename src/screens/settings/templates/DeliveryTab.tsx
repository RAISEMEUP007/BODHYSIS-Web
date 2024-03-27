import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import {
  createTemplate,
  editTemplate,
  getTemplatesDataByType,
} from '../../../api/SettingsTemplates';
import { msgStr } from '../../../common/constants/Message';

const typeTab = 'delivery';
export function DeliveryTab() {
  const [template, setTemplate] = useState({ id: null, message: '', type: typeTab });

  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useAlertModal();

  const getTemplate = () => {
    setIsLoading(true);
    getTemplatesDataByType(typeTab,(jsonRes, status, error) => {
      switch (status) {
        case 200:
          jsonRes?.template&&setTemplate(jsonRes?.template);
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
    setIsLoading(false);
  };

  function handleChangeText(value) {
    setTemplate((prevState) => ({ ...prevState, message: value }));
  }

  const handleResponse = (jsonRes, status) => {
    switch (status) {
      case 200:
        jsonRes?.template&&setTemplate(jsonRes.template)     
        break;
      case 409:
        break;
      default:
        if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
        else showAlert('error', msgStr('unknownError'));
        break;
    }
    setIsLoading(false);
  };

  function handleOnPressSave() {
    console.log(template)
    setIsLoading(true);
    if (template.id) {     
      editTemplate(template, handleResponse);
    } else {
      createTemplate(template, handleResponse);
    }
  }
  useEffect(() => {
    getTemplate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          multiline
          onChangeText={handleChangeText}
          style={styles.input}
          placeholder="Write the template message here."
          placeholderTextColor={'#807e7e'}
          value={template.message}
        />

        <View style={styles.footer}>
          <CommonButton label="Save" onPress={handleOnPressSave} type="square" />
        </View>
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  input: {
    height: '80%',
    borderWidth: 1,
    padding: 8,
  },
  footer: {
    marginTop: 16,
  },
  overlay: {    
    backgroundColor: 'rgba(183, 173, 173, 0.137)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});
