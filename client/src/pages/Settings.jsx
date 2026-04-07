import { useTranslation } from 'react-i18next'

function Settings() {
  const { t, i18n } = useTranslation()

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
    { code: 'ar', label: 'العربية' },
  ]

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    document.dir = lng === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <div>
      <h1 className="section-title">{t('settings.title')}</h1>

      <div className="card">
        <h3 className="card-title">{t('settings.language')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {t('settings.languageDesc')}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`btn ${i18n.language === lang.code ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">{t('settings.privacy')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Your data is encrypted and stored securely. You own your data — we never sell it.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn btn-outline btn-sm">{t('settings.exportData')}</button>
          <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            {t('settings.deleteData')}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">{t('settings.notifications')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Get reminders for court dates, deadlines, and check-ins.
        </p>
      </div>

      <div className="card">
        <h3 className="card-title">{t('settings.account')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Manage your account settings and authentication.
        </p>
      </div>
    </div>
  )
}

export default Settings
