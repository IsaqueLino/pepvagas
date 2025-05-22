import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.edu.ifsp.pep.pepvagas',
  appName: 'PEPVagas',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    allowNavigation: ['vagas.pep2.ifsp.edu.br:8080/api/'], //  localhost:8080
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge','alert', 'sound'],
    }
  }
};

export default config;
