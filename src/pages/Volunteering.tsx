import Header from "@/components/Header/Header";
import "@/pages/Volunteering.css";

interface Chapter {
  num: string;
  gold?: boolean;
  title: string;
  date: string;
  org: string;
  orgGold?: boolean;
  text: string;
}

const chapters: Chapter[] = [
  {
    num: "01",
    gold: true,
    title: "Terral — Daily Volunteering",
    date: "March – August 2026",
    org: "Fundació Montblanc",
    orgGold: true,
    text: "Terral has been the most consistent, and without a doubt the most transformative, part of this experience. Every day I volunteered at the centre, spending time with the girls and children — helping with homework, joining activities, and just being present with them, while also taking photos to help document the centre's day-to-day work. I'm continuing this commitment through the summer, now volunteering daily from 9:00 to 16:30 with Terral's summer camp for an additional month.",
  },
  {
    num: "02",
    title: "Jaca — CES Training Programme",
    date: "7–11 May 2026",
    org: "European Solidarity Corps",
    text: "The training week in Jaca was a great experience too — it was part of the CES (European Solidarity Corps) training programme, where I got to meet other volunteers, learn more about the programme, and take part in workshops and cultural activities. I especially loved the walk through Jaca and the excursion to Canfranc. It helped me feel more prepared and connected for the rest of my placement.",
  },
  {
    num: "03",
    title: "Sketches Festival",
    date: "2 May 2026",
    org: "Fundació Montblanc",
    orgGold: true,
    text: "Being part of the Sketches Festival at the Auditori del Fòrum was incredible — such a big event, with so many clubs from all over Catalonia performing. I was the sole professional photographer covering the entire event, documenting the parade and performances from start to finish. Seeing that many people, especially kids and youth clubs, coming together for Kimbondo was really special.",
  },
  {
    num: "04",
    title: "The Gala",
    date: "14 March 2026",
    org: "Fundació Montblanc",
    orgGold: true,
    text: "I was so happy to be part of the Gala Benèfica de Contes que Curen at Llibreria Ona. I photographed the evening throughout — the storytelling, the charity auction, all of it. It was a beautiful night and I loved seeing the community come together for such a good cause.",
  },
];

export default function Volunteering() {
  return (
    <>
      <Header />
      <div className="vol-container">
        <div className="vol-page">
          <div className="vol-cover">
            <div className="vol-cover-eyebrow">Volunteering Report · March – August 2026</div>
            <div className="vol-cover-title">
              Yara Odeh
              <br />
              <em>A season in the Raval,</em> and beyond
            </div>
            <div className="vol-cover-sub">
              Daily volunteering at Terral, community events with Fundació Montblanc, and a
              training week with the European Solidarity Corps — an experience I would love to
              do again.
            </div>

            <div className="vol-cover-meta">
              <div className="vol-cover-meta-cell">
                <div className="label">Host Organisation</div>
                <div className="value">Fundació Montblanc</div>
              </div>
              <div className="vol-cover-meta-cell">
                <div className="label">Placement</div>
                <div className="value">Terral, Barcelona</div>
              </div>
              <div className="vol-cover-meta-cell">
                <div className="label">Programme</div>
                <div className="value">European Solidarity Corps</div>
              </div>
            </div>
          </div>

          <div className="vol-content">
            <div className="vol-section-label">Reflection</div>
            <p className="vol-intro-quote">
              "These last months have been one of the most meaningful experiences of my time
              here — between daily volunteering at Terral and taking part in several big events
              and a training week. And it isn't over yet."
            </p>

            {chapters.map((c) => (
              <div className="vol-chapter" key={c.num}>
                <div className="vol-chapter-rail">
                  <div className={`vol-chapter-num${c.gold ? " gold-stroke" : ""}`}>{c.num}</div>
                  <div className="vol-chapter-rail-line" />
                </div>
                <div className="vol-chapter-body">
                  <div className="vol-chapter-head">
                    <div className="vol-chapter-title">{c.title}</div>
                    <div className="vol-chapter-date">{c.date}</div>
                  </div>
                  <div className={`vol-chapter-org${c.orgGold ? " gold" : ""}`}>{c.org}</div>
                  <p className="vol-chapter-text">{c.text}</p>
                </div>
              </div>
            ))}

            <div className="vol-closing">
              <div className="vol-section-label">In short</div>
              <div className="vol-closing-title">Grateful for every part of it</div>
              <p>
                These months gave me so much — daily moments with the girls at Terral,
                unforgettable events with Fundació Montblanc, and a training that connected me
                with other volunteers through the European Solidarity Corps. And with the summer
                camp still ahead, this journey continues. I'm really grateful for this experience
                and for everyone who made it possible. It's an experience I would love to do
                again.
              </p>
            </div>

            <div className="vol-footer-mark">
              <span>Yara Odeh · Volunteering Report</span>
              <span>Terral · Fundació Montblanc · European Solidarity Corps</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
