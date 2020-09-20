import {installMents} from './installMents'
import Ordercart from './ordercart'
export const showcaseInstallment = (contexto = document, smartFilter = false) =>{
    if(smartFilter){
       
        let showCases = contexto.querySelectorAll('.item__showcase')
        for (const element of showCases) {
            let pricesHtml = element.querySelector('.item__showcase__price-best'),
            cuotas = element.querySelector('.item__showcase__due__nInstall'),
            precioCutoas = element.querySelector('.item__showcase__due__price'),
            priceText = pricesHtml.textContent.replace(/\./g, "").replace('$',''),
            objInstall = installMents(priceText,false)
        
            cuotas.innerHTML = `${Ordercart.currency(objInstall.cuota)}`
            
            precioCutoas.innerHTML = `$ ${Ordercart.currency(objInstall.price)}`
        }
    }else{
        if(contexto.querySelector('.item__showcase__price-best')){
            let pricesHtml = contexto.querySelector('.item__showcase__price-best'),
            cuotas = contexto.querySelector('.item__showcase__due__nInstall'),
            precioCutoas = contexto.querySelector('.item__showcase__due__price'),
            priceText = pricesHtml.textContent.replace(/\./g, "").replace('$',''),
            objInstall = installMents(priceText,false)
        
            cuotas.innerHTML = `${Ordercart.currency(objInstall.cuota)}`
            
            precioCutoas.innerHTML = `$ ${Ordercart.currency(objInstall.price)}`
        }else{
            contexto.querySelector('.item__showcase__dues').style.display = 'none'
        }
        
        //console.log('las cuotas son',installMents(priceText,false))
    }
 
}