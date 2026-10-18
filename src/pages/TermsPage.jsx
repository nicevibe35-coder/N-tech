import { LegalPage } from '../components/LegalPage'
import { SITE } from '../config/site'

const SECTIONS = [
  {
    title: 'Accepting these terms',
    body: (
      <p>
        By using {SITE.name} you agree to these terms. If you do not agree, please do not use the site. You must be old
        enough to enter a binding agreement where you live, or have a parent or guardian’s permission.
      </p>
    ),
  },
  {
    title: 'Your account',
    body: (
      <>
        <p>
          Give accurate information when you sign up and keep your login details safe. You are responsible for what
          happens under your account.
        </p>
        <p>You may not impersonate others or create accounts to get around a suspension.</p>
      </>
    ),
  },
  {
    title: 'What you post',
    body: (
      <>
        <p>
          You keep ownership of what you post, including posts, comments, blog content and project cards. By posting,
          you give {SITE.name} permission to display and store that content so the site can work.
        </p>
        <p>Only post things you have the right to share. Do not post other people’s private information.</p>
      </>
    ),
  },
  {
    title: 'Community rules',
    body: (
      <>
        <p>Be respectful. The following are not allowed:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Harassment, hate speech, or threats</li>
          <li>Spam, scams, or misleading promotions</li>
          <li>Malware, or content that attacks other people’s systems</li>
          <li>Anything illegal, or that infringes someone else’s rights</li>
        </ul>
        <p>We may remove content or suspend accounts that break these rules.</p>
      </>
    ),
  },
  {
    title: 'Learning material',
    body: (
      <p>
        Lessons and materials published by {SITE.name} are for your personal learning. You may not copy and resell them.
        Code samples in lessons may be used in your own projects.
      </p>
    ),
  },
  {
    title: 'Projects and collaboration',
    body: (
      <p>
        Project cards are invitations from members. {SITE.name} does not run these projects and is not responsible for
        agreements between members, or for the outcome of any project. Decide for yourself who you work with.
      </p>
    ),
  },
  {
    title: 'Ending your access',
    body: (
      <p>
        You can stop using the site at any time. We may suspend or end access for accounts that break these terms or put
        the community at risk.
      </p>
    ),
  },
  {
    title: 'Disclaimers',
    body: (
      <p>
        {SITE.name} is provided as is, without promises that it will always be available or error-free. Learning
        material is shared in good faith but may contain mistakes. To the extent the law allows, we are not liable for
        losses that come from using the site.
      </p>
    ),
  },
  {
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms as the site grows. The date at the top shows when they last changed. Continuing to use
        the site after a change means you accept the new terms.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      updated="October 10, 2026"
      intro={`These terms explain how you may use ${SITE.name}. They are meant to be short and readable.`}
      sections={SECTIONS}
    />
  )
}
