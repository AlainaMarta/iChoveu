import { searchCities, getWeatherByCity } from './weatherAPI';

const TOKEN = import.meta.env.VITE_TOKEN;
/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon, url } = cityInfo;

  const cityElement = createElement('li', 'city');
  const buttonPrevision = document.createElement('button');
  buttonPrevision.className = 'city-forecast-button';
  buttonPrevision.innerText = 'Ver previsão';
  buttonPrevision.addEventListener('click', async (event) => {
    event.preventDefault();
    const URL_API = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${url}&days=7`;
    const response = await fetch(URL_API);
    const data = await response.json();
    const arrayTemps = await data.forecast.forecastday;
    const objetoInfo = [];
    arrayTemps.forEach(async (temperatura) => {
      const objetoDeInfos = await {
        date: temperatura.date,
        maxTemp: temperatura.day.maxtemp_c,
        minTemp: temperatura.day.mintemp_c,
        condition: temperatura.day.condition.text,
        icon: temperatura.day.condition.icon,
      };
      return objetoInfo.push(objetoDeInfos);
    });
    return showForecast(await objetoInfo);
  });
  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);
  cityElement.appendChild(buttonPrevision);
  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');
  try {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value;
    const cities = await searchCities(searchValue);
    if (await cities === undefined) {
      throw new Error('Nenhuma cidade encontrada');
    }
    const citiesInfo = await Promise.all(
      cities.map(async (city) => {
        const { url } = city;
        const listItem = await getWeatherByCity(url);
        listItem.name = city.name;
        listItem.country = city.country;
        listItem.url = city.url;
        return listItem;
      }),
    );
    citiesInfo.forEach((cityInfo) => {
      const ul = document.getElementById('cities');
      const li = createCityElement(cityInfo);
      ul.appendChild(li);
    });
    return promiseAll;
  } catch (error) {
    return error;
  }
}

const buttonDarkMode = document.getElementById('button-dark-mode');
const { body } = document;
const imgLogo = document.getElementById('logo');
buttonDarkMode.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    imgLogo.src = './src/imgs/NightIcon.png';
  } else {
    imgLogo.src = './src/imgs/iChoveuIcon.png';
  }
});
