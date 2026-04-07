import { useTranslation } from 'react-i18next'

function Community() {
  const { t } = useTranslation()

  const sections = [
    { icon: '💬', title: t('community.forums'), action: t('community.joinForum') },
    { icon: '👥', title: t('community.mentorMatching'), action: t('community.findMentor') },
    { icon: '👨‍👩‍👧‍👦', title: t('community.familySupport'), action: t('community.familySupport') },
    { icon: '🧑‍⚕️', title: t('community.counseling'), action: t('community.counseling') },
  ]

  return (
    <div>
      <h1 className="section-title">{t('community.title')}</h1>

      <div className="grid grid-2">
        {sections.map((section, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
              <h3 className="card-title" style={{ marginBottom: 0 }}>{section.title}</h3>
            </div>
            <button className="btn btn-outline btn-sm">{section.action}</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="card-title">{t('community.becomeMentor')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Share your story and help others navigate the path forward.
        </p>
        <button className="btn btn-secondary btn-sm">{t('community.becomeMentor')}</button>
      </div>
    </div>
  )
}

export default Community
