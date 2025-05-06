import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Theme } from '../themes/Theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TypingBubble = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.dotbubble]}>
      <Text>{dots}</Text>
    </View>
  );
};

const CHAT_STORAGE_KEY = 'chatMessages';

export default function ChatScreen() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  // Save messages to AsyncStorage
  const saveMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  };

  const deleteMessages = async () =>{
    try{
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY)
      setMessages('')
    }
    catch(err){
      console.error('Error',err);
    }
  }

  // Load messages from AsyncStorage
  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const GenerateText = async () => {
    if (!prompt.trim()) return;

    const userMessage = { type: 'user', text: prompt.trim() };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
      const fullText = res.data;

      // Add empty bot message
      const botMessage = { type: 'bot', text: '' };
      setMessages(prev => [...prev, botMessage]);

      let currentText = '';
      let index = 0;

      const interval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText[index];
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...botMessage, text: currentText };
            return updated;
          });
          index++;
        } else {
          clearInterval(interval);
          setLoading(false);
        }
      }, 20);
    } catch (err) {
      console.error('Error', err);
      setMessages(prev => [...prev, { type: 'bot', text: 'Error while generating text, try again later.' }]);
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={40}
      >
        <View style={styles.headercontainer}>
          <Text style={styles.headtxt}>Chat</Text>
          
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.chatContainer}
        />

        {loading && <TypingBubble />}

        <View style={styles.inputArea}>
          <TextInput
            placeholder="Type your Prompt"
            placeholderTextColor="grey"
            multiline
            value={prompt}
            onChangeText={setPrompt}
            style={styles.textInput}
          />
          <TouchableOpacity
            style={[styles.sendButton, !prompt.trim() && { backgroundColor: 'gray' }]}
            onPress={GenerateText}
            disabled={!prompt.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deleteMessages} style={styles.delete}>
            <Text style={styles.deleteTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    padding: 10
  },
  headercontainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  headtxt: {
    fontSize: Theme.fontSize.header,
    fontWeight: '600'
  },
  chatContainer: {
    paddingBottom: 60
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end'
  },
  botBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: Theme.fontSize.paragraph
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 5,
    alignSelf: 'center'
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10
  },
  sendButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20
  },
  sendText: {
    color: 'white',
    fontWeight: '600'
  },
  dotbubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 50,
  },
  delete:{
    backgroundColor: 'violet',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  deleteTxt:{
    color:'#ffff',
  }
});
