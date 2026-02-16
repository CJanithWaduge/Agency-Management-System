import { useState } from 'react';
import './EULAScreen.css';

const EULA_CONTENT = {
  en: {
    tabLabel: "English",
    title: "End User License Agreement",
    warning: "⚠️ IMPORTANT: This software uses Local Storage. You are responsible for your data.",
    body: `
1. GRANT OF LICENSE: This software is licensed, not sold. You are granted a non-exclusive license for personal or business use.

2. DATA RESPONSIBILITY (CRITICAL):
- This software stores data LOCALLY in your browser/device storage.
- The Developer DOES NOT keep a copy of your data on any server.
- You are solely responsible for backups (using the Export feature).
- The Developer is NOT LIABLE for data loss due to cache clearing, hardware failure, or viruses.

3. "AS-IS" DISCLAIMER: The Software is provided "AS IS" without warranty of any kind. The Developer is not obligated to provide updates or support.

4. LIMITATION OF LIABILITY: To the maximum extent permitted by law, the Developer shall not be liable for any indirect, special, or consequential damages (including loss of profits or data).

5. RESTRICTIONS: You may not resell, redistribute, or reverse engineer this software.

*In the event of any discrepancy between the English and Sinhala versions, the English version shall prevail.*
    `,
    checkbox: "I have read the terms and accept responsibility for my data.",
    btnAccept: "Accept & Launch",
    btnDecline: "Decline (Exit)"
  },
  si: {
    tabLabel: "සිංහල",
    title: "පරිශීලක බලපත්‍ර ගිවිසුම",
    warning: "⚠️ වැදගත්: මෙම මෘදුකාංගය දේශීය දත්ත ගබඩා (Local Storage) භාවිතා කරයි. දත්තවල වගකීම ඔබ සතුවේ.",
    body: `
1. බලපත්‍රය: මෙය විකිණීමක් නොව බලපත්‍රයක් ලබා දීමකි. මෙය ඔබගේ පුද්ගලික හෝ ව්‍යාපාරික කටයුතු සඳහා භාවිතා කළ හැක.

2. දත්ත වගකීම (ඉතා වැදගත්):
- මෙම මෘදුකාංගය දත්ත ගබඩා කරන්නේ ඔබගේ උපාංගයේ (Local Storage) පමණි.
- අප සතුව ඔබගේ දත්තවල පිටපතක් නොමැත.
- දත්ත උපස්ථ (Backup) කර තබා ගැනීම ඔබගේ වගකීමකි.
- පරිගණක දෝෂ හෝ වෛරස් නිසා සිදුවන දත්ත අහිමි වීම් සඳහා නිර්මාණකරු වගකියනු නොලැබේ.

3. වගකීම් ප්‍රතික්ෂේප කිරීම: මෘදුකාංගය "තිබෙන ආකාරයෙන්" (AS IS) ලබා දෙන අතර, අනාගත යාවත්කාලීන කිරීම් සඳහා බැඳී නොමැත.

4. වගකීම් සීමා කිරීම: නීතියෙන් අවසර දී ඇති උපරිම ප්‍රමාණයට යටත්ව, ව්‍යාපාරික ලාභ අහිමි වීම් හෝ වෙනත් අලාභ සඳහා නිර්මාණකරු වගකියනු නොලැබේ.

5. සීමා කිරීම්: මෙය නැවත විකිණීම හෝ කේත වෙනස් කිරීම තහනම් වේ.
    `,
    checkbox: "මම කොන්දේසි කියවා දත්තවල වගකීම භාර ගනිමි.",
    btnAccept: "එකඟ වී ඉදිරියට යන්න",
    btnDecline: "ප්‍රතික්ෂේප කරන්න (ඉවත් වන්න)"
  }
};

export default function EULAScreen({ onAccept }) {
  const [lang, setLang] = useState('en');
  const [isAgreed, setIsAgreed] = useState(false);

  const content = EULA_CONTENT[lang];

  const handleAccept = () => {
    localStorage.setItem('eula_accepted', 'true');
    if (onAccept) {
      onAccept();
    } else {
      window.location.reload();
    }
  };

  const handleDecline = () => {
    // TODO: Insert Electron IPC quit command here
    // Example: window.electron.ipcRenderer.send('quit-app')
    // Fallback for browser:
    window.close();
  };

  return (
    <div className="eula-overlay">
      <div className="eula-container">
        {/* Language Toggle */}
        <div className="eula-lang-toggle">
          {Object.entries(EULA_CONTENT).map(([key, data]) => (
            <button
              key={key}
              className={`eula-lang-btn ${lang === key ? 'active' : ''}`}
              onClick={() => setLang(key)}
            >
              {data.tabLabel}
            </button>
          ))}
        </div>

        {/* Title */}
        <h1 className="eula-title">{content.title}</h1>

        {/* Warning */}
        <div className="eula-warning">{content.warning}</div>

        {/* Scrollable Content Area */}
        <div className="eula-body-container">
          <div className="eula-body">{content.body}</div>
        </div>

        {/* Checkbox */}
        <label className="eula-checkbox-label">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="eula-checkbox"
          />
          <span>{content.checkbox}</span>
        </label>

        {/* Buttons */}
        <div className="eula-buttons">
          <button
            className="eula-btn eula-btn-accept"
            onClick={handleAccept}
            disabled={!isAgreed}
          >
            {content.btnAccept}
          </button>
          <button className="eula-btn eula-btn-decline" onClick={handleDecline}>
            {content.btnDecline}
          </button>
        </div>
      </div>
    </div>
  );
}
