import { useState, useEffect } from 'react';

interface AmbientData {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    icon: string;
  } | null;
  location: {
    city: string;
    country: string;
    timezone: string;
  } | null;
  calendar: {
    todayEvents: Array<{
      title: string;
      time: string;
      type: 'work' | 'personal' | 'celebration';
    }>;
    tomorrowEvents: Array<{
      title: string;
      time: string;
      type: 'work' | 'personal' | 'celebration';
    }>;
  };
}

interface ContextualNudge {
  id: string;
  type: 'activity' | 'reminder' | 'connect' | 'reflect';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  ambientContext: string;
  suggestedTime?: string;
  confidence: number;
  reason: string;
}

interface AmbientSensingSettings {
  weatherEnabled: boolean;
  locationEnabled: boolean;
  calendarEnabled: boolean;
  nudgeEnabled: boolean;
  nudgeFrequency: 'low' | 'medium' | 'high';
}

export function useAmbientSensing() {
  const [ambientData, setAmbientData] = useState<AmbientData>({
    weather: null,
    location: null,
    calendar: {
      todayEvents: [],
      tomorrowEvents: []
    }
  });

  const [settings, setSettings] = useState<AmbientSensingSettings>({
    weatherEnabled: false,
    locationEnabled: false,
    calendarEnabled: false,
    nudgeEnabled: true,
    nudgeFrequency: 'medium'
  });

  const [currentNudges, setCurrentNudges] = useState<ContextualNudge[]>([]);

  // Get weather data
  const getWeatherData = async () => {
    if (!settings.weatherEnabled || !navigator.geolocation) return;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // In a real app, you'd use a weather API like OpenWeatherMap
      // For now, simulating weather data
      const mockWeather = {
        temperature: Math.floor(Math.random() * 20) + 10,
        condition: ['sunny', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        icon: ['☀️', '☁️', '🌧️', '⛈️'][Math.floor(Math.random() * 4)]
      };

      setAmbientData(prev => ({
        ...prev,
        weather: mockWeather
      }));
    } catch (error) {
      console.log('Weather data unavailable');
    }
  };

  // Get location data
  const getLocationData = () => {
    if (!settings.locationEnabled || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you'd use a geocoding API
        const mockLocation = {
          city: 'Mumbai',
          country: 'India',
          timezone: 'Asia/Kolkata'
        };

        setAmbientData(prev => ({
          ...prev,
          location: mockLocation
        }));
      },
      (error) => {
        console.log('Location data unavailable');
      }
    );
  };

  // Get calendar data
  const getCalendarData = () => {
    if (!settings.calendarEnabled) return;

    // In a real app, you'd integrate with calendar APIs like Google Calendar
    const mockCalendar = {
      todayEvents: [
        { title: 'Meeting with team', time: '14:00', type: 'work' as const },
        { title: 'Evening walk', time: '18:30', type: 'personal' as const }
      ],
      tomorrowEvents: [
        { title: 'Dinner with Arjun', time: '19:00', type: 'personal' as const },
        { title: 'Project deadline', time: '23:59', type: 'work' as const }
      ]
    };

    setAmbientData(prev => ({
      ...prev,
      calendar: mockCalendar
    }));
  };

  // Generate contextual nudges based on ambient data
  const generateNudges = (data: AmbientData): ContextualNudge[] => {
    const nudges: ContextualNudge[] = [];
    const hour = new Date().getHours();

    // Weather-based nudges
    if (data.weather && settings.weatherEnabled) {
      const { condition, temperature } = data.weather;

      if (condition === 'rainy' && hour >= 18) {
        nudges.push({
          id: 'rainy-evening-walk',
          type: 'activity',
          title: 'Cozy Indoor Date Night',
          message: 'With the rain outside, why not create a magical indoors atmosphere? Light some candles and share your favorite memories.',
          priority: 'high',
          ambientContext: `rainy weather (${temperature}°C)`,
          suggestedTime: '7-9 PM',
          confidence: 0.85,
          reason: 'Perfect timing for indoor romance during rainy weather'
        });
      }

      if (temperature >= 25 && hour >= 16) {
        nudges.push({
          id: 'hot-evening-refresh',
          type: 'activity',
          title: 'Evening Beach Walk',
          message: 'The warm evening weather is perfect for a gentle walk together. Bonus: tropical smoothie game?',
          priority: 'medium',
          ambientContext: `warm weather (${temperature}°C)`,
          suggestedTime: '6-8 PM',
          confidence: 0.75,
          reason: 'Weather supports outdoor activities'
        });
      }
    }

    // Calendar-based nudges
    if (data.calendar && settings.calendarEnabled) {
      const hasStressfulEvents = data.calendar.todayEvents.some(e =>
        e.type === 'work' && e.time.includes('14:00')
      );

      if (hasStressfulEvents && hour >= 9) {
        nudges.push({
          id: 'stress-check-in',
          type: 'connect',
          title: 'Stress Check-In',
          message: 'I noticed you have a busy meeting today. How are you feeling? I\'m here if you want to talk.',
          priority: 'medium',
          ambientContext: 'stressful calendar events today',
          suggestedTime: 'now',
          confidence: 0.8,
          reason: 'Calendar shows potential stress triggers today'
        });
      }

      const tomorrowRomance = data.calendar.tomorrowEvents.some(e =>
        e.type === 'personal' && e.time.includes('19:00')
      );

      if (tomorrowRomance && hour >= 10) {
        nudges.push({
          id: 'tomorrow-prep',
          type: 'reminder',
          title: 'Tomorrow\'s Date Preparation',
          message: 'Looking forward to our dinner tomorrow! What can I do to make it even more special for you?',
          priority: 'low',
          ambientContext: 'romantic dinner scheduled tomorrow',
          suggestedTime: 'morning',
          confidence: 0.9,
          reason: 'Calendar shows romantic plans for tomorrow'
        });
      }
    }

    // Time-based nudges
    if (hour >= 21 && hour <= 23) {
      nudges.push({
        id: 'evening-wind-down',
        type: 'reflect',
        title: 'Evening Reflection',
        message: 'Before sleep, take a moment to reflect: What\'s one thing that made you smile today?',
        priority: 'low',
        ambientContext: 'late evening hours',
        suggestedTime: '9-11 PM',
        confidence: 0.6,
        reason: 'Natural time for daily reflection'
      });
    }

    // Location-based nudges
    if (data.location && settings.locationEnabled) {
      if (data.location.timezone.includes('Asia/Kolkata') && hour >= 17 && hour <= 19) {
        nudges.push({
          id: 'cultural-connection',
          type: 'activity',
          title: 'Cultural Connection',
          message: 'Being in Mumbai, why not try exploring a local café or street food together this evening?',
          priority: 'medium',
          ambientContext: `location: ${data.location.city}`,
          suggestedTime: '6-8 PM',
          confidence: 0.7,
          reason: 'Location-based activity suggestion'
        });
      }
    }

    return nudges.sort((a, b) => {
      // Sort by priority first, then confidence
      if (a.priority === b.priority) {
        return b.confidence - a.confidence;
      }
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
  };

  // Update Му nudges when ambient data changes
  useEffect(() => {
    if (Object.values(ambientData).some(data => data !== null && data !== undefined)) {
      const newNudges = generateNudges(ambientData);
      if (JSON.stringify(newNudges) !== JSON.stringify(currentNudges)) {
        setCurrentNudges(newNudges);
      }
    }
  }, [ambientData]);

  // Refresh ambient data
  const refreshAmbientData = () => {
    if (settings.weatherEnabled) getWeatherData();
    if (settings.locationEnabled) getLocationData();
    if (settings.calendarEnabled) getCalendarData();
  };

  // Initialize ambient data on mount and when settings change
  useEffect(() => {
    refreshAmbientData();

    // Refresh every 30 minutes
    const interval = setInterval(refreshAmbientData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [
    settings.weatherEnabled,
    settings.locationEnabled,
    settings.calendarEnabled
  ]);

  return {
    ambientData,
    settings,
    currentNudges,
    setSettings,
    refreshAmbientData
  };
}
