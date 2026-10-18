import { LegalPage } from '../components/LegalPage'
import { SITE } from '../config/site'

const SECTIONS = [
  {
    title: 'What we collect',
    body: (
      <>
        <p>We collect only what the site needs to work:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Profile details you enter, such as your name, username, bio and website</li>
          <li>Content you create, such as posts, comments, likes and project cards</li>
          <li>Your learning progress and saved items</li>
          <li>Your display preference (light or dark theme)</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Where it is stored',
    body: (
      <p>
        Your data is currently kept in your own browser, using local storage on your device. It is not sent to a server.
        This means clearing your browser data removes it, and it does not follow you to another device.
      </p>
    ),
  },
  {
    title: 'Cookies and tracking',
    body: <p>{SITE.name} does not use advertising cookies, analytics, or tracking tools. We do not sell your data.</p>,
  },
  {
    title: 'What others can see',
    body: (
      <p>
        Content you post, such as updates, comments and project cards, is shown alongside your name and username. Your
        profile page shows the name, bio and website you chose to add.
      </p>
    ),
  },
  {
    title: 'Your choices',
    body: (
      <>
        <p>You can edit or delete your content and clear your saved data at any time.</p>
        <p>To remove everything stored by this site on your device, clear this site’s data in your browser settings.</p>
      </>
    ),
  },
  {
    title: 'Children',
    body: (
      <p>{SITE.name} is not directed at children under 13, and we do not knowingly collect information from them.</p>
    ),
  },
  {
    title: 'Changes to this policy',
    body: (
      <p>
        When we change how data is handled, such as moving storage to an online service, we will update this page and
        the date at the top before the change takes effect.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 10, 2026"
      intro={`This page explains what ${SITE.name} collects, where it is kept, and the choices you have.`}
      sections={SECTIONS}
    />
  )
}
