import React, { createContext, useContext, useEffect, useState } from 'react';
import { Region } from 'react-native-maps';

interface MapContextProps {
  region: Region;
  initialRegion: Region;
  borders?: { latitude: number; longitude: number }[];
  setRegion: (region: Region) => void;
  setInitialRegion: (region: Region) => void;
  resetRegion: () => void;
  setBorders: (
    borders: {
      latitude: number;
      longitude: number;
    }[]
  ) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({
  children,
  loadRegion,
  loadBorder,
}: {
  children: JSX.Element;
  loadRegion: Region;
  loadBorder: { latitude: number; longitude: number }[];
}) => {
  const [initialRegion, setInitialRegion] = useState<Region>(loadRegion);
  const [region, setRegion] = useState<Region>(loadRegion);
  const [borders, setBorders] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    setInitialRegion(loadRegion);
    setRegion(loadRegion);
  }, [loadRegion]);
  useEffect(() => {
    setBorders(loadBorder);
  }, [loadBorder]);
  function resetRegion() {
    setRegion(initialRegion);
  }

  return (
    <MapContext.Provider
      value={{
        region,
        setRegion,
        setInitialRegion,
        resetRegion,
        initialRegion,
        setBorders,
        borders,
      }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextProps => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
