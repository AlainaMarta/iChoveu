// Remova os comentários a medida que for implementando as funções
const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  try {
    const URL_API = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`;
    const response = await fetch(URL_API);
    const data = await response.json();
    if (await data.length === 0) {
      throw new Error('Nenhuma cidade encontrada');
    }
    return data;
  } catch (error) {
    return window.alert(error.message);
  }
};

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
