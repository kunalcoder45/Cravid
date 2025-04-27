import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
  ScrollView,
  useColorScheme,
  Share as RNShare,
  Clipboard
} from 'react-native';
import { handleDownload } from './utils/downloadHandler';
import DownloadIcon from './assets/icons/DownloadIcon';
import ShareIcon from './assets/icons/ShareIcon';

const App = () => {
  const theme = useColorScheme();
  const backgroundColor = theme === 'dark' ? '#121212' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const cardBgColor = theme === 'dark' ? '#2A2A2A' : '#F5F5F5';

  const images = [
    'https://i.pinimg.com/736x/5d/4c/cf/5d4ccf1e420b6111429f7526ea2369ec.jpg',
    'https://i.pinimg.com/736x/8e/90/1f/8e901f7e4827cac9073ae2c3131d90fa.jpg',
    'https://i.pinimg.com/736x/64/47/31/64473134b741ccb9562ec5b3c350f3d1.jpg',
    'https://i.pinimg.com/736x/8a/f7/71/8af771e0579cda3c5993ec36ca810b31.jpg',
    'https://i.pinimg.com/736x/a1/35/f3/a135f31e0b2ad63e91581395f71b0a1d.jpg',
    'https://i.pinimg.com/736x/3c/84/46/3c8446184b3cb0bf99f1909803c2a1ff.jpg',
    'https://i.pinimg.com/736x/eb/ba/ba/ebbaba49e0acdf2ef594c5c8b5721a5c.jpg',
    'https://i.pinimg.com/736x/f6/b5/6f/f6b56f1d4f3e91c7101f39df22013f57.jpg',
    'https://i.pinimg.com/736x/b2/8e/cf/b28ecfa82b814c73c8f481767725a9cf.jpg',
    'https://i.pinimg.com/736x/4d/50/97/4d5097ba6c1b48c06a937ab3180093d3.jpg',
    'https://i.pinimg.com/736x/70/af/cf/70afcfe9c5a443f7b3f3a2d6b27cb541.jpg',
    'https://i.pinimg.com/736x/1d/b9/2a/1db92aa7e454b61e3c02230bc1741e92.jpg',
    'https://i.pinimg.com/736x/1d/62/c1/1d62c15f03af9677797f87a4917acda9.jpg',
    'https://i.pinimg.com/736x/8d/ed/0c/8ded0cde6ab18a612b3c39cfb8bd7f85.jpg',
    'https://i.pinimg.com/736x/d2/8e/ff/d28effacdd60d7e13669bb5b6372afba.jpg',
    'https://i.pinimg.com/736x/4b/1f/3c/4b1f3c36ec63f09161a352a7de82fff3.jpg',
    'https://i.pinimg.com/736x/20/e3/98/20e3987ed7a13b54dda22e409f542a34.jpg',
    'https://i.pinimg.com/736x/06/e5/ce/06e5ce981e127df6f4bb6ae8e970cb7a.jpg',
    'https://i.pinimg.com/736x/68/81/77/688177ab14defa25e9f53e776030a8bf.jpg',
    'https://i.pinimg.com/736x/b3/1b/d3/b31bd3b7bc1493ec9489dc5d3c866ed3.jpg',
    'https://i.pinimg.com/736x/12/7c/5c/127c5c776fac6cec6557e790c9b80c5c.jpg',
    'https://i.pinimg.com/736x/66/82/e7/6682e7d67fec07dce86c25fc6f862e64.jpg',
    'https://i.pinimg.com/736x/18/9b/93/189b93966a56c66cf5a24af3d90bd888.jpg',
    
  ];


  // Handle share functionality with image path copying
  const handleShare = async (uri) => {
    try {
      // Copy the URI to clipboard
      Clipboard.setString(uri);
      // Show share dialog with the image and its path
      await RNShare.share({
        message: `Check out this awesome image!\nImage path: ${uri}`,
        url: uri,
        title: 'Share Image',
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: textColor }]}>Cravid Collection</Text>
        {/* Images grid */}
        {images.map((imageUri, index) => (
          <View key={index} style={[styles.imageCard, { backgroundColor: cardBgColor }]}>
            <Image
              style={styles.image}
              source={{ uri: imageUri }}
              resizeMode="cover"
            />

            <View style={styles.buttonContainer}>
              <Pressable style={styles.downloadButton} onPress={() => handleDownload(imageUri)}>
                <DownloadIcon width={24} height={24} />
              </Pressable>

              <Pressable style={styles.shareButton} onPress={() => handleShare(imageUri)}>
                <ShareIcon width={24} height={24} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingBottom: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  imageCard: {
    width: '98%',
    marginHorizontal: '1%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  downloadButton: {
    backgroundColor: '#1DCD9F',
    padding: 10,
    borderRadius: 50,
    paddingVertical: 10,
  },
  shareButton: {
    backgroundColor: '#4E9AF1',
    padding: 10,
    borderRadius: 50,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default App;
