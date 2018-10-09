let header = document.querySelector('header'),
    sections = document.querySelectorAll("body main > section");

header.querySelectorAll("nav ul a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault()
        let targetElem = document.querySelector(e.currentTarget.hash)
        window.scrollBy({
            top: targetElem.getBoundingClientRect().top - document.querySelector("header").getBoundingClientRect().height,
            behavior: 'smooth'
        })
        header.classList.toggle('active')
    })
})

function verifySectionsActive() {
    let offsets = [].map.call(sections, section => {
        header.classList.remove(section.id)
        return {id: section.id, y: Math.abs(section.getBoundingClientRect().top)}
    })

    let newOffsets = offsets.sort((a, b) => a.y > b.y)
    header.classList.add(newOffsets[0].id)

    let activeLink = header.querySelector("a.active")
    if (activeLink) activeLink.classList.remove('active')
    let nextLink = header.querySelector("a[href='#" + newOffsets[0].id + "']")
    if (nextLink) nextLink.classList.add('active')
}

window.addEventListener('scroll', () => {
    let scrollY = window.scrollY
    scrollY > header.offsetHeight ? header.classList.add('scrolled') : header.classList.remove('scrolled')
    verifySectionsActive()
})
