import mergeOptions from "../helpers/mergeOptions.js"
import queryDB from "../helpers/queryDB.js"
import SimpleDB from "../class/SimpleDB.js"

export default async function getColumns(simpleDB: SimpleDB, table: string) {
    simpleDB.debug && console.log("\ngetColumns()")
    simpleDB.debug && console.log("parameters:", { table })

    const queryResult = await queryDB(
        simpleDB,
        `DESCRIBE ${table}`,
        mergeOptions(simpleDB, {
            table,
            returnDataFrom: "query",
        })
    )

    if (!queryResult) {
        throw new Error("No result")
    }

    const columns = queryResult.map((d) => d.column_name) as string[]

    simpleDB.debug && console.log("\ncolumns:", columns)

    return columns
}
