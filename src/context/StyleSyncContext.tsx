import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import {
  api,

  type Outfit,
  type StyleMemory,
  type Weather,
  type SavedLook,
  type HistoryEntry,
  type OutfitGenerateParams,
} from '@/lib/api';
import { useUser } from '@clerk/clerk-react';

interface StyleSyncContextValue {

  memory: StyleMemory | null;
  weather: Weather | null;
  savedLooks: SavedLook[];
  history: HistoryEntry[];
  loading: boolean;
  loadingMessage: string;
  outfitVersions: Outfit[][];
  activeVersionIndex: number;
  setActiveVersionIndex: (i: number) => void;

  refreshMemory: () => Promise<void>;
  refreshSaved: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  fetchWeather: (city: string) => Promise<Weather | null>;
  generateOutfits: (params: OutfitGenerateParams) => Promise<Outfit[]>;
  regenerateVariations: (params: OutfitGenerateParams) => Promise<Outfit[]>;
  lastOutfits: Outfit[];
  setLastOutfits: (outfits: Outfit[]) => void;
  globalCurrentLocation: string;
  setGlobalCurrentLocation: (loc: string) => void;
  globalDestinationLocation: string;
  setGlobalDestinationLocation: (loc: string) => void;
}

const StyleSyncContext = createContext<StyleSyncContextValue | null>(null);

export function StyleSyncProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const [memory, setMemory] = useState<StyleMemory | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastOutfits, setLastOutfits] = useState<Outfit[]>([]);
  const [outfitVersions, setOutfitVersions] = useState<Outfit[][]>([]);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating your outfits...');
  const [globalCurrentLocation, setGlobalCurrentLocation] = useState('');
  const [globalDestinationLocation, setGlobalDestinationLocation] = useState('');

  const refreshMemory = useCallback(async () => {
    const { memory: m } = await api.outfits.memory();
    setMemory(m);
    if (m.lastWeather) setWeather(m.lastWeather);
  }, []);

  const refreshSaved = useCallback(async () => {
    const { looks } = await api.saved.list();
    setSavedLooks(looks);
  }, []);

  const refreshHistory = useCallback(async () => {
    const { history: h } = await api.history.list();
    setHistory(h);
  }, []);

  const fetchWeather = useCallback(async (city: string) => {
    setLoadingMessage('Detecting weather for your location...');
    const { weather: w } = await api.weather.get(city);
    setWeather(w);
    return w;
  }, []);

  const generateOutfits = useCallback(async (params: OutfitGenerateParams) => {
    setLoading(true);
    setLoadingMessage(params.mode === 'variation' ? 'Creating new variations...' : 'Generating your outfits...');
    try {
      const result = await api.outfits.generate({
        ...params,
        mode: params.mode || 'fresh',
        seed: params.seed ?? Date.now(),
      });
      setLastOutfits(result.outfits);
      if (params.mode === 'variation') {
        setOutfitVersions((prev) => {
          const next = [...prev, result.outfits];
          setActiveVersionIndex(next.length - 1);
          return next;
        });
      } else {
        setOutfitVersions([result.outfits]);
        setActiveVersionIndex(0);
      }
      if (result.memory) setMemory(result.memory);
      if (result.weather) setWeather(result.weather);
      return result.outfits;
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerateVariations = useCallback(
    (params: OutfitGenerateParams) =>
      generateOutfits({ ...params, mode: 'variation', seed: Date.now() }),
    [generateOutfits]
  );

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    Promise.all([
      refreshMemory().catch(() => {}),
      refreshSaved().catch(() => {}),
      refreshHistory().catch(() => {}),
    ]).finally(() => setLoading(false));
    if (user.profile?.lastWeather) setWeather(user.profile.lastWeather);
    if (user.profile?.location && !globalCurrentLocation) setGlobalCurrentLocation(user.profile.location);
  }, [user?.id, refreshMemory, refreshSaved, refreshHistory, user?.profile?.lastWeather, user?.profile?.location, globalCurrentLocation]);

  return (
    <StyleSyncContext.Provider
      value={{
        memory,
        weather,
        savedLooks,
        history,
        loading,
        loadingMessage,
        outfitVersions,
        activeVersionIndex,
        setActiveVersionIndex,
        refreshMemory,
        refreshSaved,
        refreshHistory,
        fetchWeather,
        generateOutfits,
        regenerateVariations,
        lastOutfits,
        setLastOutfits,
        globalDestinationLocation,
        setGlobalDestinationLocation,
      }}
    >
      {children}
    </StyleSyncContext.Provider>
  );
}

export function useStyleSync() {
  const ctx = useContext(StyleSyncContext);
  if (!ctx) throw new Error('useStyleSync must be used within StyleSyncProvider');
  return ctx;
}
