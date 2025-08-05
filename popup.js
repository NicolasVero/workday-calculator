function parse_time_to_minutes(time_str) {
	const [hours, minutes] = time_str.split(':').map(Number);
	return hours * 60 + minutes;
}

function minutes_to_time_string(minutes) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function calculate_departure_time() {
	const morning = document.getElementById('arrival_morning').value;
	const lunch = document.getElementById('lunch_break').value;
	const afternoon = document.getElementById('afternoon_return').value;

	if (morning && lunch && afternoon) {
		const morning_start = parse_time_to_minutes(morning);
		const lunch_start = parse_time_to_minutes(lunch);
		const afternoon_start = parse_time_to_minutes(afternoon);

		const worked_before_lunch = lunch_start - morning_start;
		const remaining_to_work = 444 - worked_before_lunch;

		const departure_time = afternoon_start + remaining_to_work;
		const departure_str = minutes_to_time_string(departure_time);

		document.getElementById('result').textContent = `⏱️ Départ à ${departure_str}`;
	} else {
		document.getElementById('result').textContent = "";
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const inputs = document.querySelectorAll('input[type="time"]');
	inputs.forEach(input => {
		input.addEventListener('change', calculate_departure_time);
	});
});
