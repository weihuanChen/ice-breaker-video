export const metadata = {
  title: 'Support & Feedback | icebreakergames.video',
  description: 'Get help, report bugs, or share ideas for icebreakergames.video.',
}

export default function SupportPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Support & Feedback
          </h1>
          <p className="text-muted-foreground">
            Thanks for using icebreakergames.video. I run this project independently and check messages every
            day. Whether you found a bug, have a feature idea, or just want to say hi, I’d love to hear from you.
          </p>
        </header>

        <section className="space-y-2 text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">How to reach me</h2>
          <p>Email: <a className="text-primary hover:underline" href="mailto:shendongloving123@gmail.com">shendongloving123@gmail.com</a></p>
          <p>Response time: usually within 24–48 hours.</p>
          <p>Languages: English or Chinese are welcome.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Reporting a bug?</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Device &amp; browser (e.g., iPhone / Chrome on Windows).</li>
            <li>A screenshot or short description of what happened.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Have a feature request?</h2>
          <p className="text-muted-foreground">
            Many improvements come from user suggestions. If something is missing or could be smoother, let me
            know—this site is built for you.
          </p>
        </section>

        <section className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
          Note: Your email address is used only to reply to your inquiry and will never be shared.
        </section>
      </div>
    </main>
  )
}
