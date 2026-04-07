import { useTranslation } from 'react-i18next'

function Innocence() {
  const { t } = useTranslation()

  const tools = [
    { icon: '🔍', title: t('innocence.evidenceLog'), action: t('innocence.addEvidence') },
    { icon: '👤', title: t('innocence.witnessStatements'), action: t('innocence.addWitness') },
    { icon: '🏛️', title: t('innocence.innocenceProjects'), action: t('innocence.contactProject') },
    { icon: '🧬', title: t('innocence.dnaTesting'), action: t('innocence.dnaTesting') },
    { icon: '📝', title: t('innocence.appealPathway'), action: t('innocence.appealPathway') },
  ]

  return (
    <div>
      <h1 className="section-title">{t('innocence.title')}</h1>

      <div className="grid grid-2">
        {tools.map((tool, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{tool.icon}</span>
              <h3 className="card-title" style={{ marginBottom: 0 }}>{tool.title}</h3>
            </div>
            <button className="btn btn-outline btn-sm">{tool.action}</button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('innocence.evidenceLog')}</h3>
          <button className="btn btn-primary btn-sm">{t('innocence.addEvidence')}</button>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <p className="empty-state-text">Evidence items will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default Innocence
