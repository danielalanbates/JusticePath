import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api'

function LegalSupport() {
  const { t } = useTranslation()
  const [query_text, setQueryText] = useState('')
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/resources', { params: { category: 'legal_aid' } })
      .then(res => setLawyers(res.data.resources || []))
      .catch(() => {})
  }, [])

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
            value={query_text}
            onChange={e => setQueryText(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">{t('common.search')}</button>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Legal Categories</h3>
        <div className="grid grid-3">
          {categories.map((cat) => (
            <div key={cat.key} className="feature-card">
              <div className="feature-icon">{cat.icon}</div>
              <div className="feature-title">{t(`legalSupport.categories.${cat.key}`)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>{t('legalSupport.findLawyer')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Find public defenders, pro bono attorneys, and legal aid organizations near you.
        </p>
        {lawyers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading...</p>
        ) : (
          lawyers.map(l => (
            <div key={l.id} className="list-item">
              <div>
                <strong>{l.title}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{l.description.substring(0, 80)}...</div>
                {l.phone && <div style={{ fontSize: '0.8125rem' }}>📞 {l.phone}</div>}
              </div>
              {l.website && (
                <a href={l.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Visit</a>
              )}
            </div>
          ))
        )}
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
