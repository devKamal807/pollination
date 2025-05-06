import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Theme} from '../themes/Theme';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

export default function TextGeneration() {
  const navigation = useNavigation();

  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState();
  const [loading, setLoading] = useState(false);

  const GenerateText = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedText('');

    try {
      const res = await axios.get(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
      );

      setGeneratedText(res.data);
    } catch (err) {
      console.error('Error', err);
      setGeneratedText('Error Generating text, Try agin.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <Text style={styles.headtxt}>Text Generator</Text>
        </View>
        <View style={styles.inputcontainer}>
          <TextInput
            placeholder="Enter Your Prompt"
            value={prompt}
            onChangeText={setPrompt}
            placeholderTextColor="black"
            multiline={true}
            textAlignVertical="top"
            style={styles.input}
          />
        </View>
        <View style={styles.generatecontainer}>
          <TouchableOpacity style={styles.generatebtn} onPress={GenerateText}>
            <Text style={styles.generatetxt}>Generate</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.rescontainer}>
            {loading && (
              <ActivityIndicator
                size="large"
                color="blue"
                style={{marginTop: 20}}
              />
            )}

            {generatedText ? (
              <Text style={styles.outputText}>{generatedText}</Text>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.btncontainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              navigation.navigate('audio');
            }}>
            <Text style={styles.btntxt}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
  },
  headercontainer: {
    marginTop: Theme.dimensions.useheight * 0.07,
    alignItems: 'center',
  },
  headtxt: {
    fontSize: Theme.fontSize.header,
    fontWeight: '600',
  },
  inputcontainer: {
    marginTop: Theme.dimensions.useheight * 0.03,

    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    width: '90%',
    height: 120,
    borderRadius: 5,
  },
  generatecontainer: {
    marginTop: Theme.dimensions.useheight * 0.03,
    alignItems: 'center',
  },
  generatebtn: {
    backgroundColor: 'blue',
    height: 40,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  generatetxt: {
    color: '#ffff',
    fontSize: Theme.fontSize.buttonTxt,
  },
  rescontainer: {
    marginTop: Theme.dimensions.useheight * 0.03,
  },
  outputText: {
    fontSize: Theme.fontSize.paragraph,
  },
  btncontainer: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  btn: {
    backgroundColor: 'violet',
    height: 40,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btntxt: {
    fontSize: Theme.fontSize.buttonTxt,
    color: '#ffff',
  },
});
