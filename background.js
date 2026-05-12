const SOURCES = [
	{
		pattern: /^https:\/\/www\.extranet-ffba\.org\/api\/indicateurs\/export-indicateurs\?year=(\d+)/,
		id: 'ams_ie_$1',
		title: 'AMS Indicateurs État $1',
		accept: '.xlsx'
	},
	{
		pattern: /AMS_ExportIndicateursEtat_(\d+)_\d+_\d+\.csv$/,
		id: 'ams_ie_test_$1',
		title: 'AMS test $1',
		accept: '.csv'
	},
	{
		pattern: /^https:\/\/ba13-bouches-du-rhone\.assoconnect\.com\/framework\/tools\/export\/XLS-XLSX/,
		id: 'ac_structures',
		title: 'AssoConnect Structures',
		accept: '.xlsx'
	}
];

const notifiedDownloads = new Set();

browser.downloads.onChanged.addListener((delta) =>
{
	if (delta.state && delta.state.current === 'complete')
	{
		if (notifiedDownloads.has(delta.id))
		{
			return;
		}
		
		notifiedDownloads.add(delta.id);
		// Clean up after 30 seconds to allow for future downloads of the same ID
		setTimeout(() => notifiedDownloads.delete(delta.id), 30000);

		browser.downloads.search({ id: delta.id }).then((items) =>
		{
			if (items.length > 0)
			{
				const item = items[0];
				const match = getMatch(item);
				if (match)
				{
					activateIndicator(item, match);
				}
			}
		});
	}
});

function activateIndicator(item, source)
{
	const popupUrl = `import.html?id=${item.id}&accept=${encodeURIComponent(source.accept)}`;
	const action = browser.action || browser.browserAction;
	
	if (!action) return;

	action.setPopup({ popup: popupUrl });
	
	// Blinking effect: Toggle badge for 10 seconds
	let count = 0;
	const interval = setInterval(() => {
		count++;
		if (count % 2 === 0)
		{
			action.setBadgeText({ text: '!' });
			action.setBadgeBackgroundColor({ color: '#ff0000' }); // Red
		}
		else
		{
			action.setBadgeText({ text: ' ' });
			action.setBadgeBackgroundColor({ color: '#0060df' }); // Blue
		}

		if (count > 20) // Stop after ~10 seconds
		{
			clearInterval(interval);
			action.setBadgeText({ text: '!' });
			action.setBadgeBackgroundColor({ color: '#0060df' });
		}
	}, 500);
}

function getMatch(item)
{
	for (const source of SOURCES)
	{
		const urlMatch = item.url.match(source.pattern);
		// On some systems filename is an absolute path
		const fileMatch = item.filename.match(source.pattern);
		
		const result = urlMatch || fileMatch;

		if (result)
		{
			return {
				id: source.id.replace('$1', result[1] || ''),
				title: source.title.replace('$1', result[1] || ''),
				accept: source.accept
			};
		}
	}
	return null;
}
