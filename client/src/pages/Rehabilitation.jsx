import { useTranslation } from 'react-i18next'

function Rehabilitation() {
  const { t } = useTranslation()

  const pathways = [
    { icon: '🎓', title: t('rehabilitation.education'), desc: 'GED, vocational training, college courses' },
    { icon: '🧠', title: t('rehabilitation.mentalHealth'), desc: 'Counseling, therapy, crisis support' },
    { icon: '💊', title: t('rehabilitation.substanceAbuse'), desc: 'Treatment programs, support groups' },
    { icon: '🤲', title: t('rehabilitation.communityService'), desc: 'Track and log service hours' },
  ]

  return (
    <div>
      <h1 className="section-title">{t('rehabilitation.title')}</h1>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('rehabilitation.progress')}</h3>
          <span className="badge badge-green">0%</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--secondary)', borderRadius: '999px', height: '100%', width: '0%' }}></div>
        </div>
        <button className="btn btn-primary btn-sm">{t('rehabilitation.startPlan')}</button>
      </div>

      <div className="grid grid-2">
        {pathways.map((item, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{item.icon}</div>
            <div className="feature-title">{item.title}</div>
            <div className="feature-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('rehabilitation.planBuilder')}</h3>
          <button className="btn btn-primary btn-sm">{t('rehabilitation.addCourse')}</button>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">Your rehabilitation plan will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default Rehabilitation
