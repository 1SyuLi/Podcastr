import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Convert } from '../../utils/convertDurationToTimeString';


export default function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        PlayNext,
        PlayPrevious,
        hasPrevious,
        hasNext,
        clearPlayerState, 
    } = usePlayer();

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play()
        }else{
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function HandleEpisodeEnded(){
        if (hasNext) {
            PlayNext();
        }else{
            clearPlayerState();
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return(
        <div className={styles.PlayerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando"/>
                <strong>Tocando Agora</strong>
            </header>

            { episode ? (
                <div className={styles.playingEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.titles}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.EmptyPlayer}>
                    <strong>Selecione um Podcast para ouvir</strong>
                </div>
            ) }

            

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span className={styles.afst}>{Convert(progress)}</span>
                    <div className={styles.Slider}>
                        {episode ? (
                            <Slider 
                            trackStyle={{backgroundColor : '#04d361'}} 
                            railStyle={{backgroundColor : '#9f75ff'}} 
                            handleStyle={{borderColor: '#04d361', borderWidth: 4}} 
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            />
                        ) : (<div className={styles.emptySlider} />)} 
                    </div>
                    <span className={styles.arst}>{Convert(episode?.duration ?? 0)}</span>
                </div>

                
                {episode && (
                    <audio src={episode.url} 
                    autoPlay
                    ref={audioRef} 
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    loop={isLooping}
                    onLoadedMetadata={setupProgressListener}
                    onEnded={HandleEpisodeEnded}
                    /> 
                )}

                <div className={styles.buttons}>
                    <button type="button" onClick={toggleShuffle} disabled={!episode || episodeList.length === 1} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>

                    <button type="button" onClick={PlayPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Anterior"/>
                    </button>

                    <button type="button" className={styles.PlayButton} disabled={!episode} onClick={togglePlay}>
                        {isPlaying ? <img src="/pause.svg" alt="pausar"/> : <img src="/play.svg" alt="Tocar"/>}
                    </button>

                    <button type="button" onClick={PlayNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Próximo"/>
                    </button>

                    <button type="button" onClick={toggleLoop} disabled={!episode} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>

                </div>
            </footer>
        </div>
    );
}