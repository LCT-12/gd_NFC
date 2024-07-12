import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const CardDetailsScreen = ({ route, navigation }) => {
  const { cardId } = route.params;
  const [nfcSupported, setNfcSupported] = useState(true);

  //Mẫu thông tin thẻ, trong thực tế thông tin này sẽ được lấy từ cơ sở dữ liệu
  const cardDetails = {
    cardNumber: 'Số thẻ',
    cardHolder: 'Tên người dùng',
    openDate: 'Ngày tháng năm sinh',
  };

  useEffect(() => {
    NfcManager.start()
      .then(() => {
        console.log('NFC Manager started');
      })
      .catch((err) => {
        console.warn('NFC is not supported', err);
        setNfcSupported(false);
      });
    return () => {
      NfcManager.setEventListener(NfcTech.Ndef, null);
    };
  }, []);

  const handleNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const message = [
        {
          type: 'text',
          value: JSON.stringify(cardDetails),
        },
      ];
      await NfcManager.writeNdefMessage(message);
      await NfcManager.setAlertMessageIOS('Thẻ đã được truyền qua NFC!');
      Alert.alert('Thành công', 'Thông tin thẻ đã được truyền thành công.');
    } catch (ex) {
      console.warn(ex);
      Alert.alert('Lỗi', 'Không thể truyền thông tin thẻ.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  if (!nfcSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chi tiết thẻ</Text>
        <Text>NFC không được hỗ trợ trên thiết bị này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết thẻ</Text>
      <Text>Số thẻ: {cardDetails.cardNumber}</Text>
      <Text>Tên chủ thẻ: {cardDetails.cardHolder}</Text>
      <Text>Ngày mở thẻ: {cardDetails.openDate}</Text>
      <Button title="Quét thẻ" onPress={handleNfc} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default CardDetailsScreen;
