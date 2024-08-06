const products = [];
let productsForSale = {}
let total = new BigDecimal('0');

export function prepareSales() {
    resetVariables()

    const txtCode = document.querySelector('#txt-code')
    txtCode.focus()
    txtCode.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            const product = products.find((element) => { return element.code == txtCode.value })
            if (product) {
                fillTable(product)
            }
            txtCode.value = null;
        }
    })
    window.cCollections.get('products', (productosArray) => {
        productosArray = JSON.parse(productosArray)
        productosArray.forEach((product) => {
            products.push(product)
        });
    })

    calcExchange()
    confirmSale()

    const makeSale = document.querySelector('#make-sale')
    makeSale.addEventListener('click', () => {
        const finalPrice = document.querySelector('#final-price span')
        finalPrice.textContent = total
        const txtCash = document.querySelector('#txt-cash')
        const txtExchange = document.querySelector('#txt-exchange')
        const cash = new BigDecimal(txtCash.value)
        txtExchange.value = cash.subtract(total)
    })
}

function fillTable(newProduct) {
    const table = document.querySelector('tbody')
    const price = new BigDecimal('' + newProduct.price);

    if (productsForSale[newProduct.code]) {
        productsForSale[newProduct.code] += 1
        const row = document.querySelector(`#p-${newProduct.code}`)
        const td = row.querySelectorAll('td')
        td[1].textContent = productsForSale[newProduct.code]
        td[3].textContent = price.multiply(new BigDecimal('' + productsForSale[newProduct.code]))
    } else {
        productsForSale[newProduct.code] = 1
        table.innerHTML += `<tr id="p-${newProduct.code}"><td>${newProduct.name}</td><td>1</td><td>${newProduct.price}</td><td>${newProduct.price}</td></tr>`
    }

    total = total.add(price)
    document.querySelector('#make-sale label').textContent = total
}

function calcExchange() {
    const txtCash = document.querySelector('#txt-cash')
    const txtExchange = document.querySelector('#txt-exchange')
    txtCash.addEventListener('keyup', () => {
        const cash = new BigDecimal(txtCash.value)
        txtExchange.value = cash.subtract(total)
    })
}

function confirmSale() {
    const btnConfirm = document.querySelector('#btn-confirm')
    btnConfirm.addEventListener('click', () => {
        const txtExchange = document.querySelector('#txt-exchange')
        if (txtExchange.value < 0) {
            iziToast.error({
                title: 'Error',
                color: '#EEAAAA',
                message: 'El efectivo es insuficiente para realizar la venta',
                position: 'topRight',
                timeout: 5000, // Duración en milisegundos (opcional)
                progressBarColor: '#EF0F0F', // Color de la barra de progreso (opcional)
            });
            return
        }
        window.sales.post(productsForSale)
        iziToast.success({
            title: 'Éxito',
            color: '#A3E4D7',
            message: 'Venta realizada con éxito',
            position: 'topRight',
            timeout: 5000, // Duración en milisegundos (opcional)
            progressBarColor: '#0F9D58', // Color de la barra de progreso (opcional)
        });
        resetVariables()
    })
}

function resetVariables() {
    const table = document.querySelector('tbody')
    table.innerHTML = ''
    productsForSale = {}
    total = new BigDecimal('0')
    document.querySelector('#make-sale label').textContent = total
}