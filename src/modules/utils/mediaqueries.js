const mediaQ = (media)=>{
    var x = window.matchMedia(media)
    if (x.matches) { // If media query matches
        return true
      } else {
        return false
      }
}
export default mediaQ;
