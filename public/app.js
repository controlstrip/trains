const cityPicker = document.getElementById('city-picker');
const linePicker = document.getElementById('line-picker');
const stationView = document.getElementById('station-view');
const audioPanel = document.getElementById('audio-panel');

const cityButtons = document.getElementById('city-buttons');
const lineButtons = document.getElementById('line-buttons');
const linePickerTitle = document.getElementById('line-picker-title');
const stationViewTitle = document.getElementById('station-view-title');
const lineDiagram = document.getElementById('line-diagram');
const audioStationName = document.getElementById('audio-station-name');
const audioButtonsContainer = document.getElementById('audio-buttons');

let metroData = [];
let currentCityIndex = null;
let currentLineIndex = null;
let currentStations = [];
let currentLineColor = '';
let currentLineName = '';
let currentCityName = '';
let currentSystemName = '';

// Speech synthesis setup
const synth = window.speechSynthesis;

function speak(text) {
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Try to pick a clear English voice
  const voices = synth.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (preferred) utterance.voice = preferred;

  return new Promise(resolve => {
    utterance.onend = resolve;
    utterance.onerror = resolve;
    synth.speak(utterance);
  });
}

// Ensure voices are loaded
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();

async function loadMetroData() {
  const res = await fetch('/api/metros');
  metroData = await res.json();
  renderCities();
}

function renderCities() {
  cityButtons.innerHTML = '';
  metroData.forEach((city, i) => {
    const btn = document.createElement('button');
    btn.className = 'city-btn';
    btn.textContent = `${city.name} (${city.system})`;
    btn.addEventListener('click', () => selectCity(i));
    cityButtons.appendChild(btn);
  });
}

function selectCity(index) {
  currentCityIndex = index;
  const city = metroData[index];

  linePickerTitle.textContent = `${city.name} - Select a Line`;
  lineButtons.innerHTML = '';

  city.lines.forEach((line, i) => {
    const btn = document.createElement('button');
    btn.className = 'line-btn';
    btn.textContent = line.name;
    btn.style.background = line.color;
    btn.style.color = line.textColor;
    btn.addEventListener('click', () => selectLine(i));
    lineButtons.appendChild(btn);
  });

  cityPicker.classList.add('hidden');
  linePicker.classList.remove('hidden');
  stationView.classList.add('hidden');
  audioPanel.classList.add('hidden');
}

async function selectLine(index) {
  currentLineIndex = index;

  const res = await fetch(`/api/metros/${currentCityIndex}/lines/${currentLineIndex}`);
  const data = await res.json();

  currentStations = data.stations;
  currentLineColor = data.color;
  currentLineName = data.line;
  currentCityName = data.city;
  currentSystemName = data.system;

  stationViewTitle.textContent = `${data.city} ${data.system} - ${data.line}`;

  renderStationDiagram();

  linePicker.classList.add('hidden');
  stationView.classList.remove('hidden');
  audioPanel.classList.add('hidden');
}

function renderStationDiagram() {
  lineDiagram.innerHTML = '';

  const diagram = document.createElement('div');
  diagram.className = 'line-diagram';

  const track = document.createElement('div');
  track.className = 'line-track';
  track.style.background = currentLineColor;
  diagram.appendChild(track);

  currentStations.forEach((station, i) => {
    const stop = document.createElement('div');
    stop.className = 'station-stop';
    stop.dataset.index = i;

    const dot = document.createElement('div');
    dot.className = 'station-dot';
    dot.style.borderColor = currentLineColor;

    const name = document.createElement('div');
    name.className = 'station-name';
    name.textContent = station;

    stop.appendChild(dot);
    stop.appendChild(name);
    stop.addEventListener('click', () => selectStation(i));

    diagram.appendChild(stop);
  });

  lineDiagram.appendChild(diagram);
}

function selectStation(index) {
  // Clear previous active
  document.querySelectorAll('.station-stop').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.station-stop')[index].classList.add('active');

  const station = currentStations[index];
  const prevStation = index > 0 ? currentStations[index - 1] : null;
  const nextStation = index < currentStations.length - 1 ? currentStations[index + 1] : null;
  const isFirst = index === 0;
  const isLast = index === currentStations.length - 1;

  audioStationName.textContent = station;
  audioButtonsContainer.innerHTML = '';

  const announcements = [];

  // "Now arriving" announcement
  announcements.push({
    label: `"Now arriving: ${station}"`,
    text: `Now arriving... ${station}.`,
    className: 'now-arriving',
    icon: '\u{1F6A8}'
  });

  // "You are now at" announcement
  announcements.push({
    label: `"You are now at ${station}"`,
    text: `You are now at ${station}. ${currentLineName}, ${currentSystemName}.`,
    className: 'now-at',
    icon: '\u{1F4CD}'
  });

  // "Next station" announcement
  if (nextStation) {
    announcements.push({
      label: `"Next station: ${nextStation}"`,
      text: `Next station... ${nextStation}.`,
      className: 'next-station',
      icon: '\u{27A1}\u{FE0F}'
    });
  }

  // Previous station (going the other direction)
  if (prevStation) {
    announcements.push({
      label: `"Next station: ${prevStation}"`,
      text: `Next station... ${prevStation}.`,
      className: 'next-station',
      icon: '\u{2B05}\u{FE0F}'
    });
  }

  // Doors announcement
  announcements.push({
    label: '"Doors opening"',
    text: 'Doors opening. Please stand clear of the doors.',
    className: 'doors',
    icon: '\u{1F6AA}'
  });

  announcements.push({
    label: '"Doors closing"',
    text: 'Step back. Doors closing. Please stand clear of the closing doors.',
    className: 'doors',
    icon: '\u{26A0}\u{FE0F}'
  });

  // Terminus announcements
  if (isFirst || isLast) {
    const direction = isFirst ? currentStations[currentStations.length - 1] : currentStations[0];
    announcements.push({
      label: `"This is the last stop"`,
      text: `This is ${station}. This is the last stop on this train. All passengers must exit. Thank you for riding ${currentSystemName}.`,
      className: 'terminus',
      icon: '\u{1F6D1}'
    });
    announcements.push({
      label: `"Service to ${direction}"`,
      text: `This train is now in service to ${direction}. ${currentLineName}.`,
      className: 'terminus',
      icon: '\u{1F504}'
    });
  }

  // Transfer announcement if station name suggests a hub
  if (station.includes('Center') || station.includes('Square') || station.includes('Junction') ||
      station.includes('Plaza') || station.includes('Five Points') || station.includes('Metro Center') ||
      station.includes('Gallery') || station.includes('Clark/Lake') || station.includes('Times Sq') ||
      station.includes('Grand Central') || station.includes('Embarcadero') || station.includes('Howard') ||
      station.includes('Lindbergh') || station.includes('L\'Enfant') || station.includes('Fort Totten') ||
      station.includes('Rosslyn') || station.includes('MacArthur') || station.includes('12th St')) {
    announcements.push({
      label: '"Transfer available"',
      text: `Transfer is available at ${station}. Please check station signage for connecting services.`,
      className: 'transfer',
      icon: '\u{1F500}'
    });
  }

  announcements.forEach(a => {
    const btn = document.createElement('button');
    btn.className = `audio-btn ${a.className}`;
    btn.innerHTML = `<span class="icon">${a.icon}</span> ${a.label}`;
    btn.addEventListener('click', async () => {
      // Remove playing from all
      document.querySelectorAll('.audio-btn').forEach(b => b.classList.remove('playing'));
      btn.classList.add('playing');
      await speak(a.text);
      btn.classList.remove('playing');
    });
    audioButtonsContainer.appendChild(btn);
  });

  audioPanel.classList.remove('hidden');

  // Scroll the audio panel into view
  audioPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Navigation
document.getElementById('back-to-cities').addEventListener('click', () => {
  linePicker.classList.add('hidden');
  cityPicker.classList.remove('hidden');
  stationView.classList.add('hidden');
  audioPanel.classList.add('hidden');
});

document.getElementById('back-to-lines').addEventListener('click', () => {
  stationView.classList.add('hidden');
  audioPanel.classList.add('hidden');
  linePicker.classList.remove('hidden');
});

// Init
loadMetroData();
