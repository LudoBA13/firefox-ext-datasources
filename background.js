const SOURCES = [
	{
		pattern: /^https:\/\/www\.extranet-ffba\.org\/api\/indicateurs\/export-indicateurs\?year=(\d+)/,
		id: 'ams_ie_$1',
		title: 'AMS Indicateurs État $1'
	},
	{
		pattern: /^http:\/\/192\.168\.1\.10\/tmp\/AMS_ExportIndicateursEtat_(\d+)_\d+_\d+\.csv/,
		id: 'ams_ie_test_$1',
		title: 'AMS test $1'
	},
	{
		pattern: /^https:\/\/ba13-bouches-du-rhone\.assoconnect\.com\/framework\/tools\/export\/XLS-XLSX/,
		id: 'ac_structures',
		title: 'AssoConnect Structures'
	}
];

browser.downloads.onChanged.addListener((delta) =>
{
	if (delta.state && delta.state.current === 'complete')
	{
		browser.downloads.search({ id: delta.id }).then((items) =>
		{
			if (items.length > 0)
			{
				const item = items[0];
				const match = getMatch(item.url);
				if (match)
				{
					notify(item, match);
				}
			}
		});
	}
});

function getMatch(url)
{
	for (const source of SOURCES)
	{
		const result = url.match(source.pattern);
		if (result)
		{
			return {
				id: source.id.replace('$1', result[1]),
				title: source.title.replace('$1', result[1])
			};
		}
	}
	return null;
}

function notify(item, source)
{
	browser.notifications.create({
		type: 'basic',
		title: source.title,
		message: `${item.filename} téléchargé. Souhaitez-vous le synchroniser ?`
	});
}
