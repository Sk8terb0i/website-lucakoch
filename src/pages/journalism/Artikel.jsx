import JournalismList from "../../components/JournalismList";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

export default function Artikel() {
  const { lang } = useLanguage();
  return (
    <JournalismList category="artikel" title={translations[lang].articles} />
  );
}
