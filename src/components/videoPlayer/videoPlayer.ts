import styles from './video-player.module.css'

interface VideoConfig {
    url: string
    el: string | HTMLElement
    width?: string
    height?: string
    autoplay?: boolean
}

export default function video (options: VideoConfig) {
    return new Video(options)
}

class Video implements Component {
    container: HTMLDivElement
    constructor (private settings: VideoConfig) {
        this.settings = {
            width: '100%',
            height: '100%',
            autoplay: false,
            ...this.settings
        }

        this.init()
    }
    
    init () {
        this.template()
        this.handle()
    }
    template () {
        this.container = document.createElement('div')
        const { width, height, url, autoplay } = this.settings
        this.container.style.width = width 
        this.container.style.height = height 

        this.container.innerHTML = `
            <video ${autoplay ? 'autoplay' : ''} class=${styles['video-content']} src=${url}></video>
            <div class=${styles['video-control']}>
                <div class=${styles['progress-bar']}>
                    <div class=${styles['progress-played']}></div>
                    <div class=${styles['progress-loaded']}></div>
                    <div class=${styles['progress-pointer']}></div>
                </div>
                <div class=${styles['control-buttons-wrapper']}>
                    <div class=${styles['left']}>
                        <i class="iconfont icon-play ${styles['play-toggle']}"></i>
                        <span class=${styles['play-time']}>00:00 / 00:00</span>
                    </div>
                    <div class=${styles['right']}>
                        <i class="iconfont icon-volume ${styles['volume-toggle']}"></i>
                        <div class=${styles['volume-progress']}>
                            <div class=${styles['volume-current']}></div>
                            <div class=${styles['volume-progress-pointer']}></div>
                        </div>
                        <i class="iconfont icon-fullscreen ${styles['fullscreen-toggle']}"></i>
                    </div>
                </div>
            </div>
        `
        
        let { el } = this.settings
        if (typeof el === 'string') {
            el = document.querySelector(el) as HTMLElement
        }

        el.appendChild(this.container)
    }
    handle () {}
}
