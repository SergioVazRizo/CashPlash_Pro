import { loadTemplate } from './cTemplates.js'

let id = null;
let collection_name;
let inputs = []

async function createForm(module) {

  await loadTemplate('./templates/genericModule.html')

  const titles = document.querySelectorAll('.module-name')

  titles.forEach((title) => {
    title.textContent = module.module_name
  })

  const modalBody = document.querySelector('.modal-body')

  const tHead = document.querySelector('#module-table thead tr')

  module.inputs.forEach((input) => {

    const th = document.createElement('th')
    th.textContent = input.name

    tHead.appendChild(th)

    modalBody.appendChild(createInput(input.name, input.type, input.fiel_db))

  })

  const colEdit = document.createElement('th')
  colEdit.textContent = 'Opciones'
  tHead.appendChild(colEdit)

  const moduleForm = document.querySelector('#module-form')
  moduleForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const collection = collection_name
    const formInputs = modalBody.children

    const newInsert = {}
    Array.from(formInputs).forEach((inputGroup) => {
      const input = inputGroup.querySelector('input')
      const key = input.name
      newInsert[key] = input.value

      if (input.getAttribute('type') === 'number' ){
        newInsert[key] = parseFloat(input.value)
      }
    })

    if (id) {
      window.cCollections.put(collection, id, newInsert)
      iziToast.success({
        title: 'Éxitoso',
        message: 'Editado correctamente.',
        color: '#EEF290',
        position: 'topRight',
        timeout: 5000, // Duración en milisegundos (opcional)
        progressBarColor: '#E5EF0F', // Color de la barra de progreso (opcional)
      });
    } else {
      window.cCollections.post(collection, newInsert)
      iziToast.success({
        title: 'Éxitoso',
        color: '#4CAF50',
        message: 'Agregado correctamente.',
        position: 'topRight',
        timeout: 2000,
        progressBarColor: '#0AFB02',
      });
    }
    id = null

    moduleForm.reset()

    setTimeout(() => {
      fillTable()
    }, 200)
  })

  const newRegister = document.querySelector('#new-register')
  newRegister.addEventListener('click', (e) => {
    moduleForm.reset()
    id = null
  })

  fillTable()

  document.querySelector("input[type='search']").addEventListener("keyup", search);
}

function createInput(name, type, fiel_db) {
  const div = document.createElement('div')
  div.classList = 'input-group mb-2'
  const span = document.createElement('span')
  span.classList = 'input-group-text'
  span.textContent = name
  const input = document.createElement('input')
  input.classList = 'form-control'
  input.setAttribute('type', type)
  input.setAttribute('name', fiel_db)

  if (type === 'number') {
    input.setAttribute('step', '0.01')
  }

  div.appendChild(span)
  div.appendChild(input)

  return div
}

export function createSideBar(modules) {
  const sideBar = document.querySelector('header div')

  modules.forEach((module) => {
    const button = document.createElement('button')

    button.addEventListener('click', () => {
      if (module.collection_name) {
        collection_name = module.collection_name
      } else {
        collection_name = module._id
      }
      inputs = module.inputs
      createForm(module)
    })

    const i = document.createElement('i')
    i.classList.add(module.icon)
    i.style.fontSize = '2rem'

    button.appendChild(i)
    sideBar.appendChild(button)
  })
}

function fillTable() {
  const createRow = (register) => {
    const tr = document.createElement('tr')

    inputs.forEach((input) => {
      const td = document.createElement('td')
      td.textContent = register[input.fiel_db]
      tr.appendChild(td)
    })

    const rowEdit = document.createElement('td')
    const btnEdit = document.createElement('button')
    const btnDelete = document.createElement('button')

    btnEdit.classList.add("btnEdit")
    btnDelete.classList.add("btnDelete")
    rowEdit.classList.add("opciones")

    btnEdit.innerHTML = '<i class=" bi bi-pencil-fill" style="color: #ffffff;""></i> '
    btnDelete.innerHTML = '<i class=" bi bi-trash-fill" style="color: #ffffff;"></i>'

    btnEdit.setAttribute('data-bs-toggle', 'modal')
    btnEdit.setAttribute('data-bs-target', '#controlModule')

    btnEdit.addEventListener('click', () => {
      id = register._id
      Object.keys(register).forEach((key) => {
        if (key !== '_id') {
          const input = document.querySelector(`input[name="${key}"]`)
          input.value = register[key]
        }
      })
    })
    btnDelete.addEventListener('click', () => {
      const collection = collection_name
      window.cCollections.delete(collection, register._id)
      fillTable()
      iziToast.success({
        title: 'Éxitoso',
        color: '#EEAAAA',
        message: 'Eliminado correctamente.',
        position: 'topRight',
        timeout: 5000, // Duración en milisegundos (opcional)
        progressBarColor: '#EF0F0F', // Color de la barra de progreso (opcional)
      });
    })

    rowEdit.appendChild(btnEdit)
    rowEdit.appendChild(btnDelete)
    tr.appendChild(rowEdit)
    return tr
  }

  const addRows = (registers) => {
    const tBody = document.querySelector('#registers')
    tBody.innerHTML = ''
    registers.forEach((register) => {
      tBody.appendChild(createRow(register))
    })
  }

  const collection = collection_name
  window.cCollections.get(collection, (registers) => {
    addRows(JSON.parse(registers))
  })

  document.querySelector("input[type='search']").value = ''

}

function search(){
  let textToSeach = document.querySelector("input[type='search']").value.toLowerCase();
  let tbody = document.querySelector("#registers");
  let rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = "none"
      let celdas = rows[i].getElementsByTagName("td");

      for (let j = 0; j < celdas.length; j++){
          let text = celdas[j].textContent.toLowerCase();

          if (text.indexOf(textToSeach) > -1){
              rows[i].style.display = "table-row"
              break;
          }
      }   
  }
}