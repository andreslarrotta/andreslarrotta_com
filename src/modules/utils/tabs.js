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

class TabsN {
    constructor(options){
        let defaults = {
            containerNav: 'tab__container',
            classLink: 'tab__link',
            classTabPanel: 'tab__panel',
            activeClass: 'activeTab',
            activeClassTab: 'active',
            callback:function(){},
        };
        this.options = extend(defaults, options);
        this.init()
    }

    init(){
        
       const    container = document.querySelector(`.${this.options.containerNav}`),
                tabLinks =  container.querySelectorAll(`.${this.options.classLink}`),
                TabPanels = container.querySelectorAll(`.${this.options.classTabPanel}`)
                console.log(TabPanels)
       container.addEventListener('click',(e) =>{
           console.log(e.target)
           console.log(this.options.classLink)
        if (e.target.className.includes(`${this.options.classLink}`)){
            e.preventDefault()
            e.stopImmediatePropagation()
            const href = e.target.getAttribute('href')
            console.log('todas estas son las clases ', this.options)
            this.toogleClass(tabLinks,this.options.activeClass)
            this.toogleClass(TabPanels,this.options.activeClassTab)

            e.target.classList.add(this.options.activeClass)
            console.log(document.querySelector(`${href}`))
            document.querySelector(`${href}`).classList.add(this.options.activeClassTab)
        }

       })

    }
    toogleClass(elemts,clase){
        for (let item of elemts) {
            item.classList.remove(clase);
        }
    }
}
export default TabsN;
