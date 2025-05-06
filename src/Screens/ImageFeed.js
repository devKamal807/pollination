import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { Theme } from '../themes/Theme';
import { useNavigation } from '@react-navigation/native';
  
  export default function ImageFeed() {
    const navigation = useNavigation();

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const prompts = [
      'a futuristic city at sunset',
      'a serene forest with glowing trees',
      'a robot painting a portrait',
      'a space whale swimming through stars',
      'a magical castle in the sky',
      'a travel to saw sunraise',
      'journey of colombus',
      'pirate of the carabian',
    ];
  
    const fetchImages = () => {
      const imageUrls = prompts.map(prompt => ({
        prompt,
        image: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
      }));
      setImages(imageUrls);
      setLoading(false);
    };
  
    useEffect(() => {
      fetchImages();
    }, []);
  
    const renderItem = ({ item }) => (
      <View style={styles.imageItem}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <Text style={styles.caption}>{item.prompt}</Text>
      </View>
    );
  
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.headercontainer}>
            <Text style={styles.headtxt}>Image Feed</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
            />
          )}

           <View style={styles.btncontainer}>
                            <TouchableOpacity
                              style={styles.btn}
                              onPress={() => {
                                navigation.navigate('chat');
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
      marginTop: Theme?.dimensions?.useheight * 0.07 || 50,
      alignItems: 'center',
    },
    headtxt: {
      fontSize: Theme?.fontSize?.header || 24,
      fontWeight: '600',
    },
    list: {
      paddingVertical: 20,
    },
    imageItem: {
      marginBottom: 20,
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
    },
    caption: {
      marginTop: 8,
      fontSize: 14,
      fontStyle: 'italic',
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
  