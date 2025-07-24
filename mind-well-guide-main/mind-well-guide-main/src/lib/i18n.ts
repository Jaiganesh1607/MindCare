import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      // App title and branding
      appName: 'MindCare',
      tagline: 'A calm, safe space that listens',
      team: 'Developed by Team CODEWICK',
      
      // Navigation and main sections
      home: 'Home',
      moodTracker: 'Mood Tracker',
      voiceInput: 'Voice Input',
      journal: 'Journal',
      mindfulness: 'Mindfulness',
      chatbot: 'Support Chat',
      settings: 'Settings',
      
      // Mood Tracker
      howAreYouFeeling: 'How are you feeling?',
      selectEmotion: 'Select your current emotion and intensity',
      chooseEmotion: 'Choose your emotion',
      intensityLevel: 'Intensity Level',
      submitMoodCheckin: 'Submit Mood Check-in',
      
      // Emotions
      happy: 'Happy',
      calm: 'Calm',
      neutral: 'Neutral',
      worried: 'Worried',
      sad: 'Sad',
      frustrated: 'Frustrated',
      tired: 'Tired',
      grateful: 'Grateful',
      
      // Intensity levels
      mild: 'Mild',
      moderate: 'Moderate',
      intense: 'Intense',
      severe: 'Severe',
      low: 'Low',
      high: 'High',
      
      // Voice Input
      shareYourThoughts: 'Share Your Thoughts',
      typeOrSpeak: 'Type or speak about how you\'re feeling',
      listeningPrompt: 'Tell me about your day, your feelings, or what\'s on your mind...',
      listening: 'Listening...',
      speakNaturally: 'Speak naturally, I\'m here to listen',
      processing: 'Processing...',
      characters: 'characters',
      
      // Mindfulness
      breathingExercise: 'Breathing Exercise',
      guidedMeditation: 'Guided Meditation',
      startBreathing: 'Start Breathing',
      inhale: 'Inhale',
      hold: 'Hold',
      exhale: 'Exhale',
      
      // Journal
      emotionalJournal: 'Emotional Journal',
      writeEntry: 'Write about your feelings...',
      saveEntry: 'Save Entry',
      yourEntries: 'Your Entries',
      
      // Chatbot
      chatSupport: 'Support Chat',
      chatPlaceholder: 'Type your message here...',
      sendMessage: 'Send Message',
      
      // Settings
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      notifications: 'Notifications',
      privacy: 'Privacy',
      clearData: 'Clear All Data',
      
      // Common actions
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      close: 'Close',
      
      // Messages
      welcomeMessage: 'Welcome to your mindful space',
      dataCleared: 'All data has been cleared',
      entrySaved: 'Journal entry saved',
      
      // Privacy and disclaimers
      privacyNotice: 'Your privacy is our priority. All data stays on your device.',
      notTherapy: 'This app provides support but is not a replacement for professional therapy.',
      seekHelp: 'If you\'re in crisis, please contact emergency services or a mental health professional.',
    }
  },
  hi: {
    translation: {
      // App title and branding
      appName: 'मानसिक देखभाल',
      tagline: 'एक शांत, सुरक्षित स्थान जो सुनता है',
      team: 'टीम कोडविक द्वारा विकसित',
      
      // Navigation and main sections
      home: 'होम',
      moodTracker: 'मूड ट्रैकर',
      voiceInput: 'वॉयस इनपुट',
      journal: 'डायरी',
      mindfulness: 'मानसिक शांति',
      chatbot: 'सहायता चैट',
      settings: 'सेटिंग्स',
      
      // Mood Tracker
      howAreYouFeeling: 'आप कैसा महसूस कर रहे हैं?',
      selectEmotion: 'अपनी वर्तमान भावना और तीव्रता चुनें',
      chooseEmotion: 'अपनी भावना चुनें',
      intensityLevel: 'तीव्रता का स्तर',
      submitMoodCheckin: 'मूड चेक-इन जमा करें',
      
      // Emotions
      happy: 'खुश',
      calm: 'शांत',
      neutral: 'तटस्थ',
      worried: 'चिंतित',
      sad: 'उदास',
      frustrated: 'निराश',
      tired: 'थका हुआ',
      grateful: 'आभारी',
      
      // Intensity levels
      mild: 'हल्का',
      moderate: 'मध्यम',
      intense: 'तीव्र',
      severe: 'गंभीर',
      low: 'कम',
      high: 'अधिक',
      
      // Voice Input
      shareYourThoughts: 'अपने विचार साझा करें',
      typeOrSpeak: 'अपनी भावनाओं के बारे में टाइप करें या बोलें',
      listeningPrompt: 'मुझे अपने दिन, अपनी भावनाओं या अपने मन की बात के बारे में बताएं...',
      listening: 'सुन रहा हूं...',
      speakNaturally: 'स्वाभाविक रूप से बोलें, मैं सुनने के लिए यहां हूं',
      processing: 'प्रोसेसिंग...',
      characters: 'अक्षर',
      
      // Mindfulness
      breathingExercise: 'श्वास व्यायाम',
      guidedMeditation: 'निर्देशित ध्यान',
      startBreathing: 'श्वास शुरू करें',
      inhale: 'सांस लें',
      hold: 'रोकें',
      exhale: 'छोड़ें',
      
      // Journal
      emotionalJournal: 'भावनात्मक डायरी',
      writeEntry: 'अपनी भावनाओं के बारे में लिखें...',
      saveEntry: 'प्रविष्टि सहेजें',
      yourEntries: 'आपकी प्रविष्टियां',
      
      // Chatbot
      chatSupport: 'सहायता चैट',
      chatPlaceholder: 'यहां अपना संदेश टाइप करें...',
      sendMessage: 'संदेश भेजें',
      
      // Settings
      language: 'भाषा',
      theme: 'थीम',
      light: 'हल्का',
      dark: 'गहरा',
      notifications: 'सूचनाएं',
      privacy: 'गोपनीयता',
      clearData: 'सभी डेटा साफ़ करें',
      
      // Common actions
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      back: 'वापस',
      next: 'अगला',
      close: 'बंद करें',
      
      // Messages
      welcomeMessage: 'अपने दिमागी स्थान में आपका स्वागत है',
      dataCleared: 'सभी डेटा साफ़ कर दिया गया है',
      entrySaved: 'डायरी प्रविष्टि सहेजी गई',
      
      // Privacy and disclaimers
      privacyNotice: 'आपकी गोपनीयता हमारी प्राथमिकता है। सभी डेटा आपके डिवाइस पर रहता है।',
      notTherapy: 'यह ऐप सहायता प्रदान करता है लेकिन पेशेवर चिकित्सा का विकल्प नहीं है।',
      seekHelp: 'यदि आप संकट में हैं, तो कृपया आपातकालीन सेवाओं या मानसिक स्वास्थ्य पेशेवर से संपर्क करें।',
    }
  },
  es: {
    translation: {
      // App title and branding
      appName: 'CuidadoMental',
      tagline: 'Un espacio tranquilo y seguro que escucha',
      team: 'Desarrollado por el Equipo CODEWICK',
      
      // Navigation and main sections
      home: 'Inicio',
      moodTracker: 'Monitor de Estado de Ánimo',
      voiceInput: 'Entrada de Voz',
      journal: 'Diario',
      mindfulness: 'Atención Plena',
      chatbot: 'Chat de Apoyo',
      settings: 'Configuración',
      
      // Mood Tracker
      howAreYouFeeling: '¿Cómo te sientes?',
      selectEmotion: 'Selecciona tu emoción actual e intensidad',
      chooseEmotion: 'Elige tu emoción',
      intensityLevel: 'Nivel de Intensidad',
      submitMoodCheckin: 'Enviar Check-in de Estado de Ánimo',
      
      // Emotions
      happy: 'Feliz',
      calm: 'Tranquilo',
      neutral: 'Neutral',
      worried: 'Preocupado',
      sad: 'Triste',
      frustrated: 'Frustrado',
      tired: 'Cansado',
      grateful: 'Agradecido',
      
      // Intensity levels
      mild: 'Leve',
      moderate: 'Moderado',
      intense: 'Intenso',
      severe: 'Severo',
      low: 'Bajo',
      high: 'Alto',
      
      // Voice Input
      shareYourThoughts: 'Comparte tus pensamientos',
      typeOrSpeak: 'Escribe o habla sobre cómo te sientes',
      listeningPrompt: 'Cuéntame sobre tu día, tus sentimientos o lo que está en tu mente...',
      listening: 'Escuchando...',
      speakNaturally: 'Habla naturalmente, estoy aquí para escuchar',
      processing: 'Procesando...',
      characters: 'caracteres',
      
      // Mindfulness
      breathingExercise: 'Ejercicio de Respiración',
      guidedMeditation: 'Meditación Guiada',
      startBreathing: 'Comenzar Respiración',
      inhale: 'Inhalar',
      hold: 'Mantener',
      exhale: 'Exhalar',
      
      // Journal
      emotionalJournal: 'Diario Emocional',
      writeEntry: 'Escribe sobre tus sentimientos...',
      saveEntry: 'Guardar Entrada',
      yourEntries: 'Tus Entradas',
      
      // Chatbot
      chatSupport: 'Chat de Apoyo',
      chatPlaceholder: 'Escribe tu mensaje aquí...',
      sendMessage: 'Enviar Mensaje',
      
      // Settings
      language: 'Idioma',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      notifications: 'Notificaciones',
      privacy: 'Privacidad',
      clearData: 'Borrar Todos los Datos',
      
      // Common actions
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      close: 'Cerrar',
      
      // Messages
      welcomeMessage: 'Bienvenido a tu espacio mental',
      dataCleared: 'Todos los datos han sido eliminados',
      entrySaved: 'Entrada del diario guardada',
      
      // Privacy and disclaimers
      privacyNotice: 'Tu privacidad es nuestra prioridad. Todos los datos permanecen en tu dispositivo.',
      notTherapy: 'Esta app proporciona apoyo pero no es un reemplazo para terapia profesional.',
      seekHelp: 'Si estás en crisis, contacta servicios de emergencia o un profesional de salud mental.',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;