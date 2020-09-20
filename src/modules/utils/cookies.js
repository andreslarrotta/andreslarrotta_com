export const crearCookie = (name, value, days) => {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString()
    } else
        var expires = "";
    var domain = window.location.hostname;
    domain = domain.replace("www.", "");
    domain = domain.replace("www2.", "");
    document.cookie = name + "=" + value + expires + ";domain=." + domain + ";path=/"
}
export const actualizarCookie = (name, value) =>{
    document.cookie = name + "=" + value + "; path=/"
}
export const leerCookie = (name) =>{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return unescape(c.substring(nameEQ.length, c.length))
    }
    return ""
}
export const eliminarCookie = (name) =>{
    return document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
}
