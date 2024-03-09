const isMobile = {
    any: function() {
        return window.matchMedia('(max-width: 768px)').matches;
    }
}

export default isMobile;
