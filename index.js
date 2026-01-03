//datos productos 

const contenedor = document.getElementById("products");
let productos = [];
function card(data) {
    contenedor.innerHTML = "";

    data.forEach(element => {
        const html = `
                <div class="card">
                    <div class="card-header">
                        <img src="${element.image.desktop}" alt="${element.name}" class="imgP">
                         <div class="btnAdd"><img src="./assets/images/icon-add-to-cart.svg" alt="">Add to Cart</div>
                    </div>

                    <div class="description">${element.category}</div>
                    <div class="name" >${element.name}</div>
                    <div class="price" >$${element.price}</div>
                </div>   
            `;
        contenedor.innerHTML += html;
    });

}
fetch("./data.json").
    then(res => res.json()).
    then(data => {
        productos = data
        card(data)
    })

//guardar en una lista para usar en cart

const cartContent = document.querySelector(".cartItem")

let carrito = [];

const capEvento = (e) => {
    const btn = e.target.closest(".btnAdd");

    try {
        if (btn) {
            e.preventDefault();
            const card = btn.closest(".card");
            const nombre = card.querySelector(".name").innerText;
            const producto = productos.find(p => p.name === nombre);
            agregarAlCarrito(producto);
        }
    } catch {
        console.log("Ha ocurrido un error", error);
    }
};
contenedor.addEventListener("click", capEvento);



function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.name === producto.name);

    if (existe) {
        existe.cantidad++;
    }
    else {
        carrito.push({ name: producto.name, price: producto.price, cantidad: 1,image:producto.image})
    }

    renderizarCarrito();
    agregarTotal();
    mostrarCart();

}
function renderizarCarrito() {
    cartContent.innerHTML = "";

    carrito.forEach(item => {
        const htmlCart = `
        
            <div class="detallesTotal">
                <div class="detalles">
                    <div class="title">${item.name}</div>
                    <div class="asunto">
                        <span class="cantidad">${item.cantidad}x</span>
                        <span class="precioUnidad">@ $${item.price.toFixed(2)}</span>
                        <span class="precioTotal">$${(item.price * item.cantidad).toFixed(2)}</span>
                    </div>
                </div>
                <div class="btnCart">
                    <button class="btnEliminar">X</button>
                </div>
            </div>
            
        `
        cartContent.innerHTML += htmlCart;


    })
}



const totalContent = document.querySelector("#priceTotal");
function agregarTotal() {

    const total = carrito.reduce((acc, p) => acc + (p.cantidad * p.price), 0);
    try {

        totalContent.innerHTML = `$${total.toFixed(2)}`

    } catch (error) {
        console.log("Error al cargar total", error);
    }

}

function mostrarCart() {
    const cartItem = document.querySelector(".cartItem");
    const total = document.querySelector(".total");
    const textoAA = document.querySelector(".textoAA");
    const btnConfirmar = document.querySelector(".btnConfirmar");
    const empty = document.querySelector(".cartVacio");
    const titulo = document.querySelector(".titleCart h1");
    try {
        if (carrito.length > 0) {
            cartItem.hidden = false;
            total.hidden = false;
            textoAA.hidden = false;
            btnConfirmar.hidden = false;
            empty.hidden = true;

            contadorTitle = carrito.reduce((acc, p) => acc + p.cantidad, 0);
            titulo.innerHTML = `Your cart (${contadorTitle})`;
        } else {
            cartItem.hidden = true;
            total.hidden = true;
            textoAA.hidden = true;
            btnConfirmar.hidden = true;
            empty.hidden = false;

            titulo.innerText = `Your cart (0)`;
        }
    } catch (error) {
        console.log("Error al ocultar divs", error)
    }

}
function borrarDelCarrito(nombreProducto) {
    const productoEnCarrito = carrito.find(item => item.name === nombreProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad--;


        if (productoEnCarrito.cantidad <= 0) {
            carrito = carrito.filter(item => item.name !== nombreProducto);
        }
    }

    renderizarCarrito();
    agregarTotal();
    mostrarCart();
}

cartContent.addEventListener("click", (e) => {
    const btn = e.target.closest(".btnEliminar");
    if (btn) {
        const nombre = btn.closest(".detallesTotal").querySelector(".title").innerText;
        borrarDelCarrito(nombre);
    }
});


//modalCartConfirmed

const modalsCart = document.querySelector(".modalCart");
const confirmar = document.querySelector(".btnConfirmar");
const cerrar = document.querySelector("#btnNew")
const productosContenedor = document.querySelector(".productosCart");

confirmar.addEventListener("click", (e) => {
    modalsCart.classList.add("active")

    productosContenedor.innerHTML = ""
    try {
        carrito.forEach(element => {
            const detalleOrder = `
        <div class="row">
            <div class="imagen">
                <img src="${element.image.thumbnail}" alt="" >
            </div>
            <div class="productoDetalle">
                
                    <div id="titleDetalle">${element.name}</div>
                <div class="Detalle">
                    <div class="cantidadDetalle">${element.cantidad}x</div>
                    <div class="precioDetalle">@${element.price}</div>
                </div>
            </div>
            <div class="totalDetalle">$${element.price * element.cantidad}</div>
        </div>
        
        `

            productosContenedor.innerHTML += detalleOrder
        });
    } catch (error) {
        console.log("error al cargar orden",error)
    }

})

cerrar.addEventListener("click",(e)=>{
     modalsCart.classList.remove("active")
})