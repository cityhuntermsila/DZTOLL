import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "welcome": "Bienvenue sur ParkHome",
      "tagline": "Nous facilitons votre vie, en vous trouvant un parking",
      "login": "Connexion",
      "signup": "S'inscrire",
      "owner": "Propriétaire",
      "renter": "Locataire",
      "search_placeholder": "Où voulez-vous vous garer ?",
      "find_parking": "Nos Services",
      "list_parking": "Mettre en location ma place",
      "how_it_works": "Comment ça marche ?",
      "secure_payment": "Paiement sécurisé",
      "smart_calendar": "Calendrier intelligent",
      "qr_access": "Accès QR Code",
      "footer_text": "ParkHome - Votre solution de stationnement urbain.",
      "auth": {
        "email": "Email",
        "password": "Mot de passe",
        "google_signin": "Se connecter avec Google",
        "no_account": "Pas encore de compte ?",
        "have_account": "Déjà un compte ?"
      }
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بكم في بارك هوم",
      "tagline": "استأجر مكانك أو ابحث عن موقف سيارات بسهولة.",
      "login": "تسجيل الدخول",
      "signup": "إنشاء حساب",
      "owner": "مالك",
      "renter": "مستأجر",
      "search_placeholder": "أين تريد ركن سيارتك؟",
      "find_parking": "خدماتنا",
      "list_parking": "تأجير مكاني",
      "how_it_works": "كيف يعمل؟",
      "secure_payment": "دفع آمن",
      "smart_calendar": "تقويم ذكي",
      "qr_access": "الوصول عبر رمز QR",
      "footer_text": "بارك هوم - حلك لركن السيارات في المناطق الحضرية.",
      "auth": {
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "google_signin": "تسجيل الدخول باستخدام جوجل",
        "no_account": "ليس لديك حساب؟",
        "have_account": "لديك حساب بالفعل؟"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
