import Link from 'next/link'
import { Video, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col space-y-3">
            <Link href="/" className="flex items-center space-x-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Icebreak Games
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover fun and engaging icebreaker games to energize your team and classroom.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  All Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/long-form"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Long Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/shorts"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Short Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Support &amp; Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/user-agreement"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  User Service Agreement
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.teacherspayteachers.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Teachers Pay Teachers
                </a>
              </li>
              <li>
                <a
                  href="https://www.playmeo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Playmeo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-6 text-center">
          <p className="flex items-center justify-center text-sm text-muted-foreground">
            <span>&copy; {currentYear} icebreakgames.video. Made with</span>
            <Heart className="mx-1 h-4 w-4 fill-red-500 text-red-500" />
            <span>for educators and team builders.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
