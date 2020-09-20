export const installMents = (price,showcase,resetPrice = false)=>{
    if(!resetPrice){
        price = price.toString().substring(0, price.toString().length-2)
    }
    

    //console.log('el precio es', price)
    //console.log('los installments',data[0].items[0].sellers[0].commertialOffer.Installments)
    
    //console.log('filtardo', filterData)
    //console.log('price formt install',price)
    if(price < 440344){
        //console.log('cutoas', 6,price)
        return {
            price: price *  0.181542,
            cuota: 6
        }
        
    }else if(price > 440345 && price < 637044){
        //console.log('cutoas', 9)
        return {
            price: price *  0.125449,
            cuota: 9
        }
        
        
    }else if(price > 637045 && price < 819588){
        //console.log('cutoas', 12)
        return {
            price: price *  0.097479,
            cuota: 12
        }
        
        
    }else if(price > 819589 && price < 1146214){
        //console.log('cutoas', 16)
        return {
            price: price *  0.069662,
            cuota: 18
        }
       
        
    }else if(price > 1146215 && price < 1427526){
        //console.log('cutoas', 24)
        return {
            price: price *  0.055905,
            cuota: 24
        }
        
        
    }else if(price > 1427527){
        
        return {
            price: price *  0.042443,
            cuota: 36
        }
        
        
    }
}