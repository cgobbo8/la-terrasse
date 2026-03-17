<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Sun from 'lucide-svelte/icons/sun';
  import CloudSun from 'lucide-svelte/icons/cloud-sun';
  import Cloud from 'lucide-svelte/icons/cloud';
  import CloudFog from 'lucide-svelte/icons/cloud-fog';
  import CloudDrizzle from 'lucide-svelte/icons/cloud-drizzle';
  import CloudRain from 'lucide-svelte/icons/cloud-rain';
  import Snowflake from 'lucide-svelte/icons/snowflake';
  import CloudLightning from 'lucide-svelte/icons/cloud-lightning';
  import Wind from 'lucide-svelte/icons/wind';
  import MapPin from 'lucide-svelte/icons/map-pin';
  import Thermometer from 'lucide-svelte/icons/thermometer';

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

  // Map weather codes to icon components
  function getWeatherIcon(code: number | null) {
    if (code === null) return Thermometer;
    if (code === 0) return Sun;
    if (code <= 2) return CloudSun;
    if (code === 3) return Cloud;
    if (code <= 48) return CloudFog;
    if (code <= 55) return CloudDrizzle;
    if (code <= 65) return CloudRain;
    if (code <= 75) return Snowflake;
    if (code <= 82) return CloudRain;
    return CloudLightning;
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
    fr: 'En direct',
    en: 'Live',
    es: 'En vivo',
  };
</script>

<div class="weather-card rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden" style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);">
  <!-- Header -->
  <div class="flex items-center justify-between mb-5">
    <div class="flex items-center gap-2">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
      </span>
      <span class="text-xs font-bold uppercase tracking-[0.15em] text-sky-800/60">
        {nowLabel[lang] ?? nowLabel.fr}
      </span>
    </div>
    <span class="text-sm font-mono font-bold text-sky-900/70 tabular-nums">
      {currentTime || '--:--'}
    </span>
  </div>

  {#if loading}
    <div class="flex items-center justify-center flex-1 py-6">
      <div class="w-6 h-6 border-2 border-sky-400 border-t-sky-700 rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="flex-1 flex items-center justify-center py-6">
      <Thermometer class="w-8 h-8 text-sky-400" strokeWidth={1.5} />
    </div>
  {:else}
    <!-- Temperature + icon -->
    <div class="flex items-center gap-4 mb-3">
      <svelte:component this={getWeatherIcon(weatherCode)} class="w-10 h-10 text-sky-700" strokeWidth={1.5} />
      <span class="text-4xl font-heading font-bold text-sky-950 leading-none tabular-nums">{temperature}°</span>
    </div>
    <p class="text-sm text-sky-900/70 font-medium mb-1">
      {getWeatherLabel(weatherCode)}
    </p>
    {#if windSpeed !== null}
      <div class="flex items-center gap-1.5 text-sky-700/50">
        <Wind class="w-3.5 h-3.5" strokeWidth={1.5} />
        <span class="text-xs">{windSpeed} km/h</span>
      </div>
    {/if}
  {/if}

  <!-- Location footer -->
  <div class="flex items-center gap-1.5 mt-4 pt-3 border-t border-sky-300/30">
    <MapPin class="w-3 h-3 text-sky-600/50" strokeWidth={2} />
    <span class="text-xs text-sky-700/50">{locationLabel[lang] ?? locationLabel.fr}</span>
  </div>

  <!-- Decorative large icon -->
  <div class="absolute -bottom-6 -right-6 opacity-[0.06] pointer-events-none" aria-hidden="true">
    {#if !loading && !error}
      <svelte:component this={getWeatherIcon(weatherCode)} class="w-36 h-36" strokeWidth={1} />
    {/if}
  </div>
</div>
