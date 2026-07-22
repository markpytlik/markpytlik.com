/* ============================================================
   Case study content.
   Edit copy, media and captions here — both work.html (the index)
   and the individual case pages read from this file.

   Block kinds:
     text  { text, lead? }        lead:true = large display lead
     image { src, caption }
     video { src, caption }       autoplay, muted, loop
     pair  { cols, left, right }  two images side by side
     embed { url, caption }       Vimeo/YouTube link, or 'VIMEO_ID' placeholder
   ============================================================ */
window.MP_CASES = {

  casper: {
    href: 'casper.html',
    thumb: 'assets/work/casper.jpg',
    listTitle: 'Casper',
    listBlurb: 'A social campaign moving a mattress brand toward being a sleep company.',
    listMeta: 'Social · 2019',

    index: 'Case 01 / 05',
    eyebrow: 'Social · 2019 · Casper, The Sleep Company',
    title: 'Casper',
    hero: { src: 'assets/work/casper.jpg', alt: 'Casper — bedroom' },
    intro: 'By 2019, over 100 mattress-in-a-box brands had turned “mattresses” into a commodity, so Casper set out to become a lifestyle company built around sleep — and we answered with the Casper Sleep Channel, a library of gently absurd long-form sleep content that lived on YouTube and Spotify.',
    blocks: [
      { kind: 'image', src: 'assets/work/casper-phones.jpg', caption: 'The Casper Sleep Channel — published across Spotify & YouTube' },
      { kind: 'embed', url: 'VIMEO_ID', caption: 'Campaign film — add your Vimeo link' },
      { kind: 'video', src: 'assets/work/casper-film1.mp4', caption: 'Sleep-content spot — one of the channel’s long-form films' },
      { kind: 'pair', cols: '1.5fr 1fr',
        left:  { src: 'assets/work/casper-grid.jpg',     caption: 'Original episodes — Patent Yawns, Oceans of the World, Body Scan' },
        right: { src: 'assets/work/casper-bodyscan.jpg', caption: 'Vertical cutdowns for social' } },
      { kind: 'pair', cols: '1fr 1fr',
        left:  { src: 'assets/work/casper-patent.jpg', caption: 'Patent Yawns — episode artwork' },
        right: { src: 'assets/work/casper-oceans.jpg', caption: 'Oceans of the World — vertical key art' } },
      { kind: 'video', src: 'assets/work/casper-film2.mp4', caption: 'Social cutdown from the campaign' }
    ]
  },

  nike: {
    href: 'nike.html',
    thumb: 'assets/work/nike.jpg',
    listTitle: 'Nike — Air Max Day',
    listBlurb: 'A global Air Max Day moment engineered for feeds and culture.',
    listMeta: 'Campaign · 2021',

    index: 'Case 02 / 05',
    eyebrow: 'Campaign · 2021 · Nike, Air Max Day Worldwide',
    title: 'Air Max Day',
    hero: { src: 'assets/work/nike/hero.png', alt: 'Nike — Air Max Day Worldwide' },
    intro: 'Air Max Day is Nike’s annual celebration of the Air Max — usually a global, on-the-ground affair of events, installations and drops. In 2021 none of that was possible, so we built AMD Worldwide: a mobile-first, members-only 24-hour virtual event that met a diehard fanbase and a new Gen-Z audience where they already were.',
    blocks: [
      { kind: 'text', lead: true, text: 'The background: Air Max Day is Nike’s annual holiday for the Air Max — typically an on-the-ground initiative of geo-supported community events, installations, celebrity appearances and drops. In 2021, none of that was possible.' },
      { kind: 'text', text: 'The brief: what’s the best way to celebrate Air Max Day virtually — in a way that speaks to Nike’s diehard fanbase and Gen-Z women, while honoring the unique sensibilities and needs of each geo? We knew we had to meet our audience where they were, make it feel like a can’t-miss event, and build an extensible platform.' },
      { kind: 'video', src: 'assets/work/loops/nike-006.mp4', caption: 'AMD Worldwide — a 24-hour, Nike.com members-only experience' },
      { kind: 'text', text: 'Live for only 24 hours and open to Nike.com members, the experience housed a ton of exclusive content. Because so many geos were involved, we played on the idea of travel — Air Max is about the collective: everybody coming together to bring the future to light and give everyone a voice.' },
      { kind: 'embed', url: 'VIMEO_ID', caption: 'Launch film — add your Vimeo link' },
      { kind: 'image', src: 'assets/work/nike/geo.png', caption: 'An extensible platform built to honor the sensibilities of 15 geos' },
      { kind: 'text', text: 'The content ranged from geo-specific stories and streetscapes to “34 years of Air Max in 60 seconds,” The Pair product storytelling, a mobile-first experience, a Travis Scott live stream, and a LiDAR scan.' },
      { kind: 'pair', cols: '1fr 1fr',
        left:  { src: 'assets/work/nike/pair-1.png', caption: 'The Pair — product storytelling' },
        right: { src: 'assets/work/nike/pair-2.png', caption: '34 years of Air Max in 60 seconds' } },
      { kind: 'text', text: 'My role: casting creatives and leading concepting, writing and vetting content ideas, developing the structure and content strategy for the site, and daily check-ins with Nike CDs. Eight weeks, soup to nuts — I barely slept, but it was a trip.' },
      { kind: 'image', src: 'assets/work/nike/role.jpg', caption: 'My role — casting creatives, leading concepting, site structure & content strategy, daily check-ins with Nike CDs. Eight weeks, soup to nuts.' },
      { kind: 'text', text: 'The results: 515k total visits, 4.7M total impressions, 15.9k social shares, and 5.7B total miles travelled — 100% original content across 15 geos, delivered by a 35-person team.' }
    ]
  },

  sja: {
    href: 'steve-jobs-archive.html',
    thumb: 'assets/work/sja.jpg',
    listTitle: 'Steve Jobs Archive',
    listBlurb: 'Editorial and creative direction for a new kind of archive.',
    listMeta: 'Editorial · 2023',

    index: 'Case 03 / 05',
    eyebrow: 'Editorial · 2023 · Steve Jobs Archive',
    title: 'Letters to a Young Creator',
    hero: { src: 'assets/work/sja/a.jpg', alt: 'Steve Jobs Archive' },
    intro: 'The Steve Jobs Archive is the authoritative home for Steve’s story and a resource for new generations eager to make their own mark. “Letters to a Young Creator” is part of that work — editorial and creative direction for a new kind of institution.',
    blocks: [
      { kind: 'text', lead: true, text: 'The Steve Jobs Archive is the authoritative home for Steve’s story and a resource for new generations eager to make their own mark.' },
      { kind: 'video', src: 'assets/work/loops/sja-004.mp4', caption: 'A resource for new generations eager to make their own mark' },
      { kind: 'text', text: '“Letters to a Young Creator” is part of that work — an original series developed in the Archive’s editorial voice, pairing archival material with new writing for people at the start of their own creative lives.' },
      { kind: 'pair', cols: '1fr 1fr',
        left:  { src: 'assets/work/sja/b.png', caption: 'Editorial system' },
        right: { src: 'assets/work/sja/c.png', caption: 'Story-first layouts' } },
      { kind: 'embed', url: 'VIMEO_ID', caption: 'Film — add your Vimeo link' },
      { kind: 'pair', cols: '1fr 1fr',
        left:  { src: 'assets/work/sja/d.png', caption: 'Typography & tone' },
        right: { src: 'assets/work/sja/e.png', caption: 'The authoritative home for Steve’s story' } }
    ]
  },

  stink: {
    href: 'stink-studios-rebrand.html',
    thumb: 'assets/work/stink.jpg',
    listTitle: 'Stink Studios Rebrand',
    listBlurb: 'Rebuilding the identity of a global creative studio from the inside.',
    listMeta: 'Brand · 2022',

    index: 'Case 04 / 05',
    eyebrow: 'Brand · 2022 · Stink Studios',
    title: 'Stink Studios Rebrand',
    hero: { src: 'assets/work/stink/b.jpg', alt: 'Stink Studios rebrand' },
    intro: 'Eight years on from our last rebrand, Stink had grown to hundreds of people across six offices — lots of strangers who needed a cohesive sense of what Stink was for. The rebrand gave everyone something to rally around: a system built on craft, digital fluency and humanity, running from the values to the type to a custom icon font.',
    blocks: [
      { kind: 'text', lead: true, text: 'Eight years on from our last rebrand, and in that time Stink had ballooned to a huge staff across six offices — lots of strangers who needed a cohesive sense of what Stink was for, something to rally around.' },
      { kind: 'text', text: 'The story of Stink begins in 1998 with Stink Films in London. In 2007 Mark moved to London to set up an interactive arm, and Stink Digital was born. Our first project, Philips “Carousel,” won the Film Grand Prix at Cannes — the first ever non-linear piece to receive the honor, and the project that put Stink Digital on the map.' },
      { kind: 'image', src: 'assets/work/stink/a.jpg', caption: 'From Carousel onward — world-class work underpinned with digital thinking' },
      { kind: 'text', text: 'The rebrand ran from the values out: Craft, Digital Fluency, Positivity, Honesty, Adaptability, Humanity, Equity. On positivity — “You are here for a glorious window of time. Be the person whose presence generates serotonin instead of stress. Leave your ego at the door.”' },
      { kind: 'text', text: 'Typography connects us to craft. Helvetica, Times New Roman and Courier New are openly accessible, basic, default raw materials — and the way we shape them exposes the way we think and make, while nodding to the early-web aesthetics in our DNA.' },
      { kind: 'image', src: 'assets/work/stink/c.jpg', caption: 'Typography — Helvetica, Times New Roman and Courier New, default raw materials shaped with craft' },
      { kind: 'embed', url: 'VIMEO_ID', caption: 'Brand film — add your Vimeo link' },
      { kind: 'text', text: 'Stink Dings — our own custom icon font, a nod to our digital roots and full of references to studio culture. There’s a story behind every Ding; they’re one way we bring our humanity into the visual toolkit.' },
      { kind: 'pair', cols: '1fr 1fr',
        left:  { src: 'assets/work/stink/d.jpg', caption: 'Stink Dings — a custom icon font full of studio-culture references' },
        right: { src: 'assets/work/stink/e.jpg', caption: 'Dings in use — treated like emoji, never building blocks' } },
      { kind: 'text', text: 'My role: writing the brief, leading the design and motion teams, and lots of writing for the brand book — ultimate stakeholder. This whole thing was very much my baby.' },
      { kind: 'image', src: 'assets/work/stink/f.jpg', caption: 'A permanent minimum 18% uptick in site traffic from launch — and better vibes' },
      { kind: 'text', text: 'The impact: a permanent minimum 18% uptick in site traffic from launch onward — and the vibes were better. I heard from a lot of people about how clarifying it was to have the brand expressed like this.' }
    ]
  },

  hinge: {
    href: 'hinge.html',
    thumb: 'assets/work/hinge.jpg',
    listTitle: 'Hinge — NFAQ',
    listBlurb: 'A brand answer to the questions dating apps never address.',
    listMeta: 'Brand · 2022',

    index: 'Case 05 / 05',
    eyebrow: 'Brand · 2022 · Hinge',
    title: 'NFAQ',
    hero: { src: 'assets/work/hinge/a.png', alt: 'Hinge — NFAQ' },
    intro: 'Hinge is the dating app designed to be deleted. NFAQ — the Not-So-Frequently Asked Questions — is a brand answer to the questions dating apps never address, turning real dating anxieties into a warm, disarming campaign.',
    blocks: [
      { kind: 'video', src: 'assets/work/loops/hinge-006.mp4', caption: 'NFAQ — the Not-So-Frequently Asked Questions' },
      { kind: 'pair', cols: '1fr 1fr',
        left:  { src: 'assets/work/hinge/b.png', caption: 'Questions dating apps never address' },
        right: { src: 'assets/work/hinge/c.png', caption: 'Warm, disarming, honest' } },
      { kind: 'embed', url: 'VIMEO_ID', caption: 'Campaign film — add your Vimeo link' },
      { kind: 'image', src: 'assets/work/hinge/d.png', caption: 'Designed to be deleted' }
    ]
  }

};
