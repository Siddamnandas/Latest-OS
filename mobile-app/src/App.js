import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, View, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://localhost:3000';

export default function App() {
  const webRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Handle Android hardware back button to navigate web history
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  const onLoadEnd = useCallback(() => setLoading(false), []);

  // Inject a bridge into the web app to accept Expo token and register with backend using cookies
  const injectedBridge = `(() => {
    try {
      window.addEventListener('expoPushToken', async (e) => {
        const token = e.detail;
        try {
          await fetch('/api/push/expo/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token })
          });
        } catch (err) { console.log('Expo register failed', err); }
      });
    } catch (err) { console.log('Bridge init error', err); }
  })(); true;`;

  // Request native permissions and send token to web
  useEffect(() => {
    const registerForPush = async () => {
      try {
        if (!Device.isDevice) return;
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') return;
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        if (webRef.current && token) {
          const js = `window.dispatchEvent(new CustomEvent('expoPushToken', { detail: '${"${token}"}'.toString() })); true;`;
          webRef.current.injectJavaScript(js);
        }
      } catch (err) {
        // no-op
      }
    };
    registerForPush();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      )}
      <WebView
        ref={webRef}
        source={{ uri: WEB_APP_URL }}
        onLoadEnd={onLoadEnd}
        injectedJavaScriptBeforeContentLoaded={"window.__LATEST_OS_MOBILE__=true;"}
        allowsBackForwardNavigationGestures
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        mixedContentMode="always"
        pullToRefreshEnabled
        userAgent="LatestOS-Mobile/1.0"
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        injectedJavaScript={injectedBridge}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
