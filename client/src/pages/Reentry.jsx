import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api'

function Reentry() {
  const { t } = useTranslation()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/resources')
      .then(res => setResources(res.data.resources || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    { key: 'all', icon: '📋', label: 'All Resources' },
    { key: 'housing', icon: '🏠', label: 'Housing' },
    { key: 'employment', icon: '💼', label: 'Employment' },
    { key: 'legal_aid', icon: '⚖️', label: 'Legal Aid' },
    { key: 'mental_health', icon: '🧠', label: 'Mental Health' },
    { key: 'substance_abuse', icon: '💊', label: 'Substance Abuse' },
    { key: 'education', icon: '🎓', label: 'Education' },
  ]

  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter)

  if (loading) return <div className="card"><p>{t('common.loading')}</p></div>

  return (
    <div>
      <h1 className="section-title">{t('reentry.title')}</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`btn btn-sm ${filter === cat.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(cat.key)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No resources found for this category</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {filtered.map(r => (
            <div key={r.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{r.title}</h3>
                {r.is_verified && <span className="badge badge-green">Verified</span>}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{r.description}</p>
              {r.address && <p style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>📍 {r.address}</p>}
              {r.phone && <p style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>📞 {r.phone}</p>}
              {r.website && (
                <a href={r.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--primary)' }}>
                  🔗 Visit Website
                </a>
              )}
              {r.eligibility_requirements && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Eligibility: {r.eligibility_requirements}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">{t('reentry.benefits')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Apply for SNAP, Medicaid, housing assistance, and other benefits you may be eligible for through Washington State DSHS.
        </p>
        <a href="https://www.dshs.wa.gov" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">{t('reentry.applyBenefits')}</a>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">🪪 ID & Document Replacement</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
            Replace lost or expired identification, Social Security cards, and other essential documents.
          </p>
          <a href="https://www.dol.wa.gov" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">WA DOL — Get ID</a>
        </div>
        <div className="card">
          <h3 className="card-title">💰 Financial Literacy</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
            Build credit, manage finances, open bank accounts, and learn budgeting skills.
          </p>
          <button className="btn btn-outline btn-sm">Start Learning</button>
        </div>
      </div>
    </div>
  )
}

export default Reentry
