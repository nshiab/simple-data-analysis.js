import cloneDeep from "lodash.clonedeep"
import renameKey_ from "../methods/cleaning/renameKey.js"
import describe_ from "../methods/analyzing/describe.js"
import formatAllKeys_ from "../methods/cleaning/formatAllKeys.js"
import getArray_ from "../methods/exporting/getArray.js"
import showTable_ from "../methods/showTable.js"
import checkValues_ from "../methods/cleaning/checkValues.js"
import excludeMissingValues_ from "../methods/cleaning/excludeMissingValues.js"
import removeKey_ from "../methods/restructuring/removeKey.js"
import valuesToString_ from "../methods/cleaning/valuesToString.js"
import valuesToInteger_ from "../methods/cleaning/valuesToInteger.js"
import valuesToFloat_ from "../methods/cleaning/valuesToFloat.js"
import valuesToDate_ from "../methods/cleaning/valuesToDate.js"
import datesToString_ from "../methods/cleaning/datesToString.js"
import filterValues_ from "../methods/selecting/filterValues.js"
import filterItems_ from "../methods/selecting/filterItems.js"
import removeDuplicates_ from "../methods/selecting/removeDuplicates.js"
import roundValues_ from "../methods/cleaning/roundValues.js"
import replaceValues_ from "../methods/cleaning/replaceValues.js"
import addKey_ from "../methods/restructuring/addKey.js"
import selectKeys_ from "../methods/selecting/selectKeys.js"
import modifyValues_ from "../methods/cleaning/modifyValues.js"
import modifyItems_ from "../methods/restructuring/modifyItems.js"
import sortValues_ from "../methods/analyzing/sortValues.js"
import addQuantiles_ from "../methods/analyzing/addQuantiles.js"
import addBins_ from "../methods/analyzing/addBins.js"
import addOutliers_ from "../methods/analyzing/addOutliers.js"
import excludeOutliers_ from "../methods/analyzing/excludeOutliers.js"
import correlation_ from "../methods/analyzing/correlation.js"
import addItems_ from "../methods/restructuring/addItems.js"
import getUniqueValues_ from "../methods/exporting/getUniqueValues.js"
import summarize_ from "../methods/analyzing/summarize.js"
import mergeItems_ from "../methods/restructuring/mergeItems.js"
import checkKeys from "../helpers/checkKeys.js"
import { logCall, asyncLogCall } from "../helpers/logCall.js"
import { SimpleDataItem, SimpleDataValue } from "../types/SimpleData.types"
import loadDataFromUrl_ from "../methods/importing/loadDataFromUrl.js"
import getChart_ from "../methods/visualizing/getChart.js"
import getCustomChart_ from "../methods/visualizing/getCustomChart.js"
import log from "../helpers/log.js"

/**
 * SimpleData usage example.
 *
 * ```typescript
 * const data = [{ key: value }, ...]
 * const simpleData = new SimplaData({ data: data })
 * ```
 */
export default class SimpleData {
    _data: SimpleDataItem[]
    _tempData: SimpleDataItem[]
    _keys: string[]
    // Logging
    verbose: boolean
    logParameters: boolean
    nbTableItemsToLog: number

    /**
     * SimpleData constructor
     * @param __namedParameters.data  Data as a list of objects with the same keys.
     * @param __namedParameters.verbose  Log information in the console on `SimpleData` method calls.
     * @param __namedParameters.logParameters  If true, logs methods parameters on every call. Only applies when `verbose` is true.
     * @param __namedParameters.nbTableItemsToLog  Number of items to log in table. Only applies when `verbose` is true.
     * @param __namedParameters.fillMissingKeys  Fill missing keys with `undefined`.
     */
    constructor({
        data = [],
        verbose = false,
        logParameters = false,
        nbTableItemsToLog = 5,
        fillMissingKeys = false,
    }: {
        data?: SimpleDataItem[]
        verbose?: boolean
        logParameters?: boolean
        nbTableItemsToLog?: number
        fillMissingKeys?: boolean
    } = {}) {
        if (data.length > 0) {
            checkKeys(data, fillMissingKeys, verbose)
        } else if (data.length === 0) {
            verbose && log("\nnew SimpleDAta\nStarting an empty SimpleData")
        }

        this._data = data
        this._tempData = []
        this._keys = data[0] ? Object.keys(data[0]) : []

        this.verbose = verbose
        this.logParameters = logParameters
        this.nbTableItemsToLog = nbTableItemsToLog
    }

    #updateSimpleData(data: SimpleDataItem[]) {
        this._data = data
        this._keys = data[0] === undefined ? [] : Object.keys(data[0])
    }

    // *** IMPORTING METHOD *** //

    @asyncLogCall()
    async loadDataFromUrl({
        url,
        missingKeyValues = { null: null, NaN: NaN, undefined: undefined },
        fillMissingKeys = false,
    }: {
        url: string
        missingKeyValues?: SimpleDataItem
        fillMissingKeys?: boolean
    }): Promise<this> {
        const data = await loadDataFromUrl_({
            url: url,
            verbose: this.verbose,
            missingKeyValues: missingKeyValues,
        })

        if (data.length === 0) {
            throw new Error("Incoming data is empty.")
        }

        checkKeys(data, fillMissingKeys, this.verbose)

        this.#updateSimpleData(data)

        return this
    }

    // CLEANING METHODS //

    @logCall()
    describe({ overwrite = true }: { overwrite?: boolean } = {}): this {
        this._tempData = describe_(this._data)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    checkValues({ overwrite = true }: { overwrite?: boolean } = {}): this {
        this._tempData = checkValues_(this._data)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    excludeMissingValues({
        key,
        missingValues,
        overwrite = true,
    }: {
        key?: string
        missingValues?: SimpleDataValue[]
        overwrite?: boolean
    } = {}): this {
        if (missingValues === undefined) {
            missingValues = [null, NaN, undefined, ""]
        }
        this._tempData = excludeMissingValues_(
            this._data,
            key,
            missingValues,
            this.verbose
        )
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    formatAllKeys({ overwrite = true }: { overwrite?: boolean } = {}): this {
        this._tempData = formatAllKeys_(this._data, this.verbose)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    renameKey({
        oldKey,
        newKey,
        overwrite = true,
    }: {
        oldKey: string
        newKey: string
        overwrite?: boolean
    }): this {
        this._tempData = renameKey_(this._data, oldKey, newKey)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    valuesToString({
        key,
        overwrite = true,
    }: {
        key: string
        overwrite?: boolean
    }): this {
        this._tempData = valuesToString_(this._data, key)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    valuesToInteger({
        key,
        overwrite = true,
    }: {
        key: string
        overwrite?: boolean
    }): this {
        this._tempData = valuesToInteger_(this._data, key)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    valuesToFloat({
        key,
        overwrite = true,
    }: {
        key: string
        overwrite?: boolean
    }): this {
        this._tempData = valuesToFloat_(this._data, key)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    valuesToDate({
        key,
        format,
        overwrite = true,
    }: {
        key: string
        format: string
        overwrite?: boolean
    }): this {
        this._tempData = valuesToDate_(this._data, key, format)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    datesToString({
        key,
        format,
        overwrite = true,
    }: {
        key: string
        format: string
        overwrite?: boolean
    }): this {
        this._tempData = datesToString_(this._data, key, format)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    roundValues({
        key,
        nbDigits = 1,
        overwrite = true,
    }: {
        key: string
        nbDigits?: number
        overwrite?: boolean
    }): this {
        this._tempData = roundValues_(this._data, key, nbDigits)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    replaceValues({
        key,
        oldValue,
        newValue,
        method = "entireString",
        overwrite = true,
    }: {
        key: string
        oldValue: string
        newValue: string
        method: "entireString" | "partialString"
        overwrite?: boolean
    }): this {
        this._tempData = replaceValues_(
            this._data,
            key,
            oldValue,
            newValue,
            method
        )
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    modifyValues({
        key,
        valueGenerator,
        overwrite = true,
    }: {
        key: string
        valueGenerator: (val: SimpleDataValue) => SimpleDataValue
        overwrite?: boolean
    }): this {
        this._tempData = modifyValues_(this._data, key, valueGenerator)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    modifyItems({
        key,
        itemGenerator,
        overwrite = true,
    }: {
        key: string
        itemGenerator: (item: SimpleDataItem) => SimpleDataValue
        overwrite?: boolean
    }): this {
        this._tempData = modifyItems_(this._data, key, itemGenerator)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    excludeOutliers({
        key,
        overwrite = true,
    }: {
        key: string
        overwrite?: boolean
    }): this {
        this._tempData = excludeOutliers_(this._data, key, this.verbose)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    // *** RESTRUCTURING METHODS *** //

    @logCall()
    removeKey({
        key,
        overwrite = true,
    }: {
        key: string
        overwrite?: boolean
    }): this {
        this._tempData = removeKey_(this._data, key)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    addKey({
        key,
        itemGenerator,
        overwrite = true,
    }: {
        key: string
        itemGenerator: (item: SimpleDataItem) => SimpleDataValue
        overwrite?: boolean
    }): this {
        this._tempData = addKey_(this._data, key, itemGenerator)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    addItems({
        dataToBeAdded,
        overwrite = true,
    }: {
        dataToBeAdded: SimpleDataItem[] | SimpleData
        nbDigits?: number
        overwrite?: boolean
    }): this {
        this._tempData = addItems_(this._data, dataToBeAdded, this.verbose)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    mergeItems({
        dataToBeMerged,
        commonKey,
        nbValuesTestedForTypeOf = 10000,
        overwrite = true,
    }: {
        dataToBeMerged: SimpleDataItem[] | SimpleData
        commonKey: string
        nbValuesTestedForTypeOf?: number
        overwrite?: boolean
    }): this {
        this._tempData = mergeItems_(
            this._data,
            dataToBeMerged,
            commonKey,
            this.verbose,
            nbValuesTestedForTypeOf
        )
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    //*** SELECTION METHODS ***/

    @logCall()
    selectKeys({
        keys,
        overwrite = true,
    }: {
        keys: string[]
        overwrite?: boolean
    }): this {
        this._tempData = selectKeys_(this._data, keys)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    filterValues({
        key,
        valueComparator,
        overwrite = true,
    }: {
        key: string
        valueComparator: (val: SimpleDataValue) => SimpleDataValue
        overwrite?: boolean
    }): this {
        this._tempData = filterValues_(
            this._data,
            key,
            valueComparator,
            this.verbose
        )
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    filterItems({
        itemComparator,
        overwrite = true,
    }: {
        itemComparator: (val: SimpleDataItem) => boolean
        overwrite?: boolean
    }): this {
        this._tempData = filterItems_(this._data, itemComparator, this.verbose)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    /**
     * Remove duplicate items.
     * @param __namedParameters.key  Data as a list of objects with the same keys.
     * @param __namedParameters.overwrite  Should overwrite data with the result.
     */
    removeDuplicates({
        key,
        overwrite = true,
    }: { key?: string; overwrite?: boolean } = {}): this {
        this._tempData = removeDuplicates_(this._data, key, this.verbose)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    // *** ANALYSIS METHODS *** //

    @logCall()
    sortValues({
        key,
        order = "ascending",
        overwrite = true,
    }: {
        key: string
        order: "ascending" | "descending"
        overwrite?: boolean
    }): this {
        this._tempData = sortValues_(this._data, key, order)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    summarize({
        keyValue,
        keyCategory,
        summary,
        weight,
        overwrite = true,
        nbDigits = 1,
        nbValuesTestedForTypeOf = 1000,
    }: {
        keyValue?: string | string[]
        keyCategory?: string | string[]
        summary?: string | string[]
        weight?: string
        overwrite?: boolean
        nbDigits?: number
        nbValuesTestedForTypeOf?: number
    } = {}): this {
        this._tempData = summarize_(
            this._data,
            keyValue === undefined ? this._keys : keyValue,
            this.verbose,
            nbValuesTestedForTypeOf,
            nbDigits,
            keyCategory,
            summary,
            weight
        )
        overwrite && this.#updateSimpleData(this._tempData)
        return this
    }

    @logCall()
    correlation({
        key1,
        key2,
        overwrite = true,
        nbValuesTestedForTypeOf = 10000,
    }: {
        key1?: string
        key2?: string
        overwrite?: boolean
        nbDigits?: number
        nbValuesTestedForTypeOf?: number
    } = {}): this {
        this._tempData = correlation_(
            this._data,
            this.verbose,
            nbValuesTestedForTypeOf,
            key1,
            key2
        )
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    addQuantiles({
        key,
        newKey,
        nbQuantiles,
        overwrite = true,
    }: {
        key: string
        newKey: string
        nbQuantiles: number
        overwrite?: boolean
    }): this {
        this._tempData = addQuantiles_(this._data, key, newKey, nbQuantiles)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    addBins({
        key,
        newKey,
        nbBins,
        overwrite = true,
    }: {
        key: string
        newKey: string
        nbBins: number
        overwrite?: boolean
    }): this {
        this._tempData = addBins_(this._data, key, newKey, nbBins)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    @logCall()
    addOutliers({
        key,
        newKey,
        overwrite = true,
    }: {
        key: string
        newKey: string
        overwrite?: boolean
    }): this {
        this._tempData = addOutliers_(this._data, key, newKey, this.verbose)
        overwrite && this.#updateSimpleData(this._tempData)

        return this
    }

    // *** VISUALIZATION METHODS *** //

    @logCall()
    getChart({
        type,
        x,
        y,
        color,
        marginLeft,
        marginBottom,
    }: {
        type:
            | "dot"
            | "line"
            | "bar"
            | "barVertical"
            | "barHorizontal"
            | "box"
            | "boxVertical"
            | "boxHorizontal"
        x: string
        y: string
        color?: string
        marginLeft?: number
        marginBottom?: number
    }): string {
        const chart = getChart_(
            this._data,
            type,
            x,
            y,
            color,
            this.verbose,
            marginLeft,
            marginBottom
        )
        return chart
    }

    @logCall()
    getCustomChart({ plotOptions }: { plotOptions: object }): string {
        const chart = getCustomChart_(plotOptions)
        return chart
    }

    // ** EXPORTING METHODS *** //

    @logCall()
    clone(): SimpleData {
        const dataCloned = cloneDeep(this._data)

        return new SimpleData({ data: dataCloned })
    }

    // No @logCall otherwise it's triggered everywhere, including in methods
    getData(): SimpleDataItem[] {
        return this._data
    }

    //No @logCall otherwise it's triggered everywhere, including in methods
    getKeys(): string[] {
        return this._keys
    }

    @logCall()
    getArray({ key }: { key: string }): SimpleDataValue[] {
        const array = getArray_(this._data, key)

        return array
    }

    @logCall()
    getUniqueValues({ key }: { key: string }): SimpleDataValue[] {
        const uniqueValues = getUniqueValues_(this._data, key)

        return uniqueValues
    }

    // *** LOGGING METHODS AND OTHERS *** //

    @logCall()
    showTable({
        nbItemInTable = 5,
    }: { nbItemInTable?: "all" | number } = {}): this {
        // TODO: test this!
        showTable_(this._data, nbItemInTable)

        return this
    }
}
