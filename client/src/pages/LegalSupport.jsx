import { useTranslation } from 'react-i18next'

function LegalSupport() {
  const { t } = useTranslation()

  const categories = [
    { icon: '📝', key: 'appeals' },
    { icon: '🗑️', key: 'expungement' },
    { icon: '⚖️', key: 'sentencing' },
    { icon: '📋', key: 'probation' },
    { icon: '🔓', key: 'parole' },
    { icon: '🛡️', key: 'civilRights' },
  ]

  return (
    <div>
      <h1 className="section-title">{t('legalSupport.title')}</h1>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>{t('legalSupport.askQuestion')}</h3>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder={t('legalSupport.searchPlaceholder')}
          />
        </div>
        <button className="btn btn-primary">{t('common.search')}</button>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>{t('legalSupport.categories')}</h3>
        <div className="grid grid-3">
          {categories.map((cat) => (
            <div key={cat.key} className="feature-card">
              <div className="feature-icon">{cat.icon}</div>
              <div className="feature-title">{t(`legalSupport.categories.${cat.key}`)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">{t('legalSupport.findLawyer')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
            Find public defenders, pro bono attorneys, and legal aid organizations near you.
          </p>
          <button className="btn btn-outline btn-sm">{t('legalSupport.findLawyer')}</button>
        </div>

        <div className="card">
          <h3 className="card-title">{t('legalSupport.templates')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
            Access document templates for motions, appeals, and expungement petitions.
          </p>
          <button className="btn btn-outline btn-sm">{t('legalSupport.templates')}</button>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">{t('legalSupport.knowYourRights')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Learn about your rights at every stage of the justice system.
        </p>
        <button className="btn btn-secondary btn-sm">{t('legalSupport.knowYourRights')}</button>
      </div>
    </div>
  )
}

export default LegalSupport
