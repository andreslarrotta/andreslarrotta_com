import sass from './scss/main.scss'
import greensock from './modules/greensock'

window.addEventListener('DOMContentLoaded', function () {
    greensock()
    registerSW()
});

/* instalamos el service workes que estamos llamando del archivo switch.js */
async function registerSW(){
    if ('serviceWorker' in navigator) {
        try{
            await navigator.serviceWorker.register('./sw.js')
        } catch(e){
            console.log('SW registration failed');
            
        }
    }
}

