import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { useAlertModal } from '../../../common/hooks';
import {
  createTemplate,
  editTemplate,
  getTemplatesDataByType,
} from '../../../api/SettingsTemplates';
import { msgStr } from '../../../common/constants/Message';

const typeTab = 'delivery';
const tags=['[customer-name]','[pictures]','[lock-combo]','[location]','[delivery-number]','[color]','[rack]','[geo-lat]','[geo-long]']
export function DeliveryTab() {
  const [template, setTemplate] = useState({ id: null, message: '', type: typeTab });

  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useAlertModal();

  const getTemplate = () => {
    setIsLoading(true);
    getTemplatesDataByType(typeTab, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          jsonRes?.template && setTemplate(jsonRes?.template);
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
        jsonRes?.template && setTemplate(jsonRes.template);
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
      
      </View>
      <View style={styles.availableTags}>
        <Text style={styles.availableTagsTitle}>AVAILABLE TAGS</Text>
        <View style={styles.separator} />
        <View style={styles.tagsContent}>
        {tags.map(tag=>(
          <Text 
          key={tag}
          style={styles.availableTagsTags}>{tag}</Text>

        ))}
        </View>
      </View>
      {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
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
    backgroundColor: 'white',
    padding: 24,
  },
  input: {
    height: 400,
    backgroundColor: '#f2f2f2',
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
  availableTags: {
    padding: 24,
    marginTop: 16,
    backgroundColor: 'white',
  },
  availableTagsTitle: {
    color: '#56A036',
    fontSize: 24,
    fontWeight: '500',
  },
  separator: {
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 24,
    borderColor: '#E0E0E0',
  },
  availableTagsTags: { color: '#56A036', fontWeight: '700', },
  tagsContent: { flexDirection: 'row', gap:2 },
});
