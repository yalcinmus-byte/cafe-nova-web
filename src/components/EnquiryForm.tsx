'use client'
import { useState } from 'react'

type Kind = 'general' | 'event' | 'careers'

export function EnquiryForm({ initialKind = 'general', lockKind = false }: { initialKind?: Kind; lockKind?: boolean }) {
  const [kind, setKind] = useState<Kind>(initialKind)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const data: Record<string, unknown> = Object.fromEntries(f.entries())
    data.equipment = f.getAll('equipment')
    if (!data.startTime) delete data.startTime
    if (!data.occasion) delete data.occasion
    data.kind = kind
    if (!data.date) delete data.date
    if (data.guests) data.guests = Number(data.guests); else delete data.guests
    setState('sending')
    const r = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(() => null)
    setState(r?.ok ? 'sent' : 'error')
  }

  if (state === 'sent') return (
    <div className="form-done" role="status">
      <h3>Thank you — we’ve got it.</h3>
      <p>The team will reply by email, usually within a day.</p>
    </div>
  )

  return (
    <form className="enquiry" onSubmit={submit}>
      {!lockKind && (
        <fieldset className="enquiry__kinds">
          <legend>What’s it about?</legend>
          {([['general', 'A question'], ['event', 'An event or private hire'], ['careers', 'Working at Nova']] as const).map(([v, l]) => (
            <label key={v} className={kind === v ? 'is-on' : ''}>
              <input type="radio" name="_kind" value={v} checked={kind === v} onChange={() => setKind(v)} /> {l}
            </label>
          ))}
        </fieldset>
      )}
      <div className="enquiry__row">
        <label>Your name<input name="name" required autoComplete="name" maxLength={120} /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      </div>
      <label>Phone <span className="opt">(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      {kind === 'event' && (
        <>
          <div className="enquiry__row">
            <label>Occasion<input name="occasion" maxLength={80} placeholder="Birthday, team party, quiz night…" /></label>
            <label>Guests<input name="guests" type="number" min={1} max={200} inputMode="numeric" /></label>
          </div>
          <div className="enquiry__row">
            <label>Date<input name="date" type="date" /></label>
            <label>Start time<input name="startTime" type="time" min="17:00" /></label>
          </div>
          <fieldset className="enquiry__kinds">
            <legend>What would you like to use?</legend>
            {[['sound', 'Sound system'], ['mic', 'Microphone'], ['projector', 'Projector'], ['tv', 'Big-screen TV']].map(([v, l]) => (
              <label key={v}><input type="checkbox" name="equipment" value={v} /> {l}</label>
            ))}
          </fieldset>
        </>
      )}
      <label>{kind === 'careers' ? 'Tell us about you and the hours you’re after' : kind === 'event' ? 'What are you planning?' : 'Message'}
        <textarea name="message" required rows={5} maxLength={4000} />
      </label>
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className="btn btn--river" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send'}</button>
      {state === 'error' && <p className="form-error" role="alert">Sorry, that didn’t send. Please try again, or pop in and ask us.</p>}
    </form>
  )
}
