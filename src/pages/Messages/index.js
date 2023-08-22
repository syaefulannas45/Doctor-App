import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {List} from '../../components';
import {colors, fonts, getData, showError} from '../../utils';

import {child, get, onValue, ref} from 'firebase/database';
import {db} from '../../config';

const Messages = ({navigation}) => {
  const [historyChat, setHistoryChat] = useState([]);

  useEffect(() => {
    fetchDataAndMessages();
  }, []);

  const fetchDataAndMessages = async () => {
    try {
      const userData = await getData('user');
      await fetchChatHistory(userData.uid);
    } catch (error) {
      showError(error.message);
    }
  };

  const fetchChatHistory = async uid => {
    const urlHistory = `messages/${uid}`;
    try {
      const rootDB = ref(db);
      const childDB = child(rootDB, urlHistory);

      onValue(childDB, snapshot => {
        const data = [];

        const promises = Object.values(snapshot.val() || {}).map(
          async value => {
            const urlUidDoctor = `doctors/${value.uidPartner}`;
            const detailDoctorRef = child(rootDB, urlUidDoctor);

            const snapshot = await get(detailDoctorRef);
            if (snapshot.exists()) {
              const detailDoctorData = snapshot.val();
              data.push({
                id: Math.random(),
                ...value,
                doctorProfile: detailDoctorData,
              });
            }
          },
        );

        Promise.all(promises).then(() => {
          const sortedData = data.sort(
            (a, b) => b.lastChatDate - a.lastChatDate,
          );
          setHistoryChat(sortedData);
        });
      });
    } catch (error) {
      showError(error.message);
    }
  };
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        {historyChat.map(chat => {
          return (
            <List
              key={chat.id}
              profile={chat.doctorProfile.photo}
              name={chat.doctorProfile.fullName}
              desc={chat.lastContentChat}
              onPress={() =>
                navigation.navigate('Chatting', chat.doctorProfile)
              }
            />
          );
        })}
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginLeft: 16,
  },
});
