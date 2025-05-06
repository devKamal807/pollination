import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import { Theme } from '../themes/Theme';

export default function AudioGeneration() {
    const navigation = useNavigation();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioPath, setAudioPath] = useState(null);

  const generateAudio = async () => {
    if (!prompt) return Alert.alert('Please enter a prompt');

    setLoading(true);
    const voice = 'alloy';
    const url = `https://text.pollinations.ai/${encodeURIComponent(
      prompt,
    )}?model=openai-audio&voice=${voice}`;
    const path = `${RNFS.DocumentDirectoryPath}/generated_audio.mp3`;

    try {
      const result = await RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
      }).promise;

      if (result.statusCode === 200) {
        setAudioPath(path); // Save for later playback
        Alert.alert('Audio generated!', 'Press play to listen.');
      } else {
        Alert.alert('Download failed', `Status code: ${result.statusCode}`);
      }
    } catch (err) {
      console.error('Error Generating Voice', err);
      Alert.alert('Error Generating Voice', err.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (audioPath) {
      try {
        SoundPlayer.playUrl(`file://${audioPath}`);
      } catch (e) {
        Alert.alert('Playback error', e.message);
      }
    } else {
      Alert.alert('No audio', 'Generate audio first.');
    }
  };

  const pauseAudio = () => {
    try {
      SoundPlayer.pause();
    } catch (e) {
      Alert.alert('Pause error', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.headtxt}>Audio Generator</Text>

        <TextInput
          placeholder="Enter Your Prompt"
          value={prompt}
          onChangeText={setPrompt}
          placeholderTextColor="black"
          multiline
          textAlignVertical="top"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.generatebtn}
          onPress={generateAudio}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generatetxt}>Generate</Text>
          )}
        </TouchableOpacity>

        {audioPath && (
          <View style={styles.controls}>
            <TouchableOpacity onPress={playAudio} style={styles.controlBtn}>
              <Text style={styles.btnText}> Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pauseAudio} style={styles.controlBtn}>
              <Text style={styles.btnText}> Pause</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.btncontainer}>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                      navigation.navigate('imagefeed');
                    }}>
                    <Text style={styles.btntxt}>Next</Text>
                  </TouchableOpacity>
                </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headtxt: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
  },
  generatebtn: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  generatetxt: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlBtn: {
    padding: 12,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
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
