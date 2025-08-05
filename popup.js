function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeString(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function calculateDepartureTime() {
  const morning = document.getElementById('arrivalMorning').value;
  const lunch = document.getElementById('lunchBreak').value;
  const afternoon = document.getElementById('afternoonReturn').value;

  if (morning && lunch && afternoon) {
    const morningStart = parseTimeToMinutes(morning);
    const lunchStart = parseTimeToMinutes(lunch);
    const afternoonStart = parseTimeToMinutes(afternoon);

    const workedBeforeLunch = lunchStart - morningStart;
    const remainingToWork = 420 - workedBeforeLunch;

    const departureTime = afternoonStart + remainingToWork;
    const departureStr = minutesToTimeString(departureTime);

    document.getElementById('result').textContent = `⏱️ Départ à ${departureStr}`;
  } else {
    document.getElementById('result').textContent = "";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input[type="time"]');
  inputs.forEach(input => {
    input.addEventListener('change', calculateDepartureTime);
  });
});
