import { addClickListener, appendToListElement, createItemElement } from './dom'
import { fetchVideoItems } from './fetchVideoItems'


export default async function displayVideoFloor (selector: string) {
    const items = await fetchVideoItems()

    const listItems = items
        .map(createItemElement)
        .map(addClickListener)

    appendToListElement(selector, listItems)

    console.log(document.documentElement.innerHTML)
}
