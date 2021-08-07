import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../services/api'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import ptBR from 'date-fns/locale/pt-BR'
import { Convert } from '../../utils/convertDurationToTimeString'
import Image from 'next/image'

import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContext'

type Episode = {
  id: string;
  titles: string; 
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string; 
  url: string;
  description: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}:EpisodeProps){

    const { play } = usePlayer()


    return(
        <div className={styles.episodes}>
            <div className={styles.ThumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="voltar"/>
                    </button>
                </Link>
                <Image 
                  width={700} 
                  height={160} 
                  src={episode.thumbnail} 
                  objectFit='cover'
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episodio"/>
                </button>
            </div>

            <header>
                <h1>{episode.titles}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }}/>
        </div>
    )
}



export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params:{
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}


export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)


    const episode = {
        id: data.id,
        titles: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: Convert(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, //24 hours
    }
}