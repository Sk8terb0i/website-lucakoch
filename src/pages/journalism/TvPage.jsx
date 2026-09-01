import JournalismList from "../../components/JournalismList";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

export default function TvPage() {
  const { lang } = useLanguage();
  return <JournalismList category="tv" title={translations[lang].tv} />;
}
