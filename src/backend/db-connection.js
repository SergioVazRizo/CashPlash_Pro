const { MongoClient, ObjectId } = require('mongodb')
const { ipcMain } = require('electron')

const uri = 'mongodb://127.0.0.1:27017/?directConnection=true'
const databaseName = 'CashPlash_Pro'

let dbConnection;

async function connectToDatabase() {
  if (!dbConnection) {
    const client = await MongoClient.connect(uri)
    dbConnection = client.db(databaseName)
  }
  return dbConnection
}

ipcMain.on('get-modules', async (e) => {
  db = await connectToDatabase()

  const collection = db.collection('modules')
  const modules = await collection.find({}).toArray()

  e.reply('get-modules', JSON.stringify(modules))
})

ipcMain.on('post-module', async (e, module) => {
  db = await connectToDatabase()
  const collection = db.collection('modules')

  await collection.insertOne(module)
})

ipcMain.on('put-module', async (e, module) => {
  db = await connectToDatabase()

  const collection = db.collection('modules')
  const moduleCollection = db.collection(module._id)

  const moduleDb = await collection.findOne({ _id: new ObjectId(module._id) })
  const inputs = moduleDb.inputs

  await collection.updateOne(
    { _id: new ObjectId(module._id) },
    {
      $set: {
        module_name: module.module_name,
        icon: module.icon,
        inputs: []
      }
    }
  )

  // renombrar los inputs antiguos
  for (let i = 0; i < inputs.length; i++) {
    if (module.oldInputs[i]) {
      await collection.updateOne(
        { _id: new ObjectId(module._id) },
        { $push: { inputs: module.oldInputs[i] } }
      )

      if (inputs[i].fiel_db !== module.oldInputs[i].fiel_db) {
        const update = {};
        update[inputs[i].fiel_db] = module.oldInputs[i].fiel_db;

        await moduleCollection.updateMany(
          {},
          { $rename: update }
        )
      }
    } else {
      const update = {};
      update[inputs[i].fiel_db] = '';

      await moduleCollection.updateMany(
        {},
        { $unset: update }
      )
    }
  }

  // agregar los nuevos inputs
  module.newInputs.forEach(async (input) => {
    await collection.updateOne(
      { _id: new ObjectId(module._id) },
      { $push: { inputs: input } }
    )

    const update = {};
    update[input.fiel_db] = '';

    await moduleCollection.updateMany(
      {},
      { $set: update }
    )
  })
})

ipcMain.on('delete-module', async (e, moduleId) => {
  db = await connectToDatabase()

  const objectId = new ObjectId(moduleId)
  const collection = db.collection('modules')

  await db.dropCollection(moduleId)
  await collection.deleteOne({ _id: objectId })
})

ipcMain.on('get-collections', async (e, newCollection) => {
  db = await connectToDatabase()

  const collection = db.collection(newCollection)
  const registrations = await collection.find({}).toArray()

  e.reply('get-collections', JSON.stringify(registrations))
})

ipcMain.on('post-collection', async (e, newCollection, newInsert) => {
  db = await connectToDatabase()

  const collection = db.collection(newCollection)
  await collection.insertOne(newInsert)
})

ipcMain.on('put-collection', async (e, newCollection, id, newInsert) => {
  db = await connectToDatabase()

  const collection = db.collection(newCollection)
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: newInsert }
  )
})

ipcMain.on('delete-collection', async (e, newCollection, id) => {
  db = await connectToDatabase()

  const collection = db.collection(newCollection)
  await collection.deleteOne(
    { _id: new ObjectId(id) }
  )
})

ipcMain.on('login', async (e, user) => {
  db = await connectToDatabase()

  const users = db.collection('users')
  const userFound = await users.findOne(user)

  if (userFound) {
    e.reply('login', true)
  } else {
    e.reply('login', false)
  }
})

ipcMain.on('register', async (e, user) => {
  db = await connectToDatabase()

  const users = db.collection('users')

  const userFound = await users.findOne({ name: user.name })
  if (userFound) {
    e.reply('register', false)
    return
  }
  await users.insertOne(user)
  e.reply('register', true)
})

ipcMain.on('post-sale', async (e, products) => {
  db = await connectToDatabase()

  const collectionProducts = db.collection('products')
  for (let productCode in products) {
    let quantity = products[productCode]
    await collectionProducts.updateOne({ code: productCode }, { $inc: { stock: -quantity } })
  }

})

module.exports = { connectToDatabase }