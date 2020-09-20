let extend = function ( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};
import {installMents} from '../utils/installMents'
class ProductInf{
    constructor(options){
        let defaults = {
            getImageDefault : null,//retorna un objeto con imaganes
            getNameDefault : null,//retorna el nombre del producto
            getproductReference : null,
            getPriceDefault : null,//retorna el precio
            getClustersDefault : null,//retorna los clusters
            getBrand : null,
            getLink : null,
            getCategories : null,
            getDescription : null,
            getKitsLook: null,
            getQuantity:null,
            getSpecification: null
            
        };
        this.options = extend(defaults, options);
        this.initOptions()
        this.skuInfo = window.skuJson
        this.arrImages = []
    }
    
    async getProduct(){
        const response = await fetch(`/api/catalog_system/pub/products/search/${location.pathname.toLowerCase()}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "cache-control": "no-cache",
            }
          });
          const json = await response.json();
        
          return json;
    }
    async initOptions(){
        const data = await this.getProduct(),
              skuInfo = this.skuInfo  
              
        typeof this.options.getImageDefault === "function" ? this.options.getImageDefault(data[0].items[0].images) : null
        typeof this.options.getNameDefault === "function" ? this.options.getNameDefault(data[0].productName) : null
        typeof this.options.getClustersDefault === "function" ? this.options.getClustersDefault(data[0].clusterHighlights) : null
        typeof this.options.getBrand === "function" ? this.options.getBrand(data[0].brand) : null
        typeof this.options.getLink === "function" ? this.options.getLink(data[0].link) : null
        typeof this.options.getCategories === "function" ? this.options.getCategories(data[0].categories) : null
        typeof this.options.getDescription === "function" ? this.options.getDescription(data[0].description) : null
        typeof this.options.getQuantity === "function" ? this.options.getQuantity(data[0].items[0].sellers[0].commertialOffer.AvailableQuantity) : null
        typeof this.options.getproductReference === "function" ? this.options.getproductReference(data[0].productReference) : null
        typeof this.options.getSpecification === "function" ? this.options.getSpecification(data[0]) : null
        if(typeof this.options.getPriceDefault === "function"){
            let prices,
                bPrice
            for (const item of skuInfo.skus) {
                if(item.availablequantity > 0){
                    prices = {
                        bestPrice: item.bestPrice,
                        bestPriceFormated: item.bestPriceFormated.replace(',00',''),
                        listPrice:item.listPrice,
                        listPriceFormated:item.listPriceFormated.replace(',00','')
            
                    }
                    break;
                }
            }
            console.log('precios',prices)
            if(prices != undefined){
                let priceInstallment = installMents(prices.bestPrice,false);
            
            
                prices.installments = priceInstallment
    
    
                
                this.options.getPriceDefault(prices)
            }else{
                this.options.getPriceDefault(false)
            }
           
        }
        typeof this.options.getKitsLook === "function" ? this.options.getKitsLook(data[0].items.map(item => item.kitItems)) : null
        

        

        data[0].items.forEach((element,index) => {
            let id = element.itemId,
                ims = element.images
        
            this.arrImages.push({
              sku:id,
              ims
            })
              
          });

        

    }
   
    filterInstallment(data,cuota){
        return data[0].items[0].sellers[0].commertialOffer.Installments.filter((item)=>{
            //console.log(item.Name)
            return item.PaymentSystemName == 'mefiacuotas' && item.NumberOfInstallments == cuota
        })
    }
    getImageSku(sku){
        console.log('arrimages',this.arrImages)
        return this.arrImages.filter((el)=>{
            return (el.sku == sku) ? el : null
        })
        
    }
    getPriceSku(sku){
       const skuInfo =  this.skuInfo.skus.filter((el)=>{
            return (el.sku == sku) ? el : null
        }),
        prices = {
            bestPrice: skuInfo[0].bestPrice,
            bestPriceFormated: skuInfo[0].bestPriceFormated.replace(',00',''),
            listPrice:skuInfo[0].listPrice,
            listPriceFormated:skuInfo[0].listPriceFormated.replace(',00','')

        }

        return prices;


    }
    




}

export default ProductInf;
