const getValue = (id) => document.getElementById(id)?.value;
const setText = (id, text) => {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
};

const updateProgressBadge = (value) => {
  const badgeValue = value ? `Today: ${value}/100` : 'No score yet';
  setText('dailyProgressBadge', badgeValue);
};

const loadSavedHealthScore = () => {
  const saved = localStorage.getItem('todayScore');
  const resultEl = document.getElementById('dailyResult');
  if (saved && resultEl) {
    resultEl.innerText = `Last saved daily health score: ${saved}/100`;
  }
  updateProgressBadge(saved);
};

const loadHealthProgress = () => {
  const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
  if (history.length === 0) {
    updateHealthProgress(0, 0, 'n/a');
    updateHistoryList([]);
    return;
  }
  const sorted = history.slice().sort((a, b) => b.date.localeCompare(a.date));
  const recent = sorted[0]?.score || 0;
  let streak = 0;
  const today = new Date();
  const ms = 24 * 60 * 60 * 1000;

  for (let i = 0; i < sorted.length; i += 1) {
    const recordDate = new Date(sorted[i].date + 'T00:00:00');
    const diff = Math.round((today - recordDate) / ms);
    if (diff === streak && sorted[i].score >= 50) {
      streak += 1;
    } else {
      break;
    }
  }

  updateHealthProgress(recent, streak, recent ? `${recent}/100` : 'n/a');
  updateHistoryList(sorted.slice(0, 3));
};

const updateHistoryList = (historyItems) => {
  const list = document.getElementById('healthHistoryItems');
  if (!list) return;

  list.innerHTML = '';
  if (!historyItems || historyItems.length === 0) {
    list.innerHTML = '<li class="list-group-item px-0 text-muted">No health history yet.</li>';
    return;
  }

  historyItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'list-group-item px-0';
    li.innerHTML = `<strong>${item.date}</strong>: ${item.score}/100`;
    list.appendChild(li);
  });
};

const updateHealthProgress = (total, streak, labelText) => {
  const progressBar = document.getElementById('healthProgressBar');
  const progressLabel = document.getElementById('healthProgressLabel');
  const streakEl = document.getElementById('healthStreak');
  const recentEl = document.getElementById('recentHealthScore');

  if (progressBar) {
    const width = Math.max(0, Math.min(100, total));
    progressBar.style.width = `${width}%`;
    progressBar.setAttribute('aria-valuenow', width);
  }
  if (progressLabel) {
    progressLabel.innerText = labelText ? `Latest wellness progress: ${labelText}` : 'Wellness progress will appear here.';
  }
  if (streakEl) streakEl.innerText = streak;
  if (recentEl) recentEl.innerText = labelText;
};

const setActiveNavLink = () => {
  const links = document.querySelectorAll('nav ul li a');
  const current = window.location.pathname.split('/').pop();
  links.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === current || (link.getAttribute('href') === './index.html' && current === '')) {
      link.classList.add('active');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  loadSavedHealthScore();
  loadHealthProgress();
  setActiveNavLink();
  initLocalResourcesPage();
  initFirstAidPage();
});

function dailyCheck() {
  const sleep = parseInt(getValue('dailySleep')) || 0;
  const water = parseInt(getValue('dailyWater')) || 0;
  const exercise = parseInt(getValue('dailyExercise')) || 0;
  const mood = parseInt(getValue('dailyMood')) || 1;
  let score = 0;

  if (sleep >= 7) score += 30;
  else if (sleep >= 5) score += 15;

  if (water >= 8) score += 20;
  else if (water >= 5) score += 10;

  if (exercise >= 30) score += 30;
  else if (exercise >= 15) score += 15;

  score += mood * 5;

  let message = "⚠️ Try to take better care today";
  if (score >= 80) message = "🌟 Great job!";
  else if (score >= 50) message = "👍 Keep improving!";

  const result = `Today's Score: ${score}/100 — ${message}`;
  localStorage.setItem('todayScore', score);
  setText('dailyResult', result);
  updateProgressBadge(score);
}

function showMotivation() {
  const quotes = [
    "Small steps every day lead to big results 💪",
    "Your health is your greatest wealth 🧠",
    "Consistency beats motivation 🔥",
    "Take care of your body, it’s the only place you live 🏡",
    "Progress, not perfection 🌱",
    "A healthy mind starts with a healthy body ⚖️",
    "You don’t have to be extreme, just consistent 🚀",
    "Every workout is a step forward 🏃",
    "Rest is also part of progress 😌",
    "You are stronger than you think 💥"
  ];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  setText('motivationText', quotes[randomIndex]);
}

function generatePlan() {
  const goal = getValue('goal');
  let result = '';

  if (!goal) {
    result = '<p class="text-danger">Please select a training goal.</p>';
  } else if (goal === 'lose') {
    result = `
      <div class="card p-4">
        <h5>🔥 Lose Weight Plan</h5>
        <div class="mt-3">Mon: 30 min cardio + abs</div>
        <div class="mt-2">Tue: HIIT session</div>
        <div class="mt-2">Wed: Rest or light walk</div>
        <div class="mt-2">Thu: Cardio + lower body</div>
        <div class="mt-2">Fri: Full body strength</div>
        <div class="mt-2">Sat: Jogging or cycling</div>
        <div class="mt-2">Sun: Recovery stretch</div>
      </div>
    `;
  } else if (goal === 'maintain') {
    result = `
      <div class="card p-4">
        <h5>⚖️ Maintain Wellness Plan</h5>
        <div class="mt-3">Mon: Balanced full-body workout</div>
        <div class="mt-2">Tue: Light cardio and mobility</div>
        <div class="mt-2">Wed: Strength training</div>
        <div class="mt-2">Thu: Active recovery</div>
        <div class="mt-2">Fri: Core and flexibility</div>
        <div class="mt-2">Sat: Outdoor activity</div>
        <div class="mt-2">Sun: Rest and reflection</div>
      </div>
    `;
  } else if (goal === 'gain') {
    result = `
      <div class="card p-4">
        <h5>💪 Gain Muscle Plan</h5>
        <div class="mt-3">Mon: Chest and triceps</div>
        <div class="mt-2">Tue: Back and biceps</div>
        <div class="mt-2">Wed: Recovery day</div>
        <div class="mt-2">Thu: Legs and glutes</div>
        <div class="mt-2">Fri: Shoulders and core</div>
        <div class="mt-2">Sat: Light cardio</div>
        <div class="mt-2">Sun: Rest and stretch</div>
      </div>
    `;
  }

  const resultElement = document.getElementById('planResult');
  if (resultElement) resultElement.innerHTML = result;
}

let bmiScore = 0;
let lifestyleScore = 0;
let nutritionScore = 0;
let mentalScore = 0;

function calculateBMI() {
  const heightValue = parseFloat(getValue('height')) || 0;
  const weightValue = parseFloat(getValue('weight')) || 0;
  const bmiResultEl = document.getElementById('bmiResult');

  if (!heightValue || !weightValue) {
    if (bmiResultEl) bmiResultEl.innerText = 'Enter valid values';
    return;
  }

  const h = heightValue / 100;
  const bmi = (weightValue / (h * h)).toFixed(1);
  let status = '';

  if (bmi < 18.5) {
    status = 'Underweight';
    bmiScore = 10;
  } else if (bmi < 25) {
    status = 'Normal';
    bmiScore = 30;
  } else if (bmi < 30) {
    status = 'Overweight';
    bmiScore = 20;
  } else {
    status = 'Obese';
    bmiScore = 10;
  }

  if (bmiResultEl) bmiResultEl.innerText = `BMI: ${bmi} (${status})`;
}

function generateWorkout() {
  const goalValue = getValue('goal');
  let text = 'Select a goal to generate a workout.';

  if (goalValue === 'lose') text = 'Try a cardio and interval training session.';
  else if (goalValue === 'gain') text = 'Focus on compound lifts and heavier resistance.';
  else if (goalValue === 'maintain') text = 'Choose a balanced mix of strength and cardio.';

  setText('workoutResult', text);
}

function checkFood() {
  const water = parseInt(getValue('water')) || 0;
  const quality = getValue('foodQuality');
  nutritionScore = 0;

  if (water >= 8) nutritionScore += 20;
  else if (water >= 5) nutritionScore += 10;

  if (quality === 'high') nutritionScore += 20;
  else if (quality === 'medium') nutritionScore += 10;

  setText('foodResult', `Nutrition score: ${nutritionScore}/40`);
}

function checkMental() {
  const moodValue = parseInt(getValue('mood')) || 1;
  const stressValue = parseInt(getValue('stress')) || 1;
  mentalScore = Math.max(0, (moodValue - stressValue + 3) * 10);
  setText('mentalResult', `Mental score: ${mentalScore}/60`);
}

function calculateLifestyle() {
  const sleep = parseInt(getValue('sleepHours')) || 0;
  const exercise = parseInt(getValue('exerciseMin')) || 0;
  lifestyleScore = 0;

  if (sleep >= 7) lifestyleScore += 30;
  else if (sleep >= 5) lifestyleScore += 15;

  if (exercise >= 30) lifestyleScore += 30;
  else if (exercise >= 15) lifestyleScore += 15;

  setText('lifeResult', `Lifestyle score: ${lifestyleScore}/60`);
}

function saveHealthHistory(total) {
  const today = new Date().toISOString().slice(0, 10);
  const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
  const filtered = history.filter((record) => record.date !== today);
  filtered.push({ date: today, score: total });
  localStorage.setItem('healthHistory', JSON.stringify(filtered));
}

function clearHealthHistory() {
  if (!confirm('Clear all saved health history? This cannot be undone.')) {
    return;
  }

  localStorage.removeItem('healthHistory');
  updateHealthProgress(0, 0, 'n/a');
  updateHistoryList([]);
  setText('totalScore', 'Not calculated yet');
  setText('recentHealthScore', 'n/a');
  setText('healthStreak', '0');
}

function calculateTotal() {
  const rawTotal = bmiScore + lifestyleScore + nutritionScore + mentalScore;
  const maxScore = 190;
  const total = Math.round((rawTotal / maxScore) * 100);
  let status = '⚠️ Needs improvement';

  if (total >= 80) status = '🌟 Excellent';
  else if (total >= 50) status = '👍 Good';

  setText('totalScore', `Total Score: ${total}/100 (${status})`);
  updateHealthProgress(total, 0, `${total}/100`);
  saveHealthHistory(total);
  loadHealthProgress();
}

const resourceData = [
  // North Taiwan Clinics
  {
    id: 'taipei-community-health',
    name: 'Taipei Community Health Center',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 199, Section 2, Zhongshan N Rd, Taipei City',
    phone: '+886 2 1234-5678',
    description: 'Local community clinic offering family medicine, vaccinations, and health education.',
    coords: [25.0538, 121.5433],
  },
  {
    id: 'new-taipei-family-clinic',
    name: 'New Taipei Family Clinic',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 22, Wenhua Rd, Banqiao District, New Taipei City',
    phone: '+886 2 2345-6789',
    description: 'Family practice center with pediatric care, senior checkups, and wellness screening.',
    coords: [25.0119, 121.4628],
  },
  {
    id: 'taoyuan-wellness-clinic',
    name: 'Taoyuan Wellness Clinic',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 56, Zhongzheng Rd, Taoyuan District, Taoyuan City',
    phone: '+886 3 7654-3210',
    description: 'Primary care clinic focusing on preventive health and chronic disease management.',
    coords: [24.9892, 121.3085],
  },
  {
    id: 'hsinchu-general-practice',
    name: 'Hsinchu General Practice',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 8, Zhonghua Rd, East District, Hsinchu City',
    phone: '+886 3 532-1122',
    description: 'Community medical clinic offering general consultations and family health services.',
    coords: [24.8036, 120.9686],
  },
  {
    id: 'keelung-harbor-clinic',
    name: 'Keelung Harbor Clinic',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 110, Zhongzheng Rd, Ren’ai District, Keelung City',
    phone: '+886 2 2465-9987',
    description: 'Harbor-area clinic with travel health advice and emergency first response support.',
    coords: [25.1303, 121.7392],
  },
  {
    id: 'miaoli-family-care',
    name: 'Miaoli Family Care Clinic',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 78, Gongyuan Rd, Miaoli City',
    phone: '+886 37 222-3344',
    description: 'Regional clinic for families and older adults with preventive and chronic care.',
    coords: [24.5649, 120.8205],
  },
  {
    id: 'jungli-health-center',
    name: 'Jungli Health Center',
    category: 'Clinic',
    region: 'North Taiwan',
    address: 'No. 86, Zhongzheng Rd, Zhongli District, Taoyuan City',
    phone: '+886 3 4567-8901',
    description: 'Health center providing checkups, vaccinations, and family planning support.',
    coords: [24.9618, 121.2167],
  },

  // North Taiwan Pharmacies
  {
    id: 'taoyuan-pharmacy-care',
    name: 'Taoyuan Pharmacy Care',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 88, Section 3, Fuxing Rd, Taoyuan City',
    phone: '+886 3 987-6543',
    description: 'Pharmacy services with medication counseling, refills, and vaccinations.',
    coords: [24.9936, 121.3000],
  },
  {
    id: 'taipei-city-pharmacy',
    name: 'Taipei City Pharmacy',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 45, Ren’ai Rd, Da’an District, Taipei City',
    phone: '+886 2 8765-4321',
    description: '24-hour pharmacy offering prescription delivery and health supplements.',
    coords: [25.0329, 121.5435],
  },
  {
    id: 'keelung-central-pharmacy',
    name: 'Keelung Central Pharmacy',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 3, Ren’ai Rd, Zhongzheng District, Keelung City',
    phone: '+886 2 2422-3344',
    description: 'Medication refills, travel health products, and emergency supplies.',
    coords: [25.1339, 121.7390],
  },
  {
    id: 'hsinchu-health-pharmacy',
    name: 'Hsinchu Health Pharmacy',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 152, Guangfu Rd, East District, Hsinchu City',
    phone: '+886 3 523-6677',
    description: 'Community pharmacy with patient counseling and diabetes support services.',
    coords: [24.8060, 120.9763],
  },
  {
    id: 'xinbei-sun-pharmacy',
    name: 'Xinbei Sun Pharmacy',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 210, Wenhua Rd, Banqiao District, New Taipei City',
    phone: '+886 2 2965-2211',
    description: 'Pharmacy with vaccinations, home delivery, and healthy living advice.',
    coords: [25.0050, 121.4635],
  },
  {
    id: 'miaoli-wellness-pharmacy',
    name: 'Miaoli Wellness Pharmacy',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 12, Daxue Rd, Miaoli City',
    phone: '+886 37 334-455',
    description: 'Friendly pharmacy specializing in pediatric medicine and chronic condition support.',
    coords: [24.5623, 120.8208],
  },
  {
    id: 'banciao-care-pharmacy',
    name: 'Banqiao Care Pharmacy',
    category: 'Pharmacy',
    region: 'North Taiwan',
    address: 'No. 5, Zhongshan Rd, Banqiao District, New Taipei City',
    phone: '+886 2 2958-8899',
    description: 'Convenient pharmacy close to transit hubs with health consultation services.',
    coords: [25.0146, 121.4624],
  },

  // North Taiwan Mental Health
  {
    id: 'taipei-mind-support',
    name: 'Taipei Mind Support Center',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 5, Xinyi Rd, Xinyi District, Taipei City',
    phone: '+886 2 9999-1111',
    description: 'Mental wellness center with counseling, group therapy, and resilience workshops.',
    coords: [25.0330, 121.5654],
  },
  {
    id: 'new-taipei-counseling-hub',
    name: 'New Taipei Counseling Hub',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 60, Wenhua Rd, Banqiao District, New Taipei City',
    phone: '+886 2 8965-8833',
    description: 'Professional counseling for adults, youth, and families with crisis support.',
    coords: [25.0131, 121.4620],
  },
  {
    id: 'taoyuan-serenity-clinic',
    name: 'Taoyuan Serenity Clinic',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 18, Chenggong Rd, Taoyuan District, Taoyuan City',
    phone: '+886 3 3322-4455',
    description: 'Clinic offering stress management, meditation courses, and therapy support.',
    coords: [24.9870, 121.3019],
  },
  {
    id: 'hsinchu-mental-health-center',
    name: 'Hsinchu Mental Health Center',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 7, Zhongzheng Rd, East District, Hsinchu City',
    phone: '+886 3 523-9876',
    description: 'Mental health services for students, families, and working professionals.',
    coords: [24.8088, 120.9681],
  },
  {
    id: 'keelung-emotional-wellness',
    name: 'Keelung Emotional Wellness',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 99, Zhongshan Rd, Ren’ai District, Keelung City',
    phone: '+886 2 2468-0099',
    description: 'Support services and workshops for coping with anxiety and depression.',
    coords: [25.1285, 121.7391],
  },
  {
    id: 'miaoli-community-mental-health',
    name: 'Miaoli Community Mental Health Center',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 33, Zhongzheng Rd, Miaoli City',
    phone: '+886 37 666-777',
    description: 'Local mental health programs for families, seniors, and youth.',
    coords: [24.5680, 120.8182],
  },
  {
    id: 'taipei-youth-support',
    name: 'Taipei Youth Support Clinic',
    category: 'Mental Health',
    region: 'North Taiwan',
    address: 'No. 120, Renai Rd, Daan District, Taipei City',
    phone: '+886 2 7788-9900',
    description: 'Youth-focused mental health counseling and peer support groups.',
    coords: [25.0268, 121.5402],
  },

  // North Taiwan Urgent Care
  {
    id: 'taoyuan-urgent-care-clinic',
    name: 'Taoyuan Urgent Care Clinic',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 152, Zhongzheng Rd, Taoyuan City',
    phone: '+886 3 555-1212',
    description: 'Urgent care for non-life-threatening injuries and illnesses with evening hours.',
    coords: [24.9876, 121.3051],
  },
  {
    id: 'taipei-rapid-response',
    name: 'Taipei Rapid Response Clinic',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 14, Sec. 1, Zhongshan S Rd, Taipei City',
    phone: '+886 2 2588-1122',
    description: 'Quick urgent care for sprains, fevers, and minor diagnostic services.',
    coords: [25.0417, 121.5315],
  },
  {
    id: 'keelung-quickcare',
    name: 'Keelung QuickCare Center',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 1, Ren’ai Rd, Zhongzheng District, Keelung City',
    phone: '+886 2 2427-8899',
    description: 'Urgent treatment center with fast triage and injury care.',
    coords: [25.1384, 121.7394],
  },
  {
    id: 'hsinchu-emergency-center',
    name: 'Hsinchu Emergency Care Center',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 88, Guangfu Rd, East District, Hsinchu City',
    phone: '+886 3 564-1122',
    description: 'Emergency support for non-critical conditions with walk-in availability.',
    coords: [24.8032, 120.9756],
  },
  {
    id: 'new-taipei-express-clinic',
    name: 'New Taipei Express Clinic',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 24, Wenhua Rd, Banqiao District, New Taipei City',
    phone: '+886 2 2960-1234',
    description: 'Express urgent care for minor injuries, high fevers, and quick diagnostics.',
    coords: [25.0142, 121.4628],
  },
  {
    id: 'miaoli-urgent-care',
    name: 'Miaoli Urgent Care',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 66, Ren’ai Rd, Miaoli City',
    phone: '+886 37 333-121',
    description: 'Local urgent care offering same-day treatment for minor emergencies.',
    coords: [24.5687, 120.8186],
  },
  {
    id: 'banciao-immediate-care',
    name: 'Banqiao Immediate Care',
    category: 'Urgent Care',
    region: 'North Taiwan',
    address: 'No. 180, Zhongshan Rd, Banqiao District, New Taipei City',
    phone: '+886 2 2959-6622',
    description: 'Immediate care service for urgent medical needs near the train station.',
    coords: [25.0139, 121.4621],
  },

  // South Taiwan Clinics
  {
    id: 'kaohsiung-community-clinic',
    name: 'Kaohsiung Community Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 3, Qixian 1st Rd, Sanmin District, Kaohsiung City',
    phone: '+886 7 1234-5678',
    description: 'Community clinic providing family medicine and chronic care management.',
    coords: [22.6273, 120.3014],
  },
  {
    id: 'tainan-health-clinic',
    name: 'Tainan Health Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 30, Minsheng Rd, East District, Tainan City',
    phone: '+886 6 2345-6789',
    description: 'Health clinic offering preventive screening and maternal care services.',
    coords: [22.9995, 120.2257],
  },
  {
    id: 'pingtung-family-care',
    name: 'Pingtung Family Care Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 12, Zhonghua Rd, Pingtung City',
    phone: '+886 8 7654-3210',
    description: 'Family clinic with child health checks and adult wellness visits.',
    coords: [22.6731, 120.4818],
  },
  {
    id: 'chiayi-wellness-clinic',
    name: 'Chiayi Wellness Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 58, Datong Rd, West District, Chiayi City',
    phone: '+886 5 123-4567',
    description: 'Regional wellness clinic focused on prevention, vaccinations, and family health.',
    coords: [23.4808, 120.4471],
  },
  {
    id: 'kaohsiung-coastal-clinic',
    name: 'Kaohsiung Coastal Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 210, Zhongshan 3rd Rd, Gushan District, Kaohsiung City',
    phone: '+886 7 5566-7788',
    description: 'Coastal-area clinic with travel health and community outreach programs.',
    coords: [22.6350, 120.2753],
  },
  {
    id: 'tainan-east-clinic',
    name: 'Tainan East Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 77, Anping Rd, Anping District, Tainan City',
    phone: '+886 6 7890-1234',
    description: 'Primary care clinic offering urgent appointments and wellness checks.',
    coords: [23.0013, 120.1633],
  },
  {
    id: 'pingtung-sunrise-clinic',
    name: 'Pingtung Sunrise Clinic',
    category: 'Clinic',
    region: 'South Taiwan',
    address: 'No. 25, Ren’ai Rd, Pingtung City',
    phone: '+886 8 2345-6677',
    description: 'Clinic specializing in family health, vaccination, and preventive services.',
    coords: [22.6715, 120.4810],
  },

  // South Taiwan Pharmacies
  {
    id: 'kaohsiung-pharmacy-plus',
    name: 'Kaohsiung Pharmacy Plus',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 88, Zhongshan 1st Rd, Xinxing District, Kaohsiung City',
    phone: '+886 7 333-4455',
    description: 'Pharmacy with medicine refills, supplement advice, and home delivery.',
    coords: [22.6274, 120.2999],
  },
  {
    id: 'tainan-harbor-pharmacy',
    name: 'Tainan Harbor Pharmacy',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 11, Anping Rd, Anping District, Tainan City',
    phone: '+886 6 3456-7788',
    description: 'Harbor pharmacy providing travel vaccines and OTC health supplies.',
    coords: [23.0023, 120.1630],
  },
  {
    id: 'chiayi-health-pharmacy',
    name: 'Chiayi Health Pharmacy',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 5, Zhongshan Rd, East District, Chiayi City',
    phone: '+886 5 222-3344',
    description: 'Medication counseling and chronic care supply services.',
    coords: [23.4796, 120.4475],
  },
  {
    id: 'pingtung-family-pharmacy',
    name: 'Pingtung Family Pharmacy',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 66, Ren’ai Rd, Pingtung City',
    phone: '+886 8 333-5566',
    description: 'Family-focused pharmacy with pediatric medications and health screenings.',
    coords: [22.6729, 120.4841],
  },
  {
    id: 'kaohsiung-rapid-pharmacy',
    name: 'Kaohsiung Rapid Pharmacy',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 2, Chenggong 1st Rd, Yancheng District, Kaohsiung City',
    phone: '+886 7 337-8899',
    description: 'Quick-refill pharmacy near the port with travel health products.',
    coords: [22.6293, 120.2845],
  },
  {
    id: 'tainan-city-pharmacy',
    name: 'Tainan City Pharmacy',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 35, Shanxi Rd, West Central District, Tainan City',
    phone: '+886 6 2234-5566',
    description: 'Convenient pharmacy offering medication advice and wellness supplies.',
    coords: [22.9921, 120.2030],
  },
  {
    id: 'chiayi-village-pharmacy',
    name: 'Chiayi Village Pharmacy',
    category: 'Pharmacy',
    region: 'South Taiwan',
    address: 'No. 120, Minsheng Rd, West District, Chiayi City',
    phone: '+886 5 277-8899',
    description: 'Local pharmacy with community outreach and prescription management.',
    coords: [23.4788, 120.4500],
  },

  // South Taiwan Mental Health
  {
    id: 'kaohsiung-mental-wellness-center',
    name: 'Kaohsiung Mental Wellness Center',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 58, Qixian 1st Rd, Sanmin District, Kaohsiung City',
    phone: '+886 7 345-6789',
    description: 'Support services for mental health, counseling, and community resilience programs.',
    coords: [22.6273, 120.3014],
  },
  {
    id: 'tainan-mind-care-center',
    name: 'Tainan Mind Care Center',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 120, Minsheng Rd, East District, Tainan City',
    phone: '+886 6 5566-7788',
    description: 'Counseling, stress reduction programs, and family support services.',
    coords: [22.9973, 120.2189],
  },
  {
    id: 'pingtung-counseling-hub',
    name: 'Pingtung Counseling Hub',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 19, Zhongzheng Rd, Pingtung City',
    phone: '+886 8 1234-5567',
    description: 'Community counseling for depression, anxiety, and life transition support.',
    coords: [22.6738, 120.4821],
  },
  {
    id: 'chiayi-emotional-support',
    name: 'Chiayi Emotional Support Center',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 47, Guangfu Rd, West District, Chiayi City',
    phone: '+886 5 3456-8899',
    description: 'Local center offering therapy sessions and resilience groups.',
    coords: [23.4780, 120.4432],
  },
  {
    id: 'kaohsiung-recovery-center',
    name: 'Kaohsiung Recovery Center',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 66, Jhongjheng 2nd Rd, Lingya District, Kaohsiung City',
    phone: '+886 7 711-2233',
    description: 'Therapeutic programs for mental health recovery and community building.',
    coords: [22.6216, 120.3058],
  },
  {
    id: 'tainan-youth-mental-health',
    name: 'Tainan Youth Mental Health',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 9, Ximen Rd, North District, Tainan City',
    phone: '+886 6 2222-3344',
    description: 'Youth mental health services and peer support programs.',
    coords: [23.0007, 120.2066],
  },
  {
    id: 'pingtung-positive-mind-center',
    name: 'Pingtung Positive Mind Center',
    category: 'Mental Health',
    region: 'South Taiwan',
    address: 'No. 88, Ren’ai Rd, Pingtung City',
    phone: '+886 8 2244-5566',
    description: 'Positive psychology workshops, counseling, and wellbeing classes.',
    coords: [22.6739, 120.4833],
  },

  // South Taiwan Urgent Care
  {
    id: 'tainan-urgent-care-clinic',
    name: 'Tainan Urgent Care Clinic',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 10, Minsheng Rd, East District, Tainan City',
    phone: '+886 6 123-4567',
    description: 'Urgent care for non-life-threatening injuries and immediate treatment.',
    coords: [22.9999, 120.2269],
  },
  {
    id: 'kaohsiung-emergency-care-hub',
    name: 'Kaohsiung Emergency Care Hub',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 500, Zhongshan Rd, Lingya District, Kaohsiung City',
    phone: '+886 7 876-5432',
    description: 'Emergency and urgent care services for southern communities and travelers.',
    coords: [22.6391, 120.3014],
  },
  {
    id: 'pingtung-rapid-response',
    name: 'Pingtung Rapid Response Clinic',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 18, Zhongzheng Rd, Pingtung City',
    phone: '+886 8 2345-6678',
    description: 'Urgent medical attention for accidents, fever, and minor injuries.',
    coords: [22.6724, 120.4817],
  },
  {
    id: 'chiayi-express-clinic',
    name: 'Chiayi Express Clinic',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 7, Zhongshan Rd, East District, Chiayi City',
    phone: '+886 5 5566-7788',
    description: 'Quick urgent care for sprains, infections, and follow-up visits.',
    coords: [23.4797, 120.4466],
  },
  {
    id: 'kaohsiung-sunrise-urgent-care',
    name: 'Kaohsiung Sunrise Urgent Care',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 77, Chenggong 2nd Rd, Qianjin District, Kaohsiung City',
    phone: '+886 7 111-2233',
    description: 'Morning urgent care for immediate treatment and diagnostics.',
    coords: [22.6318, 120.3000],
  },
  {
    id: 'tainan-coastal-urgent-care',
    name: 'Tainan Coastal Urgent Care',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 55, Anping Rd, Anping District, Tainan City',
    phone: '+886 6 4444-5566',
    description: 'Coastal urgent care for travelers and local residents.',
    coords: [23.0020, 120.1637],
  },
  {
    id: 'pingtung-immediate-care',
    name: 'Pingtung Immediate Care',
    category: 'Urgent Care',
    region: 'South Taiwan',
    address: 'No. 101, Zhenxing Rd, Pingtung City',
    phone: '+886 8 5566-7788',
    description: 'Same-day urgent care and short-wait treatment for minor emergencies.',
    coords: [22.6743, 120.4764],
  },

  // East Taiwan Clinics
  {
    id: 'hualien-community-clinic',
    name: 'Hualien Community Clinic',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 60, Zhongshan Rd, Hualien City',
    phone: '+886 3 987-1234',
    description: 'Community clinic offering general practice, maternal care, and preventive services.',
    coords: [23.9739, 121.6075],
  },
  {
    id: 'taitung-community-clinic',
    name: 'Taitung Community Clinic',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 27, Zhongxiao Rd, Taitung City',
    phone: '+886 89 345-678',
    description: 'Community clinic offering general practice, maternal care, and preventive health services.',
    coords: [22.7583, 121.1444],
  },
  {
    id: 'yilan-rural-health-clinic',
    name: 'Yilan Rural Health Clinic',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 18, Zhongshan Rd, Yilan City',
    phone: '+886 3 1234-5678',
    description: 'Rural clinic providing family medicine and community health outreach.',
    coords: [24.7549, 121.7627],
  },
  {
    id: 'hualien-harbor-clinic',
    name: 'Hualien Harbor Clinic',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 210, Zhongshan Rd, Hualien City',
    phone: '+886 3 8765-4321',
    description: 'Clinic near the harbor offering travel health advice and preventive care.',
    coords: [23.9762, 121.6084],
  },
  {
    id: 'taitung-family-care',
    name: 'Taitung Family Care',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 55, Zhongzheng Rd, Taitung City',
    phone: '+886 89 234-5567',
    description: 'Family health clinic with pediatric care and wellness checkups.',
    coords: [22.7545, 121.1474],
  },
  {
    id: 'yilan-wellness-clinic',
    name: 'Yilan Wellness Clinic',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 77, Minquan Rd, Yilan City',
    phone: '+886 3 3456-7788',
    description: 'Wellness clinic offering nutritional counseling and preventive screenings.',
    coords: [24.7578, 121.7551],
  },
  {
    id: 'hualien-sunrise-clinic',
    name: 'Hualien Sunrise Clinic',
    category: 'Clinic',
    region: 'East Taiwan',
    address: 'No. 9, Zhonghua Rd, Hualien City',
    phone: '+886 3 2234-5678',
    description: 'Morning clinic with general health examinations and urgent appointments.',
    coords: [23.9768, 121.6142],
  },

  // East Taiwan Pharmacies
  {
    id: 'hualien-health-pharmacy',
    name: 'Hualien Health Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 10, Zhongshan Rd, Hualien City',
    phone: '+886 3 2222-3344',
    description: 'Pharmacy offering medication refills, supplements, and health consultations.',
    coords: [23.9759, 121.6043],
  },
  {
    id: 'taitung-bay-pharmacy',
    name: 'Taitung Bay Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 88, Gongyuan Rd, Taitung City',
    phone: '+886 89 444-5566',
    description: 'Coastal pharmacy with OTC medicines and traveler health supplies.',
    coords: [22.7572, 121.1449],
  },
  {
    id: 'yilan-forest-pharmacy',
    name: 'Yilan Forest Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 66, Zhongshan Rd, Yilan City',
    phone: '+886 3 3344-5566',
    description: 'Community pharmacy with patient counseling and herbal supplement options.',
    coords: [24.7567, 121.7580],
  },
  {
    id: 'hualien-central-pharmacy',
    name: 'Hualien Central Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 120, Zhonghua Rd, Hualien City',
    phone: '+886 3 2235-6677',
    description: 'Central pharmacy for medication dispensing and health product consultations.',
    coords: [23.9778, 121.6139],
  },
  {
    id: 'taitung-mountain-pharmacy',
    name: 'Taitung Mountain Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 12, Wenhua Rd, Taitung City',
    phone: '+886 89 555-6677',
    description: 'Pharmacy with travel health services and chronic disease medication support.',
    coords: [22.7600, 121.1478],
  },
  {
    id: 'yilan-coastal-pharmacy',
    name: 'Yilan Coastal Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 5, Minquan Rd, Yilan City',
    phone: '+886 3 4455-7788',
    description: 'Coastal pharmacy serving seaside towns with wellness and travel products.',
    coords: [24.7599, 121.7538],
  },
  {
    id: 'hualien-care-pharmacy',
    name: 'Hualien Care Pharmacy',
    category: 'Pharmacy',
    region: 'East Taiwan',
    address: 'No. 33, Zhongshan Rd, Hualien City',
    phone: '+886 3 333-4455',
    description: 'Care pharmacy with prescription delivery and health advice services.',
    coords: [23.9738, 121.6069],
  },

  // East Taiwan Mental Health
  {
    id: 'hualien-emotional-support',
    name: 'Hualien Emotional Support Center',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 22, Zhongshan Rd, Hualien City',
    phone: '+886 3 2468-9900',
    description: 'Mental health services focused on emotional resilience and family support.',
    coords: [23.9750, 121.6080],
  },
  {
    id: 'taitung-wellness-mental-health',
    name: 'Taitung Wellness Mental Health',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 5, Guangfu Rd, Taitung City',
    phone: '+886 89 666-7788',
    description: 'Counseling center for stress management, trauma recovery, and support groups.',
    coords: [22.7540, 121.1460],
  },
  {
    id: 'yilan-community-counseling',
    name: 'Yilan Community Counseling',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 44, Minquan Rd, Yilan City',
    phone: '+886 3 5566-8899',
    description: 'Local counseling hub for individuals and families seeking mental wellness support.',
    coords: [24.7602, 121.7558],
  },
  {
    id: 'hualien-island-mind-center',
    name: 'Hualien Island Mind Center',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 120, Zhonghua Rd, Hualien City',
    phone: '+886 3 333-7788',
    description: 'Island-center for mental health therapy, mindfulness training, and support groups.',
    coords: [23.9765, 121.6130],
  },
  {
    id: 'taitung-harbor-mental-health',
    name: 'Taitung Harbor Mental Health',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 88, Zhongxiao Rd, Taitung City',
    phone: '+886 89 777-8899',
    description: 'Mental health counseling near the harbor with community wellbeing programs.',
    coords: [22.7588, 121.1458],
  },
  {
    id: 'yilan-serene-mind-clinic',
    name: 'Yilan Serene Mind Clinic',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 5, Zhongshan Rd, Yilan City',
    phone: '+886 3 666-7788',
    description: 'Mental health clinic offering therapy, relaxation workshops, and peer groups.',
    coords: [24.7540, 121.7600],
  },
  {
    id: 'hualien-youth-wellness',
    name: 'Hualien Youth Wellness Center',
    category: 'Mental Health',
    region: 'East Taiwan',
    address: 'No. 88, Guoxing St, Hualien City',
    phone: '+886 3 777-8899',
    description: 'Youth mental wellness support with counseling and group activities.',
    coords: [23.9834, 121.6091],
  },

  // East Taiwan Urgent Care
  {
    id: 'hualien-emergency-care-hub',
    name: 'Hualien Emergency Care Hub',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 500, Zhongshan Rd, Hualien City',
    phone: '+886 3 876-5432',
    description: 'Emergency and urgent care services for eastern Taiwan communities and nearby travelers.',
    coords: [23.9739, 121.6075],
  },
  {
    id: 'taitung-urgent-care-center',
    name: 'Taitung Urgent Care Center',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 25, Zhongxiao Rd, Taitung City',
    phone: '+886 89 345-2211',
    description: 'Urgent medical care for travelers and residents in eastern Taiwan.',
    coords: [22.7592, 121.1498],
  },
  {
    id: 'yilan-rapid-response-clinic',
    name: 'Yilan Rapid Response Clinic',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 32, Zhongshan Rd, Yilan City',
    phone: '+886 3 5566-1122',
    description: 'Rapid urgent care for minor injuries and sudden illness in eastern Taiwan.',
    coords: [24.7580, 121.7670],
  },
  {
    id: 'hualien-quickcare',
    name: 'Hualien QuickCare',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 11, Zhonghua Rd, Hualien City',
    phone: '+886 3 2222-7788',
    description: 'Quick access urgent care for non-critical conditions and minor emergencies.',
    coords: [23.9744, 121.6072],
  },
  {
    id: 'taitung-coastal-urgent-care',
    name: 'Taitung Coastal Urgent Care',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 78, Guangfu Rd, Taitung City',
    phone: '+886 89 888-9900',
    description: 'Coastal urgent care center for hill and seaside communities.',
    coords: [22.7575, 121.1484],
  },
  {
    id: 'yilan-immediate-care',
    name: 'Yilan Immediate Care',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 18, Minquan Rd, Yilan City',
    phone: '+886 3 6688-1122',
    description: 'Immediate care service for sudden illness and minor accidents.',
    coords: [24.7574, 121.7547],
  },
  {
    id: 'hualien-mountain-urgent-care',
    name: 'Hualien Mountain Urgent Care',
    category: 'Urgent Care',
    region: 'East Taiwan',
    address: 'No. 90, Zhongshan Rd, Hualien City',
    phone: '+886 3 2333-4455',
    description: 'Urgent care clinic with access to mountain route and tourist areas.',
    coords: [23.9760, 121.6117],
  },
];

const firstAidTopics = [
  {
    id: 'cpr',
    title: 'CPR Basics',
    category: 'Cardiac',
    description: 'Step-by-step guidance on hands-only CPR for adults and children.',
    details: 'Check the scene, call for help, then start chest compressions at 100-120 per minute until help arrives.',
    timerLabel: 'Compression timer',
    timer: 30,
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    category: 'Trauma',
    description: 'How to apply pressure, dress wounds, and elevate injured limbs.',
    details: 'Use sterile gauze or cloth, apply firm pressure directly and keep the injured area elevated.',
    timerLabel: 'Pressure check timer',
    timer: 20,
  },
  {
    id: 'burns',
    title: 'Minor Burns',
    category: 'Skin Care',
    description: 'Cool the burn, cover it with a clean dressing, and avoid applying ice directly.',
    details: 'Run cool water over the burn for 10-15 minutes, then cover with a loose, sterile bandage.',
    timerLabel: 'Cooling timer',
    timer: 15,
  },
  {
    id: 'allergic',
    title: 'Allergic Reaction',
    category: 'Allergy',
    description: 'Recognize symptoms and use an EpiPen if prescribed.',
    details: 'If breathing is difficult or swelling is severe, call emergency services immediately.',
    timerLabel: 'Observation timer',
    timer: 30,
  },
];

const getUniqueValues = (items, key) => [...new Set(items.map((item) => item[key]))];

const getGoogleMapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const populateOptionList = (selectId, values) => {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join('');
};

const renderResourceCards = () => {
  const searchText = getValue('resourceSearch')?.toLowerCase() || '';
  const selectedCategory = getValue('resourceCategory') || 'All';
  const selectedRegion = getValue('resourceRegion') || 'All Taiwan';
  const results = resourceData.filter((resource) => {
    const matchesSearch = [resource.name, resource.description, resource.address]
      .some((field) => field.toLowerCase().includes(searchText));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All Taiwan' || resource.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const cardsContainer = document.getElementById('resourceCards');
  const countLabel = document.getElementById('resourceCount');
  if (countLabel) {
    countLabel.innerText = `${results.length} result${results.length === 1 ? '' : 's'}`;
  }
  if (!cardsContainer) return;

  if (results.length === 0) {
    cardsContainer.innerHTML = '<div class="col-12 text-muted">No matching resources found.</div>';
  } else {
    cardsContainer.innerHTML = results.map((resource) => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="resource-card">
          <h5>${resource.name}</h5>
          <p class="text-muted mb-2">${resource.category} • ${resource.region}</p>
          <p>${resource.description}</p>
          <p class="mb-1"><strong>Address:</strong> ${resource.address}</p>
          <p><strong>Phone:</strong> ${resource.phone}</p>
          <a href="${getGoogleMapsLink(resource.address)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm mt-3">Open in Google Maps</a>
        </div>
      </div>
    `).join('');
  }

  updateResourceMap(results);
};

const initResourceMap = () => {
  const mapEl = document.getElementById('resourceMap');
  if (!mapEl || typeof L === 'undefined') return;

  window.resourceMap = L.map('resourceMap', {
    scrollWheelZoom: false,
  }).setView([23.8, 121.0], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(window.resourceMap);

  window.resourceMarkers = L.layerGroup().addTo(window.resourceMap);
};

const updateResourceMap = (items) => {
  if (!window.resourceMap || !window.resourceMarkers) return;
  window.resourceMarkers.clearLayers();

  if (items.length === 0) return;

  const bounds = [];
  items.forEach((item) => {
    const marker = L.marker(item.coords).bindPopup(`
      <strong>${item.name}</strong><br>
      ${item.category}<br>
      ${item.address}
    `);
    marker.addTo(window.resourceMarkers);
    bounds.push(item.coords);
  });

  if (bounds.length) {
    window.resourceMap.fitBounds(bounds, { padding: [40, 40] });
  }
};

const initLocalResourcesPage = () => {
  if (!document.getElementById('resourceCards')) return;

  populateOptionList('resourceCategory', ['All', ...getUniqueValues(resourceData, 'category')]);
  populateOptionList('resourceRegion', ['All Taiwan', 'North Taiwan', 'South Taiwan', 'East Taiwan']);

  const filters = ['resourceSearch', 'resourceCategory', 'resourceRegion'];
  filters.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', renderResourceCards);
      element.addEventListener('change', renderResourceCards);
    }
  });

  initResourceMap();
  renderResourceCards();
};

const renderFirstAidAccordion = () => {
  const searchText = getValue('firstAidSearch')?.toLowerCase() || '';
  const filtered = firstAidTopics.filter((topic) => {
    return [topic.title, topic.category, topic.description, topic.details]
      .some((field) => field.toLowerCase().includes(searchText));
  });

  const container = document.getElementById('firstAidAccordion');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-muted">No matching first aid topics found.</div>';
    return;
  }

  container.innerHTML = filtered.map((topic) => `
    <details class="accordion-item mb-3">
      <summary class="accordion-header p-3 rounded-3 border bg-white text-dark d-flex justify-content-between align-items-center" style="cursor: pointer;">
        <span>${topic.title}</span>
        <span class="text-muted">${topic.category}</span>
      </summary>
      <div class="accordion-body p-4 border border-top-0 rounded-bottom-3 bg-white">
        <p class="mb-2"><strong>Category:</strong> ${topic.category}</p>
        <p>${topic.description}</p>
        <p>${topic.details}</p>
        <button class="btn btn-outline-success btn-sm" type="button" onclick="startAidTimer('${topic.id}')">Start ${topic.timerLabel}</button>
      </div>
    </details>
  `).join('');
};

let firstAidInterval = null;

function updateAidTimerDisplay(label, value) {
  setText('firstAidTimerLabel', label);
  setText('firstAidTimerValue', value);
}

function clearAidTimer() {
  if (firstAidInterval) {
    clearInterval(firstAidInterval);
    firstAidInterval = null;
  }
}

function startAidTimer(topicId) {
  const topic = firstAidTopics.find((item) => item.id === topicId);
  if (!topic || !topic.timer) return;

  clearAidTimer();
  let remaining = topic.timer;
  updateAidTimerDisplay(`${topic.timerLabel} — ${topic.title}`, `${remaining}s`);

  firstAidInterval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearAidTimer();
      updateAidTimerDisplay(`${topic.timerLabel} — ${topic.title}`, 'Done!');
      return;
    }
    updateAidTimerDisplay(`${topic.timerLabel} — ${topic.title}`, `${remaining}s`);
  }, 1000);
}

const initFirstAidPage = () => {
  if (!document.getElementById('firstAidAccordion')) return;

  const searchInput = document.getElementById('firstAidSearch');
  if (searchInput) {
    searchInput.addEventListener('input', renderFirstAidAccordion);
  }

  renderFirstAidAccordion();
};
