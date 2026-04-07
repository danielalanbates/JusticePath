import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../AuthContext'

function Settings() {
  const { t, i18n } = useTranslation()
  const { user, login, register, logout } = useAuth()
  const [mode, setMode] = useState(user ? 'profile' : 'login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [regData, setRegData] = useState({ phone: '', email: '', password: '', first_name: '', last_name: '' })
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(identifier, password)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(regData)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  const handleLogout = () => {
    logout()
    setMode('login')
  }

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

  if (!user) {
    return (
      <div>
        <h1 className="section-title">{t('settings.title')}</h1>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setMode('login'); setError('') }}>Sign In</button>
          <button className={`btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setMode('register'); setError('') }}>Create Account</button>
        </div>

        {error && (
          <div className="card" style={{ borderColor: 'var(--danger)', border: '1px solid var(--danger)', background: '#fef2f2' }}>
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Sign In</h3>
            <div className="form-group">
              <label className="form-label">Phone or Email</label>
              <input className="form-input" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Create Account</h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={regData.first_name} onChange={e => setRegData({...regData, first_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={regData.last_name} onChange={e => setRegData({...regData, last_name: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} required minLength={6} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Either email or phone is required. Your data is encrypted and never sold.
            </p>
            <button type="submit" className="btn btn-primary">Create Account</button>
          </form>
        )}

        <div className="card" style={{ marginTop: '1.5rem' }}>
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
      </div>
    )
  }

  return (
    <div>
      <h1 className="section-title">{t('settings.title')}</h1>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Account</h3>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Sign Out</button>
        </div>
        <div className="list-item" style={{ padding: '0.75rem 0' }}>
          <div>
            <strong>{user.first_name} {user.last_name}</strong>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {user.email && <span>{user.email}</span>}
              {user.phone && <span>{user.phone}</span>}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  )
}

export default Settings
