document.addEventListener("DOMContentLoaded", async () => {
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
					return { result: "❌ Pas assez de pointages enregistrés..." };
				}
				
				const [morning, lunch, afternoon] = hours;
				const morning_start = parse_time_to_minutes(morning);
				const lunch_start = parse_time_to_minutes(lunch);
				const afternoon_start = parse_time_to_minutes(afternoon);

				const worked_before_lunch = lunch_start - morning_start;
				const remaining_to_work = 444 - worked_before_lunch;

				const theoretical_departure = afternoon_start + remaining_to_work;
				const theoretical_departure_str = minutes_to_time_string(theoretical_departure);

				const now = new Date();
				const now_minutes = now.getHours() * 60 + now.getMinutes();

				let result = "";
				let extra = "";

				if (hours.length === 3) {
					result = `⏱️ Départ prévu à ${theoretical_departure_str}`;
					
					if (now_minutes < theoretical_departure) {
						const time_left = theoretical_departure - now_minutes;
						const h_left = Math.floor(time_left / 60);
						const m_left = time_left % 60;
						extra = `⏳ Temps restant : ${h_left}h${String(m_left).padStart(2, '0')}`;
					} else if (now_minutes === theoretical_departure) {
						extra = "🎉 C'est l'heure !!! Zouuu ! Pas d'heures sup aujourd'hui !";
					} else {
						const overtime = now_minutes - theoretical_departure;
						const h_over = Math.floor(overtime / 60);
						const m_over = overtime % 60;
						extra = `💪 Heures supplémentaires en cours : ${h_over}h${String(m_over).padStart(2, '0')}`;
					}
				}

				if (hours.length >= 4) {
					const actual_departure = parse_time_to_minutes(hours[hours.length - 1]);
					const actual_departure_str = minutes_to_time_string(actual_departure);
					result = `📌 Sortie enregistrée à ${actual_departure_str}`;

					if (actual_departure < theoretical_departure) {
						const diff = theoretical_departure - actual_departure;
						const h_diff = Math.floor(diff / 60);
						const m_diff = diff % 60;
						extra = `⚠️ Heures non effectuées : ${h_diff}h${String(m_diff).padStart(2, '0')}`;
					} else if (actual_departure === theoretical_departure) {
						extra = "🎉 C'est l'heure !!! Zouuu ! Pas d'heures sup aujourd'hui !";
					} else {
						const overtime = actual_departure - theoretical_departure;
						const h_over = Math.floor(overtime / 60);
						const m_over = overtime % 60;
						extra = `💪 Heures supplémentaires en cours : ${h_over}h${String(m_over).padStart(2, '0')}`;
					}
				}

				return { result, extra };
			}

			return calculate_departure_from_badgeages();
		}
	}, (results) => {
		if (results && results[0] && results[0].result) {
			const { result, extra } = results[0].result;
			document.getElementById("result").textContent = result || "";
			document.getElementById("extra").textContent = extra || "";
		} else {
			document.getElementById("result").textContent = "❌ Impossible de lire les données...";
		}
	});
});
