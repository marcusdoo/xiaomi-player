import styles from './video-player.module.css'

interface VideoConfig {
    url: string
    el: string | HTMLElement
    width?: string
    height?: string
    autoplay?: boolean
    volume?: number
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
            volume: 0.5,
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
        this.container.classList.add(`${styles['video']}`)

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
                        <div class=${styles['play-time']}><span>00:00</span> / <span>00:00</span></div>
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

    getElement (selector: string): HTMLElement {
        return this.container.querySelector(selector)
    }
    getAllElement (selector: string): NodeList {
        return this.container.querySelectorAll(selector)
    }
    
    qsa (selector: TemplateStringsArray): NodeList {
        return this.container.querySelectorAll(selector.raw[0])
    }

    handle () {
        const playToggleEl = this.getElement(`.${styles['play-toggle']}`)
        const videoEl= this.getElement(`.${styles['video-content']}`) as HTMLVideoElement
        const fullscreenToggleEl = this.getElement(`.${styles['fullscreen-toggle']}`)
        const [currentTimeEl, durationEl] = Array.from(this.getAllElement(`.${styles['play-time']} span`))
        
        const progressBarEl = this.getElement(byClass('progress-bar'))
        const progressPlayedEl = this.getElement(byClass('progress-played'))
        const progressPointerEl = this.getElement(byClass('progress-pointer'))
        const progressLoadedEl = this.getElement(byClass('progress-loaded'))

        const volumeToggleEl = this.getElement(byClass('volume-toggle'))
        const volumePointerEl = this.getElement(byClass('volume-progress-pointer'))
        const volumeCurrentEl = this.getElement(byClass('volume-current'))

        videoEl.volume = this.settings.volume

        videoEl.addEventListener('canplay', () => {
            currentTimeEl.textContent = formatTime(videoEl.currentTime)
            durationEl.textContent = formatTime(videoEl.duration)
        })

        videoEl.addEventListener('play', () => {
            playToggleEl.classList.replace('icon-play', 'icon-pause')
        })

        videoEl.addEventListener('pause', () => {
            playToggleEl.classList.replace('icon-pause', 'icon-play')
        })

        videoEl.addEventListener('timeupdate', () => {
            const playedPercentage = videoEl.currentTime / videoEl.duration * 100 + '%'
            const loadedPercentage = videoEl.buffered.end(0) / videoEl.duration * 100 + '%'
            currentTimeEl.textContent = formatTime(videoEl.currentTime)

            progressPlayedEl.style.width = playedPercentage 
            progressPointerEl.style.left = playedPercentage
            progressLoadedEl.style.width = loadedPercentage
        })

        progressPointerEl.addEventListener('mousedown', function (e: MouseEvent) {
            const _this = this
            const startX = e.pageX
            const startLeft = this.offsetLeft

            function onMouseMove (e: MouseEvent) {
                let percentage = (e.pageX - (startX - startLeft)) / _this.parentElement.offsetWidth
                
                if (percentage < 0) {
                    percentage = 0
                }
                if (percentage > 1) {
                    percentage = 1
                }

                volumeCurrentEl.style.width = percentage * 100 + '%' 
                progressLoadedEl.style.width = percentage * 100 + '%'
                progressPointerEl.style.left = percentage * 100 + '%'
                videoEl.currentTime = percentage * videoEl.duration
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove)
            })

            e.preventDefault()
        })
 

        volumePointerEl.addEventListener('mousedown', function (e: MouseEvent) {
            console.log(123)
            const _this = this
            const startX = e.pageX
            const startLeft = this.offsetLeft

            function onMouseMove (e: MouseEvent) {
                let percentage = (e.pageX - (startX - startLeft)) / _this.parentElement.offsetWidth
                if (percentage < 0) {
                    percentage = 0
                }
                if (percentage > 1) {
                    percentage = 1
                }

                volumeCurrentEl.style.width = percentage * 100 + '%'
                volumePointerEl.style.left = percentage * 100 + '%'
                videoEl.volume = percentage
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove)
            })

            e.preventDefault()
        })

        // press `F` key to enter/exit fullscreen
        let isFullscreen = false
        document.addEventListener('keyup', (e) => {
            if (e.key === 'f') {
                videoEl.requestFullscreen()
                isFullscreen = true
            }
            if (isFullscreen) {
                document.exitFullscreen()
                isFullscreen = false
            }
        })

        this.container.addEventListener('click', (e) => {
            const target = e.target
            e.preventDefault()
            switch (target) {
                case videoEl:
                case playToggleEl: {
                    videoEl.paused ? videoEl.play() : videoEl.pause()
                    break
                }
                case fullscreenToggleEl: {
                    videoEl.requestFullscreen()
                    break
                }
                case progressPlayedEl: // HACK: solved problem caused by z-index
                case progressBarEl: {
                    progressPointerEl.style.left = e.offsetX + 'px'
                    progressPlayedEl.style.width = e.offsetX + 'px' 
                    videoEl.currentTime = e.offsetX / parseFloat(getComputedStyle(progressBarEl).width) * videoEl.duration
                    break
                }
                case volumeToggleEl: {
                    const isMuted = videoEl.muted
                    videoEl.muted = !isMuted
                    if (isMuted) {
                        volumeToggleEl.classList.replace('icon-mute', 'icon-volume')
                    } else {
                        volumeToggleEl.classList.replace('icon-volume', 'icon-mute')
                    }
                    break
                }
            }
        })
    }
}


function formatTime (time: number): string {
    if (isNaN(time) || time < 0) {
        throw new TypeError(`time must be a positive number, received ${typeof time}.`)
    }

    const m = Math.floor(time / 60)
    const s = Math.round(time % 60)

    function padStart (n: number) {
        return (n < 10 ? '0' : '') + n
    }
    
    return padStart(m) + ':' + padStart(s)
}

function byClass (str: keyof (typeof styles)) {
    return `.${styles[str]}`
}
