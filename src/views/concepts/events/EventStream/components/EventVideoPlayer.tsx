import Card from '@/components/ui/Card'
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import React from 'react'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import Notification from '@/components/ui/Notification'


import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'
import { toast } from '@/components/ui'

interface EventVideoPlayerProps {
    src?: string
    poster?: string
}

const onAutoPlay = () => {
    console.log('onAutoPlay - success')
}
const onAutoPlayFail = () => {
    console.log('onAutoPlayFail - failed')
    toast.push(
        <Notification type="danger">
            Ops, video did not play automatically due to restriction from your
            browser. Please press play button to start the video.
        </Notification>,
        {
            placement: 'top-center',
        },
    )
}

const EventVideoPlayer: React.FC<EventVideoPlayerProps> = ({
    src = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    poster = 'https://ecme-react.themenate.net/img/landing/hero/hero.webp',
}) => {
    return (
        <Card className="w-full h-full p-0 m-0">
            <MediaPlayer
                autoPlay
                muted
                title="..."
                storage={src}
                src={src}
                onAutoPlay={onAutoPlay}
                onAutoPlayFail={onAutoPlayFail}
                className="w-full h-full"
            >
                <MediaProvider className="w-full h-full">
                    <Poster src={poster} alt="..." className="w-full h-full" />
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
