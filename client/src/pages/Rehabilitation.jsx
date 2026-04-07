import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../AuthContext'
import api from '../api'

function Rehabilitation() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ goal_type: 'education', goal_description: '', target_completion: '' })
  const [showProgressForm, setShowProgressForm] = useState(null) // plan id
  const [progressData, setProgressData] = useState({ entry_type: 'course_completed', description: '', hours_completed: 0, entry_date: '' })

  useEffect(() => {
    if (!user) return
    api.get('/rehab/plans')
      .then(res => {
        setPlans(res.data.plans || [])
        res.data.plans.forEach(plan => {
          api.get(`/rehab/plans/${plan.id}/progress`).then(r => {
            setProgress(prev => ({ ...prev, [plan.id]: r.data.progress || [] }))
          })
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/rehab/plans', formData)
      setPlans([res.data.plan, ...plans])
      setProgress[res.data.plan.id] = []
      setFormData({ goal_type: 'education', goal_description: '', target_completion: '' })
      setShowForm(false)
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const handleAddProgress = async (planId) => {
    try {
      const res = await api.post(`/rehab/plans/${planId}/progress`, progressData)
      setProgress(prev => ({ ...prev, [planId]: [res.data.progress, ...(prev[planId] || [])] }))
      setProgressData({ entry_type: 'course_completed', description: '', hours_completed: 0, entry_date: '' })
      setShowProgressForm(null)
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const handleUpdateStatus = async (planId, status) => {
    try {
      const res = await api.patch(`/rehab/plans/${planId}`, { status })
      setPlans(plans.map(p => p.id === planId ? res.data.plan : p))
    } catch (err) {
      alert(t('common.error'))
    }
  }

  const typeIcons = {
    education: '🎓', vocational: '🔧', mental_health: '🧠',
    substance_abuse: '💊', community_service: '🤲',
  }

  const totalHours = Object.values(progress).flat().reduce((sum, p) => sum + parseFloat(p.hours_completed || 0), 0)

  if (!user) {
    return (
      <div>
        <h1 className="section-title">{t('rehabilitation.title')}</h1>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)' }}>Please register or log in to build your rehabilitation plan.</p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="card"><p>{t('common.loading')}</p></div>

  return (
    <div>
      <h1 className="section-title">{t('rehabilitation.title')}</h1>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('rehabilitation.progress')}</h3>
          <span className="badge badge-green">{totalHours} hrs</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--secondary)', borderRadius: '999px', height: '100%', width: plans.length > 0 ? `${Math.min(100, (plans.filter(p => p.status === 'completed').length / plans.length) * 100)}%` : '0%' }}></div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>{t('rehabilitation.startPlan')}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePlan} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>New Goal</h3>
          <div className="form-group">
            <label className="form-label">Goal Type</label>
            <select className="form-input" value={formData.goal_type} onChange={e => setFormData({...formData, goal_type: e.target.value})}>
              <option value="education">Education</option>
              <option value="vocational">Vocational Training</option>
              <option value="mental_health">Mental Health</option>
              <option value="substance_abuse">Substance Abuse Program</option>
              <option value="community_service">Community Service</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Goal Description</label>
            <textarea className="form-input" value={formData.goal_description} onChange={e => setFormData({...formData, goal_description: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Target Completion</label>
            <input type="date" className="form-input" value={formData.target_completion} onChange={e => setFormData({...formData, target_completion: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Create</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>{t('common.cancel')}</button>
          </div>
        </form>
      )}

      {plans.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">Your rehabilitation plan will appear here</p>
          </div>
        </div>
      ) : (
        plans.map(plan => (
          <div key={plan.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{typeIcons[plan.goal_type] || '📋'} {plan.goal_type.replace('_', ' ').toUpperCase()}</h3>
              <span className={`badge ${plan.status === 'completed' ? 'badge-green' : plan.status === 'paused' ? 'badge-yellow' : 'badge-blue'}`}>{plan.status}</span>
            </div>
            <p style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>{plan.goal_description}</p>
            {plan.target_completion && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Target: {new Date(plan.target_completion).toLocaleDateString()}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setShowProgressForm(showProgressForm === plan.id ? null : plan.id)}>{t('rehabilitation.addCourse')}</button>
              {plan.status !== 'completed' && <button className="btn btn-outline btn-sm" onClick={() => handleUpdateStatus(plan.id, 'completed')}>Mark Complete</button>}
              {plan.status === 'in_progress' && <button className="btn btn-outline btn-sm" onClick={() => handleUpdateStatus(plan.id, 'paused')}>Pause</button>}
              {plan.status === 'paused' && <button className="btn btn-outline btn-sm" onClick={() => handleUpdateStatus(plan.id, 'in_progress')}>Resume</button>}
            </div>

            {showProgressForm === plan.id && (
              <form onSubmit={(e) => { e.preventDefault(); handleAddProgress(plan.id) }} style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Entry Type</label>
                  <select className="form-input" value={progressData.entry_type} onChange={e => setProgressData({...progressData, entry_type: e.target.value})}>
                    <option value="course_completed">Course Completed</option>
                    <option value="hours_logged">Hours Logged</option>
                    <option value="milestone_reached">Milestone Reached</option>
                    <option value="counseling_session">Counseling Session</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" value={progressData.description} onChange={e => setProgressData({...progressData, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hours</label>
                  <input type="number" className="form-input" value={progressData.hours_completed} onChange={e => setProgressData({...progressData, hours_completed: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Add Entry</button>
              </form>
            )}

            {(progress[plan.id] || []).length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Progress Entries</h4>
                {progress[plan.id].map(entry => (
                  <div key={entry.id} className="list-item">
                    <div>
                      <strong>{entry.entry_type.replace(/_/g, ' ')}</strong>
                      {entry.description && <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{entry.description}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {entry.hours_completed > 0 && <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{entry.hours_completed}h</div>}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(entry.entry_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default Rehabilitation
