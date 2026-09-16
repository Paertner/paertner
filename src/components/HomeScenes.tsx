import type { Site } from "@/lib/content";
import { LinkArrow } from "@/components/ui";

type ServiceItem = { slug: string; title: string; short: string; intro: string; deliverables: { label: string }[] };
export function Entrance({ site }: { site: Site }) {
  return (
    <section id="entrance" className="entrance" data-sc-act="scrub" data-sc-span="2.85" data-sc-dwell="0.12" aria-labelledby="hero-title">
      <div className="entrance-stage" data-sc-stage>
        <div className="entrance-film" aria-hidden="true">
          {site.heroPoster?.url && <img className="sc-stage__poster" src={site.heroPoster.url} alt="" width="1764" height="1176" fetchPriority="high" />}
          <video data-sc-scrub data-sc-src="/video/paertner-atmosphere.mp4" data-sc-src-mobile="/video/paertner-atmosphere-mobile.mp4" data-sc-lerp="0.2" muted playsInline preload="none" tabIndex={-1} />
        </div>
        <div className="entrance-shade" aria-hidden="true" />
        <div className="entrance-copy" data-sc-cue="0 0.43 0 0.22" data-sc-rise="0">
          <p className="entrance-position">Web development & digital marketing</p>
          <h1 id="hero-title">{site.heroTitle}</h1>
          <p className="entrance-description">{site.heroDescription}</p>
          <LinkArrow href="/book">Book a call</LinkArrow>
        </div>
        <a href="#services" className="entrance-services">Explore our services <span aria-hidden="true">↘</span></a>
        <p className="entrance-resolution" data-sc-cue="0.44 1 0.06 0.08" data-sc-rise="0">The whole picture.<br /><span>Built together.</span></p>
      </div>
    </section>
  );
}

export function SearchArtwork() {
  return (
    <div className="search-artwork" role="group" aria-label="An illustrative search preview connected to Paertner's service page">
      <div className="search-query"><span aria-hidden="true">⌕</span><span>web development and digital marketing</span></div>
      <div className="search-result">
        <a className="search-brand" href="/services"><img src="/brand/mark.svg" width="38" height="22" alt="" /><span>Paertner<small>paertner.com › services</small></span></a>
        <p className="search-title"><a href="/services">Your next digital move starts here.</a></p>
        <p>Websites, search and campaigns. One connected partner for the way your business grows.</p>
        <div className="search-sitelinks"><a href="/services/websites-web-apps">Web development</a><a href="/services/seo">SEO</a><a href="/services/digital-marketing">Digital marketing</a></div>
      </div>
      <div className="search-connection" aria-hidden="true" />
      <div className="search-destination" data-sc-reveal="up" data-sc-reveal-at="0.12 0.72">
        <div className="destination-nav"><img src="/brand/wordmark.svg" alt="" width="100" height="25" /><span>Built around your next move.</span></div>
        <div className="destination-body"><span className="destination-headline">Find.<br />Connect.<br /><em>Grow.</em></span><div className="destination-side"><span>From the first search<br />to the next conversation.</span><a className="destination-action" href="/book">Book a call <span aria-hidden="true">↗</span></a></div></div>
      </div>
      <p className="artwork-note">Illustrative search preview. No ranking claim.</p>
    </div>
  );
}

export function Discovery({ service }: { service: ServiceItem }) {
  return (
    <section id="discovery" className="discovery" data-sc-act="pin" data-sc-span="2.05" data-sc-adaptive="flow" aria-labelledby="discovery-title">
      <div className="discovery-stage" data-sc-stage>
        <div className="discovery-copy">
          <h2 id="discovery-title">{service.short}</h2>
          <p>{service.intro}</p>
          <LinkArrow href="/services/seo">Explore SEO</LinkArrow>
        </div>
        <SearchArtwork />
        <div className="discovery-footer"><span>Search intent</span><span>Useful content</span><span>Technical foundations</span></div>
      </div>
    </section>
  );
}

export function CampaignArtwork({ variant = "social" }: { variant?: "social" | "paid" | "brand" }) {
  return (
    <div className={"campaign-art campaign-art--" + variant}>
      <img className="campaign-brand" src={variant === "social" ? "/brand/wordmark.svg" : "/brand/wordmark-light.svg"} width="130" height="32" alt="Paertner" />
      {variant === "social" ? <div className="campaign-message">Good ideas<br />deserve<br /><em>an audience.</em></div> : variant === "paid" ? <div className="campaign-message">Make<br />the next<br /><em>click count.</em></div> : <div className="campaign-message">One voice.<br />Every<br /><em>touchpoint.</em></div>}
      <div className="campaign-footer"><span>Marketing meets making.</span><img src="/brand/mark.svg" width="90" height="48" alt="" /></div>
    </div>
  );
}

export function Campaigns({ services }: { services: ServiceItem[] }) {
  const slugs = ["social-media", "paid-media", "brand-content"];
  return (
    <section className="campaigns" data-sc-act="pan" data-sc-span="2.8" data-sc-adaptive="flow" aria-labelledby="campaign-title">
      <div className="campaign-stage" data-sc-stage>
        <div className="campaign-rail" data-sc-pan="0">
          <div className="campaign-lead">
            <h2 id="campaign-title">One idea.<br />A wider<br /><em>world.</em></h2>
            <p>A recognizable voice. The right channels. A reason to take the next step.</p>
            <LinkArrow href="/services/digital-marketing">Explore digital marketing</LinkArrow>
          </div>
          {slugs.map((slug, index) => {
            const s = services.find((item) => item.slug === slug);
            if (!s) return null;
            return <article className="campaign-panel" key={slug}>
              <a href={"/services/" + slug} className="campaign-visual-link"><CampaignArtwork variant={(["social", "paid", "brand"] as const)[index]} /></a>
              <div className="campaign-caption"><h3><a href={"/services/" + slug}>{s.title}</a></h3><p>{s.short}</p></div>
            </article>;
          })}
          <div className="campaign-end"><img src="/brand/mark.svg" alt="" width="130" height="68" /><p>From the message<br />to the destination.</p><LinkArrow href="/book?service=Digital%20marketing">Connect your marketing</LinkArrow></div>
        </div>
      </div>
    </section>
  );
}

export function Capabilities({ services }: { services: ServiceItem[] }) {
  return <section id="services" className="services-section connected-services wrap" data-sc-act="flow">
    <div className="section-heading"><h2>Your next move.<br /><span>Our shared focus.</span></h2><p>Explore a single discipline or bring the whole picture together.</p></div>
    <div className="service-ledger" data-sc-in data-sc-stagger="45">
      {services.map(s => <a className="service-row" key={s.slug} href={"/services/" + s.slug}><h3>{s.title}</h3><span className="service-short">{s.short}</span><span className="row-arrow" aria-hidden="true">↗</span></a>)}
    </div>
  </section>;
}

