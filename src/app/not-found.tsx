import Link from "next/link";

import { EventFooter } from "@/components/ui/EventFooter";
import { EventHeader } from "@/components/ui/EventHeader";

export default function NotFound() {
  return (
    <div className="app-shell">
      <EventHeader phaseOverride="PRE_SALE" />
      <main className="phase-layout">
        <section className="not-found-screen">
          <div className="container">
            <div className="not-found-screen__panel">
              <p className="type-label">404 / Off route</p>
              <h1 className="type-display not-found-screen__title">This drop doesn&apos;t exist.</h1>
              <p className="type-body not-found-screen__copy">
                The signal you followed is gone. Return to the live event flow and catch the next
                release window from the top.
              </p>
              <Link
                className="button button--ghost button--md not-found-screen__action"
                data-cursor="go"
                href="/"
              >
                Back to the homepage
              </Link>
            </div>
          </div>
        </section>
      </main>
      <EventFooter />
    </div>
  );
}
