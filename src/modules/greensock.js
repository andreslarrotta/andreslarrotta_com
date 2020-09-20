import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

const easing = () => {
    /* wron part */
    let wronPart = document.querySelector('.easing .wrong .square'),
        goodPart = document.querySelector('.easing .good .square')

    setInterval(() => {
        if (!wronPart.classList.contains('active')) {
            wronPart.classList.add('active')
            wronPart.setAttribute('style', 'float: right;')
        }
        else {
            wronPart.classList.remove('active')
            wronPart.setAttribute('style', 'float: left;')
        }
    }, 1000);

    /* good part */
    let easingAnimation = gsap.timeline({ repeat: -1 });

    easingAnimation.to(goodPart, {
        /* css */
        "margin-left": "87%",
        borderWidth: '20px',
        borderColor: 'black',
        borderStyle: 'solid',
        duration: 1
    })
        .to(goodPart, {
            "margin-left": "0%",
            borderWidth: '0',
            borderColor: 'black',
            borderStyle: 'solid',
            duration: 1
        })
    /* 
        easingAnimation.delay(1); */

}
const offset = () => {
    let buttonMenu = document.querySelector('.offset .good .square')
    buttonMenu.addEventListener('click', (e) => {
        let offsetAnimation = gsap.timeline(),
            contenidoBotonOffsetitems = document.querySelectorAll('.offset .square_content .item')

        offsetAnimation.to(e.target, {
            scale: 2,
            duration: 0.1
        })
            .to(e.target, {
                scale: 1,
                duration: 0.1
            })

        if (!e.target.classList.contains('active')) {
            e.target.classList.add('active')
            gsap.to(contenidoBotonOffsetitems, { stagger: 0.2, ease: "elastic", opacity: 1, duration: 2 })
        }
        else {
            e.target.classList.remove('active')
            gsap.to(contenidoBotonOffsetitems, { stagger: -0.2, ease: "elastic", opacity: 0, duration: 2 })
        }
    })

}
const masking = () => {
    let squareMasking = document.querySelector('.masking .good .square'),
        botonPlus = document.querySelector('.masking .good .square .fa-plus'),
        botonOpen = document.querySelector('.masking .good .square .button'),
        maskinAnimation = gsap.timeline()

    botonPlus.addEventListener('click', () => {
        if (!squareMasking.classList.contains('active')) {
            squareMasking.classList.add('active')
            maskinAnimation.to(squareMasking, {
                width: '100%',
                duration: 0.5
            })
                .to(squareMasking, {
                    borderColor: 'black',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderRadius: '0',
                    duration: 0.1
                })
        }
        else {
            squareMasking.classList.remove('active')
            botonOpen.classList.remove('open')
            botonOpen.querySelector('.content').textContent = 'Open'
            maskinAnimation.to(squareMasking, {
                height: '100px',
                width: '100px',
                duration: 0.5
            })
                .to(squareMasking, {
                    background: 'orange',
                    borderWidth: '0',
                    borderRadius: '17px',
                    duration: 0.1
                })
        }
    })
    botonOpen.addEventListener('click', (e) => {
        e.preventDefault()
        let paperPlane = document.querySelector('.masking .square .fa-paper-plane')

        if (botonOpen.classList.contains('open')) {
            botonOpen.classList.remove('open')
            botonOpen.querySelector('.content').textContent = 'Open'

            maskinAnimation.to(squareMasking, {
                height: '100px',
                duration: 0.5
            })
                .to(squareMasking, {
                    background: 'orange',
                    borderWidth: '0',
                    borderRadius: '17px',
                    duration: 0.1
                })
        }
        else {
            botonOpen.classList.add('open')
            botonOpen.querySelector('.content').textContent = 'Close'
            gsap.to(squareMasking, {
                borderColor: 'orange',
                background: "white",
                borderWidth: '2px',
                borderStyle: 'solid',
                borderRadius: '17px',
                height: '300px',
                duration: 1
            })
            maskinAnimation.to(paperPlane, {
                color: 'black',
                x: '100px',
                y: '-30px',
                duration: 0.5
            }).to(paperPlane, {
                x: '-10px',
                y: '-30px',
                duration: 0.6
            })
                .to(paperPlane, {
                    x: '0',
                    y: '0',
                    color: 'white',
                    duration: 0.6
                })

        }
    })
}
const parenting = () => {
    let goodSquare = document.querySelector('.parenting .good .square'),
        bones = document.querySelector('.parenting .good .container')

    Draggable.create(goodSquare, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: bones,
        inertia: false,
        onDrag: function () {
            let carga = ((this.x) * (100)) / this.maxX,
                scala = (carga * 2) / 100,
                elementoHr = document.querySelector('.parenting .good .container hr')

            if (carga < 0) {
                carga = 0
            }
            else if (carga > 100) {
                carga = 100
                scala = 2
            }
            if (scala < 0.5) {
                scala = 0.5
            }
            gsap.to(goodSquare, {
                scaleX: scala,
                scaleY: scala,
            })
            elementoHr.setAttribute('style', `width:${carga}%`)
        }
    });
}
const transformation = () => {
    let squareOne = document.querySelectorAll('.transformation .wrong .square')[0],
        squareTwo = document.querySelectorAll('.transformation .good .square')[0],
        squareThree = document.querySelectorAll('.transformation .wrong .square')[1],
        squareFour = document.querySelectorAll('.transformation .good .square')[1],
        loopAnimation = gsap.timeline({ repeat: -1 })

    loopAnimation.to(squareOne, {
        scale: 1.5
    }, 1)
        .to(squareOne, {
            scale: 1
        }, 2)

    loopAnimation.to(squareTwo, {
        scaleY: 1.5
    }, 1)
        .to(squareTwo, {
            scaleY: 1
        }, 2)
        .to(squareTwo, {
            scaleX: 1.5
        }, 3)
        .to(squareTwo, {
            scaleX: 1
        }, 4)

    loopAnimation.to(squareThree, {
        rotate: 360
    }, 0.5)

    loopAnimation.from(squareFour, {
        x: -100,
        y: 0,
        opacity: 0
    }, 1)
}
const obscuration = () => {
    let wrongSide = document.querySelector('.obscuration .wrong .square .fa-ellipsis-v'),
        settingWrong = document.querySelector('.obscuration .wrong .square .settings'),
        goodSide = document.querySelector('.obscuration .good .square .fa-ellipsis-v'),
        settingGood = document.querySelector('.obscuration .good .square .settings'),
        contentGood = document.querySelector('.obscuration .good .square .square_content')


    wrongSide.addEventListener('click', () => {
        settingWrong.classList.toggle('active')
        if (settingWrong.classList.contains('active')) {
            wrongSide.setAttribute('style', 'color:white;')
        }
        else {
            wrongSide.setAttribute('style', 'color:black;')
        }
    })
    goodSide.addEventListener('click', () => {
        settingGood.classList.toggle('open')
        if (settingGood.classList.contains('open')) {
            goodSide.setAttribute('style', 'color:white;')
            gsap.to(settingGood, {
                opacity: 1,
                scale: 1
            }, 1)
            gsap.from(settingGood, {
                borderRadius: '50%',
                scale: 0,
            }, 1)
            gsap.to(contentGood, {
                scale: 0.9,
                opacity: 0.5
            }, 1)
        }
        else {
            goodSide.setAttribute('style', 'color:black;')

            gsap.to(settingGood, {
                scale: 0,
                borderRadius: '0%',
                opacity: 0.5
            }, 1)

            gsap.to(contentGood, {
                scale: 1,
                opacity: 1
            }, 1)
        }

    })
}
const greensock = () => {
    let body = document.body
    if (body.classList.contains('greensock')) {
        easing()
        offset()
        masking()
        parenting()
        transformation()
        obscuration(9)
    }
}
export default greensock