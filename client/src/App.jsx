import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from './pages/Home'
import CaseTracker from './pages/CaseTracker'
import LegalSupport from './pages/LegalSupport'
import Rehabilitation from './pages/Rehabilitation'
import Innocence from './pages/Innocence'
import Reentry from './pages/Reentry'
import Community from './pages/Community'
import Settings from './pages/Settings'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
]

function App() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    document.dir = lng === 'ar' ? 'rtl' : 'ltr'
  }

  const navItems = [
    { path: '/', icon: '🏠', label: t('nav.home') },
    { path: '/cases', icon: '📋', label: t('nav.caseTracker') },
    { path: '/legal', icon: '⚖️', label: t('nav.legalSupport') },
    { path: '/rehabilitation', icon: '📚', label: t('nav.rehabilitation') },
    { path: '/innocence', icon: '🆕', label: t('nav.innocence') },
    { path: '/reentry', icon: '🏠', label: t('nav.reentry') },
    { path: '/community', icon: '🤝', label: t('nav.community') },
    { path: '/settings', icon: '⚙️', label: t('nav.settings') },
  ]

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <NavLink to="/" className="logo">{t('app.name')}</NavLink>
            <div className="header-actions">
              <select
                className="lang-select"
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            </div>
          </div>
        </header>

        <div className="layout">
          <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
            <ul className="sidebar-nav">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cases" element={<CaseTracker />} />
              <Route path="/legal" element={<LegalSupport />} />
              <Route path="/rehabilitation" element={<Rehabilitation />} />
              <Route path="/innocence" element={<Innocence />} />
              <Route path="/reentry" element={<Reentry />} />
              <Route path="/community" element={<Community />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
