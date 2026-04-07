import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function Home() {
  const { t } = useTranslation()

  const quickActions = [
    { icon: '📋', title: t('home.checkCaseStatus'), link: '/cases' },
    { icon: '⚖️', title: t('home.findLegalHelp'), link: '/legal' },
    { icon: '📚', title: t('home.startRehabPlan'), link: '/rehabilitation' },
    { icon: '🆕', title: t('home.reportEvidence'), link: '/innocence' },
    { icon: '🏠', title: t('home.findHousing'), link: '/reentry' },
    { icon: '🤝', title: t('home.joinCommunity'), link: '/community' },
  ]

  return (
    <div>
      <div className="hero">
        <h1>{t('app.welcome')}</h1>
        <p>{t('app.welcomeDesc')}</p>
        <Link to="/cases" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          {t('home.getStarted')}
        </Link>
      </div>

      <h2 className="section-title">{t('home.quickActions')}</h2>
      <div className="grid grid-3">
        {quickActions.map((action, i) => (
          <Link key={i} to={action.link} className="feature-card">
            <div className="feature-icon">{action.icon}</div>
            <div className="feature-title">{action.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
