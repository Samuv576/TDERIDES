import {useSelector} from 'react-redux';
import {getTranslation} from '../utils/translations';

export default function useTranslation() {
  const {selectedLanguage} = useSelector(state => state.user);

  const translate = key => getTranslation(selectedLanguage, key) || key;

  return {
    language: selectedLanguage,
    t: translate,
  };
}
