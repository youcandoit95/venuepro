/* KORTA data — courts, coaches, membership, content (bilingual id/en) */
const COURTS = [
  { id:"centre", name:"Centre Court", type:"indoor", price:280000, img:"images/court-1.jpg",
    surface:{id:"Rumput sintetik premium",en:"Premium synthetic turf"},
    tagline:{id:"Panggung utama, dinding kaca panorama.",en:"The main stage, panoramic glass walls."},
    features:[{id:"Indoor ber-AC",en:"Air-conditioned"},{id:"Lampu turnamen",en:"Tournament lighting"},{id:"Tribun penonton",en:"Spectator seating"}]},
  { id:"sunset", name:"Sunset Court", type:"outdoor", price:220000, img:"images/court-2.jpg",
    surface:{id:"Rumput sintetik outdoor",en:"Outdoor synthetic turf"},
    tagline:{id:"Main di bawah langit golden hour.",en:"Play beneath the golden-hour sky."},
    features:[{id:"Outdoor terbuka",en:"Open-air"},{id:"Lampu sorot malam",en:"Night floodlights"},{id:"Pemandangan terbuka",en:"Open views"}]},
  { id:"arena", name:"Glass Arena", type:"indoor", price:260000, img:"images/court-3.jpg",
    surface:{id:"Rumput sintetik kompetisi",en:"Competition-grade turf"},
    tagline:{id:"Arena kaca penuh untuk laga sengit.",en:"A full glass cage for fierce rallies."},
    features:[{id:"Dinding kaca penuh",en:"Full glass walls"},{id:"Akustik premium",en:"Premium acoustics"},{id:"Siap turnamen",en:"Tournament-ready"}]},
  { id:"terrace", name:"Terrace Court", type:"outdoor", price:180000, img:"images/court-surface.jpg",
    surface:{id:"Rumput sintetik cepat",en:"Fast-pace turf"},
    tagline:{id:"Lapangan latihan favorit pagi hari.",en:"The favourite morning practice court."},
    features:[{id:"Ideal untuk latihan",en:"Ideal for drills"},{id:"Sewa raket gratis",en:"Free racket rental"},{id:"Akses 24/7",en:"24/7 access"}]},
  { id:"panorama", name:"Panorama Court", type:"indoor", price:250000, img:"images/doubles-2.jpg",
    surface:{id:"Rumput sintetik premium",en:"Premium synthetic turf"},
    tagline:{id:"Dinding kaca penuh, sorotan sinematik.",en:"Full glass walls, cinematic lighting."},
    features:[{id:"Indoor ber-AC",en:"Air-conditioned"},{id:"Kaca panorama",en:"Panoramic glass"},{id:"Live-stream siap",en:"Live-stream ready"}]},
  { id:"garden", name:"Garden Court", type:"outdoor", price:200000, img:"images/doubles-1.jpg",
    surface:{id:"Rumput sintetik outdoor",en:"Outdoor synthetic turf"},
    tagline:{id:"Dikelilingi taman, sejuk sepanjang sore.",en:"Garden-wrapped, breezy all evening."},
    features:[{id:"Suasana taman",en:"Garden setting"},{id:"Lampu malam",en:"Night floodlights"},{id:"Area santai",en:"Lounge area"}]},
  { id:"academy", name:"Academy Court", type:"indoor", price:190000, img:"images/padel-action-1.jpg",
    surface:{id:"Rumput sintetik latihan",en:"Training-grade turf"},
    tagline:{id:"Markas coaching dan kelas grup.",en:"Home of coaching and clinics."},
    features:[{id:"Untuk coaching",en:"Coaching-ready"},{id:"Papan analisis",en:"Analysis board"},{id:"Sewa alat gratis",en:"Free gear rental"}]},
  { id:"rooftop", name:"Rooftop Court", type:"outdoor", price:240000, img:"images/court-rooftop.jpg",
    surface:{id:"Rumput sintetik cepat",en:"Fast-pace turf"},
    tagline:{id:"Main di atap kota, langit jadi atapnya.",en:"Play above the city, sky as ceiling."},
    features:[{id:"Pemandangan kota",en:"City views"},{id:"Sunset terbaik",en:"Best sunsets"},{id:"Bar tepi lapangan",en:"Courtside bar"}]},
];

const FOCUS = [
  {key:"technique",label:{id:"Teknik",en:"Technique"}},
  {key:"strategy",label:{id:"Strategi",en:"Strategy"}},
  {key:"serve",label:{id:"Servis",en:"Serve"}},
  {key:"competition",label:{id:"Kompetisi",en:"Competition"}},
  {key:"fitness",label:{id:"Fisik",en:"Fitness"}},
  {key:"junior",label:{id:"Junior",en:"Junior"}},
];

const COACHES = [
  { slug:"raka-pratama", name:"Raka Pratama", img:"images/coach-3.jpg", level:"Pro", focus:["strategy","competition","serve"],
    role:{id:"Head Coach",en:"Head Coach"}, rating:4.9, years:12, sessions:3200, langs:["ID","EN","ES"],
    sp:[{id:"Strategi & taktik",en:"Strategy & tactics"},{id:"Servis & bandeja",en:"Serve & bandeja"}],
    bio:{id:"Mantan pemain nasional yang membawa pendekatan taktis ala World Padel Tour ke setiap sesi. Raka membaca permainan seperti papan catur.",en:"A former national player bringing a World Padel Tour tactical approach to every session. Raka reads the game like a chessboard."},
    cert:["FIP Coach Level 3","WPT Academy","Sport Science S1"], days:["Sen","Rab","Jum","Sab"]},
  { slug:"sinta-halim", name:"Sinta Halim", img:"images/coach-1.jpg", level:"Intermediate", focus:["technique","serve"],
    role:{id:"Technique Coach",en:"Technique Coach"}, rating:4.8, years:8, sessions:2100, langs:["ID","EN"],
    sp:[{id:"Teknik dasar",en:"Core technique"},{id:"Kontrol & sentuhan",en:"Control & touch"}],
    bio:{id:"Spesialis fondasi. Sinta memecah setiap pukulan jadi langkah kecil yang mudah dikuasai pemula maupun pemain menengah.",en:"A fundamentals specialist. Sinta breaks every stroke into small, masterable steps."},
    cert:["FIP Coach Level 2","Padel Federation ID"], days:["Sel","Kam","Sab","Min"]},
  { slug:"maya-wijaya", name:"Maya Wijaya", img:"images/coach-4.jpg", level:"Pro", focus:["strategy","competition"],
    role:{id:"Strategy Coach",en:"Strategy Coach"}, rating:4.9, years:10, sessions:2600, langs:["ID","EN"],
    sp:[{id:"Permainan ganda",en:"Doubles play"},{id:"Positioning",en:"Court positioning"}],
    bio:{id:"Otak di balik banyak pasangan juara klub. Maya mengajarkan cara bergerak sebagai satu unit dan mengunci poin penting.",en:"The brain behind many of the club's winning pairs. Maya teaches you to move as one unit."},
    cert:["FIP Coach Level 3","Doubles Strategy Cert"], days:["Sen","Sel","Jum"]},
  { slug:"nadia-putri", name:"Nadia Putri", img:"images/coach-2.jpg", level:"Beginner", focus:["junior","technique"],
    role:{id:"Junior Development",en:"Junior Development"}, rating:5.0, years:6, sessions:1500, langs:["ID","EN"],
    sp:[{id:"Pengembangan junior",en:"Junior development"},{id:"Motivasi & fun",en:"Motivation & fun"}],
    bio:{id:"Membuat anak-anak jatuh cinta pada padel sejak pukulan pertama. Sabar, ceria, dan terstruktur.",en:"Makes kids fall in love with padel from the first swing. Patient, joyful, structured."},
    cert:["FIP Coach Level 2","Junior Coaching Cert"], days:["Rab","Sab","Min"]},
  { slug:"citra-anggraini", name:"Citra Anggraini", img:"images/coach-6.jpg", level:"Intermediate", focus:["fitness","competition"],
    role:{id:"Fitness & Conditioning",en:"Fitness & Conditioning"}, rating:4.7, years:7, sessions:1800, langs:["ID","EN"],
    sp:[{id:"Kondisi fisik",en:"Conditioning"},{id:"Kelincahan & footwork",en:"Agility & footwork"}],
    bio:{id:"Membangun mesin di balik permainanmu — daya tahan, ledakan, dan footwork yang membuatmu sampai ke setiap bola.",en:"Builds the engine behind your game — endurance, explosiveness, and footwork."},
    cert:["Strength & Conditioning Cert","Sport Science S1"], days:["Sel","Kam","Sab"]},
  { slug:"alya-rahman", name:"Alya Rahman", img:"images/coach-5.jpg", level:"Pro", focus:["competition","serve","strategy"],
    role:{id:"Performance Coach",en:"Performance Coach"}, rating:4.8, years:9, sessions:2400, langs:["ID","EN"],
    sp:[{id:"Mental kompetisi",en:"Competition mindset"},{id:"Smash & vibora",en:"Smash & víbora"}],
    bio:{id:"Mempersiapkan pemain untuk tekanan turnamen — dari ritual pra-laga hingga pukulan penutup yang dingin.",en:"Prepares players for tournament pressure — from pre-match rituals to the finishing shot."},
    cert:["FIP Coach Level 3","Mental Performance Cert"], days:["Sen","Kam","Min"]},
];

const TIERS = [
  { id:"sosial", name:"Sosial", m:250000, y:2500000,
    tagline:{id:"Untuk yang main santai akhir pekan.",en:"For the casual weekend hitter."},
    perks:[{id:"Diskon 10% sewa lapangan",en:"10% off court rental"},{id:"Booking 3 hari ke depan",en:"Book 3 days ahead"},{id:"Akses komunitas KORTA",en:"KORTA community access"},{id:"1 open play / bulan",en:"1 open-play / month"}]},
  { id:"klub", name:"Klub", m:650000, y:6500000, rec:true,
    tagline:{id:"Pilihan member paling populer.",en:"The most popular membership."},
    perks:[{id:"Diskon 25% sewa lapangan",en:"25% off court rental"},{id:"Booking 7 hari ke depan",en:"Book 7 days ahead"},{id:"4 open play / bulan",en:"4 open-play / month"},{id:"1 coaching grup / bulan",en:"1 group coaching / month"},{id:"Sewa raket & bola gratis",en:"Free racket & ball rental"}]},
  { id:"pro", name:"Pro", m:1200000, y:12000000,
    tagline:{id:"Untuk yang serius mengejar level.",en:"For those chasing the next level."},
    perks:[{id:"Diskon 40% sewa lapangan",en:"40% off court rental"},{id:"Booking 14 hari ke depan",en:"Book 14 days ahead"},{id:"Open play tanpa batas",en:"Unlimited open play"},{id:"2 coaching privat / bulan",en:"2 private coaching / month"},{id:"Prioritas slot prime-time",en:"Priority prime-time slots"},{id:"Undangan turnamen member",en:"Member tournament invites"}]},
];

const STATS = [
  {v:8, s:"", l:{id:"Lapangan premium",en:"Premium courts"}},
  {v:2400, s:"+", l:{id:"Member aktif",en:"Active members"}},
  {v:64000, s:"+", l:{id:"Jam dimainkan",en:"Hours played"}},
  {v:18, s:"", l:{id:"Turnamen / tahun",en:"Tournaments / year"}},
];

const MANIFESTO = {
  lead:{id:"Bukan sekadar lapangan.",en:"More than a court."},
  lines:[
    {id:"KORTA adalah ritual sore — tempat tanah, keringat, dan tawa bertemu.",en:"KORTA is an evening ritual — where ground, sweat, and laughter meet."},
    {id:"Empat dinding kaca, satu komunitas, dan permainan yang membuatmu kembali.",en:"Four glass walls, one community, and a game that keeps calling you back."},
  ],
  pillars:[
    {t:{id:"Komunitas",en:"Community"},b:{id:"Ratusan member yang main, tumbuh, dan menang bersama.",en:"Hundreds of members who play, grow, and win together."}},
    {t:{id:"Lapangan kelas turnamen",en:"Tournament courts"},b:{id:"Kaca panorama, rumput premium, pencahayaan presisi.",en:"Panoramic glass, premium turf, precision lighting."}},
    {t:{id:"Coaching pro",en:"Pro coaching"},b:{id:"Dari pukulan pertama hingga panggung turnamen.",en:"From your first swing to the tournament stage."}},
  ],
};

const GALLERY = [
  {src:"images/court-2.jpg",alt:{id:"Lapangan saat golden hour",en:"Court at golden hour"}},
  {src:"images/detail-rackets-1.jpg",alt:{id:"Raket dan bola padel",en:"Padel rackets and balls"}},
  {src:"images/detail-rackets-2.jpg",alt:{id:"Detail raket di lapangan",en:"Racket detail on court"}},
  {src:"images/detail-grip.jpg",alt:{id:"Genggaman raket",en:"Racket grip"}},
  {src:"images/court-3.jpg",alt:{id:"Arena kaca",en:"Glass arena"}},
  {src:"images/detail-ball.jpg",alt:{id:"Bola di lapangan",en:"Ball on court"}},
  {src:"images/court-1.jpg",alt:{id:"Centre court",en:"Centre court"}},
  {src:"images/detail-ball2.jpg",alt:{id:"Bola padel close-up",en:"Padel ball close-up"}},
];

const TESTIMONIALS = [
  {q:{id:"Dari belum pernah pegang raket sampai ikut turnamen member — semua di KORTA. Komunitasnya bikin nagih.",en:"From never holding a racket to playing a member tournament — all at KORTA. The community is addictive."},nm:"Gita Anjani",ro:{id:"Member Klub",en:"Klub Member"}},
  {q:{id:"Lapangannya kelas turnamen dan booking-nya gampang banget. Coach-nya benar-benar paham cara mengajar.",en:"Tournament-grade courts and booking is effortless. The coaches truly know how to teach."},nm:"Reza Maulana",ro:{id:"Member Pro",en:"Pro Member"}},
  {q:{id:"Sore di KORTA jadi agenda wajib keluarga kami. Anak-anak senang, kami pun makin sehat.",en:"An evening at KORTA is now a family ritual. The kids love it and we're fitter than ever."},nm:"Dewi & Arman",ro:{id:"Member Sosial",en:"Sosial Members"}},
];

const MARQUEE = ["PADEL","KORTA","GOLDEN HOUR","GLASS COURTS","COMMUNITY","TANAH LAPANG","JIWA JUARA"];

const CLUB = {
  address:{id:"Jl. Senopati No. 88, Jakarta Selatan",en:"Jl. Senopati No. 88, South Jakarta"},
  hours:[{d:{id:"Sen–Jum",en:"Mon–Fri"},t:"06:00 — 23:00"},{d:{id:"Sab–Min",en:"Sat–Sun"},t:"05:00 — 24:00"}],
  phone:"+62 811 8000 555", email:"main@korta.padel",
};

/* UI strings */
const T = {
  nav:{courts:{id:"Lapangan",en:"Courts"},booking:{id:"Booking",en:"Booking"},coaches:{id:"Coach",en:"Coaches"},membership:{id:"Membership",en:"Membership"}},
};
