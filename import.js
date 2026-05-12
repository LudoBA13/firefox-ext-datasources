// Clear the notification badge when opened
const action = (typeof browser !== 'undefined') ? (browser.action || browser.browserAction) : null;
if (action)
{
	action.setBadgeText({ text: '' });
}

const params = new URLSearchParams(window.location.search);
const downloadId = parseInt(params.get('id'));
const accept = params.get('accept');
const fileInput = document.getElementById('fileInput');
const pickButton = document.getElementById('pickButton');
const status = document.getElementById('status');

// Debug elements
const infoId = document.getElementById('infoId');
const infoName = document.getElementById('infoName');
const infoUrl = document.getElementById('infoUrl');
const pickedFileInfo = document.getElementById('pickedFileInfo');
const pickedName = document.getElementById('pickedName');
const pickedSize = document.getElementById('pickedSize');
const pickedType = document.getElementById('pickedType');

if (accept)
{
	fileInput.accept = accept;
}

// Fetch download metadata for debugging
if (downloadId)
{
	browser.downloads.search({ id: downloadId }).then((items) =>
	{
		if (items.length > 0)
		{
			const item = items[0];
			infoId.textContent = item.id;
			infoName.textContent = item.filename.split(/[\\\/]/).pop();
			infoUrl.textContent = item.url;
		}
	});
}

pickButton.addEventListener('click', () =>
{
	fileInput.click();
});

fileInput.addEventListener('change', (e) =>
{
	const file = e.target.files[0];
	if (!file)
	{
		return;
	}

	// Update picked file debug info
	pickedFileInfo.style.display = 'block';
	pickedName.textContent = file.name;
	pickedSize.textContent = file.size;
	pickedType.textContent = file.type || 'n/a';

	status.textContent = 'Lecture du fichier...';
	status.style.color = 'black';

	const reader = new FileReader;
	reader.onload = (event) =>
	{
		const content = event.target.result;
		console.log('Contenu récupéré (100 char):', content.substring(0, 100));
		status.textContent = 'Données prêtes pour la synchronisation !';
		status.style.color = 'green';
	};

	reader.onerror = () =>
	{
		status.textContent = 'Erreur lors de la lecture du fichier.';
		status.style.color = 'red';
	};

	reader.readAsText(file);
});
