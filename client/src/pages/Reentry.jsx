import { useTranslation } from 'react-i18next'

function Reentry() {
  const { t } = useTranslation()

  const resources = [
    { icon: '🏠', title: t('reentry.housing'), desc: t('reentry.findHousing') },
    { icon: '💼', title: t('reentry.employment'), desc: t('reentry.jobSearch') },
    { icon: '🪪', title: t('reentry.idReplacement'), desc: 'Replace lost or expired identification' },
    { icon: '📋', title: t('reentry.benefits'), desc: t('reentry.applyBenefits') },
    { icon: '💰', title: t('reentry.financialLiteracy'), desc: 'Build credit, manage finances, open accounts' },
  ]

  return (
    <div>
      <h1 className="section-title">{t('reentry.title')}</h1>

      <div className="grid grid-3">
        {resources.map((resource, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{resource.icon}</div>
            <div className="feature-title">{resource.title}</div>
            <div className="feature-desc">{resource.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="card-title">{t('reentry.benefits')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Apply for SNAP, Medicaid, housing assistance, and other benefits you may be eligible for.
        </p>
        <button className="btn btn-secondary btn-sm">{t('reentry.applyBenefits')}</button>
      </div>
    </div>
  )
}

export default Reentry
