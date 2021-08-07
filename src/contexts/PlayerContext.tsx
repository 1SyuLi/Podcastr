import is from 'date-fns/esm/locale/is/index.js';
import { createContext, ReactNode, useContext, useState } from 'react';


type Episode = {
    titles: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean,
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void;
    PlayList: (list: Episode[], index: number) => void;
    PlayNext: () => void;
    PlayPrevious: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
};

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children}: PlayerContextProviderProps){
  const [episodeList, setepisodeList] = useState([]);
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);


  function play(episode: Episode){
    setepisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setIsPlaying(true);
  }


  function PlayList(list: Episode[], index: number) {
      setepisodeList(list);
      setcurrentEpisodeIndex(index);
      setIsPlaying(true);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function PlayNext(){
    if(isShuffling){
        const NextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setcurrentEpisodeIndex(NextRandomEpisodeIndex);
    }else if(hasNext){
        setcurrentEpisodeIndex(currentEpisodeIndex + 1);
    } 
  }

  function PlayPrevious (){
      if(hasPrevious){
        setcurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleShuffle(){
      setIsShuffling(!isShuffling)
  }

  function toggleLoop(){
      setIsLooping(!isLooping)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function clearPlayerState(){
      setepisodeList([]);
      setcurrentEpisodeIndex(0);
  }

  return(
    <PlayerContext.Provider value={
        { episodeList,
         currentEpisodeIndex,
         play,
         isPlaying,
         isLooping,
         isShuffling,
         togglePlay,
         setPlayingState,
         PlayList,
         PlayNext,
         PlayPrevious,
         hasPrevious,
         hasNext,
         toggleLoop,
         toggleShuffle,
         clearPlayerState,
        }
    }>
        {children}
    </PlayerContext.Provider>
  )
} 

export const usePlayer = () => {
    return useContext(PlayerContext);
}
