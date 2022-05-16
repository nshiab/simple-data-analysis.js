import { SimpleDataItem, Options } from "../types.js"
import hasKey from "../helpers/hasKey.js"

export default function valuesToFloat(data: SimpleDataItem[], key: string, options: Options): SimpleDataItem[] {

    if (!hasKey(data[0], key)) {
        throw new Error("No key " + key)
    }

    for (let i = 0; i < data.length; i++) {
        data[i][key] = parseFloat(data[i][key] as any)
    }

    return data
}