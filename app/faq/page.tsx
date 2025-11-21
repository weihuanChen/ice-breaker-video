'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What are icebreaker games?',
    answer:
      'Icebreaker games are fun, interactive activities designed to help people get to know each other, build rapport, and create a comfortable environment. They are perfect for team meetings, classrooms, workshops, or any gathering where you want to energize participants and encourage connection.',
  },
  {
    question: 'How do I choose the right icebreaker game?',
    answer:
      'Consider your group size, available time, and the setting. For large groups, choose games that scale well. For shorter sessions, opt for quick activities (our "Short Videos" section). For in-depth team building, explore our "Long Videos" section. Also consider the energy level you want - some games are high-energy and physical, while others are more reflective and conversational.',
  },
  {
    question: 'What is the difference between short and long videos?',
    answer:
      'Short videos (typically under 5 minutes) offer quick, easy-to-implement activities perfect for quick warm-ups or transitions. Long videos (over 5 minutes) provide more comprehensive explanations, detailed instructions, and often include variations or deeper facilitation tips for more complex games.',
  },
  {
    question: 'Can I use these games for virtual/online meetings?',
    answer:
      'Yes! Many icebreaker games can be adapted for virtual settings. Look for games that involve conversation, creativity, or sharing stories. When browsing our videos, check the descriptions for "virtual-friendly" or "online" tags. Games that require minimal physical materials or movement work best online.',
  },
  {
    question: 'How many people do I need for these games?',
    answer:
      'Most icebreaker games work with groups of 5-30 people, but many can be scaled up or down. Each video includes information about recommended group sizes. Some games work great even in pairs or small groups of 3-4, while others are designed for larger teams or classrooms.',
  },
  {
    question: 'Do I need any special materials or equipment?',
    answer:
      'Most icebreaker games require minimal materials - often just pen and paper, or nothing at all! Each video description lists any materials needed. We prioritize games that are easy to set up and don\'t require expensive or hard-to-find items.',
  },
  {
    question: 'How often should I use icebreaker games?',
    answer:
      'It depends on your context! For recurring team meetings, starting with a quick icebreaker every 2-3 meetings can keep energy high without feeling repetitive. For classrooms, you might use them at the start of a new unit or when introducing group work. The key is to match the frequency to your group\'s needs and energy.',
  },
  {
    question: 'Are these games suitable for professional/corporate settings?',
    answer:
      'Absolutely! Many of our icebreaker games are designed for professional environments and help build team cohesion, improve communication, and create positive work culture. Look for games tagged with "team building" or "corporate" for workplace-appropriate activities.',
  },
  {
    question: 'Can I use these games with children or students?',
    answer:
      'Yes! We have many games suitable for educational settings and different age groups. Check the video descriptions for age recommendations. Games tagged with "classroom" or "educational" are particularly well-suited for teachers and youth group leaders.',
  },
  {
    question: 'How do I search for specific types of games?',
    answer:
      'Use the search bar at the top of the page to search by keywords (e.g., "energizer", "team building", "creative"). You can also filter by tags to find games for specific purposes, group sizes, or settings. Click on any tag to see related games.',
  },
  {
    question: 'Can I suggest new icebreaker games to add?',
    answer:
      'We\'re always looking to expand our collection! While we don\'t currently have a formal submission process, we regularly add new games based on user feedback and trending team-building activities. Check back regularly for new additions.',
  },
  {
    question: 'Are the videos free to watch?',
    answer:
      'Yes! All videos on Icebreak Games are completely free to watch and use. Our mission is to make quality icebreaker resources accessible to everyone - teachers, facilitators, team leaders, and event organizers.',
  },
]

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold">{item.question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        )}
      >
        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about icebreaker games and how to use our platform
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="divide-y divide-border">
            {faqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h2 className="mb-3 text-xl font-semibold">Still have questions?</h2>
          <p className="text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Browse our video collection to see examples
            and detailed instructions, or use the search function to find specific types of games.
          </p>
        </div>
      </div>
    </main>
  )
}
