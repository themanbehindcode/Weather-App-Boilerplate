const CC_KEY = 'eS9zp93BwfPo7NjL8BxoSQGnd9UpCxgX';

function queryBuilder(request, options) {
	request += '?';
	Object.keys(options).forEach(key => {
		if (
			typeof options[key] === 'number' ||
			typeof options[key] === 'string'
		) {
			if (request[request.length - 1] !== '?') {
				request += '&';
			}
			request += `${key}=${options[key]}`;
		} else if (Array.isArray(options[key])) {
			options[key].forEach(e => {
				if (typeof e === 'number' || typeof e === 'string') {
					if (request[request.length - 1] !== '?') {
						request += '&';
					}
					request += '&';
				}
				request += `${key}=${e}`;
			});
		}
	});
	return request;
}

async function getWeatherData(lat, lon) {
	try {
		const fields = [
			'temp',
			'precipitation',
			'baro_pressure',
			'humidity',
			'wind_speed',
			'o3',
			'so2',
			'surface_shortwave_radiation',
		];
		const url = queryBuilder(
			'https://api.climacell.co/v3/weather/realtime',
			{
				lat,
				lon,
				unit_system: 'si',
				fields: fields,
				apikey: CC_KEY,
			}
		);

		const climaCellRes = await fetch(url);
		if (climaCellRes.status === 404) {
			return;
		}
		const climaCellData = await climaCellRes.json();
		return climaCellData;
	} catch (error) {
		console.log(error);
		return;
	}
}

function toggleCard(action) {
	if (action === 'hide') {
		document.querySelector('#data-card').classList.add('hide');
	} else if (action === 'show') {
		document.querySelector('#data-card').classList.remove('hide');
	}
}

function moveCard(x, y) {
	document.querySelector('#data-card').style.left = x;
	document.querySelector('#data-card').style.top = y;
}

function updateCardData(data) {
	document.querySelector(
		'#wind-speed > span:last-child'
	).innerHTML = `${data.wind_speed.value} ${data.wind_speed.units}`;

	document.querySelector(
		'#precipitation > span:last-child'
	).innerHTML = `${data.precipitation.value} ${data.precipitation.units}`;

	document.querySelector(
		'#air_pressure > span:last-child'
	).innerHTML = `${data.baro_pressure.value} ${data.baro_pressure.units}`;

	document.querySelector(
		'#humidity > span:last-child'
	).innerHTML = `${data.humidity.value} ${data.humidity.units}`;

	document.querySelector(
		'#temperature > span:last-child'
	).innerHTML = `${data.temp.value} ${data.temp.units}`;

	document.querySelector(
		'#o3 > span:last-child'
	).innerHTML = `${data.o3.value} ${data.o3.units}`;

	document.querySelector(
		'#so2 > span:last-child'
	).innerHTML = `${data.so2.value} ${data.so2.units}`;

	document.querySelector(
		'#surface_shortwave_radiation > span:last-child'
	).innerHTML = `${data.surface_shortwave_radiation.value} ${data.surface_shortwave_radiation.units}`;
}

window.onload = () => {
	initMap('map', main);

	async function main(coordinates, e) {
		const { lat, lon } = coordinates;
		const data = await getWeatherData(lat, lon);
		toggleCard('hide');
		if (data) {
			updateCardData(data);
			moveCard(e.clientX, e.clientY);
			toggleCard('show');
		}
	}
};
