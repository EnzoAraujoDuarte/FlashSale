import { Container } from "@/components/primitives/Container";
import { Body, Caption, Label } from "@/components/primitives/Typography";

export function EventFooter() {
  return (
    <footer className="event-footer">
      <Container className="event-footer__inner">
        <div className="event-footer__block">
          <Label>Flash Sale Engine</Label>
          <Body>
            Portfolio-grade event commerce built to feel like a premium live release from first
            countdown to final sold-out state.
          </Body>
        </div>
        <div className="event-footer__block">
          <Caption>Architected for queue, scarcity, timed reservations, and cinematic product flow.</Caption>
          <Caption>Refined to production-grade polish across desktop, mobile, and every phase.</Caption>
        </div>
      </Container>
    </footer>
  );
}
