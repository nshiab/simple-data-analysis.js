import { SimpleDataItem, Options } from "../types.js"
//@ts-ignore
import cloneDeep from "lodash.clonedeep"
import SimpleData from "../class/SimpleData.js"

export default function clone(data: SimpleDataItem[], defaultOptions: Options, options: Options): object {

    const clonedData = cloneDeep(data)
    const newSimpleData = new SimpleData(clonedData, defaultOptions)

    return newSimpleData
}