// const isMobile = {
//     Android: function() {
//         return navigator.userAgent.match(/Android/i)
//     },
//     BlackBerry: function() {
//         return navigator.userAgent.match(/BlackBerry/i)
//     },
//     iOS: function() {
//         return navigator.userAgent.match(/iPhone|iPad|iPod/i)
//     },
//     Opera: function() {
//         return navigator.userAgent.match(/Opera Mini/i)
//     },
//     Windows: function() {
//         return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)
//     },
//     any: function() {
//         return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
//     }
// }

// export default isMobile

const isMobile = {
    any: function() {
        return window.matchMedia('(max-width: 767px)').matches;
    }
}

export default isMobile;
