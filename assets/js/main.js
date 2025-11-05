// we grab our header and our desktop header
// we insert the contents of our header into the desktop one

const header = document.querySelector('.header')
const desktopHeader = document.querySelector('.header-desktop')
desktopHeader.innerHTML = header.innerHTML

// 1. when the .header enters the viewprt, hide the desktop header (by adding the visible class)
// 2. when the header leaves, show it (by adding the visible class)

inView('.header')
    .on('enter', el => desktopHeader.classList.remove('visible'))
    .on('exit', el => desktopHeader.classList.add('visible'))


// here we enable the tilt library on all our images
VanillaTilt.init(document.querySelectorAll('.image'), {
    max: 25,
    speed: 400
})


// here we grab all our images we want to fade in
// we add the visible class which toggles the opacity
inView('.fade')
    .on('enter', img => img.classList.add('visible'))
    .on('exit', img => img.classList.remove('visible'))

