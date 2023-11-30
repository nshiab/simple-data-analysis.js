import mergeOptions from "../helpers/mergeOptions.js"
import queryDB from "../helpers/queryDB.js"
import SimpleDB from "../indexWeb.js"

export default async function getMin(
    simpleDB: SimpleDB,
    table: string,
    column: string
) {
    simpleDB.debug && console.log("\ngetMin()")

    const queryResult = await queryDB(
        simpleDB,
        `SELECT MIN("${column}") AS valueForGetMin FROM ${table}`,
        mergeOptions(simpleDB, { table, returnDataFrom: "query" })
    )

    if (!queryResult) {
        throw new Error("No queryResults")
    }

    return queryResult[0].valueForGetMin
}
