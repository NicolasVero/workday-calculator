document.getElementById("btn").addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const hours_span = document.querySelectorAll('#kgrdBadgeages tbody tr td:first-of-type span');
			console.log(hours_span)

			const hours = Array.from(hours_span).map(span => span.innerText);
			console.log(hours)
		}
	});
});
