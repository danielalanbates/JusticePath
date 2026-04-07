import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../AuthContext'
import api from '../api'

function CaseTracker() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [courtDates, setCourtDates] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    case_number: '', court_name: '', case_type: 'criminal', charge_description: '', next_court_date: ''
  })
  const [showDateForm, setShowDateForm] = useState(false)
  const [dateForm, setDateForm] = useState({ case_id: '', date_time: '', court_location: '', hearing_type: '', notes: '' })

  useEffect(() => {
    if (!user) return
    Promise.all([
      api.get('/cases'),
      api.get('/court-dates'),
      api.get('/documents'),
    ]).then(([casesRes, datesRes, docsRes]) => {
      setCases(casesRes.data.cases || [])
      setCourtDates(datesRes.data.courtDates || [])
      setDocuments(docsRes.data.documents || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/cases', formData)
      setCases([res.data.case, ...cases])
      setFormData({ case_number: '', court_name: '', case_type: 'criminal', charge_description: '', next_court_date: '' })
      setShowForm(false)
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const handleDeleteCase = async (id) => {
    if (!confirm(t('common.delete') + '?')) return
    try {
      await api.delete(`/cases/${id}`)
      setCases(cases.filter(c => c.id !== id))
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const handleAddDate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/court-dates', dateForm)
      setCourtDates([...courtDates, res.data.courtDate])
      setDateForm({ case_id: '', date_time: '', court_location: '', hearing_type: '', notes: '' })
      setShowDateForm(false)
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const statusBadge = (status) => {
    const map = { active: 'badge-green', pending: 'badge-yellow', closed: 'badge-blue', appealed: 'badge-red' }
    return <span className={`badge ${map[status] || 'badge-blue'}`}>{status}</span>
  }

  if (!user) {
    return (
      <div>
        <h1 className="section-title">{t('caseTracker.title')}</h1>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)' }}>Please register or log in to track your cases.</p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="card"><p>{t('common.loading')}</p></div>

  const upcomingDates = courtDates.filter(d => new Date(d.date_time) >= new Date()).slice(0, 3)

  return (
    <div>
      <h1 className="section-title">{t('caseTracker.title')}</h1>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('caseTracker.status')}</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              {cases.length === 0 ? t('caseTracker.addFirstCase') : t('caseTracker.addDocument')}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
              <div className="form-group">
                <label className="form-label">{t('caseTracker.caseNumber') || 'Case Number'}</label>
                <input className="form-input" value={formData.case_number} onChange={e => setFormData({...formData, case_number: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Court Name</label>
                <input className="form-input" value={formData.court_name} onChange={e => setFormData({...formData, court_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Case Type</label>
                <select className="form-input" value={formData.case_type} onChange={e => setFormData({...formData, case_type: e.target.value})}>
                  <option value="criminal">Criminal</option>
                  <option value="civil">Civil</option>
                  <option value="appeal">Appeal</option>
                  <option value="expungement">Expungement</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Charge Description</label>
                <textarea className="form-input" value={formData.charge_description} onChange={e => setFormData({...formData, charge_description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Next Court Date</label>
                <input type="datetime-local" className="form-input" value={formData.next_court_date} onChange={e => setFormData({...formData, next_court_date: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>{t('common.cancel')}</button>
              </div>
            </form>
          )}

          {cases.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('caseTracker.noCases')}</p>
          ) : (
            cases.map(c => (
              <div key={c.id} className="list-item">
                <div>
                  <strong>{c.case_number || 'Unnamed Case'}</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.court_name} — {c.case_type}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {statusBadge(c.status)}
                  <button className="btn btn-outline btn-sm" onClick={() => handleDeleteCase(c.id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('caseTracker.nextCourtDate')}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setShowDateForm(!showDateForm)}>{t('caseTracker.addReminder')}</button>
          </div>

          {showDateForm && (
            <form onSubmit={handleAddDate} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
              <div className="form-group">
                <label className="form-label">Case</label>
                <select className="form-input" value={dateForm.case_id} onChange={e => setDateForm({...dateForm, case_id: e.target.value})}>
                  <option value="">Select a case</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.case_number || 'Unnamed'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-input" value={dateForm.date_time} onChange={e => setDateForm({...dateForm, date_time: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Court Location</label>
                <input className="form-input" value={dateForm.court_location} onChange={e => setDateForm({...dateForm, court_location: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Hearing Type</label>
                <input className="form-input" value={dateForm.hearing_type} onChange={e => setDateForm({...dateForm, hearing_type: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowDateForm(false)}>{t('common.cancel')}</button>
              </div>
            </form>
          )}

          {upcomingDates.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No upcoming dates</p>
          ) : (
            upcomingDates.map(d => (
              <div key={d.id} className="list-item">
                <div>
                  <strong>{new Date(d.date_time).toLocaleDateString()}</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{d.hearing_type} — {d.court_location}</div>
                </div>
                <span className="badge badge-blue">{d.case_number || ''}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('caseTracker.documents')}</h3>
        </div>
        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <p className="empty-state-text">No documents uploaded yet</p>
          </div>
        ) : (
          documents.map(d => (
            <div key={d.id} className="list-item">
              <div>
                <strong>{d.title}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{d.document_type} — {new Date(d.created_at).toLocaleDateString()}</div>
              </div>
              <span className="badge badge-green">Encrypted</span>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('caseTracker.timeline')}</h3>
        </div>
        {courtDates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p className="empty-state-text">Case timeline will appear here</p>
          </div>
        ) : (
          courtDates.sort((a, b) => new Date(a.date_time) - new Date(b.date_time)).map(d => (
            <div key={d.id} className="list-item">
              <div>
                <strong>{new Date(d.date_time).toLocaleDateString()} {new Date(d.date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{d.hearing_type} at {d.court_location}</div>
                {d.notes && <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{d.notes}</div>}
              </div>
              <span className="badge badge-blue">{d.case_number || ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CaseTracker
