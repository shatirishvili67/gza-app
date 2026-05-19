import { useEffect, useMemo, useState } from "react";
import "./App.css";
import heroImg from "./hero-georgia.jpg";

/* ============ i18n ============ */
const T = {
  brand: { ka: "გზა", en: "Gza" },
  tagline: { ka: "გზამკვლევი საქართველოში", en: "Your guide to Georgia" },
  nav: {
    home: { ka: "მთავარი", en: "Home" },
    routes: { ka: "მარშრუტები", en: "Routes" },
    tips: { ka: "რჩევები", en: "Tips" },
    planner: { ka: "დამგეგმავი", en: "Planner" },
  },
  hero: {
    eyebrow: { ka: "აღმოაჩინე საქართველო", en: "Discover Georgia" },
    title: { ka: "მთები, ღვინო, ისტორია — ერთ გზაზე", en: "Mountains, wine, history — on one path" },
    subtitle: {
      ka: "ხელით შერჩეული მარშრუტები, ლოკალური რჩევები და მარტივი მოგზაურობის დამგეგმავი.",
      en: "Hand-picked routes, local tips and a simple trip planner.",
    },
    ctaRoutes: { ka: "მარშრუტების ნახვა", en: "Explore routes" },
    ctaPlanner: { ka: "მოგზაურობის დაგეგმვა", en: "Plan a trip" },
  },
  home: {
    featuredTitle: { ka: "რჩეული მარშრუტები", en: "Featured routes" },
    featuredSub: { ka: "სამი დღიდან ერთ კვირამდე", en: "From 3 days to a week" },
    quickTipsTitle: { ka: "სასარგებლო რჩევები", en: "Useful tips" },
    seeAll: { ka: "ყველას ნახვა", en: "See all" },
  },
  routesPage: {
    title: { ka: "მარშრუტები", en: "Tourist Routes" },
    subtitle: {
      ka: "კლასიკური და ნაკლებად ცნობილი მიმართულებები.",
      en: "Classic and off-beat itineraries — by length, season and vibe.",
    },
    addToPlanner: { ka: "გეგმაში დამატება", en: "Add to planner" },
    inPlanner: { ka: "გეგმაშია", en: "In planner" },
    days: { ka: "დღე", en: "days" },
    highlights: { ka: "მთავარი", en: "Highlights" },
  },
  tipsPage: {
    title: { ka: "სასარგებლო რჩევები", en: "Useful Tips" },
    subtitle: {
      ka: "ის, რაც ნამდვილად გამოგადგება — ფული, ტრანსპორტი, კერძი და კულტურა.",
      en: "What actually matters — money, transport, food and culture.",
    },
  },
  plannerPage: {
    title: { ka: "მოგზაურობის დამგეგმავი", en: "Trip Planner" },
    subtitle: {
      ka: "შეადგინე საკუთარი მარშრუტი. შენახული ხარ ბრაუზერში.",
      en: "Build your own itinerary. Saved in your browser.",
    },
    tripName: { ka: "მოგზაურობის სახელი", en: "Trip name" },
    startDate: { ka: "დაწყების თარიღი", en: "Start date" },
    days: { ka: "დღეები", en: "Days" },
    addStop: { ka: "გაჩერების დამატება", en: "Add stop" },
    stopName: { ka: "ადგილის სახელი", en: "Place" },
    stopNote: { ka: "შენიშვნა", en: "Note" },
    empty: {
      ka: "გეგმა ცარიელია. დაამატე გაჩერებები ან აირჩიე მარშრუტიდან.",
      en: "Your plan is empty. Add stops or pick one from the routes.",
    },
    summary: { ka: "ჯამი", en: "Summary" },
    stops: { ka: "გაჩერებები", en: "stops" },
    clear: { ka: "გასუფთავება", en: "Clear" },
    export: { ka: "ექსპორტი", en: "Export" },
  },
  footer: { note: { ka: "გული საქართველოში — გზა ყველგან.", en: "Heart in Georgia — paths everywhere." } },
};

function tr(path, lang) {
  const entry = path.split(".").reduce((o, k) => (o ? o[k] : undefined), T);
  if (!entry) return path;
  if (typeof entry === "string") return entry;
  return entry[lang] ?? entry.en ?? path;
}
const pick = (b, lang) => b[lang] ?? b.en;

/* ============ Content ============ */
const ROUTES = [
  {
    id: "tbilisi-classic", emoji: "🏛️",
    title: { ka: "თბილისის კლასიკა", en: "Classic Tbilisi" },
    region: { ka: "თბილისი", en: "Tbilisi" },
    days: 3, season: { ka: "მთელი წელი", en: "All year" },
    vibe: { ka: "ქალაქი · ისტორია · აბანო", en: "City · history · baths" },
    summary: {
      ka: "ძველი ქალაქი, ნარიყალა, აბანოები და თანამედროვე ღამის ცხოვრება.",
      en: "Old town, Narikala fortress, sulphur baths and modern nightlife.",
    },
    highlights: [
      { ka: "ნარიყალას ციხე", en: "Narikala Fortress" },
      { ka: "აბანოთუბანი", en: "Abanotubani sulphur baths" },
      { ka: "მთაწმინდის პარკი", en: "Mtatsminda Park" },
      { ka: "ფაბრიკა — დიზაინ კვარტალი", en: "Fabrika design quarter" },
    ],
  },
  {
    id: "kazbegi", emoji: "🏔️",
    title: { ka: "ყაზბეგი და მთა", en: "Kazbegi & the High Caucasus" },
    region: { ka: "მცხეთა-მთიანეთი", en: "Mtskheta-Mtianeti" },
    days: 2, season: { ka: "მაისი–ოქტომბერი", en: "May–October" },
    vibe: { ka: "მთა · ჰაიკი · სილამაზე", en: "Alpine · hiking · awe" },
    summary: {
      ka: "სამხედრო გზა, გუდაური, გერგეტის სამება და მყინვარწვერი.",
      en: "Military road, Gudauri, Gergeti Trinity Church and Mt. Kazbek.",
    },
    highlights: [
      { ka: "ჟინვალის წყალსაცავი", en: "Jinvali reservoir" },
      { ka: "ანანურის კომპლექსი", en: "Ananuri complex" },
      { ka: "ჯვრის უღელტეხილი", en: "Cross Pass viewpoint" },
      { ka: "გერგეტის სამება", en: "Gergeti Trinity Church" },
    ],
  },
  {
    id: "kakheti-wine", emoji: "🍷",
    title: { ka: "კახეთის ღვინის გზა", en: "Kakheti Wine Route" },
    region: { ka: "კახეთი", en: "Kakheti" },
    days: 3, season: { ka: "მაისი–ოქტომბერი", en: "May–October" },
    vibe: { ka: "ღვინო · სუფრა · მზე", en: "Wine · feast · sunshine" },
    summary: {
      ka: "სიღნაღი, ალავერდი, თელავი — 8000 წლის ღვინის ტრადიცია.",
      en: "Sighnaghi, Alaverdi, Telavi — 8000 years of winemaking.",
    },
    highlights: [
      { ka: "სიღნაღი — სიყვარულის ქალაქი", en: "Sighnaghi — city of love" },
      { ka: "ბოდბის მონასტერი", en: "Bodbe Monastery" },
      { ka: "ალავერდის ტაძარი", en: "Alaverdi Cathedral" },
      { ka: "ქვევრის დეგუსტაცია მარანში", en: "Qvevri tasting in a marani" },
    ],
  },
  {
    id: "svaneti", emoji: "🗼",
    title: { ka: "სვანეთის კოშკები", en: "Svaneti Towers" },
    region: { ka: "ზემო სვანეთი", en: "Upper Svaneti" },
    days: 4, season: { ka: "ივნისი–სექტემბერი", en: "June–September" },
    vibe: { ka: "ველური · უძველესი · ცხელი", en: "Wild · ancient · soulful" },
    summary: {
      ka: "მესტია, უშგული — ევროპის ერთ-ერთი უმაღლესი დასახლება.",
      en: "Mestia, Ushguli — one of Europe's highest inhabited villages.",
    },
    highlights: [
      { ka: "მესტიის კოშკები", en: "Mestia tower houses" },
      { ka: "უშგული — UNESCO", en: "Ushguli — UNESCO site" },
      { ka: "შხარის მყინვარი", en: "Shkhara glacier view" },
      { ka: "კორულდის ტბები", en: "Koruldi Lakes hike" },
    ],
  },
  {
    id: "batumi", emoji: "🌊",
    title: { ka: "ბათუმი და შავი ზღვა", en: "Batumi & the Black Sea" },
    region: { ka: "აჭარა", en: "Adjara" },
    days: 3, season: { ka: "ივნისი–სექტემბერი", en: "June–September" },
    vibe: { ka: "ზღვა · სუბტროპიკები · ღამე", en: "Sea · subtropics · nightlife" },
    summary: {
      ka: "ბათუმის ბულვარი, ბოტანიკური ბაღი და მთის სოფლები.",
      en: "Batumi boulevard, botanical garden and mountain villages.",
    },
    highlights: [
      { ka: "ბათუმის ბულვარი", en: "Batumi Boulevard" },
      { ka: "ბოტანიკური ბაღი", en: "Botanical Garden" },
      { ka: "მახუნცეთის ჩანჩქერი", en: "Makhuntseti Waterfall" },
      { ka: "გონიო-აფსაროსი", en: "Gonio-Apsaros fortress" },
    ],
  },
  {
    id: "vardzia", emoji: "🪨",
    title: { ka: "სამცხე და ვარძია", en: "Samtskhe & Vardzia" },
    region: { ka: "სამცხე-ჯავახეთი", en: "Samtskhe-Javakheti" },
    days: 2, season: { ka: "აპრილი–ნოემბერი", en: "April–November" },
    vibe: { ka: "გამოქვაბული · ისტორია · ვულკანი", en: "Caves · history · volcanoes" },
    summary: {
      ka: "ვარძიის გამოქვაბული ქალაქი, რაბათი და ბორჯომი.",
      en: "Vardzia cave city, Rabati fortress and Borjomi.",
    },
    highlights: [
      { ka: "ვარძია — XII საუკუნე", en: "Vardzia — 12th century" },
      { ka: "რაბათის ციხე", en: "Rabati Castle" },
      { ka: "ბორჯომის პარკი", en: "Borjomi Central Park" },
      { ka: "ბაკურიანი — ზამთრის კურორტი", en: "Bakuriani winter resort" },
    ],
  },
];

const TIPS = [
  { id: "currency", icon: "💴", category: { ka: "ფული", en: "Money" },
    title: { ka: "ვალუტა — ლარი (₾)", en: "Currency — Lari (₾)" },
    body: { ka: "ბანკომატები ყველგანაა. ბარათი მუშაობს ქალაქებში, მთაში წაიღე ნაღდი.",
      en: "ATMs are everywhere. Cards work in cities; carry cash in the mountains." } },
  { id: "marshrutka", icon: "🚐", category: { ka: "ტრანსპორტი", en: "Transport" },
    title: { ka: "მარშრუტკა — იაფი და სწრაფი", en: "Marshrutka — cheap & fast" },
    body: { ka: "მინი-ავტობუსები ქალაქებს შორის. დიდუბის ან ისნის სადგურიდან.",
      en: "Shared minibuses between cities. Leave from Didube or Isani in Tbilisi." } },
  { id: "bolt", icon: "🚖", category: { ka: "ტრანსპორტი", en: "Transport" },
    title: { ka: "Bolt მუშაობს ყველგან", en: "Bolt works everywhere" },
    body: { ka: "თბილისში 3–7 ლარი მოკლე გადაადგილებისთვის.",
      en: "₾3–7 for short city rides. Skip street taxis — use the app." } },
  { id: "khinkali", icon: "🥟", category: { ka: "კერძი", en: "Food" },
    title: { ka: "ხინკალი — ხელით ჭამე", en: "Khinkali — eat with your hands" },
    body: { ka: "უმაღლესით დაიჭირე, მოწუწნე წვენი, შემდეგ ჭამე.",
      en: "Hold by the top knot, sip the broth first, then bite. Don't eat the knot." } },
  { id: "wine", icon: "🍷", category: { ka: "კერძი", en: "Food" },
    title: { ka: "ქვევრის ღვინო", en: "Qvevri wine" },
    body: { ka: "ნახე საფერავი (წითელი) და რქაწითელი (ქარვისფერი).",
      en: "Try Saperavi (red) and Rkatsiteli (amber). Best in small family wineries." } },
  { id: "toast", icon: "🥂", category: { ka: "კულტურა", en: "Culture" },
    title: { ka: "თამადა და სადღეგრძელო", en: "The toastmaster (tamada)" },
    body: { ka: "სუფრაზე თამადა წარმართავს. დაელოდე მის სიტყვას — შემდეგ დალიე.",
      en: "At a feast, the tamada leads the toasts. Wait for his words, then drink." } },
  { id: "church", icon: "⛪", category: { ka: "კულტურა", en: "Culture" },
    title: { ka: "ეკლესიაში ჩაცმა", en: "Dress code at churches" },
    body: { ka: "ქალები — თავსაბურავი და ქვედა ნაწილი დაფარული. კაცები — გრძელი შარვალი.",
      en: "Women: head covering & skirt. Men: long trousers. Shawls often provided." } },
  { id: "language", icon: "🗣️", category: { ka: "ენა", en: "Language" },
    title: { ka: "სამი სასარგებლო სიტყვა", en: "Three useful words" },
    body: { ka: "გამარჯობა (hello), მადლობა (thanks), გაუმარჯოს (cheers).",
      en: "Gamarjoba (hello), Madloba (thanks), Gaumarjos (cheers)." } },
  { id: "safety", icon: "🛡️", category: { ka: "უსაფრთხოება", en: "Safety" },
    title: { ka: "უსაფრთხო ქვეყანა", en: "A safe country" },
    body: { ka: "დანაშაულის დონე დაბალია. მთაში ამინდი იცვლება სწრაფად.",
      en: "Crime rates are low. In the mountains, weather flips fast — bring layers." } },
  { id: "sim", icon: "📶", category: { ka: "კავშირი", en: "Connectivity" },
    title: { ka: "SIM ბარათი აეროპორტში", en: "SIM at the airport" },
    body: { ka: "Magti, Geocell ან Beeline — 20–30 ლარი თვეში.",
      en: "Magti, Geocell or Beeline — ₾20–30/month. 4G even in mountain villages." } },
];

/* ============ App ============ */
const PAGES = ["home", "routes", "tips", "planner"];
const LANG_KEY = "gza:lang";
const PLAN_KEY = "gza:plan:v1";
const DEFAULT_PLAN = { name: "", startDate: "", days: 5, stops: [] };

export default function App() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [plan, setPlan] = useState(DEFAULT_PLAN);

  // Load persisted state
  useEffect(() => {
    try {
      const l = localStorage.getItem(LANG_KEY);
      if (l === "ka" || l === "en") setLang(l);
      else if (navigator.language?.toLowerCase().startsWith("ka")) setLang("ka");
      const p = localStorage.getItem(PLAN_KEY);
      if (p) setPlan({ ...DEFAULT_PLAN, ...JSON.parse(p) });
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang); document.documentElement.lang = lang; } catch {}
  }, [lang]);
  useEffect(() => {
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)); } catch {}
  }, [plan]);

  const addStop = (s) =>
    setPlan(p => ({ ...p, stops: [...p.stops, { ...s, id: crypto.randomUUID() }] }));
  const removeStop = (id) =>
    setPlan(p => ({ ...p, stops: p.stops.filter(x => x.id !== id) }));
  const hasRoute = (rid) => plan.stops.some(s => s.routeId === rid);
  const clearPlan = () => setPlan(DEFAULT_PLAN);

  const goRoutes = () => setPage("routes");
  const goPlanner = () => setPage("planner");

  return (
    <div className="app">
      <Header lang={lang} setLang={setLang} page={page} setPage={setPage} />

      {page === "home" && (
        <Home lang={lang} goRoutes={goRoutes} goPlanner={goPlanner} setPage={setPage} />
      )}
      {page === "routes" && (
        <RoutesPage lang={lang} hasRoute={hasRoute} addStop={addStop} />
      )}
      {page === "tips" && <TipsPage lang={lang} />}
      {page === "planner" && (
        <PlannerPage lang={lang} plan={plan} setPlan={setPlan}
          addStop={addStop} removeStop={removeStop} clearPlan={clearPlan} />
      )}

      <Footer lang={lang} />
    </div>
  );
}

/* ============ Header ============ */
function Header({ lang, setLang, page, setPage }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" onClick={() => setPage("home")} style={{ background: "none", border: 0, padding: 0 }}>
          <span className="brand-mark">გ</span>
          <span style={{ textAlign: "left" }}>
            <div className="brand-name">
              {tr("brand", lang)} <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 14 }}>· {lang === "ka" ? "Gza" : "გზა"}</span>
            </div>
            <div className="brand-sub">{tr("tagline", lang)}</div>
          </span>
        </button>

        <nav className="nav">
          {PAGES.map(p => (
            <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>
              {tr(`nav.${p}`, lang)}
            </button>
          ))}
        </nav>

        <div className="lang-toggle">
          {["ka", "en"].map(l => (
            <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>
              {l === "ka" ? "ქარ" : "EN"}
            </button>
          ))}
        </div>
      </div>

      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {PAGES.map(p => (
            <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>
              {tr(`nav.${p}`, lang)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ============ Home ============ */
function Home({ lang, goRoutes, goPlanner, setPage }) {
  const featured = ROUTES.slice(0, 3);
  const quickTips = TIPS.slice(0, 4);
  return (
    <>
      <section className="hero">
        <img src={heroImg} alt="Gergeti Trinity Church beneath Mount Kazbek" className="hero-img" />
        <div className="container hero-content">
          <span className="eyebrow">✦ {tr("hero.eyebrow", lang)}</span>
          <h1>{tr("hero.title", lang)}</h1>
          <p className="lead">{tr("hero.subtitle", lang)}</p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={goRoutes}>{tr("hero.ctaRoutes", lang)} →</button>
            <button className="btn btn-ghost-light" onClick={goPlanner}>{tr("hero.ctaPlanner", lang)}</button>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <h2>{tr("home.featuredTitle", lang)}</h2>
            <div className="muted">{tr("home.featuredSub", lang)}</div>
          </div>
          <button className="link" style={{ background: "none", border: 0 }} onClick={goRoutes}>
            {tr("home.seeAll", lang)} →
          </button>
        </div>
        <div className="grid grid-3">
          {featured.map(r => (
            <button key={r.id} className="card card-link" style={{ textAlign: "left", border: "1px solid var(--border)" }} onClick={goRoutes}>
              <div className="card-emoji">{r.emoji}</div>
              <div className="card-region">📍 {pick(r.region, lang)}</div>
              <h3>{pick(r.title, lang)}</h3>
              <p>{pick(r.summary, lang)}</p>
              <div className="chips">
                <span className="chip chip-muted">{r.days} {tr("routesPage.days", lang)}</span>
                <span className="chip chip-accent">{pick(r.season, lang)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="container section">
          <div className="section-head">
            <h2>{tr("home.quickTipsTitle", lang)}</h2>
            <button className="link" style={{ background: "none", border: 0 }} onClick={() => setPage("tips")}>
              {tr("home.seeAll", lang)} →
            </button>
          </div>
          <div className="grid grid-2">
            {quickTips.map(tip => (
              <div key={tip.id} className="card">
                <div style={{ color: "var(--primary)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  {pick(tip.category, lang)}
                </div>
                <h3 style={{ marginTop: 4, fontSize: 18 }}>{pick(tip.title, lang)}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>{pick(tip.body, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============ Routes ============ */
function RoutesPage({ lang, hasRoute, addStop }) {
  return (
    <main className="container">
      <header className="page-header">
        <h1>{tr("routesPage.title", lang)}</h1>
        <p>{tr("routesPage.subtitle", lang)}</p>
      </header>
      <div className="grid grid-2" style={{ marginTop: 20, marginBottom: 60 }}>
        {ROUTES.map(r => {
          const added = hasRoute(r.id);
          return (
            <article key={r.id} className="card route-card">
              <div className="route-head">
                <div className="card-emoji">{r.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="card-region">📍 {pick(r.region, lang)}</div>
                  <h2 style={{ fontSize: 24 }}>{pick(r.title, lang)}</h2>
                </div>
              </div>
              <p className="route-summary">{pick(r.summary, lang)}</p>
              <div className="chips">
                <span className="chip chip-primary">{r.days} {tr("routesPage.days", lang)}</span>
                <span className="chip chip-accent">{pick(r.season, lang)}</span>
                <span className="chip chip-muted">{pick(r.vibe, lang)}</span>
              </div>
              <div className="highlights">
                <div className="highlights-label">{tr("routesPage.highlights", lang)}</div>
                <ul>
                  {r.highlights.map((h, i) => <li key={i}>{pick(h, lang)}</li>)}
                </ul>
              </div>
              <button
                className={added ? "btn btn-outline" : "btn btn-primary"}
                disabled={added}
                onClick={() => addStop({ name: pick(r.title, lang), note: pick(r.region, lang), routeId: r.id })}
              >
                {added ? `✓ ${tr("routesPage.inPlanner", lang)}` : `+ ${tr("routesPage.addToPlanner", lang)}`}
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
}

/* ============ Tips ============ */
function TipsPage({ lang }) {
  const groups = useMemo(() => {
    return TIPS.reduce((acc, tip) => {
      const k = pick(tip.category, lang);
      (acc[k] ??= []).push(tip);
      return acc;
    }, {});
  }, [lang]);

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <header className="page-header">
        <h1>{tr("tipsPage.title", lang)}</h1>
        <p>{tr("tipsPage.subtitle", lang)}</p>
      </header>
      <div style={{ marginTop: 28 }}>
        {Object.entries(groups).map(([cat, tips]) => (
          <section key={cat} className="tips-group">
            <div className="tips-label">{cat}</div>
            <div className="grid grid-3">
              {tips.map(tip => (
                <div key={tip.id} className="card tip-card">
                  <div className="tip-icon">{tip.icon}</div>
                  <h3>{pick(tip.title, lang)}</h3>
                  <p>{pick(tip.body, lang)}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

/* ============ Planner ============ */
function PlannerPage({ lang, plan, setPlan, addStop, removeStop, clearPlan }) {
  const [stopName, setStopName] = useState("");
  const [stopNote, setStopNote] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const n = stopName.trim();
    if (!n) return;
    addStop({ name: n, note: stopNote.trim() || undefined });
    setStopName(""); setStopNote("");
  };

  const exportPlan = () => {
    const lines = [
      plan.name || "გზა · Gza",
      plan.startDate ? `${tr("plannerPage.startDate", lang)}: ${plan.startDate}` : "",
      `${tr("plannerPage.days", lang)}: ${plan.days}`,
      "",
      ...plan.stops.map((s, i) => `${i + 1}. ${s.name}${s.note ? ` — ${s.note}` : ""}`),
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${(plan.name || "georgia-trip").replace(/\s+/g, "-")}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <header className="page-header">
        <h1>{tr("plannerPage.title", lang)}</h1>
        <p>{tr("plannerPage.subtitle", lang)}</p>
      </header>

      <div className="planner-grid" style={{ marginTop: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <label className="field" style={{ marginBottom: 12 }}>
              <span className="field-label">{tr("plannerPage.tripName", lang)}</span>
              <input value={plan.name} onChange={e => setPlan({ ...plan, name: e.target.value })}
                placeholder={lang === "ka" ? "ჩემი მოგზაურობა" : "My Georgia trip"} />
            </label>
            <div className="row-2">
              <label className="field">
                <span className="field-label">{tr("plannerPage.startDate", lang)}</span>
                <input type="date" value={plan.startDate}
                  onChange={e => setPlan({ ...plan, startDate: e.target.value })} />
              </label>
              <label className="field">
                <span className="field-label">{tr("plannerPage.days", lang)}</span>
                <input type="number" min={1} max={30} value={plan.days}
                  onChange={e => setPlan({ ...plan, days: Math.max(1, Number(e.target.value) || 1) })} />
              </label>
            </div>
          </div>

          <form onSubmit={submit} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label className="field">
              <span className="field-label">{tr("plannerPage.stopName", lang)}</span>
              <input value={stopName} onChange={e => setStopName(e.target.value)}
                placeholder={lang === "ka" ? "მაგ. სიღნაღი" : "e.g. Sighnaghi"} />
            </label>
            <label className="field">
              <span className="field-label">{tr("plannerPage.stopNote", lang)}</span>
              <input value={stopNote} onChange={e => setStopNote(e.target.value)}
                placeholder={lang === "ka" ? "ღვინის დეგუსტაცია" : "Wine tasting"} />
            </label>
            <button type="submit" className="btn btn-primary btn-block">+ {tr("plannerPage.addStop", lang)}</button>
          </form>
        </div>

        <div className="summary-card">
          <div className="summary-head">
            <div style={{ minWidth: 0 }}>
              <div className="summary-eyebrow">{tr("plannerPage.summary", lang)}</div>
              <div className="summary-title">{plan.name || "—"}</div>
              <div className="summary-meta">
                {plan.startDate && <span>📅 {plan.startDate}</span>}
                <span>{plan.days} {tr("plannerPage.days", lang).toLowerCase()}</span>
                <span>{plan.stops.length} {tr("plannerPage.stops", lang)}</span>
              </div>
            </div>
            <div className="summary-actions">
              <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }}
                onClick={exportPlan} disabled={plan.stops.length === 0}>
                ↓ {tr("plannerPage.export", lang)}
              </button>
              <button className="btn btn-quiet" onClick={clearPlan}
                disabled={plan.stops.length === 0 && !plan.name}>
                🗑 {tr("plannerPage.clear", lang)}
              </button>
            </div>
          </div>

          {plan.stops.length === 0 ? (
            <div className="stops-empty">{tr("plannerPage.empty", lang)}</div>
          ) : (
            <ol className="stops">
              {plan.stops.map((s, i) => (
                <li key={s.id} className="stop">
                  <div className="stop-num">{i + 1}</div>
                  <div className="stop-body">
                    <div className="stop-name">{s.name}</div>
                    {s.note && <div className="stop-note">📍 {s.note}</div>}
                  </div>
                  <button className="icon-btn" aria-label="Remove" onClick={() => removeStop(s.id)}>✕</button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </main>
  );
}

function Footer({ lang }) {
  return (
    <footer className="footer">
      <div className="quote">{tr("footer.note", lang)}</div>
      <div style={{ marginTop: 6 }}>© {new Date().getFullYear()} გზა · Gza</div>
    </footer>
  );
}
