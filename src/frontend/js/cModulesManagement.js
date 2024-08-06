let currentModule = {}

export function main() {
  loadModules()

  const newModal = document.querySelector('#new-module')
  newModal.addEventListener('click', prepareModalN)

  const btnNewInput = document.querySelectorAll('.form-button button')
  btnNewInput[0].addEventListener('click', addInputN)
  btnNewInput[1].addEventListener('click', addInputE)

  const btnSaveN = document.querySelector('#createModule .save-module')
  btnSaveN.addEventListener('click', saveModuleN)

  const btnSaveE = document.querySelector('#editModule .save-module')
  btnSaveE.addEventListener('click', saveModuleE)

  const btnDelete = document.querySelector('#delete .delete-module')
  btnDelete.addEventListener('click', deleteModule)
}

// Metodo para añadir un input al modal de crear un modulo
function addInputN() {
  const newInput = createInput()

  const formInputs = document.querySelector(`#createModule .form-inputs`)
  formInputs.appendChild(newInput)
}

// Metodo para añadir un input al modal de editar un modulo
function addInputE() {
  const newInput = createInput()

  const formInputs = document.querySelector(`#editModule .form-inputs .new-inputs`)
  formInputs.appendChild(newInput)
}

// Metodo para preparar el modal para un nuevo modulo
function prepareModalN() {
  const moduleName = document.querySelector('#createModule .module-name')
  moduleName.value = ''

  const moduleIcon = document.querySelector('#createModule input[name="icons"]')
  moduleIcon.checked = true

  const newInput = createInput()
  const formInputs = document.querySelector('#createModule .form-inputs')
  formInputs.innerHTML = ''
  formInputs.appendChild(newInput)
}

// Metodo para guardar un modulo
function saveModuleN() {
  const module = {
    'module_name': document.querySelector('#createModule .module-name').value,
    'icon': document.querySelector('#createModule input[name="icons"]:checked').value,
    'inputs': []
  }

  const formInputs = document.querySelector('#createModule .form-inputs').children

  Array.from(formInputs).forEach((input) => {
    module.inputs.push({
      'name': input.querySelector('input').value,
      'type': input.querySelector('select').value,
      'fiel_db': input.querySelector('input').value.toLowerCase().trim().replace(/\s+/g, '_').replace(/\./g, '')
    })
  })

  window.cModules.post(module)

  location.reload()
}

// Metodo para cargar los modulos
function loadModules() {
  window.cModules.get((info) => {
    const modules = JSON.parse(info)
    const cards = document.querySelector('#cards')

    modules.forEach(module => {
      const card = document.createElement('div')
      card.classList.add('card')
      card.setAttribute('data-bs-toggle', 'modal')
      card.setAttribute('data-bs-target', '#editModule')

      const h4 = document.createElement('h4')
      h4.textContent = module.module_name

      const p = document.createElement('p')
      p.innerHTML = `<i class="bi ${module.icon}"></i>`

      card.appendChild(h4)
      card.appendChild(p)
      card.addEventListener('click', () => prepareModalE(module))
      cards.appendChild(card)
    })
  })
}

// Metodo para preparar el modal para editar un modulo
function prepareModalE(module) {
  currentModule._id = module._id
  currentModule.module_name = module.module_name
  currentModule.icon = module.icon
  currentModule.oldInputs = module.inputs

  document.querySelector('#editModule .module-name').value = module.module_name
  const iconInput = document.querySelector(`#editModule input[name="icons"][value=${module.icon}]`)
  if (iconInput) {
    iconInput.checked = true
  }

  const formInputs = document.querySelector('#editModule .form-inputs .old-inputs')
  formInputs.innerHTML = ''

  module.inputs.forEach((input) => {
    const newInput = createInput()
    newInput.setAttribute('index', module.inputs.indexOf(input))
    newInput.querySelector('input').value = input.name
    newInput.querySelector('select').value = input.type
    newInput.querySelector('button').addEventListener('click', () => {
      currentModule.oldInputs[newInput.getAttribute('index')] = null
    })

    formInputs.appendChild(newInput)
  })
}

// Metodo para guardar un modulo editado
function saveModuleE() {
  currentModule.module_name = document.querySelector('#editModule .module-name').value
  currentModule.icon = document.querySelector('#editModule input[name="icons"]:checked').value
  currentModule.newInputs = []

  const formInputsO = document.querySelector('#editModule .form-inputs .old-inputs').children
  Array.from(formInputsO).forEach((input) => {

    const updateInput = {
      'name': input.querySelector('input').value,
      'type': input.querySelector('select').value,
      'fiel_db': input.querySelector('input').value.toLowerCase().trim().replace(/\s+/g, '_').replace(/\./g, '')
    }

    currentModule.oldInputs[input.getAttribute('index')] = updateInput
  })

  const formInputsN = document.querySelector('#editModule .form-inputs .new-inputs').children
  Array.from(formInputsN).forEach((input) => {
    currentModule.newInputs.push({
      'name': input.querySelector('input').value,
      'type': input.querySelector('select').value,
      'fiel_db': input.querySelector('input').value.toLowerCase().trim().replace(/\s+/g, '_').replace(/\./g, '')
    })
  })

  window.cModules.put(currentModule)

  location.reload()
}

// Metodo para eliminar un modulo
function deleteModule() {
  window.cModules.delete(currentModule._id)

  location.reload()
}

// Metodo para construir un input
function createInput() {
  const inputGroup = document.createElement('div')
  inputGroup.classList.add('input-group')
  inputGroup.innerHTML = `
    <button class="btn btn-outline-danger" type="button"><i class="bi bi-trash-fill"></i></button>
    <input type="text" aria-label="First name" class="form-control" placeholder="Campo">
    <select class="form-select" id="inputGroupSelect01">
      <option disabled selected>Tipo de dato</option>
      <option value="text">Texto</option>
      <option value="password">Contraseña</option>
      <option value="email">Correo Electronico</option>
      <option value="number">Número</option>
      <option value="tel">Telefono</option>
      <option value="date">Fecha</option>
      <option value="time">Hora</option>
      <option value="datetime-local">Fecha y Hora</option>
      <option value="month">Mes</option>
      <option value="week">Semana</option>
      <option value="color">Color</option>
      <option value="url">Url</option>
      </select>`
  const button = inputGroup.querySelector('button')
  button.addEventListener('click', () => {
    inputGroup.remove()
  })
  return inputGroup
}