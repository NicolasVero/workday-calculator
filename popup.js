document.getElementById("btn").addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			function parse_time_to_minutes(time_str) {
				const [hours, minutes] = time_str.split(':').map(Number);
				return hours * 60 + minutes;
			}

			function minutes_to_time_string(minutes) {
				const h = Math.floor(minutes / 60);
				const m = minutes % 60;
				return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
			}

			function calculate_departure_from_badgeages() {
				const hours = Array.from(
					document.querySelectorAll('#kgrdBadgeages tbody tr td:first-of-type span')
				).map(span => span.innerText);

				if (hours.length < 3) {
					console.log("❌ Pas assez d'heures pour calculer (il en faut 3).");
					return;
				}

				const [morning, lunch, afternoon] = hours;

				const morning_start = parse_time_to_minutes(morning);
				const lunch_start = parse_time_to_minutes(lunch);
				const afternoon_start = parse_time_to_minutes(afternoon);

				const worked_before_lunch = lunch_start - morning_start;
				const remaining_to_work = 444 - worked_before_lunch;

				const departure_time = afternoon_start + remaining_to_work;
				const departure_str = minutes_to_time_string(departure_time);

				console.log(`⏱️ Heure de départ ${departure_str}`);
				
				// 🕒 Heure actuelle
				const now_minutes = (hours.length === 4)
					? parse_time_to_minutes(hours[3])
					: (new Date().getHours() * 60 + new Date().getMinutes());

				if (now_minutes < departure_time) {
					const time_left = departure_time - now_minutes;
					const h_left = Math.floor(time_left / 60);
					const m_left = time_left % 60;
					console.log(`⏳ Reste à faire : ${h_left}h${String(m_left).padStart(2, '0')}`);
				} else if (now_minutes === departure_time) {
					console.log("🎉 Pars maintenant !!! Heures sup interdites aujourd'hui !");
				} else {
					const overtime = now_minutes - departure_time;
					const h_over = Math.floor(overtime / 60);
					const m_over = overtime % 60;
					console.log(`💪 Heure supplémentaires en cours :  ${h_over}h${String(m_over).padStart(2, '0')}`);
				}
			}

			calculate_departure_from_badgeages();
		}
	});
});
