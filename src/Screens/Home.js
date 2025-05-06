import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { Theme } from '../themes/Theme';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation()

  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
      
      // Although this returns an image directly, we simulate an axios GET request
    //   const response = await axios.get(apiUrl, { responseType: 'blob' }); 

      // Construct image URI manually from the prompt
      setImageUrl(apiUrl); // Since the actual image is accessible via this URL

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <Text style={styles.headertxt}>Image Generation</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your image prompt..."
          placeholderTextColor='black'
          value={prompt}
          multiline={true}
          numberOfLines={10}
          textAlignVertical='top'
          onChangeText={setPrompt}
        />

        <Button title="Generate Image" onPress={generateImage} />

        {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}

        {imageUrl && !loading && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.btncontainer}>
          <TouchableOpacity style={styles.btn} onPress={()=>{navigation.navigate('text')}}>
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
    flex:1
  },
  headercontainer: {
    marginTop: Theme.dimensions.useheight * 0.07,
    alignItems: 'center',
    marginBottom: 20,
  },
  headertxt: {
    fontSize: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    height:120,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
  btncontainer:{
    position:'absolute',
    bottom:50,
    right:20,
  },
  btn:{
    backgroundColor:'violet',
    height:40,
    width:80,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
  },
  btntxt:{
    fontSize:Theme.fontSize.buttonTxt,
    color:'#ffff',
  }
 
});
