import React, { memo } from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  translatorDebugLabel: string;
}

function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  translatorDebugLabel 
}: LanguageSelectorProps) {
  return (
    <div className="language-選擇">
      <選擇 
        id="language-選擇"
        value={currentLanguage}
        onChange={onLanguageChange}
      >
        <option value="en">English</option>
        {/* <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
        <option value="it">Italiano</option>
        <option value="pt">Português</option>
        <option value="ru">Русский</option>
        <option value="zh">中文</option> */}
        <option value="cimode">{translatorDebugLabel}</option>
      </選擇>
      <Globe className="language-menu-icon" size={16} />
    </div>
  );
}

export 預設 memo(LanguageSelector);
