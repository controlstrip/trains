import { useState, useEffect, useRef, useCallback } from "react";

// ─── Metro Data ────────────────────────────────────────────────────────────
const METRO_DATA = {
  cities: [
    {
      name: "Washington, D.C.", system: "WMATA Metro", icon: "🏛️",
      lines: [
        { name: "Red Line", color: "#BF0D3E", textColor: "#ffffff", abbr: "RD",
          directionLabels: { forward: "Glenmont", backward: "Shady Grove" },
          transfers: { "Metro Center": ["BL","OR","SV"], "Gallery Place-Chinatown": ["GR","YL"], "Fort Totten": ["GR","YL"] },
          stations: ["Shady Grove","Rockville","Twinbrook","North Bethesda","Grosvenor-Strathmore","Medical Center","Bethesda","Friendship Heights","Tenleytown-AU","Van Ness-UDC","Cleveland Park","Woodley Park","Dupont Circle","Farragut North","Metro Center","Gallery Place-Chinatown","Judiciary Square","Union Station","NoMa-Gallaudet U","Rhode Island Ave","Brookland-CUA","Fort Totten","Takoma","Silver Spring","Forest Glen","Wheaton","Glenmont"] },
        { name: "Blue Line", color: "#009CDE", textColor: "#ffffff", abbr: "BL",
          directionLabels: { forward: "Downtown Largo", backward: "Franconia-Springfield" },
          transfers: { "Metro Center": ["RD","OR","SV"], "L'Enfant Plaza": ["GR","YL","OR","SV"], "Rosslyn": ["OR","SV"] },
          stations: ["Franconia-Springfield","Van Dorn Street","King Street-Old Town","Braddock Road","Ronald Reagan Washington National Airport","Crystal City","Pentagon City","Pentagon","Arlington Cemetery","Rosslyn","Foggy Bottom-GWU","Farragut West","McPherson Square","Metro Center","Federal Triangle","Smithsonian","L'Enfant Plaza","Federal Center SW","Capitol South","Eastern Market","Potomac Ave","Stadium-Armory","Benning Road","Capitol Heights","Addison Road","Morgan Boulevard","Downtown Largo"] },
        { name: "Orange Line", color: "#ED8B00", textColor: "#000000", abbr: "OR",
          directionLabels: { forward: "New Carrollton", backward: "Vienna" },
          transfers: { "Metro Center": ["RD","BL","SV"], "Rosslyn": ["BL","SV"], "L'Enfant Plaza": ["GR","YL","BL","SV"] },
          stations: ["Vienna","Dunn Loring","West Falls Church","East Falls Church","Ballston-MU","Virginia Square-GMU","Clarendon","Court House","Rosslyn","Foggy Bottom-GWU","Farragut West","McPherson Square","Metro Center","Federal Triangle","Smithsonian","L'Enfant Plaza","Federal Center SW","Capitol South","Eastern Market","Potomac Ave","Stadium-Armory","Minnesota Ave","Deanwood","Cheverly","Landover","New Carrollton"] },
        { name: "Silver Line", color: "#919D9D", textColor: "#000000", abbr: "SV",
          directionLabels: { forward: "Downtown Largo", backward: "Ashburn" },
          transfers: { "Metro Center": ["RD","BL","OR"], "L'Enfant Plaza": ["GR","YL","BL","OR"], "Rosslyn": ["BL","OR"] },
          stations: ["Ashburn","Loudoun Gateway","Washington Dulles International Airport","Innovation Center","Herndon","Reston Town Center","Wiehle-Reston East","Spring Hill","Greensboro","Tysons","McLean","East Falls Church","Ballston-MU","Virginia Square-GMU","Clarendon","Court House","Rosslyn","Foggy Bottom-GWU","Farragut West","McPherson Square","Metro Center","Federal Triangle","Smithsonian","L'Enfant Plaza","Federal Center SW","Capitol South","Eastern Market","Potomac Ave","Stadium-Armory","Minnesota Ave","Deanwood","Cheverly","Landover","New Carrollton","Downtown Largo"] },
        { name: "Green Line", color: "#00B140", textColor: "#ffffff", abbr: "GR",
          directionLabels: { forward: "Greenbelt", backward: "Branch Ave" },
          transfers: { "Gallery Place-Chinatown": ["RD"], "Fort Totten": ["RD"], "L'Enfant Plaza": ["BL","OR","SV"] },
          stations: ["Branch Ave","Suitland","Naylor Road","Southern Ave","Congress Heights","Anacostia","Navy Yard-Ballpark","Waterfront","L'Enfant Plaza","Archives","Gallery Place-Chinatown","Mt Vernon Square","Shaw-Howard U","U Street","Columbia Heights","Georgia Ave-Petworth","Fort Totten","West Hyattsville","Hyattsville Crossing","College Park-U of Md","Greenbelt"] },
        { name: "Yellow Line", color: "#FFD100", textColor: "#000000", abbr: "YL",
          directionLabels: { forward: "Mt Vernon Square", backward: "Huntington" },
          transfers: { "Gallery Place-Chinatown": ["RD","GR"], "L'Enfant Plaza": ["BL","OR","SV","GR"] },
          stations: ["Huntington","Eisenhower Ave","King Street-Old Town","Braddock Road","Ronald Reagan Washington National Airport","Crystal City","Pentagon City","Pentagon","L'Enfant Plaza","Archives","Gallery Place-Chinatown","Mt Vernon Square"] }
      ]
    },
    {
      name: "Chicago", system: "CTA 'L'", icon: "🌬️",
      lines: [
        { name: "Red Line", color: "#C60C30", textColor: "#ffffff", abbr: "Red",
          directionLabels: { forward: "95th/Dan Ryan", backward: "Howard" },
          transfers: { "Howard": ["P"], "Belmont": ["Brn"], "Fullerton": ["Brn"], "Clark/Lake": ["Blue","Brn","G","Org","P"] },
          stations: ["Howard","Jarvis","Morse","Loyola","Granville","Thorndale","Bryn Mawr","Berwyn","Argyle","Lawrence","Wilson","Sheridan","Addison","Belmont","Fullerton","North/Clybourn","Clark/Division","Chicago","Grand","Lake","Monroe","Jackson","Harrison","Roosevelt","Cermak-Chinatown","Sox-35th","47th","Garfield","63rd","69th","79th","87th","95th/Dan Ryan"] },
        { name: "Blue Line", color: "#00A1DE", textColor: "#ffffff", abbr: "Blue",
          directionLabels: { forward: "Forest Park", backward: "O'Hare" },
          transfers: { "Clark/Lake": ["Red","Brn","G","Org","P"] },
          stations: ["O'Hare","Rosemont","Cumberland","Harlem","Jefferson Park","Montrose","Irving Park","Addison","Belmont","Logan Square","California","Western","Damen","Division","Chicago","Grand","Clark/Lake","Washington","Monroe","Jackson","LaSalle","Clinton","UIC-Halsted","Racine","Illinois Medical District","Western","Kedzie-Homan","Pulaski","Cicero","Austin","Oak Park","Harlem","Forest Park"] },
        { name: "Brown Line", color: "#62361B", textColor: "#ffffff", abbr: "Brn",
          directionLabels: { forward: "Loop", backward: "Kimball" },
          transfers: { "Clark/Lake": ["Red","Blue","G","Org","P"], "Fullerton": ["Red"] },
          stations: ["Kimball","Kedzie","Francisco","Rockwell","Western","Damen","Montrose","Irving Park","Addison","Paulina","Southport","Belmont","Wellington","Diversey","Fullerton","Armitage","Sedgwick","Chicago","Merchandise Mart","Washington/Wabash","Adams/Wabash","Harold Washington Library","LaSalle/Van Buren","Quincy","Washington/Wells"] },
        { name: "Green Line", color: "#009B3A", textColor: "#ffffff", abbr: "G",
          directionLabels: { forward: "Cottage Grove", backward: "Harlem/Lake" },
          transfers: { "Clark/Lake": ["Red","Blue","Brn","Org","P"] },
          stations: ["Harlem/Lake","Oak Park","Ridgeland","Austin","Central","Laramie","Cicero","Pulaski","Conservatory","Kedzie","California","Ashland","Morgan","Clinton","Clark/Lake","State/Lake","Washington/Wabash","Adams/Wabash","Roosevelt","Cermak-McCormick Place","35th-Bronzeville-IIT","Indiana","43rd","47th","51st","Garfield","Halsted","Ashland/63rd","King Drive","Cottage Grove"] },
        { name: "Orange Line", color: "#F9461C", textColor: "#ffffff", abbr: "Org",
          directionLabels: { forward: "Loop", backward: "Midway" },
          transfers: { "Clark/Lake": ["Red","Blue","Brn","G","P"] },
          stations: ["Midway","Pulaski","Kedzie","Western","35th/Archer","Ashland","Halsted","Roosevelt","Harold Washington Library","LaSalle/Van Buren","Quincy","Washington/Wells","Clark/Lake","State/Lake","Washington/Wabash","Adams/Wabash"] },
        { name: "Purple Line", color: "#522398", textColor: "#ffffff", abbr: "P",
          directionLabels: { forward: "Howard", backward: "Linden" },
          transfers: { "Howard": ["Red"] },
          stations: ["Linden","Central","Noyes","Foster","Davis","Dempster","Main","South Boulevard","Howard"] }
      ]
    },
    {
      name: "New York City", system: "MTA Subway", icon: "🗽",
      lines: [
        { name: "1 Line", color: "#EE352E", textColor: "#ffffff", abbr: "①",
          directionLabels: { forward: "South Ferry", backward: "Van Cortlandt Park" },
          transfers: { "Times Sq-42 St": ["②","③","⑦","Ⓐ","Ⓒ","Ⓔ"], "34 St-Penn Station": ["②","③","Ⓐ","Ⓒ","Ⓔ"] },
          stations: ["Van Cortlandt Park-242 St","238 St","231 St","Marble Hill-225 St","215 St","207 St","Dyckman St","191 St","181 St","168 St","157 St","145 St","137 St-City College","125 St","116 St-Columbia University","Cathedral Pkwy-110 St","103 St","96 St","86 St","79 St","72 St","66 St-Lincoln Center","59 St-Columbus Circle","50 St","Times Sq-42 St","34 St-Penn Station","28 St","23 St","18 St","14 St","Christopher St-Sheridan Sq","Houston St","Canal St","Franklin St","Chambers St","Cortlandt St","Rector St","South Ferry"] },
        { name: "7 Line", color: "#B933AD", textColor: "#ffffff", abbr: "⑦",
          directionLabels: { forward: "34 St-Hudson Yards", backward: "Flushing-Main St" },
          transfers: { "Times Sq-42 St": ["①","②","③","Ⓐ","Ⓒ","Ⓔ"], "Grand Central-42 St": ["④","⑤","⑥"] },
          stations: ["Flushing-Main St","Mets-Willets Point","111 St","103 St-Corona Plaza","Junction Blvd","90 St-Elmhurst Ave","82 St-Jackson Hts","74 St-Broadway","69 St","61 St-Woodside","52 St","46 St-Bliss St","40 St-Lowery St","33 St-Rawson St","Queensboro Plaza","Court Sq","Hunters Point Ave","Vernon Blvd-Jackson Ave","Grand Central-42 St","Times Sq-42 St","34 St-Hudson Yards"] },
        { name: "A Line", color: "#0039A6", textColor: "#ffffff", abbr: "Ⓐ",
          directionLabels: { forward: "Howard Beach-JFK Airport", backward: "Inwood-207 St" },
          transfers: { "42 St-Port Authority": ["①","②","③","⑦"], "Jay St-MetroTech": ["Ⓕ","Ⓖ","Ⓡ"] },
          stations: ["Inwood-207 St","Dyckman St","190 St","181 St","175 St","168 St","145 St","125 St","59 St-Columbus Circle","42 St-Port Authority","34 St-Penn Station","14 St","West 4 St-Washington Sq","Spring St","Canal St","Fulton St","Chambers St","High St","Jay St-MetroTech","Hoyt-Schermerhorn Sts","Nostrand Ave","Kingston-Throop Aves","Utica Ave","Ralph Ave","Rockaway Blvd","Howard Beach-JFK Airport"] },
        { name: "L Line", color: "#A7A9AC", textColor: "#000000", abbr: "Ⓛ",
          directionLabels: { forward: "Canarsie-Rockaway Pkwy", backward: "8 Ave" },
          transfers: { "Union Sq-14 St": ["④","⑤","⑥","Ⓝ","Ⓠ","Ⓡ"], "Broadway Junction": ["Ⓐ","Ⓒ"] },
          stations: ["8 Ave","6 Ave","Union Sq-14 St","3 Ave","1 Ave","Bedford Ave","Lorimer St","Graham Ave","Grand St","Montrose Ave","Morgan Ave","Jefferson St","DeKalb Ave","Myrtle-Wyckoff Aves","Halsey St","Wilson Ave","Bushwick Ave-Aberdeen St","Broadway Junction","Atlantic Ave","Sutter Ave","Livonia Ave","New Lots Ave","East 105 St","Canarsie-Rockaway Pkwy"] },
        { name: "6 Line", color: "#00933C", textColor: "#ffffff", abbr: "⑥",
          directionLabels: { forward: "Brooklyn Bridge-City Hall", backward: "Pelham Bay Park" },
          transfers: { "Grand Central-42 St": ["④","⑤","⑦"], "Union Sq-14 St": ["④","⑤","Ⓝ","Ⓠ","Ⓡ","Ⓛ"] },
          stations: ["Pelham Bay Park","Buhre Ave","Middletown Rd","Westchester Sq-E Tremont Ave","Zerega Ave","Castle Hill Ave","Parkchester","St Lawrence Ave","Morrison Ave-Soundview","Elder Ave","Whitlock Ave","Hunts Point Ave","Longwood Ave","E 149 St","E 143 St-St Mary's St","Cypress Ave","Brook Ave","3 Ave-138 St","125 St","116 St","110 St","103 St","96 St","86 St","77 St","68 St-Hunter College","Lexington Ave-59 St","51 St","Grand Central-42 St","33 St","28 St","23 St","Astor Place","Bleecker St","Spring St","Canal St","Brooklyn Bridge-City Hall"] }
      ]
    },
    {
      name: "Atlanta", system: "MARTA", icon: "🍑",
      lines: [
        { name: "Red Line", color: "#CE242B", textColor: "#ffffff", abbr: "R",
          directionLabels: { forward: "Airport", backward: "North Springs" },
          transfers: { "Five Points": ["G","B","Gr"], "Lindbergh Center": ["G"] },
          stations: ["North Springs","Sandy Springs","Dunwoody","Medical Center","Buckhead","Lindbergh Center","Arts Center","Midtown","North Ave","Civic Center","Peachtree Center","Five Points","Garnett","West End","Oakland City","Lakewood/Ft. McPherson","East Point","College Park","Airport"] },
        { name: "Gold Line", color: "#D4A723", textColor: "#000000", abbr: "G",
          directionLabels: { forward: "Airport", backward: "Doraville" },
          transfers: { "Five Points": ["R","B","Gr"], "Lindbergh Center": ["R"] },
          stations: ["Doraville","Chamblee","Brookhaven/Oglethorpe","Lenox","Lindbergh Center","Arts Center","Midtown","North Ave","Civic Center","Peachtree Center","Five Points","Garnett","West End","Oakland City","Lakewood/Ft. McPherson","East Point","College Park","Airport"] },
        { name: "Blue Line", color: "#009FDA", textColor: "#ffffff", abbr: "B",
          directionLabels: { forward: "Indian Creek", backward: "Hamilton E. Holmes" },
          transfers: { "Five Points": ["R","G","Gr"] },
          stations: ["Hamilton E. Holmes","West Lake","Ashby","Vine City","GWCC/CNN Center","Five Points","Georgia State","King Memorial","Inman Park/Reynoldstown","Edgewood/Candler Park","East Lake","Decatur","Avondale","Kensington","Indian Creek"] },
        { name: "Green Line", color: "#009A44", textColor: "#ffffff", abbr: "Gr",
          directionLabels: { forward: "Edgewood/Candler Park", backward: "Bankhead" },
          transfers: { "Five Points": ["R","G","B"] },
          stations: ["Bankhead","Ashby","Vine City","GWCC/CNN Center","Five Points","Georgia State","King Memorial","Inman Park/Reynoldstown","Edgewood/Candler Park"] }
      ]
    },
    {
      name: "San Francisco", system: "BART", icon: "🌉",
      lines: [
        { name: "Red Line", color: "#ED1C24", textColor: "#ffffff", abbr: "R",
          directionLabels: { forward: "Millbrae", backward: "Richmond" },
          transfers: { "MacArthur": ["Y","O"], "Embarcadero": ["Y","B","G","O"] },
          stations: ["Richmond","El Cerrito del Norte","El Cerrito Plaza","North Berkeley","Downtown Berkeley","Ashby","MacArthur","19th St/Oakland","12th St/Oakland City Center","West Oakland","Embarcadero","Montgomery St","Powell St","Civic Center/UN Plaza","16th St Mission","24th St Mission","Glen Park","Balboa Park","Daly City","Colma","South San Francisco","San Bruno","Millbrae"] },
        { name: "Yellow Line", color: "#FFB81C", textColor: "#000000", abbr: "Y",
          directionLabels: { forward: "Millbrae/SFO", backward: "Antioch" },
          transfers: { "MacArthur": ["R","O"], "12th St/Oakland City Center": ["R","O"] },
          stations: ["Antioch","Pittsburg Center","Pittsburg/Bay Point","Concord","Pleasant Hill/Contra Costa Centre","Walnut Creek","Lafayette","Orinda","Rockridge","MacArthur","19th St/Oakland","12th St/Oakland City Center","West Oakland","Embarcadero","Montgomery St","Powell St","Civic Center/UN Plaza","16th St Mission","24th St Mission","Glen Park","Balboa Park","Daly City","Colma","South San Francisco","San Bruno","SFO Airport","Millbrae"] },
        { name: "Blue Line", color: "#0099D8", textColor: "#ffffff", abbr: "B",
          directionLabels: { forward: "Daly City", backward: "Dublin/Pleasanton" },
          transfers: { "Embarcadero": ["R","Y","G","O"] },
          stations: ["Dublin/Pleasanton","West Dublin/Pleasanton","Castro Valley","Bay Fair","San Leandro","Coliseum","Fruitvale","Lake Merritt","West Oakland","Embarcadero","Montgomery St","Powell St","Civic Center/UN Plaza","16th St Mission","24th St Mission","Glen Park","Balboa Park","Daly City"] },
        { name: "Green Line", color: "#4DB848", textColor: "#ffffff", abbr: "G",
          directionLabels: { forward: "Daly City", backward: "Berryessa/North San Jose" },
          transfers: { "Embarcadero": ["R","Y","B","O"] },
          stations: ["Berryessa/North San Jose","Milpitas","Warm Springs/South Fremont","Fremont","Union City","South Hayward","Hayward","Bay Fair","San Leandro","Coliseum","Fruitvale","Lake Merritt","West Oakland","Embarcadero","Montgomery St","Powell St","Civic Center/UN Plaza","16th St Mission","24th St Mission","Glen Park","Balboa Park","Daly City"] },
        { name: "Orange Line", color: "#F58220", textColor: "#000000", abbr: "O",
          directionLabels: { forward: "Berryessa/North San Jose", backward: "Richmond" },
          transfers: { "MacArthur": ["R","Y"], "12th St/Oakland City Center": ["R","Y"] },
          stations: ["Richmond","El Cerrito del Norte","El Cerrito Plaza","North Berkeley","Downtown Berkeley","Ashby","MacArthur","19th St/Oakland","12th St/Oakland City Center","Lake Merritt","Fruitvale","Coliseum","San Leandro","Bay Fair","Hayward","South Hayward","Union City","Fremont","Warm Springs/South Fremont","Milpitas","Berryessa/North San Jose"] }
      ]
    }
  ]
};

// ─── IndexedDB helpers ─────────────────────────────────────────────────────
const DB_NAME = "MetroSoundboard", DB_VER = 1, STORE = "recordings";
function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
    r.onsuccess = e => res(e.target.result);
    r.onerror = () => rej(r.error);
  });
}
async function saveRec(key, blob) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}
async function loadRec(key) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).get(key);
    r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error);
  });
}
async function listRecKeys(prefix) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).getAllKeys();
    r.onsuccess = () => res((r.result || []).filter(k => k.startsWith(prefix)));
    r.onerror = () => rej(r.error);
  });
}

// ─── Airport helpers ───────────────────────────────────────────────────────
const AIRPORT_STATION_NAMES = new Set(["O'Hare", "Midway"]);
const isAirportStation = name => name.includes("Airport") || AIRPORT_STATION_NAMES.has(name);

function getAllAirports() {
  const seen = new Set();
  const result = [];
  METRO_DATA.cities.forEach((city, ci) => {
    city.lines.forEach((line, li) => {
      line.stations.forEach((station, si) => {
        if (isAirportStation(station) && !seen.has(station)) {
          seen.add(station);
          result.push({ station, cityName: city.name, system: city.system, cityIdx: ci, lineIdx: li, stationIdx: si, color: line.color, lineName: line.name });
        }
      });
    });
  });
  return result;
}

// ─── Speech ────────────────────────────────────────────────────────────────
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
function speak(text, onStart, onEnd) {
  if (!synth) return Promise.resolve();
  synth.cancel();
  return new Promise(res => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.88; u.pitch = 1.0;
    const vs = synth.getVoices();
    const pref = vs.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Samantha")))
      || vs.find(v => v.lang.startsWith("en")) || vs[0];
    if (pref) u.voice = pref;
    u.onstart = onStart;
    u.onend = () => { onEnd?.(); res(); };
    u.onerror = () => { onEnd?.(); res(); };
    synth.speak(u);
  });
}
if (typeof speechSynthesis !== "undefined") speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[880, 0], [660, 0.45]].forEach(([freq, start]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.7);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.75);
    });
    return new Promise(r => setTimeout(r, 1300));
  } catch { return Promise.resolve(); }
}

function playElevatorDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine"; osc.frequency.value = 1046.5;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.start(); osc.stop(ctx.currentTime + 1.5);
    return new Promise(r => setTimeout(r, 600));
  } catch { return Promise.resolve(); }
}

// ─── Waveform ──────────────────────────────────────────────────────────────
function Waveform({ active }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:2, height:18, opacity:active?1:0, transition:"opacity 0.2s", flexShrink:0 }}>
      {[...Array(10)].map((_,i) => (
        <span key={i} style={{ display:"block", width:2.5, background:"#4cc9f0", borderRadius:2,
          height:`${6+Math.sin(i*0.9)*6}px`,
          animation: active ? `wv ${0.4+(i%3)*0.12}s ${i*0.04}s ease-in-out infinite alternate` : "none"
        }}/>
      ))}
      <style>{`@keyframes wv{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`}</style>
    </span>
  );
}

// ─── Transfer badge ────────────────────────────────────────────────────────
function TBadge({ abbr, cityLines }) {
  const line = cityLines.find(l => l.abbr === abbr);
  if (!line) return <span style={{fontSize:8,color:"#555",marginRight:2}}>{abbr}</span>;
  return <span style={{display:"inline-block",fontSize:8,fontWeight:700,padding:"1px 3px",borderRadius:2,background:line.color,color:line.textColor,marginRight:2,fontFamily:"monospace"}}>{abbr}</span>;
}

// ─── SVG Line Diagram — snake layout with curved row connectors ────────────
function LineDiagram({ stations, color, selectedIndex, transfers, cityLines, onSelect, isTraveling, travelFromIdx, travelPct }) {
  const ref = useRef(null);
  const [W, setW] = useState(600);
  useEffect(() => {
    const ob = new ResizeObserver(es => setW(es[0].contentRect.width || 600));
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  const STATION_W = 90, ROW_H = 105, DOT_Y = 30, PAD = 8;
  const maxPerRow = Math.max(3, Math.floor((W - PAD * 2) / STATION_W));
  // Pick the perRow (≤ maxPerRow) that makes the last row as full as possible
  let perRow = maxPerRow, bestScore = -1;
  for (let p = maxPerRow; p >= 3; p--) {
    const last = stations.length % p || p;
    const score = last / p;
    if (score > bestScore) { bestScore = score; perRow = p; }
  }

  // Build rows (snake: even rows L→R, odd rows R→L)
  const rows = [];
  for (let i = 0; i < stations.length; i += perRow)
    rows.push(stations.slice(i, i+perRow).map((s,j) => ({ name: s, gi: i+j })));

  const svgH = rows.length * ROW_H + 20;

  const getX = (ri, pi, len) => {
    const L = PAD + STATION_W/2, R = W - PAD - STATION_W/2;
    const span = R - L, sp = len>1 ? span/(len-1) : 0;
    const p = ri%2===1 ? len-1-pi : pi;
    return L + p*sp;
  };
  const getY = ri => 12 + ri*ROW_H + DOT_Y;

  const pos = [];
  for (let r=0; r<rows.length; r++)
    for (let p=0; p<rows[r].length; p++)
      pos.push({ x: getX(r,p,rows[r].length), y: getY(r) });

  // Build smooth SVG path
  let d = "";
  for (let i=0; i<pos.length-1; i++) {
    const c = pos[i], n = pos[i+1];
    const sameRow = rows.findIndex(row=>row.some(s=>s.gi===i)) === rows.findIndex(row=>row.some(s=>s.gi===i+1));
    if (i===0) d = `M${c.x},${c.y}`;
    if (sameRow) {
      d += ` L${n.x},${n.y}`;
    } else {
      // U-bend: bow control points outward so the curve visibly arcs around the corner
      const offset = Math.min(W * 0.07, 50);
      const bx = c.x > W / 2 ? c.x + offset : c.x - offset;
      d += ` C${bx},${c.y} ${bx},${n.y} ${n.x},${n.y}`;
    }
  }

  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={W} height={svgH} style={{display:"block",overflow:"visible"}}>
        <defs>
          <filter id="trainGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.9"/>
          </filter>
        </defs>
        {d && <path d={d} fill="none" stroke={color} strokeWidth={4} strokeOpacity={0.65} strokeLinejoin="round" strokeLinecap="round"/>}
        {/* Traveling train emoji sliding along the path */}
        {(() => {
          if (travelFromIdx == null || travelPct == null || travelFromIdx < 0 || travelFromIdx >= pos.length - 1) return null;
          const c = pos[travelFromIdx], n = pos[travelFromIdx + 1];
          const t = travelPct;
          const sameRow = Math.floor(travelFromIdx / perRow) === Math.floor((travelFromIdx + 1) / perRow);
          let tx, ty;
          if (sameRow) {
            tx = c.x + (n.x - c.x) * t;
            ty = c.y;
          } else {
            const offset = Math.min(W * 0.07, 50);
            const bx = c.x > W / 2 ? c.x + offset : c.x - offset;
            const mt = 1 - t;
            tx = mt*mt*mt*c.x + 3*mt*mt*t*bx + 3*mt*t*t*bx + t*t*t*n.x;
            ty = mt*mt*mt*c.y + 3*mt*mt*t*c.y + 3*mt*t*t*n.y + t*t*t*n.y;
          }
          return (
            <g key="train" style={{pointerEvents:"none"}}>
              <circle cx={tx} cy={ty} r={13} fill="#000" fillOpacity={0.55}/>
              <text x={tx} y={ty+6} textAnchor="middle" fontSize={15}
                style={{userSelect:"none"}}
                filter="url(#trainGlow)">🚇</text>
            </g>
          );
        })()}
        {pos.map((p,i) => {
          const name = stations[i];
          const active = selectedIndex === i;
          const tList = (transfers && transfers[name]) || [];
          const hasT = tList.length > 0;
          return (
            <g key={i} onClick={() => !isTraveling && onSelect(i)} style={{cursor: isTraveling?"not-allowed":"pointer"}}>
              {/* Pulse ring when active */}
              {active && <circle cx={p.x} cy={p.y} r={16} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.35}/>}
              {/* Dot */}
              <circle cx={p.x} cy={p.y} r={active?10:hasT?7:5}
                fill={active?"#fff":hasT?"#fff":"#0a0d14"}
                stroke={color} strokeWidth={active?3:2}/>
              {/* Transfer pip */}
              {hasT && !active && <circle cx={p.x+10} cy={p.y-10} r={3.5} fill="#4cc9f0"/>}
              {/* Airport indicator */}
              {isAirportStation(name) && (
                <text x={p.x} y={p.y-20} textAnchor="middle" fontSize={14} fill="#4cc9f0"
                  style={{pointerEvents:"none",userSelect:"none"}}>✈</text>
              )}
              {/* Label */}
              <text x={p.x} y={p.y+26} textAnchor="middle" fontSize={11}
                fill={active?"#fff":"#8a8a9a"} fontWeight={active?"700":"400"}
                fontFamily="DM Mono,monospace" style={{pointerEvents:"none",userSelect:"none"}}>
                {name.length>17 ? name.slice(0,16)+"…" : name}
              </text>
              {/* Transfer badges — centered */}
              {(() => {
                const vis = tList.slice(0,3);
                const totalW = vis.length * 17 - 2;
                return (<>
                  {vis.map((ab,ti) => {
                    const tl = cityLines.find(l=>l.abbr===ab);
                    if (!tl) return null;
                    return <rect key={ti} x={p.x - totalW/2 + ti*17} y={p.y+38} width={15} height={13} rx={3} fill={tl.color}/>;
                  })}
                  {vis.map((ab,ti) => {
                    const tl = cityLines.find(l=>l.abbr===ab);
                    if (!tl) return null;
                    return <text key={`t${ti}`} x={p.x - totalW/2 + ti*17 + 7.5} y={p.y+49} fontSize={9}
                      fill={tl.textColor} fontFamily="monospace" fontWeight="700" textAnchor="middle"
                      style={{pointerEvents:"none"}}>{ab.length>2?ab.slice(0,2):ab}</text>;
                  })}
                </>);
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Travel progress bar ───────────────────────────────────────────────────
function TravelBar({ from, to, progress, lineColor }) {
  const pct = Math.min(100, Math.max(0, progress * 100));
  return (
    <div style={{padding:"10px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
        <span style={{color:"#fff",fontWeight:600}}>{from}</span>
        <span style={{color:"#666"}}>{to}</span>
      </div>
      <div style={{position:"relative",height:34,margin:"0 12px"}}>
        {/* Track bg */}
        <div style={{position:"absolute",top:"50%",left:0,right:0,height:5,background:"#1e1e2e",borderRadius:3,transform:"translateY(-50%)"}}>
          <div style={{height:"100%",width:`${pct}%`,background:lineColor,borderRadius:3,transition:"width 0.05s linear"}}/>
        </div>
        {/* Origin dot */}
        <div style={{position:"absolute",top:"50%",left:0,width:12,height:12,borderRadius:"50%",background:lineColor,transform:"translate(-50%,-50%)"}}/>
        {/* Dest dot */}
        <div style={{position:"absolute",top:"50%",right:0,width:12,height:12,borderRadius:"50%",background:"#222",border:`2.5px solid ${lineColor}`,transform:"translate(50%,-50%)"}}/>
        {/* Train emoji sliding along track */}
        <div style={{
          position:"absolute", top:"50%",
          left:`${pct}%`,
          transform:"translate(-50%,-60%)",
          fontSize:22, lineHeight:1,
          filter:`drop-shadow(0 0 8px ${lineColor})`,
          transition:"left 0.05s linear", zIndex:2
        }}>🚇</div>
      </div>
      <div style={{textAlign:"center",fontSize:11,color:"#444",marginTop:8}}>
        {pct<100 ? `${Math.round(pct)}% en route…` : "✓ Arrived"}
      </div>
    </div>
  );
}

// ─── Voice Recorder ────────────────────────────────────────────────────────
function VoiceRecorder({ lineData, cityLines }) {
  const lineKey = `${lineData.city}/${lineData.name}`;
  const sampleS = lineData.stations[Math.floor(lineData.stations.length/2)];
  const sampleN = lineData.stations[Math.floor(lineData.stations.length/2)+1];

  const [micStatus, setMicStatus] = useState("checking");
  const [recs, setRecs] = useState({});
  const [recording, setRecording] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);

  const prompts = [
    { id:"arriving",   label:"Arriving at station", script:`"Now arriving… ${sampleS}."` },
    { id:"doors-open", label:"Doors opening",        script:`"Doors opening. Please stand clear of the doors."` },
    { id:"doors-close",label:"Doors closing",        script:`"Step back. Doors closing."` },
    { id:"next",       label:"Next station",         script:`"Next station… ${sampleN}."` },
  ];

  useEffect(() => {
    (async () => {
      // Don't enumerate devices pre-permission — browsers often hide mic devices
      // until access is granted. Let getUserMedia handle errors instead.
      setMicStatus(navigator.mediaDevices?.getUserMedia ? "ok" : "none");
      try {
        const keys = await listRecKeys(lineKey+"/");
        const loaded = {};
        for (const k of keys) {
          const blob = await loadRec(k);
          if (blob) loaded[k.split("/")[2]] = URL.createObjectURL(blob);
        }
        setRecs(loaded);
      } catch {}
    })();
  }, [lineKey]);

  const startRec = async (id) => {
    if (micStatus==="none"||micStatus==="denied") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      setMicStatus("ok");
      const mr = new MediaRecorder(stream);
      mrRef.current = mr; chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t=>t.stop());
        const blob = new Blob(chunksRef.current, {type:"audio/webm"});
        const url = URL.createObjectURL(blob);
        setRecs(r => ({...r,[id]:url}));
        try { await saveRec(`${lineKey}/${id}`, blob); } catch {}
      };
      mr.start(); setRecording(true); setActiveId(id);
    } catch(err) {
      if (err.name==="NotAllowedError"||err.name==="PermissionDeniedError") setMicStatus("denied");
      else if (err.name==="NotFoundError") setMicStatus("none");
      else alert("Microphone error: "+err.message);
    }
  };

  const stopRec = () => {
    mrRef.current?.stop(); setRecording(false); setActiveId(null);
  };

  return (
    <div style={{background:"#0a0d14",border:"1px solid #1e1e2e",borderRadius:10,padding:16,marginTop:14}}>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,color:"#4cc9f0",marginBottom:10}}>
        🎙 Custom Announcements — {lineData.name}
      </div>
      {micStatus==="none" && (
        <div style={{background:"#1a0000",border:"1px solid #cc000055",borderRadius:8,padding:10,marginBottom:12,fontSize:12,color:"#ff8888"}}>
          ⚠️ No microphone detected on this device. Connect a mic and reload to use recordings.
        </div>
      )}
      {micStatus==="denied" && (
        <div style={{background:"#1a0000",border:"1px solid #cc000055",borderRadius:8,padding:10,marginBottom:12,fontSize:12,color:"#ff8888"}}>
          ⚠️ Microphone access denied. Allow it in browser settings and reload.
        </div>
      )}
      {(micStatus==="ok"||micStatus==="checking"||micStatus==="unknown") && (
        <>
          <p style={{fontSize:11,color:"#444",marginBottom:12,lineHeight:1.6}}>
            Recordings are saved in your browser (IndexedDB) — they persist across reloads, per line.
          </p>
          {prompts.map(pr => {
            const hasRec = !!recs[pr.id];
            const active = recording && activeId===pr.id;
            return (
              <div key={pr.id} style={{border:"1px solid #1e1e2e",borderRadius:8,padding:10,marginBottom:8,background:active?"#1a0505":"#0d1117"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#bbb",marginBottom:3}}>{pr.label}</div>
                <div style={{fontSize:10,color:"#444",fontStyle:"italic",marginBottom:8}}>Say: {pr.script}</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                  {active ? (
                    <button onClick={stopRec} style={{background:"#cc0000",color:"#fff",border:"none",padding:"5px 12px",borderRadius:6,cursor:"pointer",fontSize:11}}>⏹ Stop</button>
                  ) : (
                    <button onClick={()=>startRec(pr.id)} disabled={micStatus==="none"||micStatus==="denied"} style={{background:"#111827",border:"1px solid #333",color:"#ccc",padding:"5px 12px",borderRadius:6,cursor:"pointer",fontSize:11,opacity:(micStatus==="none"||micStatus==="denied")?0.4:1}}>
                      {hasRec ? "🔴 Re-record" : "🎙 Record"}
                    </button>
                  )}
                  {hasRec && !active && (
                    <>
                      <button onClick={()=>new Audio(recs[pr.id]).play()} style={{background:"#0c2d3f",border:"1px solid #4cc9f033",color:"#4cc9f0",padding:"5px 12px",borderRadius:6,cursor:"pointer",fontSize:11}}>▶ Play</button>
                      <span style={{fontSize:10,color:"#4caf50"}}>✓ Saved</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── Station Panel ─────────────────────────────────────────────────────────
function StationPanel({ selectedIndex, lineData, cityLines, isTraveling, isAutoPlaying, isPlaying, onDepart, onPlay, onFly, onTransfer }) {
  const ref = useRef(null);
  const [showRec, setShowRec] = useState(false);
  const [showFlights, setShowFlights] = useState(false);
  const { stations, color, name: lineName, system, directionLabels, transfers } = lineData;
  const sel = stations[selectedIndex];
  const prev = selectedIndex>0 ? stations[selectedIndex-1] : null;
  const next = selectedIndex<stations.length-1 ? stations[selectedIndex+1] : null;
  const tList = (transfers && transfers[sel]) || [];

  // Scroll panel into view with 80px top offset so diagram stays partially visible
  useEffect(() => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0,top), behavior:"smooth" });
  }, [selectedIndex]);

  const anns = [
    { label:`🔔 Now arriving: ${sel}`, text:`Now arriving… ${sel}.`, bg:"#0c2d3f", bd:"#4cc9f033" },
    { label:`📍 You are now at ${sel}`, text:`You are now at ${sel}. ${lineName}, ${system}.`, bg:"#0c2f1f", bd:"#72efdd33" },
    next && { label:`→ Next: ${next}`, text:`Next station… ${next}.`, bg:"#2f1a00", bd:"#f4a26133" },
    prev && { label:`← Next: ${prev}`, text:`Next station… ${prev}.`, bg:"#2f2a00", bd:"#e9c46a33" },
    { label:"🚪 Doors opening", text:"Doors opening. Please stand clear of the doors.", bg:"#200030", bd:"#c77dff33" },
    { label:"⚠️ Doors closing", text:"Step back. Doors closing.", bg:"#2f1500", bd:"#ff9f1c33" },
    (selectedIndex===0||selectedIndex===stations.length-1) && { label:"🏁 Last stop", text:`This is ${sel}. This is the last stop on this train. All passengers must exit. Thank you for riding ${system}.`, bg:"#2f0010", bd:"#ef476f33" },
    (selectedIndex===0||selectedIndex===stations.length-1) && { label:`🔄 Service to ${selectedIndex===0?stations[stations.length-1]:stations[0]}`, text:`This train is now in service to ${selectedIndex===0?stations[stations.length-1]:stations[0]}. ${lineName}.`, bg:"#002f1a", bd:"#06d6a033" },
    tList.length>0 && { label:"🔀 Transfer available", text:`Transfer is available at ${sel}. Please check station signage for connecting services.`, bg:"#2f0a0a", bd:"#ff6b6b33" },
  ].filter(Boolean);

  return (
    <div ref={ref} style={{
      background:"#0d1117", border:`1px solid ${color}44`, borderRadius:12,
      padding:20, marginTop:-6, position:"relative", zIndex:2,
      boxShadow:`0 0 40px ${color}18`
    }}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <div style={{width:5,height:38,borderRadius:2,background:color,flexShrink:0,marginTop:2}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,letterSpacing:0.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {isAirportStation(sel) && <span style={{color:"#4cc9f0",marginRight:6}}>✈</span>}{sel}
          </div>
          {tList.length>0 && (
            <div style={{display:"flex",alignItems:"center",gap:3,marginTop:4,flexWrap:"wrap"}}>
              <span style={{fontSize:10,color:"#555"}}>Transfer:</span>
              {tList.map(a=><TBadge key={a} abbr={a} cityLines={cityLines}/>)}
            </div>
          )}
        </div>
        <Waveform active={isPlaying}/>
      </div>

      {/* Depart buttons */}
      {!isAutoPlaying && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          {prev && directionLabels && (
            <button onClick={()=>onDepart(selectedIndex-1)} disabled={isTraveling} style={{background:"#111827",border:`1px solid ${color}44`,color:"#ddd",padding:"8px 13px",borderRadius:8,cursor:isTraveling?"not-allowed":"pointer",fontSize:11,lineHeight:1.5,opacity:isTraveling?0.5:1,fontFamily:"inherit",textAlign:"left"}}>
              🚇 Depart to {prev}
              <div style={{fontSize:9,color:"#666",marginTop:2}}>toward {directionLabels.backward}</div>
            </button>
          )}
          {next && directionLabels && (
            <button onClick={()=>onDepart(selectedIndex)} disabled={isTraveling} style={{background:"#111827",border:`1px solid ${color}44`,color:"#ddd",padding:"8px 13px",borderRadius:8,cursor:isTraveling?"not-allowed":"pointer",fontSize:11,lineHeight:1.5,opacity:isTraveling?0.5:1,fontFamily:"inherit",textAlign:"left"}}>
              🚇 Depart to {next}
              <div style={{fontSize:9,color:"#666",marginTop:2}}>toward {directionLabels.forward}</div>
            </button>
          )}
        </div>
      )}

      {/* Transfer buttons */}
      {tList.length > 0 && !isAutoPlaying && (() => {
        const options = tList.map(abbr => {
          const li = cityLines.findIndex(l => l.abbr === abbr);
          if (li === -1) return null;
          const line = cityLines[li];
          const si = line.stations.indexOf(sel);
          if (si === -1) return null;
          return { abbr, li, si, line };
        }).filter(Boolean);
        return options.length > 0 ? (
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {options.map(({li, si, line}) => (
              <button key={line.abbr} onClick={() => onTransfer(li, si)} disabled={isTraveling}
                style={{background:line.color,color:line.textColor,border:"none",padding:"8px 14px",borderRadius:8,cursor:isTraveling?"not-allowed":"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",opacity:isTraveling?0.5:1,lineHeight:1.5,textAlign:"left"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=isTraveling?"0.5":"0.85"}
                onMouseLeave={e=>e.currentTarget.style.opacity=isTraveling?"0.5":"1"}
              >
                🔀 Transfer to {line.name}
                <div style={{fontSize:9,fontWeight:400,marginTop:2,opacity:0.8}}>{line.stations.length} stations</div>
              </button>
            ))}
          </div>
        ) : null;
      })()}

      {/* Announcements */}
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
        {anns.map((a,i)=>(
          <button key={i} onClick={()=>onPlay(a.text)} style={{background:a.bg,border:`1px solid ${a.bd}`,color:"#ddd",padding:"7px 11px",borderRadius:8,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Fly to another airport */}
      {isAirportStation(sel) && (
        <div style={{marginBottom:8}}>
          <button onClick={()=>setShowFlights(f=>!f)} style={{background:showFlights?"#0c1f2f":"transparent",border:"1px solid #222",color:"#60a0d0",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:11}}>
            {showFlights?"▾":"▸"} ✈ Fly to another airport
          </button>
          {showFlights && (
            <div style={{background:"#0a0d14",border:"1px solid #1e1e2e",borderRadius:10,padding:14,marginTop:8,display:"flex",flexDirection:"column",gap:8}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,color:"#60a0d0",marginBottom:4}}>Select a destination</div>
              {getAllAirports().filter(a => a.station !== sel).map(a => (
                <button key={a.station} onClick={()=>{ onFly(a.cityIdx, a.lineIdx, a.stationIdx); setShowFlights(false); }}
                  style={{background:"#0d1117",border:`2px solid ${a.color}44`,borderRadius:8,padding:"10px 14px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#ddd",display:"flex",alignItems:"center",gap:10}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=a.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=`${a.color}44`}
                >
                  <div style={{width:8,height:8,borderRadius:"50%",background:a.color,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>✈ {a.station}</div>
                    <div style={{fontSize:10,color:"#555",marginTop:2}}>{a.cityName} — {a.lineName}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recorder toggle */}
      <button onClick={()=>setShowRec(r=>!r)} style={{background:showRec?"#1a1030":"transparent",border:"1px solid #222",color:"#666",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:11}}>
        {showRec?"▾":"▸"} 🎙 Custom Voice Recorder
      </button>
      {showRec && <VoiceRecorder lineData={lineData} cityLines={cityLines}/>}
    </div>
  );
}

// ─── Station View ──────────────────────────────────────────────────────────
function StationView({ lineData, cityLines, onBack, initialStationIdx, onFly, onTransfer }) {
  const [selIdx, setSelIdx] = useState(initialStationIdx ?? null);
  const [playing, setPlaying] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [travelFrom, setTravelFrom] = useState(null);
  const [travelTo, setTravelTo] = useState(null);
  const [travelFromIdx, setTravelFromIdx] = useState(null);
  const [travelPct, setTravelPct] = useState(0);
  const [traveling, setTraveling] = useState(false);
  const [travelSec, setTravelSec] = useState(10);
  const [chimesEnabled, setChimesEnabled] = useState(true);
  const autoRef = useRef(false);
  const rafRef = useRef(null);
  const { stations, color, name: lineName, system, city, directionLabels } = lineData;

  const startTravel = useCallback((fromIdx) => {
    if (fromIdx >= stations.length-1) return;
    const toIdx = fromIdx+1;
    setTravelFrom(stations[fromIdx]); setTravelTo(stations[toIdx]);
    setTravelFromIdx(fromIdx);
    setTravelPct(0); setTraveling(true);
    const t0 = Date.now(), dur = travelSec*1000;
    const tick = () => {
      const p = Math.min((Date.now()-t0)/dur, 1);
      setTravelPct(p);
      if (p<1) rafRef.current = requestAnimationFrame(tick);
      else { setTraveling(false); setTravelFrom(null); setTravelTo(null); setTravelFromIdx(null); setSelIdx(toIdx); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stations, travelSec]);

  const cancelTravel = () => { cancelAnimationFrame(rafRef.current); setTraveling(false); setTravelFrom(null); setTravelTo(null); setTravelFromIdx(null); };

  const startAuto = useCallback(async (dir) => {
    setAutoPlaying(true); autoRef.current = true;
    const idxs = dir==="forward" ? stations.map((_,i)=>i) : stations.map((_,i)=>stations.length-1-i);
    for (let step=0; step<idxs.length; step++) {
      if (!autoRef.current) break;
      const i = idxs[step];
      const isLast = step===idxs.length-1;
      const nextSt = !isLast ? stations[idxs[step+1]] : null;
      setSelIdx(i);
      // Arrival chime
      if (chimesEnabled) { await playChime(); if (!autoRef.current) break; }
      // Arriving announcement
      await speak(`Now arriving… ${stations[i]}.`, ()=>setPlaying(true), ()=>setPlaying(false));
      if (!autoRef.current) break;
      // Doors opening
      await speak("Doors opening. Please stand clear of the doors.", ()=>setPlaying(true), ()=>setPlaying(false));
      if (!autoRef.current) break;
      // Dwell at station
      await new Promise(r=>setTimeout(r, 1200));
      if (!autoRef.current) break;
      // Transfer announcement
      const tList = (lineData.transfers && lineData.transfers[stations[i]]) || [];
      if (tList.length>0) {
        await speak(`Transfer is available at ${stations[i]}. Please check station signage for connecting services.`, ()=>setPlaying(true), ()=>setPlaying(false));
        if (!autoRef.current) break;
      }
      if (isLast) {
        // Last stop
        await speak(`This is ${stations[i]}. This is the last stop on this train. All passengers must exit. Thank you for riding ${system}.`, ()=>setPlaying(true), ()=>setPlaying(false));
      } else {
        // Next station + doors closing
        await speak(`Next station… ${nextSt}.`, ()=>setPlaying(true), ()=>setPlaying(false));
        if (!autoRef.current) break;
        await speak("Step back. Doors closing.", ()=>setPlaying(true), ()=>setPlaying(false));
        if (!autoRef.current) break;
        // Departure chime
        if (chimesEnabled) { await playChime(); if (!autoRef.current) break; }
        // Travel time between stations
        await new Promise(r=>setTimeout(r, travelSec*1000));
      }
    }
    autoRef.current=false; setAutoPlaying(false);
  }, [stations, chimesEnabled, travelSec, lineData, system]);

  const stopAuto = () => { autoRef.current=false; synth?.cancel(); setAutoPlaying(false); setPlaying(false); };

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); autoRef.current=false; synth?.cancel(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{background:"transparent",border:"1px solid #2a2a3a",color:"#666",padding:"6px 13px",borderRadius:8,cursor:"pointer",fontSize:12}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{width:11,height:11,borderRadius:"50%",background:color}}/>
          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:17,letterSpacing:0.4}}>{city} — {lineName}</span>
          <span style={{fontSize:11,color:"#444"}}>{system} · {stations.length} stations</span>
        </div>
        <Waveform active={playing}/>
      </div>

      {/* Direction labels */}
      {directionLabels && (
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#444",marginBottom:6}}>
          <span>◄ {directionLabels.backward}</span>
          <span>{directionLabels.forward} ►</span>
        </div>
      )}

      {/* Controls */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:10}}>
        {autoPlaying ? (
          <button onClick={stopAuto} style={{background:"#cc0000",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>⏹ Stop Auto-Play</button>
        ) : directionLabels && (
          <>
            <button onClick={()=>startAuto("backward")} style={{background:"#0d1117",border:`1px solid ${color}44`,color:color,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:11}}>▶ Full run → {directionLabels.backward}</button>
            <button onClick={()=>startAuto("forward")} style={{background:"#0d1117",border:`1px solid ${color}44`,color:color,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:11}}>▶ Full run → {directionLabels.forward}</button>
          </>
        )}
        <div style={{display:"flex",alignItems:"center",gap:10,marginLeft:"auto",flexWrap:"wrap"}}>
          <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11,color:"#666",userSelect:"none"}}>
            <input type="checkbox" checked={chimesEnabled} onChange={e=>setChimesEnabled(e.target.checked)} style={{accentColor:color,cursor:"pointer"}}/>
            🔔 Chimes
          </label>
          <span style={{fontSize:10,color:"#444",whiteSpace:"nowrap"}}>Travel time:</span>
          <input type="range" min={2} max={30} step={1} value={travelSec} onChange={e=>setTravelSec(+e.target.value)} style={{width:75,accentColor:color}}/>
          <span style={{fontSize:11,color:"#888",minWidth:28}}>{travelSec}s</span>
        </div>
      </div>

      {/* Line diagram — train emoji slides along it during travel */}
      <div style={{background:"#0a0d14",border:"1px solid #161622",borderRadius:12,padding:"14px 10px",position:"relative",zIndex:1}}>
        <LineDiagram
          stations={stations} color={color} selectedIndex={selIdx}
          transfers={lineData.transfers} cityLines={cityLines}
          onSelect={setSelIdx} isTraveling={traveling}
          travelFromIdx={travelFromIdx} travelPct={travelPct}
        />
        {traveling && travelFrom && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6,padding:"4px 4px 0"}}>
            <span style={{fontSize:11,color:"#555"}}>{travelFrom} → {travelTo} · {Math.round(travelPct*100)}%</span>
            <button onClick={cancelTravel} style={{background:"transparent",border:"1px solid #222",color:"#444",padding:"2px 8px",borderRadius:5,cursor:"pointer",fontSize:10}}>Cancel</button>
          </div>
        )}
      </div>

      {/* Station panel — overlaps diagram by 6px */}
      {selIdx!==null && !traveling && (
        <StationPanel
          selectedIndex={selIdx} lineData={lineData} cityLines={cityLines}
          isTraveling={traveling} isAutoPlaying={autoPlaying} isPlaying={playing}
          onDepart={startTravel}
          onPlay={async text => { await speak(text, ()=>setPlaying(true), ()=>setPlaying(false)); }}
          onFly={onFly}
          onTransfer={onTransfer}
        />
      )}
    </div>
  );
}

// ─── Line Picker ───────────────────────────────────────────────────────────
function LinePicker({ city, onSelect, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{background:"transparent",border:"1px solid #2a2a3a",color:"#666",padding:"6px 13px",borderRadius:8,cursor:"pointer",fontSize:12,marginBottom:16}}>← All Cities</button>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,marginBottom:18}}>
        {city.icon} {city.name} <span style={{color:"#444",fontSize:14}}>— {city.system}</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {city.lines.map((l,i)=>(
          <button key={l.name} onClick={()=>onSelect(i)} style={{background:l.color,color:l.textColor,border:"none",padding:"10px 20px",borderRadius:24,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Oswald',sans-serif",boxShadow:`0 4px 14px ${l.color}44`,transition:"transform 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}
          >{l.name}</button>
        ))}
      </div>
    </div>
  );
}

// ─── City Picker ───────────────────────────────────────────────────────────
function CityPicker({ onSelect }) {
  return (
    <div>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:12,color:"#333",marginBottom:14,letterSpacing:3}}>SELECT A CITY</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
        {METRO_DATA.cities.map((c,i)=>(
          <button key={c.name} onClick={()=>onSelect(i)} style={{background:"linear-gradient(145deg,#111827,#1a2332)",border:"1px solid #2a2a3a",borderRadius:12,padding:"18px 14px",cursor:"pointer",textAlign:"center",color:"#fff",transition:"all 0.2s",fontFamily:"inherit"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#4cc9f0";e.currentTarget.style.transform="translateY(-4px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a2a3a";e.currentTarget.style.transform="";}}
          >
            <div style={{fontSize:32,marginBottom:8}}>{c.icon}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:14}}>{c.name}</div>
            <div style={{fontSize:10,color:"#555",marginTop:3}}>{c.system}</div>
            <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:8,flexWrap:"wrap"}}>
              {c.lines.map(l=><div key={l.name} style={{width:9,height:9,borderRadius:"50%",background:l.color}} title={l.name}/>)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Editable Title ────────────────────────────────────────────────────────
function EditableTitle() {
  const KEY = "appTitle", DEF = "JULIAN'S TOYBOX";
  const [title, setTitle] = useState(() => {
    try { return localStorage.getItem(KEY) || DEF; } catch { return DEF; }
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const ref = useRef(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const commit = () => {
    const v = draft.trim() || DEF;
    setTitle(v);
    try { localStorage.setItem(KEY, v); } catch {}
    setEditing(false);
  };

  const gradStyle = {
    fontFamily:"'Oswald',sans-serif", fontWeight:700,
    fontSize:"clamp(18px,4.5vw,32px)", letterSpacing:3,
    background:"linear-gradient(135deg,#4cc9f0 0%,#f72585 100%)",
    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
  };

  if (editing) return (
    <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
      <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)} maxLength={40}
        onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setEditing(false);setDraft(title);}}}
        style={{...gradStyle,background:"none",WebkitTextFillColor:"#fff",border:"none",borderBottom:"2px solid #4cc9f0",outline:"none",textAlign:"center",width:"min(380px,75vw)",padding:"0 4px"}}/>
      <button onClick={commit} style={{background:"#4cc9f0",border:"none",borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:12,fontWeight:700,color:"#000"}}>✓</button>
      <button onClick={()=>{setEditing(false);setDraft(title);}} style={{background:"transparent",border:"1px solid #333",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:"#666"}}>✕</button>
    </div>
  );

  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={gradStyle}>{title}</span>
      <button onClick={()=>{setDraft(title);setEditing(true);}} style={{background:"transparent",border:"1px solid #2a2a3a",color:"#444",borderRadius:6,padding:"3px 7px",cursor:"pointer",fontSize:10}} title="Edit title">✏️</button>
    </div>
  );
}

// ─── Elevator Simulator ────────────────────────────────────────────────────
const ELEVATORS = [
  { id:"hotel",    name:"Grand Hotel",    icon:"🏨", color:"#c9a84c",
    desc:"Lobby to Penthouse",         note:"No 13th floor",
    groundFloor:"L",  floors:["L","2","3","4","5","6","7","8","9","10","11","12","PH"],
    panelSide:"right", panelBg:"linear-gradient(180deg,#18120a,#100d05)", panelBorder:"#c9a84c55",
    btnRadius:"50%", btnGap:5, btnSize:44, displayColor:"#d4a43c", displayBg:"#0a0700",
    doorGrad:"linear-gradient(90deg,#6b5a3a,#c8b87a 22%,#a89060 50%,#d4c088 72%,#a09050 86%,#6b5a3a)",
    doorGradR:"linear-gradient(270deg,#6b5a3a,#c8b87a 22%,#a89060 50%,#d4c088 72%,#a09050 86%,#6b5a3a)" },
  { id:"office",   name:"Office Tower",   icon:"🏢", color:"#4c7ac9",
    desc:"Underground parking to 15F", note:"Skips floor 13",
    groundFloor:"G",  floors:["B2","B1","G","2","3","4","5","6","7","8","9","10","11","12","14","15"],
    panelSide:"left",  panelBg:"linear-gradient(180deg,#080c18,#050810)", panelBorder:"#4c7ac955",
    btnRadius:"3px",  btnGap:4, btnSize:40, displayColor:"#4cc9f0", displayBg:"#02050f",
    doorGrad:"linear-gradient(90deg,#3a3a3a,#888 22%,#606060 50%,#aaa 72%,#707070 86%,#3a3a3a)",
    doorGradR:"linear-gradient(270deg,#3a3a3a,#888 22%,#606060 50%,#aaa 72%,#707070 86%,#3a3a3a)" },
  { id:"parking",  name:"Parking Garage", icon:"🚗", color:"#888888",
    desc:"Three underground levels",   note:"Underground only",
    groundFloor:"L",  floors:["G3","G2","G1","L"],
    panelSide:"right", panelBg:"linear-gradient(180deg,#0c0c0c,#080808)", panelBorder:"#88888855",
    btnRadius:"2px",  btnGap:6, btnSize:60, displayColor:"#ff6600", displayBg:"#080400",
    doorGrad:"linear-gradient(90deg,#222,#505050 22%,#383838 50%,#606060 72%,#404040 86%,#222)",
    doorGradR:"linear-gradient(270deg,#222,#505050 22%,#383838 50%,#606060 72%,#404040 86%,#222)" },
  { id:"hospital", name:"Hospital",       icon:"🏥", color:"#4cc9a8",
    desc:"Basement to patient floors", note:"Has basement & ground",
    groundFloor:"G",  floors:["B","G","1","2","3","4","5","6","7","8"],
    panelSide:"left",  panelBg:"linear-gradient(180deg,#041614,#030f0d)", panelBorder:"#4cc9a855",
    btnRadius:"22px", btnGap:4, btnSize:42, displayColor:"#4cc9a8", displayBg:"#020c0a",
    doorGrad:"linear-gradient(90deg,#7a8a88,#c4d4d0 22%,#a0b0ae 50%,#d0e0dc 72%,#aabab8 86%,#7a8a88)",
    doorGradR:"linear-gradient(270deg,#7a8a88,#c4d4d0 22%,#a0b0ae 50%,#d0e0dc 72%,#aabab8 86%,#7a8a88)" },
  { id:"mall",     name:"Shopping Mall",  icon:"🛍️", color:"#c94c9a",
    desc:"Lower level to top floor",   note:"Has lower level (LL)",
    groundFloor:"L",  floors:["LL","L","1","2","3"],
    panelSide:"right", panelBg:"linear-gradient(180deg,#180610,#120408)", panelBorder:"#c94c9a55",
    btnRadius:"50px", btnGap:5, btnSize:54, displayColor:"#ff69b4", displayBg:"#100208",
    doorGrad:"linear-gradient(90deg,#7a2458,#c87aac 22%,#a05488 50%,#d490c0 72%,#b060a0 86%,#7a2458)",
    doorGradR:"linear-gradient(270deg,#7a2458,#c87aac 22%,#a05488 50%,#d490c0 72%,#b060a0 86%,#7a2458)" },
  { id:"lucky",    name:"Lucky Tower",    icon:"🍀", color:"#4cc94c",
    desc:"20 floors, no 4 or 13",      note:"Skips 4th & 13th floors",
    groundFloor:"1",  floors:["1","2","3","5","6","7","8","9","10","11","12","15","16","17","18","19","20"],
    panelSide:"left",  panelBg:"linear-gradient(180deg,#061206,#040c04)", panelBorder:"#4cc94c55",
    btnRadius:"8px 20px 8px 20px", btnGap:4, btnSize:40, displayColor:"#4cc94c", displayBg:"#030803",
    doorGrad:"linear-gradient(90deg,#1a3a1a,#4a8a4a 22%,#306030 50%,#5a9a5a 72%,#408040 86%,#1a3a1a)",
    doorGradR:"linear-gradient(270deg,#1a3a1a,#4a8a4a 22%,#306030 50%,#5a9a5a 72%,#408040 86%,#1a3a1a)" },
];

function ElevatorPicker({ onSelect, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{background:"transparent",border:"1px solid #2a2a3a",color:"#666",padding:"6px 13px",borderRadius:8,cursor:"pointer",fontSize:12,marginBottom:16}}>← Back</button>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:12,color:"#333",marginBottom:14,letterSpacing:3}}>SELECT AN ELEVATOR</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        {ELEVATORS.map((el,i) => (
          <button key={el.id} onClick={()=>onSelect(i)}
            style={{background:"linear-gradient(145deg,#111827,#1a2332)",border:`1px solid ${el.color}44`,borderRadius:12,padding:"18px 14px",cursor:"pointer",textAlign:"center",color:"#fff",transition:"all 0.2s",fontFamily:"inherit"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=el.color;e.currentTarget.style.transform="translateY(-4px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${el.color}44`;e.currentTarget.style.transform="";}}
          >
            <div style={{fontSize:34,marginBottom:8}}>{el.icon}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:15,marginBottom:4}}>{el.name}</div>
            <div style={{fontSize:10,color:"#555",marginBottom:5}}>{el.desc}</div>
            <div style={{fontSize:10,color:el.color,fontStyle:"italic",marginBottom:8}}>{el.note}</div>
            <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:3}}>
              {el.floors.map(f=><span key={f} style={{fontSize:9,color:"#444",background:"#0d1117",padding:"2px 5px",borderRadius:3,border:"1px solid #1e1e2e"}}>{f}</span>)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const FLOOR_SCENES = {
  hotel: {
    "L": {bg:"#2e2214",left:"🛋️",right:"🌺", label:"Grand Lobby",   window:"city-day"},
    "2": {bg:"#1a2828",left:"🏊",right:"🪟", label:"Pool & Spa",     window:"interior"},
    "3": {bg:"#1e1826",left:"🕯️",right:"💆", label:"Wellness Spa",   window:"city-day"},
    "4": {bg:"#2a1c10",left:"🍷",right:"🍽️", label:"Restaurant",     window:"city-day"},
    "5": {bg:"#1e1a18",left:"🛏️",right:"🖼️", label:"5th Floor",      window:"city-night"},
    "6": {bg:"#1e1c18",left:"🛏️",right:"🌸", label:"6th Floor",      window:"city-night"},
    "7": {bg:"#1c1e18",left:"🪴",right:"🛏️", label:"7th Floor",      window:"city-night"},
    "8": {bg:"#181e1c",left:"🛏️",right:"🏙️", label:"8th Floor",      window:"city-night"},
    "9": {bg:"#1a1c18",left:"🌿",right:"🛏️", label:"9th Floor",      window:"city-night"},
    "10":{bg:"#1e1818",left:"🛏️",right:"🌹", label:"10th Floor",     window:"city-night"},
    "11":{bg:"#181e1e",left:"💫",right:"🛏️", label:"11th Floor",     window:"city-night"},
    "12":{bg:"#1a1426",left:"🎭",right:"✨",  label:"Event Hall",     window:"city-night"},
    "PH":{bg:"#14101e",left:"🛋️",right:"🌇", label:"Penthouse",      window:"panorama"},
  },
  office: {
    "B2":{bg:"#0c0c0c",left:"🚗",right:"🚙", label:"Parking B2",     window:"none"},
    "B1":{bg:"#0c0c0c",left:"🛵",right:"📦", label:"Parking B1",     window:"none"},
    "G": {bg:"#121820",left:"📮",right:"☕",  label:"Ground Floor",   window:"city-day"},
    "2": {bg:"#0d1420",left:"💻",right:"🪴",  label:"2nd Floor",      window:"city-day"},
    "3": {bg:"#0d1420",left:"📋",right:"🖥️", label:"3rd Floor",      window:"city-day"},
    "4": {bg:"#0d1620",left:"📽️",right:"🤝", label:"Conference",     window:"city-day"},
    "5": {bg:"#0d1420",left:"☕",right:"📌",  label:"5th Floor",      window:"city-day"},
    "6": {bg:"#0d1420",left:"📁",right:"🖨️", label:"Records",        window:"city-day"},
    "7": {bg:"#0e1820",left:"💻",right:"⌨️", label:"IT — 7F",        window:"city-night"},
    "8": {bg:"#0d1620",left:"📊",right:"🏆",  label:"Sales — 8F",    window:"city-night"},
    "9": {bg:"#0d1420",left:"🩺",right:"📋",  label:"HR — 9F",       window:"city-night"},
    "10":{bg:"#0d1420",left:"📚",right:"🖊️", label:"Legal — 10F",   window:"city-night"},
    "11":{bg:"#141420",left:"🪟",right:"🏙️", label:"Exec — 11F",    window:"panorama"},
    "12":{bg:"#141420",left:"🎩",right:"☕",  label:"C-Suite — 12F", window:"panorama"},
    "14":{bg:"#141820",left:"🍱",right:"🥗",  label:"Cafeteria",     window:"city-night"},
    "15":{bg:"#0d1018",left:"⚙️",right:"🔧", label:"Mechanical",     window:"none"},
  },
  parking: {
    "G3":{bg:"#0c0c0c",left:"🚗",right:"🚙", label:"Level G3",       window:"none"},
    "G2":{bg:"#0c0c0c",left:"🚕",right:"🛻", label:"Level G2",       window:"none"},
    "G1":{bg:"#0c0c0c",left:"🚐",right:"🏍️",label:"Level G1",       window:"none"},
    "L": {bg:"#0e0e0e",left:"🎟️",right:"🌤️",label:"Street Level",   window:"sky"},
  },
  hospital: {
    "B": {bg:"#0c1412",left:"🧪",right:"📦", label:"Basement",       window:"none"},
    "G": {bg:"#12201e",left:"🏥",right:"🌡️", label:"Main Entrance",  window:"city-day"},
    "1": {bg:"#0e1816",left:"🩺",right:"💊", label:"Outpatient",     window:"city-day"},
    "2": {bg:"#0e1816",left:"🛌",right:"🩹", label:"Ward 2",         window:"city-day"},
    "3": {bg:"#0e1816",left:"🔬",right:"🧫", label:"Pathology",      window:"city-day"},
    "4": {bg:"#0e1816",left:"👶",right:"🍼", label:"Maternity",      window:"city-day"},
    "5": {bg:"#0e1816",left:"🛌",right:"🌸", label:"Ward 5",         window:"city-day"},
    "6": {bg:"#0e1816",left:"🩻",right:"📋", label:"Radiology",      window:"none"},
    "7": {bg:"#0e1816",left:"🧑‍⚕️",right:"💉",label:"ICU — 7F",     window:"none"},
    "8": {bg:"#0f1a18",left:"🍱",right:"☕", label:"Cafeteria",      window:"city-day"},
  },
  mall: {
    "LL":{bg:"#180814",left:"🛒",right:"🅿️", label:"Lower Level",    window:"none"},
    "L": {bg:"#1c0e18",left:"🛍️",right:"☕", label:"Ground Floor",   window:"city-day"},
    "1": {bg:"#200a1c",left:"👗",right:"👠",  label:"Fashion — 1F",  window:"interior"},
    "2": {bg:"#1c0a18",left:"🍕",right:"🧃",  label:"Food Court",    window:"interior"},
    "3": {bg:"#180816",left:"🎡",right:"🎈",  label:"Fun Zone",      window:"sky"},
  },
  lucky: {
    "1": {bg:"#081208",left:"🍀",right:"🌱", label:"Ground — 1F",    window:"city-day"},
    "2": {bg:"#081208",left:"💻",right:"🌿", label:"2nd Floor",      window:"city-day"},
    "3": {bg:"#081208",left:"🪴",right:"📋", label:"3rd Floor",      window:"city-day"},
    "5": {bg:"#091409",left:"🍀",right:"🎯", label:"5th Floor",      window:"city-day"},
    "6": {bg:"#091409",left:"💡",right:"🌿", label:"6th Floor",      window:"city-day"},
    "7": {bg:"#091409",left:"💻",right:"🍀", label:"7th Floor",      window:"city-night"},
    "8": {bg:"#091409",left:"🪴",right:"🎲", label:"8th Floor",      window:"city-night"},
    "9": {bg:"#0a1a0a",left:"📊",right:"🌿", label:"9th Floor",      window:"city-night"},
    "10":{bg:"#0a1a0a",left:"🏆",right:"🍀", label:"10th Floor",     window:"city-night"},
    "11":{bg:"#0a1a0a",left:"🪟",right:"🌳", label:"11th Floor",     window:"city-night"},
    "12":{bg:"#0a1a0a",left:"🌿",right:"💫", label:"12th Floor",     window:"city-night"},
    "15":{bg:"#0b1c0b",left:"🍀",right:"🌇", label:"15th Floor",     window:"panorama"},
    "16":{bg:"#0b1c0b",left:"⭐",right:"🌿", label:"16th Floor",     window:"panorama"},
    "17":{bg:"#0b1c0b",left:"🪴",right:"🍀", label:"17th Floor",     window:"panorama"},
    "18":{bg:"#0c200c",left:"🎰",right:"🌿", label:"18th Floor",     window:"panorama"},
    "19":{bg:"#0c200c",left:"🏆",right:"🍀", label:"19th Floor",     window:"panorama"},
    "20":{bg:"#0d220d",left:"🌇",right:"🌟", label:"Lucky Top — 20", window:"panorama"},
  },
};

function playBell() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1108, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.start(t); osc.stop(t + 0.9);
    });
  } catch {}
}

function ElevatorInterior({ elevator, onExit }) {
  const { floors, groundFloor, color, name: elName, icon,
    panelSide, panelBg, panelBorder, btnRadius, btnGap, btnSize,
    displayColor, displayBg, doorGrad, doorGradR } = elevator;
  const gndIdx = floors.indexOf(groundFloor);

  const [dispIdx, setDispIdx]             = useState(gndIdx);
  const [realIdx, setRealIdx]             = useState(gndIdx);
  const [doorPhase, setDoorPhase]         = useState("closed");
  const [lit, setLit]                     = useState(new Set());
  const [dir, setDir]                     = useState(null);
  const [engineRunning, setEngineRunning] = useState(false);
  const [bellRinging, setBellRinging]           = useState(false);
  const [moving, setMoving]                     = useState(false);
  const [keycardValidated, setKeycardValidated] = useState(elevator.id !== "hotel");

  const realIdxRef   = useRef(gndIdx);
  const doorPhaseRef = useRef("closed");
  const queueRef     = useRef([]);
  const runRef       = useRef(false);
  const exitRef      = useRef(false);
  const movingRef    = useRef(false);

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const setDoor = phase => { doorPhaseRef.current = phase; setDoorPhase(phase); };
  const setMovingState = val => { movingRef.current = val; setMoving(val); };
  const openDoors  = async () => { setDoor("opening"); await sleep(900); setDoor("open"); };
  const closeDoors = async () => { if (doorPhaseRef.current === "closed") return; setDoor("closing"); await sleep(900); setDoor("closed"); };
  const removeLit  = idx => setLit(prev => { const s = new Set(prev); s.delete(idx); return s; });

  const runEngine = async () => {
    if (runRef.current) return;
    runRef.current = true; setEngineRunning(true);
    let curDir = null;
    while (runRef.current && queueRef.current.length > 0) {
      const cur = realIdxRef.current;
      const above = queueRef.current.filter(f=>f>cur).sort((a,b)=>a-b);
      const below = queueRef.current.filter(f=>f<cur).sort((a,b)=>b-a);
      let target;
      if (curDir !== "down" && above.length > 0) { target = above[0]; curDir = "up"; }
      else if (below.length > 0)                  { target = below[0]; curDir = "down"; }
      else if (above.length > 0)                  { target = above[0]; curDir = "up"; }
      if (target === undefined) break;
      setDir(curDir);
      let f = realIdxRef.current;
      while (f !== target) {
        setMovingState(true);
        await sleep(1100);
        setMovingState(false);
        if (!runRef.current) { setEngineRunning(false); setDir(null); return; }
        f += curDir === "up" ? 1 : -1;
        realIdxRef.current = f; setRealIdx(f); setDispIdx(f);
        if (f !== target && queueRef.current.includes(f)) {
          setDir(null);
          queueRef.current = queueRef.current.filter(x=>x!==f);
          removeLit(f);
          await playElevatorDing(); await openDoors();
          if (exitRef.current && f === gndIdx) { await sleep(800); onExit(); return; }
          await sleep(2500); await closeDoors();
          setMovingState(true);
          setDir(curDir);
        }
      }
      setDir(null);
      queueRef.current = queueRef.current.filter(x=>x!==target);
      removeLit(target);
      await playElevatorDing(); await openDoors();
      if (exitRef.current && target === gndIdx) { await sleep(800); onExit(); return; }
      await sleep(2500); await closeDoors();
      curDir = null;
    }
    runRef.current = false; setEngineRunning(false); setMovingState(false); setDir(null);
  };

  const pressFloor = idx => {
    if (idx === realIdxRef.current || queueRef.current.includes(idx)) return;
    if (elevator.id === "hotel" && !keycardValidated) {
      if (idx !== gndIdx && idx !== floors.indexOf("2")) return;
    }
    queueRef.current = [...queueRef.current, idx];
    setLit(prev => new Set([...prev, idx]));
    if (!runRef.current) closeDoors().then(() => runEngine());
  };

  const handleDoorOpen = async () => {
    if (movingRef.current || doorPhaseRef.current === "open" || doorPhaseRef.current === "opening") return;
    await openDoors(); await sleep(2500); await closeDoors();
    if (queueRef.current.length > 0 && !runRef.current) runEngine();
  };
  const handleDoorClose = async () => {
    if (movingRef.current || doorPhaseRef.current === "closed" || doorPhaseRef.current === "closing") return;
    await closeDoors();
    if (queueRef.current.length > 0 && !runRef.current) runEngine();
  };
  const handleExit = () => {
    if (realIdxRef.current === gndIdx && !runRef.current) { onExit(); return; }
    exitRef.current = true;
    queueRef.current = [gndIdx];
    setLit(new Set([gndIdx]));
    if (!runRef.current) closeDoors().then(() => runEngine());
  };
  const handleBell = () => {
    if (bellRinging) return;
    setBellRinging(true); playBell();
    setTimeout(() => setBellRinging(false), 3000);
  };

  useEffect(() => {
    sleep(400).then(() => openDoors());
    return () => { runRef.current = false; };
  }, []);

  const isOpen = doorPhase === "open" || doorPhase === "opening";
  const scene = FLOOR_SCENES[elevator.id]?.[floors[realIdx]] || { bg:"#111118", left:"", right:"", label:"", window:"none" };

  const windowViews = {
    "city-day":  "linear-gradient(180deg,#1a5a90 0%,#64a8d4 50%,#b8d8ec 100%)",
    "city-night":"linear-gradient(180deg,#04060e 0%,#080e1e 60%,#0c1020 100%)",
    "sky":       "linear-gradient(180deg,#1470b0 0%,#50a0d0 50%,#e8d880 100%)",
    "interior":  "linear-gradient(180deg,#2a1c08 0%,#3a2c10 60%,#4a3a18 100%)",
    "panorama":  "linear-gradient(180deg,#020810 0%,#060e20 40%,#0a1430 100%)",
  };

  const doorArea = (
    <div style={{flex:1, position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${color}22`, minHeight:380}}>
      {/* Hallway */}
      <div style={{position:"absolute", inset:0, background:scene.bg, transition:"background 0.8s"}}>
        {/* Ceiling */}
        <div style={{position:"absolute", top:0, left:0, right:0, height:32, background:"rgba(0,0,0,0.55)", zIndex:1}}>
          <div style={{position:"absolute", bottom:4, left:"18%", right:"18%", height:3, background:"rgba(255,255,240,0.18)", borderRadius:2, boxShadow:"0 0 10px rgba(255,255,200,0.25)"}}/>
        </div>
        {/* Baseboard */}
        <div style={{position:"absolute", bottom:62, left:0, right:0, height:5, background:"rgba(0,0,0,0.45)", zIndex:1}}/>
        {/* Floor shading */}
        <div style={{position:"absolute", bottom:0, left:0, right:0, height:62, background:"rgba(0,0,0,0.25)", zIndex:1}}/>
        {/* Floor sign — upper left, wall-mounted */}
        <div style={{position:"absolute", top:40, left:12, zIndex:2,
          background:"rgba(0,0,0,0.7)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"4px 10px"}}>
          <div style={{fontFamily:"'DM Mono',monospace", fontSize:7, color:"#555", letterSpacing:2, marginBottom:1}}>FLOOR</div>
          <div style={{fontFamily:"'Oswald',sans-serif", fontSize:28, color:"#eaeaea", letterSpacing:4, lineHeight:1}}>{floors[realIdx]}</div>
          {scene.label && <div style={{fontFamily:"'DM Mono',monospace", fontSize:7, color:"#666", marginTop:2, letterSpacing:0.5}}>{scene.label.toUpperCase()}</div>}
        </div>
        {/* Window — upper right */}
        {scene.window && scene.window !== "none" && (
          <div style={{position:"absolute", top:40, right:12, width:70, height:78, zIndex:2,
            background:windowViews[scene.window], border:"4px solid rgba(160,140,100,0.5)", borderRadius:2, overflow:"hidden"}}>
            {(scene.window === "city-day" || scene.window === "city-night" || scene.window === "panorama") && <>
              <div style={{position:"absolute", bottom:0, left:0,  width:22, height:44, background:scene.window==="city-day"?"rgba(20,35,55,0.7)":"#040a12"}}/>
              <div style={{position:"absolute", bottom:0, left:14, width:16, height:28, background:scene.window==="city-day"?"rgba(20,35,55,0.6)":"#050c14"}}/>
              <div style={{position:"absolute", bottom:0, right:0, width:26, height:38, background:scene.window==="city-day"?"rgba(20,35,55,0.65)":"#040a12"}}/>
              {scene.window === "city-night" && [
                {b:28,l:4},{b:20,l:8},{b:35,l:2},{b:22,r:5},{b:14,r:9},{b:30,r:3}
              ].map((d,i)=>(
                <div key={i} style={{position:"absolute", bottom:d.b, left:d.l, right:d.r, width:3, height:3, background:"#ffd090", borderRadius:"50%"}}/>
              ))}
            </>}
          </div>
        )}
        {/* Scene items */}
        {scene.left  && <div style={{position:"absolute", bottom:68, left:14,  fontSize:24, zIndex:2}}>{scene.left}</div>}
        {scene.right && <div style={{position:"absolute", bottom:68, right:14, fontSize:24, zIndex:2}}>{scene.right}</div>}
      </div>
      {/* Direction indicator */}
      <div style={{position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", zIndex:3,
        background:"rgba(0,0,0,0.8)", borderRadius:6, padding:"3px 12px",
        fontSize:10, color:dir?color:"#555", fontFamily:"'DM Mono',monospace", letterSpacing:1, whiteSpace:"nowrap"}}>
        {dir==="up"?"▲ UP":dir==="down"?"▼ DOWN":isOpen?"● OPEN":"● STOP"}
      </div>
      {/* Left door */}
      <div style={{position:"absolute", left:0, top:0, bottom:0, width:"50%", zIndex:2,
        background:doorGrad, boxShadow:"inset -4px 0 14px rgba(0,0,0,0.6)",
        transition:"transform 0.9s cubic-bezier(0.4,0,0.2,1)", transform:isOpen?"translateX(-100%)":"translateX(0)"}}>
        <div style={{position:"absolute", top:"12%", bottom:"12%", left:"14%", right:"14%", border:"1px solid rgba(255,255,255,0.15)", borderRadius:2}}/>
        <div style={{position:"absolute", top:"30%", bottom:"30%", right:7, width:4, background:"rgba(0,0,0,0.35)", borderRadius:2}}/>
      </div>
      {/* Right door */}
      <div style={{position:"absolute", right:0, top:0, bottom:0, width:"50%", zIndex:2,
        background:doorGradR, boxShadow:"inset 4px 0 14px rgba(0,0,0,0.6)",
        transition:"transform 0.9s cubic-bezier(0.4,0,0.2,1)", transform:isOpen?"translateX(100%)":"translateX(0)"}}>
        <div style={{position:"absolute", top:"12%", bottom:"12%", left:"14%", right:"14%", border:"1px solid rgba(255,255,255,0.15)", borderRadius:2}}/>
        <div style={{position:"absolute", top:"30%", bottom:"30%", left:7, width:4, background:"rgba(0,0,0,0.35)", borderRadius:2}}/>
      </div>
    </div>
  );

  const panel = (
    <div style={{width:132, display:"flex", flexDirection:"column", background:panelBg,
      borderRadius:12, border:`1px solid ${panelBorder}`, overflow:"hidden"}}>
      {/* Floor display */}
      <div style={{padding:"10px 8px 7px", borderBottom:`1px solid ${color}22`, flexShrink:0}}>
        <div style={{fontFamily:"'Courier New',monospace", fontSize:28, color:displayColor,
          background:displayBg, textAlign:"center", padding:"5px 4px", borderRadius:4,
          letterSpacing:3, textShadow:`0 0 12px ${displayColor}88`, border:`1px solid ${color}33`}}>
          {floors[dispIdx]}
        </div>
        <div style={{fontSize:8, color:`${color}88`, textAlign:"center", marginTop:4,
          letterSpacing:1, fontFamily:"'DM Mono',monospace"}}>
          {dir==="up"?"▲ GOING UP":dir==="down"?"▼ GOING DN":isOpen?"● DOORS OPEN":"● STOPPED"}
        </div>
      </div>
      {/* Floor buttons */}
      <div style={{flex:1, overflowY:"auto", padding:8, scrollbarWidth:"none", msOverflowStyle:"none"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:btnGap}}>
          {[...floors].reverse().map((fl, ri) => {
            const idx = floors.length - 1 - ri;
            const isLit = lit.has(idx);
            const isCur = realIdx === idx;
            const isRestricted = elevator.id === "hotel" && !keycardValidated && idx !== gndIdx && idx !== floors.indexOf("2");
            return (
              <button key={fl} onClick={()=>pressFloor(idx)} disabled={isCur || isRestricted}
                style={{height:btnSize, width:"100%", padding:0, borderRadius:btnRadius,
                  background: isLit?color : isCur?`${color}18` : isRestricted?"#0c0c10":"#18182a",
                  border:`2px solid ${isLit?color : isCur?`${color}55` : isRestricted?"#1a1a20":`${color}22`}`,
                  color: isLit?"#000" : isCur?color : isRestricted?"#252530":`${color}88`,
                  fontFamily:"'Oswald',sans-serif", fontSize:12, fontWeight:700,
                  cursor:isCur||isRestricted?"default":"pointer", transition:"all 0.15s",
                  boxShadow:isLit?`0 0 10px ${color}88, inset 0 1px 3px rgba(255,255,255,0.25)`:"none"}}>
                {fl}
              </button>
            );
          })}
        </div>
      </div>
      {/* Hotel keycard reader */}
      {elevator.id === "hotel" && (
        <div style={{padding:"6px 8px", borderTop:`1px solid ${color}22`, flexShrink:0}}>
          <div onClick={keycardValidated ? undefined : () => setKeycardValidated(true)}
            style={{background:"#080604", border:`1px solid ${keycardValidated?"#4cc94c44":"#c9a84c44"}`,
              borderRadius:6, padding:"6px 8px", cursor:keycardValidated?"default":"pointer",
              display:"flex", alignItems:"center", gap:6, transition:"all 0.3s"}}>
            <div style={{fontSize:15}}>🎫</div>
            <div style={{flex:1, fontFamily:"'DM Mono',monospace"}}>
              <div style={{fontSize:7, color:keycardValidated?"#4cc94c":"#c9a84c", letterSpacing:1, marginBottom:1}}>
                {keycardValidated ? "CARD OK" : "TAP CARD"}
              </div>
              <div style={{fontSize:7, color:"#666", letterSpacing:0.5}}>
                {keycardValidated ? "ALL FLOORS" : "L & 2 ONLY"}
              </div>
            </div>
            <div style={{width:9, height:9, borderRadius:"50%", flexShrink:0,
              background:keycardValidated?"#4cc94c":"#dc2626",
              boxShadow:keycardValidated?"0 0 7px #4cc94c":"0 0 8px #dc2626"}}/>
          </div>
        </div>
      )}
      {/* Divider */}
      <div style={{height:1, background:`${color}22`, margin:"0 8px", flexShrink:0}}/>
      {/* Special buttons */}
      <div style={{padding:8, display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, flexShrink:0}}>
        <button onClick={handleDoorOpen} disabled={moving} title="Open doors"
          style={{height:34, borderRadius:6, background:"#14142a", border:`1px solid ${color}22`,
            color:moving?"#1e1e30":`${color}88`, cursor:moving?"not-allowed":"pointer", fontSize:12}}>◄ ►</button>
        <button onClick={handleDoorClose} disabled={moving} title="Close doors"
          style={{height:34, borderRadius:6, background:"#14142a", border:`1px solid ${color}22`,
            color:moving?"#1e1e30":`${color}88`, cursor:moving?"not-allowed":"pointer", fontSize:12}}>► ◄</button>
        <button onClick={handleBell} title="Emergency bell"
          style={{height:34, borderRadius:6,
            background:bellRinging?"#450a0a":"#1a0808",
            border:`1px solid ${bellRinging?"#dc2626":"#5a1414"}`,
            color:bellRinging?"#fca5a5":"#dc262688",
            cursor:"pointer", fontSize:16, transition:"all 0.2s"}}>🔔</button>
        <button onClick={handleExit}
          style={{height:34, borderRadius:6,
            background:realIdx===gndIdx&&!engineRunning?"#450a0a":"#14142a",
            border:`1px solid ${realIdx===gndIdx&&!engineRunning?"#dc2626":`${color}22`}`,
            color:realIdx===gndIdx&&!engineRunning?"#fca5a5":"#333",
            cursor:"pointer", fontSize:9, fontWeight:700, letterSpacing:0.5, transition:"all 0.15s"}}>EXIT</button>
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:520, margin:"0 auto"}}>
      <div style={{display:"flex", flexDirection:"row", gap:8, alignItems:"stretch"}}>
        {panelSide === "right" ? <>{doorArea}{panel}</> : <>{panel}{doorArea}</>}
      </div>
    </div>
  );
}

function ElevatorSimulator({ onBack }) {
  const [elevIdx, setElevIdx] = useState(null);
  if (elevIdx === null) return <ElevatorPicker onSelect={setElevIdx} onBack={onBack}/>;
  return <ElevatorInterior elevator={ELEVATORS[elevIdx]} onExit={()=>setElevIdx(null)}/>;
}

// ─── Activity Picker ───────────────────────────────────────────────────────
const ACTIVITIES = [
  { name: "Metro Soundboard", icon: "🚇", desc: "Explore transit lines & play station announcements", active: true },
  { name: "Elevator Simulator", icon: "🛗", desc: "Ride elevators and press all the buttons",           active: true  },
  { name: "Route Challenge",  icon: "🗺️", desc: "Find the fastest path between two stations",         active: false },
  { name: "Schedule Run",     icon: "⏱️", desc: "Race the clock through a line",                      active: false },
  { name: "Station Builder",  icon: "🏗️", desc: "Design and build your own metro system",             active: false },
];

function ActivityPicker({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:12,color:"#888",marginBottom:14,letterSpacing:3}}>SELECT AN ACTIVITY</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {ACTIVITIES.map((a,i) => (
          <button key={a.name}
            onClick={() => { if (a.active) onSelect(i); }}
            onMouseEnter={e => {
              if (a.active) { e.currentTarget.style.borderColor="#4cc9f0"; e.currentTarget.style.transform="translateY(-4px)"; }
              setHovered(i);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor=a.active?"#2a2a3a":"#1a1a25";
              e.currentTarget.style.transform="";
              setHovered(null);
            }}
            onTouchStart={() => setHovered(i)}
            onTouchEnd={() => setTimeout(()=>setHovered(null), 1500)}
            style={{
              background:a.active?"linear-gradient(145deg,#111827,#1a2332)":"linear-gradient(145deg,#0d0d14,#111118)",
              border:`1px solid ${a.active?"#2a2a3a":"#1a1a25"}`,borderRadius:12,padding:"24px 18px",
              cursor:a.active?"pointer":"default",textAlign:"center",color:a.active?"#fff":"#555",
              transition:"all 0.2s",fontFamily:"inherit",position:"relative",overflow:"hidden",
            }}
          >
            <div style={{fontSize:42,marginBottom:10,filter:a.active?"none":"grayscale(1) opacity(0.25)"}}>{a.icon}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16}}>{a.name}</div>
            <div style={{fontSize:11,color:a.active?"#aaa":"#444",marginTop:4}}>{a.active?a.desc:"???"}</div>
            {!a.active && hovered===i && (
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(7,10,16,0.93)",borderRadius:12,fontSize:11,color:"#4cc9f0",padding:14,lineHeight:1.6}}>
                🚧 Coming soon
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activityIdx, setActivityIdx] = useState(null);
  const [cityIdx, setCityIdx] = useState(null);
  const [lineIdx, setLineIdx] = useState(null);
  const [flyStation, setFlyStation] = useState(null);
  const city = cityIdx!=null ? METRO_DATA.cities[cityIdx] : null;
  const line = city && lineIdx!=null ? city.lines[lineIdx] : null;
  const lineData = line ? {...line, city:city.name, system:city.system} : null;

  const goHome = () => { setActivityIdx(null); setCityIdx(null); setLineIdx(null); setFlyStation(null); };
  const handleFly = (ci, li, si) => { setCityIdx(ci); setLineIdx(li); setFlyStation(si); };
  const handleTransfer = (li, si) => { setLineIdx(li); setFlyStation(si); };

  const subtitle = activityIdx==null
    ? "Select an activity"
    : activityIdx===1
      ? "Elevator Simulator"
      : cityIdx==null
        ? "Metro Soundboard — Select a City"
        : lineIdx==null
          ? `${city.name} — Select a Line`
          : `${city.name} ${line.name}`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#070a10}button{font-family:'DM Mono',monospace}`}</style>
      <div style={{minHeight:"100vh",background:"#070a10",color:"#d8d8d8",fontFamily:"'DM Mono',monospace",paddingBottom:60}}>

        {/* Header */}
        <div style={{background:"linear-gradient(180deg,#0d1117 0%,transparent 100%)",padding:"24px 20px 18px",textAlign:"center",borderBottom:"1px solid #151520"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:5}}>
            <span style={{fontSize:26}}>🧸</span>
            <EditableTitle/>
          </div>
          <div style={{fontSize:11,color:"#888",letterSpacing:1}}>{subtitle}</div>
        </div>

        {/* Breadcrumb */}
        {activityIdx!=null && (
          <div style={{padding:"6px 20px",borderBottom:"1px solid #0f0f18",fontSize:10,color:"#666",display:"flex",gap:4,alignItems:"center"}}>
            <span style={{cursor:"pointer",color:"#4cc9f070"}} onClick={goHome}>Activities</span>
            {activityIdx===1 && <>
              <span>›</span>
              <span style={{color:"#4cc9f0"}}>Elevator Simulator</span>
            </>}
            {activityIdx===0 && <>
              <span>›</span>
              <span style={cityIdx==null?{color:"#4cc9f0"}:{cursor:"pointer",color:"#4cc9f070"}} onClick={cityIdx!=null?()=>{setCityIdx(null);setLineIdx(null);}:undefined}>Metro Soundboard</span>
              {cityIdx!=null && <>
                <span>›</span>
                <span style={lineIdx==null?{color:"#4cc9f0"}:{cursor:"pointer",color:"#4cc9f070"}} onClick={lineIdx!=null?()=>setLineIdx(null):undefined}>{city.name}</span>
              </>}
              {lineIdx!=null && <><span>›</span><span style={{color:"#4cc9f0"}}>{line.name}</span></>}
            </>}
          </div>
        )}

        {/* Content */}
        <div style={{padding:20,maxWidth:1080,margin:"0 auto"}}>
          {activityIdx==null && <ActivityPicker onSelect={setActivityIdx}/>}
          {activityIdx===0 && cityIdx==null && <CityPicker onSelect={i=>{setCityIdx(i);setLineIdx(null);}}/>}
          {activityIdx===0 && cityIdx!=null && lineIdx==null && <LinePicker city={city} onSelect={setLineIdx} onBack={()=>{setCityIdx(null);setLineIdx(null);}}/>}
          {activityIdx===0 && lineData && <StationView key={`${cityIdx}-${lineIdx}`} lineData={lineData} cityLines={city.lines} onBack={()=>{setLineIdx(null);setFlyStation(null);}} initialStationIdx={flyStation} onFly={handleFly} onTransfer={handleTransfer}/>}
          {activityIdx===1 && <ElevatorSimulator onBack={goHome}/>}
        </div>

        {/* Footer */}
        <div style={{textAlign:"center",padding:"16px 20px",fontSize:10,color:"#585870",borderTop:"1px solid #0f0f18",marginTop:20}}>
          Compiled on {__BUILD_TIME__}
        </div>

      </div>
    </>
  );
}
