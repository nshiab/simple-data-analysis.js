import mergeOptions from "../helpers/mergeOptions.js"
import queryDB from "../helpers/queryDB.js"
import SimpleWebTable from "../class/SimpleWebTable.js"

export default async function getSkew(
    simpleWebTable: SimpleWebTable,
    column: string,
    options: {
        decimals?: number
    } = {}
) {
    const queryResult = await queryDB(
        simpleWebTable,
        typeof options.decimals === "number"
            ? `SELECT ROUND(SKEWNESS(${column}), ${options.decimals}) AS valueForGetSkew FROM ${simpleWebTable.name}`
            : `SELECT SKEWNESS(${column}) AS valueForGetSkew FROM ${simpleWebTable.name}`,
        mergeOptions(simpleWebTable, {
            table: simpleWebTable.name,
            returnDataFrom: "query",
            method: "getSkew()",
            parameters: { column, options },
        })
    )

    if (!queryResult) {
        throw new Error("No queryResults")
    }

    const result = queryResult[0].valueForGetSkew
    simpleWebTable.debug && console.log("skew:", result)
    return result as number
}
