const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('cModules', {
  get: (method) => {
    ipcRenderer.send('get-modules')
    ipcRenderer.once('get-modules', (e, modules) => {
      method(modules)
    })
  },
  post: (module) => {
    ipcRenderer.send('post-module', module)
  },
  put: (module) => {
    ipcRenderer.send('put-module', module)
  },
  delete: (id) => {
    ipcRenderer.send('delete-module', id)
  }
})

contextBridge.exposeInMainWorld('cCollections', {
  get: (collection, method) => {
    ipcRenderer.send('get-collections', collection)
    ipcRenderer.once('get-collections', (e, registrations) => {
      method(registrations)
    })
  },
  post: (collection, newInsert) => {
    ipcRenderer.send('post-collection', collection, newInsert)
  },
  put: (collection, id, newInsert) => {
    ipcRenderer.send('put-collection', collection, id, newInsert)
  },
  delete: (collection, id) => {
    ipcRenderer.send('delete-collection', collection, id)
  }
})

contextBridge.exposeInMainWorld('log', {
  check: (user, method) => {
    ipcRenderer.send('login', user)
    ipcRenderer.once('login', (e, isFound) => {
      method(isFound)
    })
  },
  register: (user, method) => {
    ipcRenderer.send('register', user)
    ipcRenderer.once('register', (e, isRegistered) => {
      method(isRegistered)
    })
  } 
})

contextBridge.exposeInMainWorld('sales', {
  post: (products) => {
    ipcRenderer.send('post-sale', products)
  }
})
