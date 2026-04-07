import { useTranslation } from 'react-i18next'

function Community() {
  const { t } = useTranslation()

  const sections = [
    { icon: '💬', title: t('community.forums'), action: t('community.joinForum'), desc: 'Connect with peers anonymously in moderated support forums.' },
    { icon: '👥', title: t('community.mentorMatching'), action: t('community.findMentor'), desc: 'Get matched with someone who has successfully navigated a similar path.' },
    { icon: '👨‍👩‍👧‍👦', title: t('community.familySupport'), action: t('community.familySupport'), desc: 'Resources for families affected by incarceration.' },
    { icon: '🧑‍⚕️', title: t('community.counseling'), action: t('community.counseling'), desc: 'Find faith-based and secular counseling in your area.' },
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{section.desc}</p>
            <button className="btn btn-outline btn-sm">{section.action}</button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">{t('community.becomeMentor')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.75rem 0' }}>
          Share your story and help others navigate the path forward. If you have successfully rebuilt your life, consider guiding someone else.
        </p>
        <button className="btn btn-secondary btn-sm">{t('community.becomeMentor')}</button>
      </div>
    </div>
  )
}

export default Community
