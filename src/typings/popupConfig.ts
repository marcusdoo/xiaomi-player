type PopupConfig = Partial<{
    width: string
    height: string
    title: string
    pos: | 'left' 
        | 'center' 
        | 'right'
    mask: boolean
    content: (el: HTMLElement) => void
}>
