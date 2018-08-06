'use strict'

let Connection = require('./src/DBCConector')
const tranformer = require('./src/createStructure')
const fileWriter = require('./src/fileWriter')
const { outputPath, dbConfig, dbTables } = require(process.argv[2])

async function main () {
  let connection = new Connection(dbConfig.host, dbConfig.username, dbConfig.password, dbConfig.schema)
  await connection.dbConnect()

  // let dbTables = await connection.getTableName()
  // dbTables = dbTables.map(row => row.Tables_in_movieclub_db)
  console.log('Start converting database schema to model...')
  console.log(`--- Schema: ${dbConfig.schema} ---`)
  console.log(`--- Target: ${dbTables.length} tables ---`)
  console.log(`--- Output Path: "${outputPath}" ---`)

  dbTables.forEach(async element => {
    try {
      let elem = element.toLowerCase()
      let result = await connection.getSchema(elem)
      let model = tranformer(result, elem, dbConfig[3])
      fileWriter.writeFile(outputPath, model, elem)
    } catch (e) {
      console.log(e)
    }
  })
  await connection.dbDisConnect()
}

main()
