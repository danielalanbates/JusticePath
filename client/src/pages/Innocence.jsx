import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../AuthContext'
import api from '../api'

function Innocence() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [evidence, setEvidence] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)
  const [showWitnessForm, setShowWitnessForm] = useState(false)
  const [evidenceForm, setEvidenceForm] = useState({ case_id: '', title: '', description: '', evidence_type: 'document', date_collected: '', chain_of_custody: '' })
  const [witnessForm, setWitnessForm] = useState({ case_id: '', title: '', description: '', date_collected: '' })

  useEffect(() => {
    if (!user) return
    Promise.all([
      api.get('/evidence'),
      api.get('/cases'),
    ]).then(([evRes, casesRes]) => {
      setEvidence(evRes.data.evidence || [])
      setCases(casesRes.data.cases || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const handleAddEvidence = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/evidence', evidenceForm)
      setEvidence([res.data.evidence, ...evidence])
      setEvidenceForm({ case_id: '', title: '', description: '', evidence_type: 'document', date_collected: '', chain_of_custody: '' })
      setShowEvidenceForm(false)
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const handleAddWitness = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/evidence', { ...witnessForm, evidence_type: 'witness_statement' })
      setEvidence([res.data.evidence, ...evidence])
      setWitnessForm({ case_id: '', title: '', description: '', date_collected: '' })
      setShowWitnessForm(false)
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm(t('common.delete') + '?')) return
    try {
      await api.delete(`/evidence/${id}`)
      setEvidence(evidence.filter(e => e.id !== id))
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const typeIcons = {
    photo: '📷', video: '🎥', document: '📄', witness_statement: '👤', audio: '🎙️',
  }

  if (!user) {
    return (
      <div>
        <h1 className="section-title">{t('innocence.title')}</h1>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)' }}>Please register or log in to use innocence support tools.</p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="card"><p>{t('common.loading')}</p></div>

  return (
    <div>
      <h1 className="section-title">{t('innocence.title')}</h1>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowEvidenceForm(!showEvidenceForm)}>{t('innocence.addEvidence')}</button>
        <button className="btn btn-outline" onClick={() => setShowWitnessForm(!showWitnessForm)}>{t('innocence.addWitness')}</button>
      </div>

      {showEvidenceForm && (
        <form onSubmit={handleAddEvidence} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>{t('innocence.addEvidence')}</h3>
          <div className="form-group">
            <label className="form-label">Related Case</label>
            <select className="form-input" value={evidenceForm.case_id} onChange={e => setEvidenceForm({...evidenceForm, case_id: e.target.value})}>
              <option value="">No case selected</option>
              {cases.map(c => <option key={c.id} value={c.id}>{c.case_number || 'Unnamed'}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={evidenceForm.title} onChange={e => setEvidenceForm({...evidenceForm, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={evidenceForm.evidence_type} onChange={e => setEvidenceForm({...evidenceForm, evidence_type: e.target.value})}>
              <option value="document">Document</option>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={evidenceForm.description} onChange={e => setEvidenceForm({...evidenceForm, description: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Date Collected</label>
            <input type="date" className="form-input" value={evidenceForm.date_collected} onChange={e => setEvidenceForm({...evidenceForm, date_collected: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowEvidenceForm(false)}>{t('common.cancel')}</button>
          </div>
        </form>
      )}

      {showWitnessForm && (
        <form onSubmit={handleAddWitness} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>{t('innocence.addWitness')}</h3>
          <div className="form-group">
            <label className="form-label">Related Case</label>
            <select className="form-input" value={witnessForm.case_id} onChange={e => setWitnessForm({...witnessForm, case_id: e.target.value})}>
              <option value="">No case selected</option>
              {cases.map(c => <option key={c.id} value={c.id}>{c.case_number || 'Unnamed'}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Witness Name / Title</label>
            <input className="form-input" value={witnessForm.title} onChange={e => setWitnessForm({...witnessForm, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Statement</label>
            <textarea className="form-input" value={witnessForm.description} onChange={e => setWitnessForm({...witnessForm, description: e.target.value})} required style={{ minHeight: '120px' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={witnessForm.date_collected} onChange={e => setWitnessForm({...witnessForm, date_collected: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowWitnessForm(false)}>{t('common.cancel')}</button>
          </div>
        </form>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('innocence.evidenceLog')}</h3>
          <span className="badge badge-blue">{evidence.length} items</span>
        </div>
        {evidence.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <p className="empty-state-text">Evidence items will appear here</p>
          </div>
        ) : (
          evidence.map(ev => (
            <div key={ev.id} className="list-item">
              <div>
                <strong>{typeIcons[ev.evidence_type] || '📄'} {ev.title}</strong>
                {ev.description && <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{ev.description.substring(0, 100)}{ev.description.length > 100 ? '...' : ''}</div>}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ev.evidence_type} — {ev.date_collected ? new Date(ev.date_collected).toLocaleDateString() : 'No date'}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => handleDelete(ev.id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>✕</button>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">{t('innocence.innocenceProjects')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
            Contact the Innocence Project or one of its affiliates to review your case.
          </p>
          <a href="https://innocenceproject.org" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{t('innocence.contactProject')}</a>
        </div>
        <div className="card">
          <h3 className="card-title">{t('innocence.dnaTesting')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
            Learn about DNA testing resources and post-conviction testing options.
          </p>
          <button className="btn btn-outline btn-sm">{t('innocence.dnaTesting')}</button>
        </div>
      </div>
    </div>
  )
}

export default Innocence
