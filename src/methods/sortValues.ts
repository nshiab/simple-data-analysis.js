import { SimpleDataItem, Options } from "../types.js"
import hasKey from "../helpers/hasKey.js"

export default function sortValues(data: SimpleDataItem[], key: string, order: "ascending" | "descending", options: Options): SimpleDataItem[] {

    if (!hasKey(data[0], key)) {
        throw new Error("No key " + key)
    }

    if (order === "ascending") {
        data.sort((a, b) => a[key] < b[key] ? -1 : 1)
    } else {
        data.sort((a, b) => a[key] < b[key] ? 1 : -1)
    }

    return data
}