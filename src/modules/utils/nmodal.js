class Nmodal {
  /* 
      se crea el constructor con dos parametros
      nameElement: id para que el modal se unico como objeto
      options: 
          beforeclose: se puede enviar como funciona que se ejecuta antes de cerrar el modal
          beforeOpen: se puede enviar como funcion que se ejecuta antes de abrir el modal
  */
  constructor(nameElement = "NmodalS", classModal = "", classContent = "", options = {
    beforeClose: null,
    beforeOpen: null
  }) {

    this.nameElement = nameElement;
    this.classModal = classModal;
    this.classContent = classContent;

    //estructura html del modal
    this.html = `<div id="${this.nameElement}__Nmodal__container" class="Nmodal__container ${this.classModal}">
                          <div class="Nmodal__box">
                          <button id="${this.nameElement}-close" class="close-button Nmodal__close" aria-label="Close alert" type="button" data-close>
                            &times;
                          </button>
                              
                              <div id="${this.nameElement}__Nmodal-content" class="Nmodal__box-content ${this.classContent}"></div>
                          </div>
                      </div>
                      `;



    //parametros con las opciones
    this.options = options;

    //ejecuta funcion de renderizado del modal
    this._render();

  }
  //funcion de renderizar el modal
  _render() {
    //id del modal cread
    let exist = `${this.nameElement}__Nmodal__container`

    //se comprueba si el modale ya esta creado
    if (document.getElementById(exist) == null) {
      //si no esa creado se crear un div padre que va contener el modal yse agrega al final del body

      document.querySelector('body').insertAdjacentHTML('beforeend', this.html);

      //se agrega un elemento de clase para controlar el scroll en el body
      
    }


  }
  //eventos para cerrar el modal
  _closeEvents() {
    //evento click con delgate sobre el div padre del modal para cerrarlo
    document.querySelector('.Nmodal__container').addEventListener("click", (e) => {
      //si el click sucedio en el overlay se cierra

      //si el click sucedio sobre el boton cerrar se cierra el modal
      //console.log(e.target)
      if (e.target && e.target.matches(".Nmodal__close") || e.target.matches(".btn__close__modal")) {
        e.preventDefault()
        e.stopImmediatePropagation()
        //console.log(64756)
        this.close();
      }
    })
    document.addEventListener("keyup", (e) => {
      if (e.keyCode == 27 || e.keyCode == 13) {
        this.close();
      }
    });
  }
  //boora el contenido del modal
  setContent(content = "") {
    //console.log(document.getElementById(`${this.nameElement}__Nmodal-content`))
    document.getElementById(`${this.nameElement}__Nmodal-content`).innerHTML = content;
  }
  removeContent() {
    document.getElementById(`${this.nameElement}__Nmodal-content`).remove();
  }
  open() {
    document.querySelector('body').classList.add("body__Nmodal")
    if (typeof this.options.beforeOpen === 'function') {
      this.options.beforeOpen();
    }
    document.getElementById(`${this.nameElement}__Nmodal__container`).classList.add("Nmodal__visible");
    this._closeEvents();
  }
  close() {


    if (typeof this.options.beforeClose === "function") {
      var close = this.options.beforeClose.call(this);
      if (!close) return;
    }
    document.querySelector('body').classList.remove("body__Nmodal")
    document.getElementById(`${this.nameElement}__Nmodal__container`).classList.remove("Nmodal__visible");

  }
}

export default Nmodal;