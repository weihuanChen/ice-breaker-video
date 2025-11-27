export const metadata = {
  title: 'Privacy Policy | icebreakergames.video',
  description: 'How icebreakergames.video collects, uses, and protects your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: November 27, 2025</p>
          <p className="text-muted-foreground">
            Welcome to icebreakergames.video. We respect your privacy and are committed to protecting your
            personal data. This policy explains what we collect, how we use it, and your choices.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Data We Collect</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Usage data: Anonymous analytics about how you use the site (e.g., pages visited). Tools like Google
              Analytics or Vercel Analytics may be used to gather aggregated metrics.
            </li>
            <li>Cookies: Used to improve your browsing experience and remember preferences.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. How We Use Your Data</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Provide and maintain the service.</li>
            <li>Monitor usage to improve performance and content.</li>
            <li>Detect, prevent, and address technical issues or abuse.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Third-Party Services</h2>
          <p className="text-muted-foreground">
            We may use third-party providers to monitor or analyze usage:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Google Analytics</li>
            <li>Vercel Analytics</li>
            <li>Cloudflare</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Your Choices</h2>
          <p className="text-muted-foreground">
            You can manage cookie preferences through your browser settings. If you disable cookies, some site
            features may not work as intended.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, contact us at{' '}
            <a className="text-primary hover:underline" href="mailto:shendongloving123@gmail.com">
              shendongloving123@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
