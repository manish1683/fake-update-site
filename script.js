let percent = 0;
let interval = null;
let currentOS = 'win10';

const messages = {
  win10: [
    "Working on updates",
    "Installing drivers",
    "Configuring system",
    "Applying changes",
    "Almost done"
  ],
  win11: [
    "Getting things ready",
    "Installing features",
    "Optimizing for your device",
    "Almost there",
    "Finishing up"
  ]
};

const speedMap = { slow: 120, normal: 60, fast: 20 };

// Read URL params (shareable link support)
const params = new URLSearchParams(location.search);
if (params.get('autostart') === '1') {
  document.getElementById('settings-panel').style.display = 'none';
  const os = params.get('os') || 'win10';
  const spd = params.get('speed') || 'normal';
  const msg = params.get('msg') || '';
  if (msg) overrideMessages(os, msg);
  startPrank(os, spd);
}

document.getElementById('start-btn').addEventListener('click', () => {
  const os = document.getElementById('os-select').value;
  const spd = document.getElementById('speed-select').value;
  const msg = document.getElementById('custom-msg').value.trim();
  if (msg) overrideMessages(os, msg);
  document.getElementById('settings-panel').style.display = 'none';
  document.getElementById('gear-btn').style.display = 'flex';
  startPrank(os, spd);
});

document.getElementById('share-btn').addEventListener('click', () => {
  const os = document.getElementById('os-select').value;
  const spd = document.getElementById('speed-select').value;
  const msg = document.getElementById('custom-msg').value.trim();
  const url = `${location.origin}${location.pathname}?autostart=1&os=${os}&speed=${spd}&msg=${encodeURIComponent(msg)}`;
  navigator.clipboard.writeText(url);
  document.getElementById('share-btn').textContent = '✅ Copied!';
  setTimeout(() => document.getElementById('share-btn').textContent = '🔗 Copy Prank Link', 2000);
});

document.getElementById('gear-btn').addEventListener('click', () => {
  clearInterval(interval);
  percent = 0;
  document.getElementById('settings-panel').style.display = 'flex';
  document.getElementById('gear-btn').style.display = 'none';
  document.querySelectorAll('.os-screen').forEach(s => s.classList.remove('active'));
});

// Block F5 / right-click for realism
document.addEventListener('keydown', e => {
  if (['F5','F11'].includes(e.key) || (e.ctrlKey && ['r','w','R','W'].includes(e.key))) {
    e.preventDefault();
  }
});
document.addEventListener('contextmenu', e => e.preventDefault());

function overrideMessages(os, msg) {
  if (os === 'bsod') return;
  messages[os] = [msg, msg + '..', msg + '...', 'Still ' + msg, 'Finishing ' + msg];
}

function startPrank(os, speed) {
  currentOS = os;
  document.querySelectorAll('.os-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(os + '-screen').classList.add('active');

  // Request fullscreen
  document.documentElement.requestFullscreen?.().catch(() => {});

  percent = 0;
  const delay = speedMap[speed] || 60;

  interval = setInterval(() => {
    percent++;
    updateUI(os, percent);

    if (percent >= 100) {
      clearInterval(interval);
      // Trigger fake BSOD after win10/win11 completes
      if (os !== 'bsod') {
        setTimeout(() => {
          document.getElementById(os + '-screen').classList.remove('active');
          document.getElementById('bsod-screen').classList.add('active');
          startPrank('bsod', 'normal');
        }, 1500);
      } else {
        setTimeout(() => {
          document.getElementById('settings-panel').style.display = 'flex';
          document.getElementById('gear-btn').style.display = 'none';
          document.getElementById('bsod-screen').classList.remove('active');
          document.exitFullscreen?.();
        }, 3000);
      }
    }
  }, delay);
}

function updateUI(os, p) {
  const msgList = messages[os] || messages['win10'];
  const msgIndex = Math.min(Math.floor(p / 20), msgList.length - 1);

  if (os === 'win10') {
    document.getElementById('status-text').textContent = msgList[msgIndex];
    document.getElementById('percent-display').textContent = p + '% complete';
    document.getElementById('progress-bar').style.width = p + '%';
  } else if (os === 'win11') {
    document.getElementById('win11-status').textContent = msgList[msgIndex];
    document.getElementById('win11-percent').textContent = p + '%';
  } else if (os === 'bsod') {
    document.getElementById('bsod-percent').textContent = p + '% complete';
  }
}

document.getElementById('start-btn').addEventListener('click', () => {
  const os = document.getElementById('os-select').value;
  const spd = document.getElementById('speed-select').value;
  const msg = document.getElementById('custom-msg').value.trim();
  if (msg) overrideMessages(os, msg);
  document.getElementById('settings-panel').style.display = 'none';
  document.getElementById('gear-btn').style.display = 'flex';

  // Track prank start
  if (typeof gtag !== 'undefined') trackPrankStart(os, spd);

  startPrank(os, spd);
});

document.getElementById('share-btn').addEventListener('click', () => {
  // existing share code...

  // Track link copied
  if (typeof gtag !== 'undefined') trackLinkCopied();
});