import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.realestate.life.game',
  appName: '房地产大亨',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'always',
    handleApplicationNotifications: false
  }
};

export default config;
