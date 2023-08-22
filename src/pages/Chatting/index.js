import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ChatItem, Header, InputChat} from '../../components';
import {
  colors,
  fonts,
  getChatTime,
  getData,
  showError,
  setDateChat,
} from '../../utils';
import {onValue, push, ref, serverTimestamp, update} from 'firebase/database';
import {db} from '../../config';

const Chatting = ({navigation, route}) => {
  const {fullName, profession, photo, uid} = route.params;
  const [user, setUser] = useState({});
  const [chatContent, setChatContent] = useState('');
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    fetchDataAndInitialize();
  }, []);
  const fetchDataAndInitialize = async () => {
    try {
      const userData = await getData('user');
      setUser(userData);
      await fetchChatData();
    } catch (error) {
      showError(error.message);
    }
  };
  const fetchChatData = async () => {
    const userData = await getData('user');
    const chatID = `${userData.uid}_${uid}`;
    const chatPath = `chatting/${chatID}/allChat/`;
    try {
      const chatRef = ref(db, chatPath);
      onValue(chatRef, snapshot => {
        if (snapshot.val()) {
          const dataSnapshot = snapshot.val();
          const allChatData = [];

          Object.keys(dataSnapshot).map(dateKey => {
            const chatDataForDate = dataSnapshot[dateKey];
            const newDataChat = [];

            Object.keys(chatDataForDate).map(itemKey => {
              newDataChat.push({
                id: itemKey,
                data: chatDataForDate[itemKey],
              });
            });

            allChatData.push({
              id: dateKey,
              data: newDataChat,
            });
          });

          setChatData(allChatData);
        }
      });
    } catch (error) {
      showError(error);
    }
  };

  const sendChat = async () => {
    const today = new Date();
    const chatID = `${user.uid}_${uid}`;
    const chatPath = `chatting/${chatID}/allChat/${setDateChat(today)}`;
    const userChatHistoryPath = `messages/${user.uid}/${chatID}`;
    const doctorChatHistoryPath = `messages/${uid}/${chatID}`;
    setChatContent('');
    try {
      const chatData = {
        sendBy: user.uid,
        chatDate: serverTimestamp(),
        chatTime: getChatTime(today),
        chatContent: chatContent,
      };
      const userChatHistoryData = {
        lastContentChat: chatContent,
        lastChatDate: serverTimestamp(),
        uidPartner: uid,
      };
      const doctorChatHistoryData = {
        lastContentChat: chatContent,
        lastChatDate: serverTimestamp(),
        uidPartner: user.uid,
      };
      const chatRef = ref(db, chatPath);
      const historyChatRefUser = ref(db, userChatHistoryPath);
      const historyChatRefDoc = ref(db, doctorChatHistoryPath);

      await update(historyChatRefDoc, doctorChatHistoryData);
      await update(historyChatRefUser, userChatHistoryData);
      await push(chatRef, chatData);
    } catch (error) {
      showError(error);
    }
  };
  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={fullName}
        desc={profession}
        photo={photo}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {chatData.map(chat => (
            <View key={chat.id}>
              <Text style={styles.chatDate}>{chat.id}</Text>
              {chat.data.map(itemChat => {
                const isMe = itemChat.data.sendBy === user.uid;
                return (
                  <ChatItem
                    isMe={isMe}
                    text={itemChat.data.chatContent}
                    date={itemChat.data.chatTime}
                    key={itemChat.id}
                    photo={isMe ? null : {uri: photo}}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
      <InputChat
        value={chatContent}
        onChangeText={value => setChatContent(value)}
        onButtonPress={sendChat}
      />
    </View>
  );
};

export default Chatting;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: 20,
  },
});
