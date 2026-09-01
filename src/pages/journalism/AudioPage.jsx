import JournalismList from "../../components/JournalismList";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

export default function AudioPage() {
  const { lang } = useLanguage();
  return <JournalismList category="audio" title={translations[lang].audio} />;
}
