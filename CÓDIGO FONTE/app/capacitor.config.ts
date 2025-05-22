import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pep.vagas.id',
  appName: 'PEPVagas',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    PushNotifications:{
      presentationOptions: ["badge", "sound", "alert"],
    }
  }
};

export default config;
