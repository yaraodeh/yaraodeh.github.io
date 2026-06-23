export default function CV() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yara Odeh — CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#1A1A1A;
    --muted:#555350;
    --faint:#84827C;
    --line:#1A1A1A;
    --hair:#D8D6D0;
    --serif:'Source Serif 4',Georgia,serif;
    --sans:'Inter','Helvetica Neue',Arial,sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#E9E7E1;}
  body{
    font-family:var(--sans);
    color:var(--ink);
    line-height:1.45;
    -webkit-font-smoothing:antialiased;
    display:flex;justify-content:center;
    padding:32px 16px;
  }

  .page{
    background:#fff;
    width:210mm;
    min-height:297mm;
    padding:18mm 18mm;
    box-shadow:0 8px 40px rgba(0,0,0,.14);
  }

  header{
    border-bottom:2px solid var(--line);
    padding-bottom:10px;
    margin-bottom:4px;
  }
  .name{
    font-family:var(--serif);
    font-weight:600;
    font-size:30px;
    letter-spacing:-.01em;
  }
  .role{
    font-size:12.5px;
    color:var(--muted);
    margin-top:3px;
  }
  .contact{
    margin-top:9px;
    font-size:11px;
    color:var(--muted);
    display:flex;
    flex-wrap:wrap;
    align-items:center;
    gap:5px 16px;
  }
  .contact a{color:var(--muted);text-decoration:none;}
  .contact span{display:inline-flex;align-items:center;gap:5px;}
  .ic{width:13px;height:13px;flex:none;}

  .statement{
    font-size:12.5px;
    color:#33322E;
    max-width:100%;
    margin:14px 0 22px;
    line-height:1.6;
  }

  .eyebrow{
    font-size:10.5px;
    letter-spacing:.12em;
    text-transform:uppercase;
    font-weight:600;
    color:var(--ink);
    border-bottom:1px solid var(--hair);
    padding-bottom:4px;
    margin-bottom:10px;
  }
  section{margin-bottom:18px;}
  section:last-child{margin-bottom:0;}

  .row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;}
  .title{font-size:13px;font-weight:600;}
  .date{font-size:11px;color:var(--faint);white-space:nowrap;font-variant-numeric:tabular-nums;}
  .sub{font-size:12px;color:var(--muted);margin-top:1px;}
  ul.desc{margin:5px 0 0 16px;padding:0;}
  ul.desc li{font-size:11.5px;color:#3A3935;line-height:1.55;margin-bottom:2px;}
  .entry{margin-bottom:13px;}
  .entry:last-child{margin-bottom:0;}

  .exh-row{display:grid;grid-template-columns:42px 1fr;column-gap:12px;margin-bottom:8px;}
  .exh-row:last-child{margin-bottom:0;}
  .exh-year{font-size:11px;color:var(--faint);font-variant-numeric:tabular-nums;padding-top:1px;}
  .exh-title{font-size:12.5px;font-weight:600;}
  .exh-venue{font-size:11.5px;color:var(--muted);}
  .exh-series{font-size:11px;color:var(--faint);font-style:italic;}

  .twocol{display:grid;grid-template-columns:1fr 1fr;gap:0 28px;}
  .skill-line{font-size:11.5px;color:#3A3935;line-height:1.65;}
  .skill-line b{font-weight:600;color:var(--ink);}

  @media print{
    @page{size:A4;margin:0;}
    html,body{background:#fff;}
    body{padding:0;}
    .page{box-shadow:none;width:auto;min-height:auto;margin:0;}
  }
  @media(max-width:760px){
    .page{width:100%;padding:24px 20px;}
    header{flex-direction:column;align-items:flex-start;gap:6px;}
    .contact{text-align:left;}
    .twocol{grid-template-columns:1fr;}
  }
</style>
</head>
<body>
  <div class="page">

    <header>
      <div class="name">Yara Odeh</div>
      <div class="role">Photographer — Documentary, Portrait, Street &amp; Fine Art</div>
      <div class="contact">
        <span><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.4 17.5c0 .3-.1.6-.3.8a8.4 8.4 0 0 1-1.6 1.4 7 7 0 0 1-2 .8c-3.6 1-7.7-.6-11-3.9S1.1 8.8 2.1 5.2a7 7 0 0 1 .8-2c.4-.6.9-1.1 1.4-1.6.2-.2.5-.3.8-.3h2.6c.5 0 1 .3 1.1.8l1 3.4c.1.4 0 .9-.3 1.2L8 8.3c1 2 2.7 3.7 4.7 4.7l1.6-1.5c.3-.3.8-.4 1.2-.3l3.4 1c.5.1.8.6.8 1.1z"/></svg>+34 625 950 563</span>
        <span><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/></svg><a href="mailto:yaraodehph@gmail.com">yaraodehph@gmail.com</a></span>
        <span><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9s1.3-6.5 3.8-9z"/></svg><a href="https://yara.odeh.app/">yara.odeh.app</a></span>
        <span><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-4.5a1.5 1.5 0 0 1 3 0V17M14 17v-4.5a2 2 0 0 1 4 0V17"/></svg><a href="https://www.linkedin.com/in/yaraodeh">/in/yaraodeh</a></span>
        <span><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>Barcelona, Spain</span>
      </div>
    </header>

    <p class="statement">
      Photographer with 4+ years of freelance experience, based in Barcelona and working across documentary,
      portrait, street, architecture, nature, and fine art, currently completing a Master's in Photography
      and Design at Elisava. Exhibited work across Barcelona and Catalonia, with freelance experience
      managing photography projects end to end — from shoot through post-production and client delivery.
    </p>

    <section>
      <div class="eyebrow">Experience</div>

      <div class="entry">
        <div class="row">
          <div class="title">Freelance Photographer · Self-employed</div>
          <div class="date">2022 – Present</div>
        </div>
        <ul class="desc">
          <li>Shoot weddings, proms, graduations, and private events for individual clients.</li>
          <li>Provide Airbnb listing photography for hosts to showcase their properties.</li>
          <li>Cover portrait sessions for individuals and families.</li>
          <li>Edit and retouch all images in Adobe Lightroom and Photoshop.</li>
          <li>Use Claude AI to streamline client communication, scheduling, and workflow organisation.</li>
          <li>Manage client communication, scheduling, and final delivery independently.</li>
        </ul>
      </div>

      <div class="entry">
        <div class="row">
          <div class="title">Volunteer Photographer &amp; Childcare Support · Montblanc &amp; Terral</div>
          <div class="date">March 2026 – Present</div>
        </div>
        <ul class="desc">
          <li>Committed daily volunteer role, present on-site every day to support the organisation's work.</li>
          <li>Care for children day to day, supporting their schoolwork and activities.</li>
          <li>Photograph the children's everyday moments, gatherings, and events.</li>
          <li>Edit and deliver images for the organisation's communications and outreach.</li>
        </ul>
      </div>
    </section>

    <section>
      <div class="eyebrow">Exhibitions</div>
      <div class="exh-row">
        <div class="exh-year">2026</div>
        <div>
          <div class="exh-title">Presence</div>
          <div class="exh-venue">Nau Bostik, Barcelona</div>
          <div class="exh-series">Series: This Sea Is Mine</div>
        </div>
      </div>
      <div class="exh-row">
        <div class="exh-year">2026</div>
        <div>
          <div class="exh-title"><a href="https://www.fundaciovilacasas.com/en/exhibition/elisava-el-mar-sempre-el-mar" style="color:inherit;text-decoration:underline;">El mar, sempre el mar</a></div>
          <div class="exh-venue">Can Framis Museum, Barcelona</div>
        </div>
      </div>
      <div class="exh-row">
        <div class="exh-year">2026</div>
        <div>
          <div class="exh-title">Identity</div>
          <div class="exh-venue">Fine Art Igualada, Igualada</div>
          <div class="exh-series">Series: The Art of Silence</div>
        </div>
      </div>
    </section>

    <section>
      <div class="eyebrow">Education</div>
      <div class="entry">
        <div class="row">
          <div class="title">Master's in Photography and Design</div>
          <div class="date">2025 – Present</div>
        </div>
        <div class="sub">Elisava, Barcelona School of Design and Engineering · Barcelona, Spain</div>
      </div>
      <div class="entry">
        <div class="row">
          <div class="title" style="font-weight:500;color:var(--muted);font-size:12px;">B.A. in Economics, Birzeit University</div>
          <div class="date">2018 – 2022</div>
        </div>
      </div>
    </section>

    <section>
      <div class="eyebrow">Skills &amp; Languages</div>
      <div class="twocol">
        <div class="skill-line"><b>Software</b><br>Adobe Lightroom, Adobe Photoshop, CapCut, Canva, Claude AI</div>
        <div class="skill-line"><b>Areas</b><br>Documentary, portrait, street, architecture, nature &amp; fine art photography, event &amp; Airbnb listing photography, photo retouching, video editing</div>
      </div>
      <div class="skill-line" style="margin-top:10px;"><b>Languages</b><br>Arabic (Native) · English (Fluent) · Spanish (Beginner)</div>
    </section>

  </div>
</body>
</html>
        `,
      }}
      style={{ minHeight: "100vh" }}
    />
  );
}
