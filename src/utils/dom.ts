interface VideoItem { 
    img_url: string; 
    video_url: string; 
    title: string; 
    subtitle: string 
}


export function createItemElement (item: VideoItem) {
    const { img_url, video_url, title, subtitle } = item

    const li = document.createElement('li')
    li.setAttribute('data-video-url', video_url)
    li.setAttribute('data-title', title)

    const i = document.createElement('i')
    i.classList.add('iconfont', `icon-play`)
    
    const img = document.createElement('img')
    img.setAttribute('src', img_url)
    img.setAttribute('title', title)
    img.setAttribute('alt', title)
    
    const h3 = document.createElement('h3') 
    h3.textContent = title
    
    li.appendChild(img)
    li.appendChild(i)
    li.appendChild(h3)

    const h4 = document.createElement('h4')
    h4.textContent = subtitle
    subtitle !== '' && li.appendChild(h4)

    return li
}

export function addClickListener (el: HTMLElement) {
    el.addEventListener('click', () => {
        console.log('hello world')
    })
    return el
}

export function appendToListElement (listElement: string | Element, listItems: HTMLElement[]) {
    if (typeof listElement === 'string') {
        listElement = document.querySelector(listElement)
    }

    const fragment = document.createDocumentFragment()
    
    listItems.forEach((item) => {
        fragment.appendChild(item)
    })

    listElement.appendChild(fragment)
}
