'use client';

import { Season } from '@/types';

interface SeasonSelectorProps {
  selectedSeason?: Season;
  onSeasonChange: (season: Season) => void;
  aiSuggested?: boolean;
}

const SEASON_ICONS: Record<Season, string> = {
  primavera: '🌸',
  estate: '☀️',
  autunno: '🍂',
  inverno: '❄️',
  tutte_stagioni: '🌍'
};

const SEASON_LABELS: Record<Season, string> = {
  primavera: 'Primavera',
  estate: 'Estate',
  autunno: 'Autunno',
  inverno: 'Inverno',
  tutte_stagioni: 'Tutte le stagioni'
};

export function SeasonSelector({ selectedSeason, onSeasonChange, aiSuggested }: SeasonSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium">Stagione</label>
        {aiSuggested && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
            ✨ Suggerito da AI
          </span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(SEASON_ICONS) as Season[]).map((season) => (
          <button
            key={season}
            type="button"
            onClick={() => onSeasonChange(season)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSeason === season
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2 text-lg">{SEASON_ICONS[season]}</span>
            {SEASON_LABELS[season]}
          </button>
        ))}
      </div>
    </div>
  );
}
