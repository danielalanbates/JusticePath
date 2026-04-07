import { useTranslation } from 'react-i18next'

function CaseTracker() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="section-title">{t('caseTracker.title')}</h1>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('caseTracker.status')}</h3>
            <span className="badge badge-blue">Active</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {t('caseTracker.noCases')}
          </p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            {t('caseTracker.addFirstCase')}
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('caseTracker.nextCourtDate')}</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            No upcoming dates
          </p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            {t('caseTracker.addReminder')}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('caseTracker.documents')}</h3>
          <button className="btn btn-primary btn-sm">{t('caseTracker.addDocument')}</button>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <p className="empty-state-text">No documents uploaded yet</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('caseTracker.timeline')}</h3>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p className="empty-state-text">Case timeline will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default CaseTracker
