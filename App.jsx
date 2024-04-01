import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  useColorScheme,
  View
} from 'react-native';
import WebView from 'react-native-webview';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const webViewRef = useRef(null);
  const [cords, setCords] = useState({})
  const injectJavaScript = `
  (function() {
    var latitude = document.getElementById('latitude');
    var longitude = document.getElementById('longitude');
    if (latitude && longitude) {
      var longitudeText = longitude.textContent || longitude.innerText;
      var latitudeText = latitude.textContent || latitude.innerText;
      var cords = {
        latitude: latitudeText,
        longitude: longitudeText
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(cords));
    }
  })();
`;

  const handleWebViewTouchStart = () => {
    webViewRef.current.injectJavaScript(injectJavaScript);
  };

  const handleMessage = (event) => {
    const { data } = event.nativeEvent;
    const coordinates = JSON.parse(data);
    setCords((prev) => { return (coordinates) })
    console.log('Received coordinates:', coordinates);
  };

  return (
    <SafeAreaView >
      <View
        style={{
          backgroundColor: "red",
          height: "92%",
          width: "100%"
        }}
      >
        <WebView source={{ uri: 'https://gistest1.rajasthan.gov.in/samparkgis' }}
          style={{
            flex: 1
          }}
          ref={webViewRef}
          onMessage={handleMessage}
          onTouchEnd={handleWebViewTouchStart}
        />
      </View>
      <View
        style={{
          padding: 10
        }}
      >
        <Text>Lattitude : {cords?.latitude || "00"}</Text>
        <Text>Longitude : {cords?.longitude || "00"}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
