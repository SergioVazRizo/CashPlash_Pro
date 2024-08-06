import { loadTemplate } from './cTemplates.js'
import { main as modulesManagement} from './cModulesManagement.js'
import { createSideBar } from './cGenericModules.js'
import { prepareSales } from './cSales.js'

window.addEventListener('load', () => {
  setTimeout(() => {
    loadTemplate('./templates/homeModule.html')
    document.querySelector('#load').style.display = "none"
  }, 500)
})

const btnHome = document.querySelector('#btnHome')
btnHome.addEventListener('click', async (e) => {
  e.preventDefault()
  await loadTemplate('./templates/homeModule.html')
})

const btnManagement = document.querySelector('#btnManagement')
btnManagement.addEventListener('click', async (e) => {
  e.preventDefault()
  await loadTemplate('./templates/modulesManagement.html')

  modulesManagement()
})

const btnSales = document.querySelector('#btnSales')
btnSales.addEventListener('click', async () => {
  await loadTemplate('./templates/sales.html')

  prepareSales();
})

const btnExit = document.querySelector('#btnExit')
btnExit.addEventListener('click', () => {
  window.location.href = './index.html'
})

window.cModules.get((modules) => {
  createSideBar(JSON.parse(modules))
})