<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let lang: 'fr' | 'en' | 'es' = 'fr';

  // Lac de Saint-Ferréol coordinates
  const LAT = 43.4292;
  const LON = 2.0181;

  let temperature: number | null = null;
  let weatherCode: number | null = null;
  let windSpeed: number | null = null;
  let currentTime = '';
  let loading = true;
  let error = false;
  let timeInterval: ReturnType<typeof setInterval>;

  const weatherLabels: Record<string, Record<number, string>> = {
    fr: {
      0: 'Ciel dégagé', 1: 'Plutôt dégagé', 2: 'Partiellement nuageux', 3: 'Couvert',
      45: 'Brouillard', 48: 'Brouillard givrant',
      51: 'Bruine légère', 53: 'Bruine', 55: 'Bruine dense',
      61: 'Pluie légère', 63: 'Pluie', 65: 'Forte pluie',
      71: 'Neige légère', 73: 'Neige', 75: 'Forte neige',
      80: 'Averses légères', 81: 'Averses', 82: 'Fortes averses',
      95: 'Orage', 96: 'Orage avec grêle', 99: 'Orage violent',
    },
    en: {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Rime fog',
      51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
      61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
      71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
      80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe storm',
    },
    es: {
      0: 'Cielo despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
      45: 'Niebla', 48: 'Niebla helada',
      51: 'Llovizna ligera', 53: 'Llovizna', 55: 'Llovizna densa',
      61: 'Lluvia ligera', 63: 'Lluvia', 65: 'Lluvia fuerte',
      71: 'Nieve ligera', 73: 'Nieve', 75: 'Nieve fuerte',
      80: 'Chubascos ligeros', 81: 'Chubascos', 82: 'Chubascos fuertes',
      95: 'Tormenta', 96: 'Tormenta con granizo', 99: 'Tormenta severa',
    },
  };

  function getWeatherIcon(code: number | null): string {
    if (code === null) return '🌡️';
    if (code === 0) return '☀️';
    if (code <= 2) return '⛅';
    if (code === 3) return '☁️';
    if (code <= 48) return '🌫️';
    if (code <= 55) return '🌦️';
    if (code <= 65) return '🌧️';
    if (code <= 75) return '❄️';
    if (code <= 82) return '🌧️';
    return '⛈️';
  }

  function getWeatherLabel(code: number | null): string {
    if (code === null) return '';
    return weatherLabels[lang]?.[code] ?? weatherLabels.fr[code] ?? '';
  }

  function updateTime() {
    const now = new Date();
    currentTime = new Intl.DateTimeFormat(lang, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(now);
  }

  async function fetchWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe/Paris`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      temperature = Math.round(data.current.temperature_2m);
      weatherCode = data.current.weather_code;
      windSpeed = Math.round(data.current.wind_speed_10m);
      loading = false;
    } catch {
      error = true;
      loading = false;
    }
  }

  onMount(() => {
    updateTime();
    fetchWeather();
    timeInterval = setInterval(updateTime, 30_000);
  });

  onDestroy(() => {
    if (timeInterval) clearInterval(timeInterval);
  });

  const locationLabel: Record<string, string> = {
    fr: 'Lac de Saint-Ferréol',
    en: 'Lake Saint-Ferréol',
    es: 'Lago de Saint-Ferréol',
  };

  const nowLabel: Record<string, string> = {
    fr: 'En ce moment',
    en: 'Right now',
    es: 'Ahora mismo',
  };

  const windLabel: Record<string, string> = {
    fr: 'Vent',
    en: 'Wind',
    es: 'Viento',
  };
</script>

<div class="weather-card bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs font-semibold uppercase tracking-wider text-sky-700/70">
      {nowLabel[lang] ?? nowLabel.fr}
    </span>
    <span class="text-sm font-mono font-bold text-sky-800">
      {currentTime || '--:--'}
    </span>
  </div>

  {#if loading}
    <div class="flex items-center justify-center flex-1 py-4">
      <div class="w-6 h-6 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="flex-1 flex items-center justify-center">
      <p class="text-sky-600/60 text-sm text-center">
        🌡️
      </p>
    </div>
  {:else}
    <div class="flex items-center gap-3 mb-2">
      <span class="text-4xl leading-none">{getWeatherIcon(weatherCode)}</span>
      <div>
        <span class="text-3xl font-bold text-sky-900 leading-none">{temperature}°</span>
      </div>
    </div>
    <p class="text-sm text-sky-800/80 font-medium mb-1">
      {getWeatherLabel(weatherCode)}
    </p>
    {#if windSpeed !== null}
      <p class="text-xs text-sky-700/50">
        {windLabel[lang] ?? windLabel.fr} {windSpeed} km/h
      </p>
    {/if}
  {/if}

  <p class="text-xs text-sky-700/40 mt-2 pt-2 border-t border-sky-200/50">
    📍 {locationLabel[lang] ?? locationLabel.fr}
  </p>
</div>
