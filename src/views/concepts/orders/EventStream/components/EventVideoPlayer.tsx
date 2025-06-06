import Card from '@/components/ui/Card'
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import React from 'react'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'

import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'
interface EventVideoPlayerProps {
    src?: string
    poster?: string
}

const EventVideoPlayer: React.FC<EventVideoPlayerProps> = ({
    src = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    poster = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
}) => {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <MediaPlayer title="..." src={src}>
                <MediaProvider>
                    <Poster src={poster} alt="..." />
                </MediaProvider>

                <DefaultVideoLayout
                    thumbnails="thumbnails.vtt"
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>
        </Card>
    )
}

export default EventVideoPlayer
