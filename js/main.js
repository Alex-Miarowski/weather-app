let searchInput
let searchBtn
let warningMessage
let cityName
let weatherImg
let weatherDescription
let temperature
let feelsLikeTemperature
let humidity
let wind
let pressure
let nextDaysWeatherDayBoxes
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const API_KEY = 'caab00ceccf31d5cd447c12bea02a939'
const API_TODAYS_WEATHER_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_NEXT_DAYS_WEATHER_LINK = 'https://api.openweathermap.org/data/2.5/forecast?q='
const API_UNITS = '&units=metric'

const main = () => {
	prepareDOMElements()
	prepareDOMEvents()
}

const prepareDOMElements = () => {
	searchInput = document.querySelector('.search-box__input')
	searchBtn = document.querySelector('.search-box__btn')
	warningMessage = document.querySelector('.search-box__warning')
	cityName = document.querySelector('.main-info__city-name')
	weatherImg = document.querySelector('.main-info__weather-img')
	weatherDescription = document.querySelector('.main-info__weather-description')
	temperature = document.querySelector('.main-info__temperature')
	feelsLikeTemperature = document.querySelector('.main-info__feels-like-temperature')
	humidity = document.querySelector('.additional-info__humidity')
	wind = document.querySelector('.additional-info__wind')
	pressure = document.querySelector('.additional-info__pressure')
	nextDaysWeatherDayBoxes = document.querySelectorAll('.next-three-days-weather__day-box')
}

const prepareDOMEvents = () => {
	searchBtn.addEventListener('click', getTodaysWeather)
	searchInput.addEventListener('keyup', enterKeyCheck)
}

const todaysDate = new Date()
const todaysDay = todaysDate.toISOString().slice(0, 10)

const getTodaysWeather = () => {
	const searchedCity = searchInput.value
	const URL = API_TODAYS_WEATHER_LINK + searchedCity + '&appid=' + API_KEY + API_UNITS

	axios
		.get(URL)
		.then(res => {
			cityName.textContent = res.data.name
			weatherDescription.textContent = res.data.weather[0].description
			temperature.textContent = Math.round(res.data.main.temp) + '℃'
			feelsLikeTemperature.textContent = Math.round(res.data.main.feels_like) + '℃'
			humidity.textContent = res.data.main.humidity + '%'
			wind.textContent = res.data.wind.speed + 'km/h'
			pressure.textContent = res.data.main.pressure + 'hPa'
			warningMessage.textContent = ''
			warningMessage.classList.add('not-visible')
			warningMessage.classList.remove('visible')
			searchInput.textContent = ''

			setWeatherImg(res.data.weather[0].main, weatherImg)

			getNextDaysWeather()
		})
		.catch(() => {
			warningMessage.textContent = 'Wrong city name'
			warningMessage.classList.remove('not-visible')
			warningMessage.classList.add('visible')
		})
}

const getNextDaysWeather = () => {
	const searchedCity = searchInput.value
	const URL = API_NEXT_DAYS_WEATHER_LINK + searchedCity + '&appid=' + API_KEY + API_UNITS

	axios
		.get(URL)
		.then(res => {
			let resWeatherList = res.data.list.filter(element => {
				return element.dt_txt.slice(-8) == '15:00:00' && element.dt_txt.slice(10) != todaysDay
			})

			for (let i = 0; i < 3; i++) {
				let nextDays_dayName = nextDaysWeatherDayBoxes[i].querySelector('.next-three-days-weather__day-name')
				let nextDays_weatherImg = nextDaysWeatherDayBoxes[i].querySelector('.next-three-days-weather__weather-img')
				let nextDays_temperature = nextDaysWeatherDayBoxes[i].querySelector('.next-three-days-weather__temperature')

				let nextDayIndex = todaysDate.getDay() + i >= 7 ? i - 1 : todaysDate.getDay() + i

				nextDays_dayName.textContent = weekDays[nextDayIndex]
				nextDays_temperature.textContent = Math.round(resWeatherList[i].main.temp) + '℃'

				setWeatherImg(resWeatherList[i].weather[0].main, nextDays_weatherImg)
			}
		})
		.catch()
}

const setWeatherImg = (weatherDesc, weatherImgPlace) => {
	switch (weatherDesc) {
		case 'Thunderstorm':
			weatherImgPlace.setAttribute('src', './img/thunderstorm.png')
			break

		case 'Drizzle':
			weatherImgPlace.setAttribute('src', './img/drizzle.png')
			break

		case 'Rain':
			weatherImgPlace.setAttribute('src', './img/rain.png')
			break

		case 'Snow':
			weatherImgPlace.setAttribute('src', './img/ice.png')
			break

		case 'Clear':
			weatherImgPlace.setAttribute('src', './img/sun.png')
			break

		case 'Clouds':
			weatherImgPlace.setAttribute('src', './img/cloud.png')
			break

		default:
			if (weatherDesc === 741) {
				weatherImgPlace.setAttribute('src', './img/fog.png')
			} else {
				weatherImgPlace.setAttribute('src', './img/unknown.png')
			}
			break
	}
}

const enterKeyCheck = e => {
	if (e.key === 'Enter') {
		getTodaysWeather()
	}
}

document.addEventListener('DOMContentLoaded', main)
