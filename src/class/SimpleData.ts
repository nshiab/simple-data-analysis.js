import cloneData from "../helpers/cloneData.js"
import renameKey_ from "../methods/cleaning/renameKey.js"
import describe_ from "../methods/analyzing/describe.js"
import formatAllKeys_ from "../methods/cleaning/formatAllKeys.js"
import getItem_ from "../methods/exporting/getItem.js"
import getArray_ from "../methods/exporting/getArray.js"
import getMin_ from "../methods/exporting/getMin.js"
import getMax_ from "../methods/exporting/getMax.js"
import getMean_ from "../methods/exporting/getMean.js"
import getMedian_ from "../methods/exporting/getMedian.js"
import getSum_ from "../methods/exporting/getSum.js"
import getQuantile_ from "../methods/exporting/getQuantile.js"
import getDataAsArrays_ from "../methods/exporting/getDataAsArrays.js"
import showTable_ from "../methods/showTable.js"
import checkValues_ from "../methods/cleaning/checkValues.js"
import excludeMissingValues_ from "../methods/cleaning/excludeMissingValues.js"
import keepNumbers_ from "../methods/cleaning/keepNumbers.js"
import keepDates_ from "../methods/cleaning/keepDates.js"
import keepStrings_ from "../methods/cleaning/keepStrings.js"
import removeKey_ from "../methods/restructuring/removeKey.js"
import valuesToString_ from "../methods/cleaning/valuesToString.js"
import valuesToInteger_ from "../methods/cleaning/valuesToInteger.js"
import valuesToFloat_ from "../methods/cleaning/valuesToFloat.js"
import valuesToDate_ from "../methods/cleaning/valuesToDate.js"
import datesToString_ from "../methods/cleaning/datesToString.js"
import filterValues_ from "../methods/selecting/filterValues.js"
import filterItems_ from "../methods/selecting/filterItems.js"
import removeDuplicates_ from "../methods/cleaning/removeDuplicates.js"
import roundValues_ from "../methods/cleaning/roundValues.js"
import replaceValues_ from "../methods/cleaning/replaceValues.js"
import addKey_ from "../methods/restructuring/addKey.js"
import selectKeys_ from "../methods/selecting/selectKeys.js"
import pickRandomItems_ from "../methods/selecting/pickRandomItems.js"
import modifyValues_ from "../methods/cleaning/modifyValues.js"
import modifyItems_ from "../methods/cleaning/modifyItems.js"
import sortValues_ from "../methods/analyzing/sortValues.js"
import addQuantiles_ from "../methods/analyzing/addQuantiles.js"
import addBins_ from "../methods/analyzing/addBins.js"
import addOutliers_ from "../methods/analyzing/addOutliers.js"
import excludeOutliers_ from "../methods/analyzing/excludeOutliers.js"
import correlation_ from "../methods/analyzing/correlation.js"
import regression_ from "../methods/analyzing/regression.js"
import addItems_ from "../methods/restructuring/addItems.js"
import getUniqueValues_ from "../methods/exporting/getUniqueValues.js"
import summarize_ from "../methods/analyzing/summarize.js"
import addProportions_ from "../methods/analyzing/addProportions.js"
import addVariation_ from "../methods/analyzing/addVariation.js"
import mergeItems_ from "../methods/restructuring/mergeItems.js"
import keysToValues_ from "../methods/restructuring/keysToValues.js"
import valuesToKeys_ from "../methods/restructuring/valuesToKeys.js"
import addRank_ from "../methods/analyzing/addRank.js"
import handleMissingKeys from "../helpers/handleMissingKeys.js"
import { logCall, asyncLogCall } from "../helpers/logCall.js"
import { SimpleDataItem, SimpleDataValue } from "../types/SimpleData.types"
import loadDataFromUrlWeb_ from "../methods/importing/loadDataFromUrlWeb.js"
import getChart_ from "../methods/visualizing/getChart.js"
import getCustomChart_ from "../methods/visualizing/getCustomChart.js"
import log from "../helpers/log.js"
import arraysToData from "../helpers/arraysToData.js"
import round from "../helpers/round.js"

/**
 * SimpleData usage example.
 *
 * ```typescript
 * const data = [{ key: value }, ...]
 * const simpleData = new SimpleData({ data: data })
 * ```
 */
export default class SimpleData {
    protected _data: SimpleDataItem[]
    duration: number
    noLogs: boolean
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
        dataAsArrays = false,
        verbose = false,
        logParameters = false,
        nbTableItemsToLog = 5,
        fillMissingKeys = false,
        noLogs = false,
        firstItem = 0,
        lastItem = Infinity,
        duration = 0,
    }: {
        data?: SimpleDataItem[] | { [key: string]: SimpleDataValue[] }
        dataAsArrays?: boolean
        verbose?: boolean
        logParameters?: boolean
        nbTableItemsToLog?: number
        fillMissingKeys?: boolean
        noLogs?: boolean
        firstItem?: number
        lastItem?: number
        duration?: 0
    } = {}) {
        if (data.length > 0 || Object.keys(data).length > 0) {
            const incomingData = dataAsArrays
                ? cloneData(
                      arraysToData(
                          data as unknown as {
                              [key: string]: SimpleDataValue[]
                          },
                          verbose
                      ).slice(firstItem, lastItem + 1)
                  )
                : cloneData(
                      (data as SimpleDataItem[]).slice(firstItem, lastItem + 1)
                  )

            handleMissingKeys(
                incomingData,
                fillMissingKeys,
                undefined,
                undefined,
                !noLogs && verbose
            )

            this._data = incomingData
        } else {
            !noLogs &&
                verbose &&
                log("\nnew SimpleData()\nStarting an empty SimpleData")

            this._data = []
        }

        this.duration = duration
        this.verbose = !noLogs && verbose
        this.logParameters = logParameters
        this.nbTableItemsToLog = nbTableItemsToLog
        this.noLogs = noLogs
    }

    // If modified, needs to be modified in SimpleDataNode
    #updateSimpleData(data: SimpleDataItem[]) {
        this._data = data
    }

    // *** IMPORTING METHOD *** //

    @asyncLogCall()
    async loadDataFromUrl({
        url,
        autoType = false,
        missingKeyValues = { null: null, NaN: NaN, undefined: undefined },
        fillMissingKeys = false,
        dataAsArrays = false,
        firstItem = 0,
        lastItem = Infinity,
        nbFirstRowsToExclude = 0,
        nbLastRowsToExclude = Infinity,
    }: {
        url: string | string[]
        autoType?: boolean
        missingKeyValues?: SimpleDataItem
        fillMissingKeys?: boolean
        dataAsArrays?: boolean
        firstItem?: number
        lastItem?: number
        nbFirstRowsToExclude?: number
        nbLastRowsToExclude?: number
    }): Promise<this> {
        if (this._data.length > 0) {
            throw new Error(
                "This SimpleData already has data. Create another one."
            )
        }
        const data = await loadDataFromUrlWeb_(
            url,
            autoType,
            dataAsArrays,
            firstItem,
            lastItem,
            nbFirstRowsToExclude,
            nbLastRowsToExclude,
            fillMissingKeys,
            missingKeyValues,
            this.verbose
        )

        this.#updateSimpleData(data)

        return this
    }

    // CLEANING METHODS //

    @logCall()
    describe(): this {
        this.#updateSimpleData(describe_(cloneData(this._data)))

        return this
    }

    @logCall()
    checkValues({
        nbItemsToCheck = "all",
        randomize = false,
    }: {
        nbItemsToCheck?: "all" | number
        randomize?: boolean
    } = {}): this {
        this.#updateSimpleData(
            checkValues_(cloneData(this._data), nbItemsToCheck, randomize)
        )

        return this
    }

    @logCall()
    excludeMissingValues({
        key,
        missingValues,
        keepExcludedOnly = false,
    }: {
        key?: string
        missingValues?: SimpleDataValue[]
        keepExcludedOnly?: boolean
    } = {}): this {
        if (missingValues === undefined) {
            missingValues = [null, NaN, undefined, ""]
        }
        this.#updateSimpleData(
            excludeMissingValues_(
                cloneData(this._data),
                key,
                missingValues,
                this.verbose,
                keepExcludedOnly
            )
        )

        return this
    }

    @logCall()
    keepNumbers({
        key,
        keepNonNumbersOnly = false,
    }: {
        key: string
        keepNonNumbersOnly?: boolean
    }): this {
        this.#updateSimpleData(
            keepNumbers_(
                cloneData(this._data),
                key,
                keepNonNumbersOnly,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    keepDates({
        key,
        keepNonDatesOnly = false,
    }: {
        key: string
        keepNonDatesOnly?: boolean
    }): this {
        this.#updateSimpleData(
            keepDates_(
                cloneData(this._data),
                key,
                keepNonDatesOnly,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    keepStrings({
        key,
        keepNonStringOnly = false,
    }: {
        key: string
        keepNonStringOnly?: boolean
    }): this {
        this.#updateSimpleData(
            keepStrings_(
                cloneData(this._data),
                key,
                keepNonStringOnly,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    formatAllKeys(): this {
        this.#updateSimpleData(
            formatAllKeys_(cloneData(this._data), this.verbose)
        )

        return this
    }

    @logCall()
    renameKey({ oldKey, newKey }: { oldKey: string; newKey: string }): this {
        this.#updateSimpleData(
            renameKey_(cloneData(this._data), oldKey, newKey)
        )

        return this
    }

    @logCall()
    valuesToString({ key, newKey }: { key: string; newKey?: string }): this {
        this.#updateSimpleData(
            valuesToString_(cloneData(this._data), key, newKey)
        )

        return this
    }

    @logCall()
    valuesToInteger({
        key,
        thousandSeparator = ",",
        decimalSeparator = ".",
        skipErrors = false,
        newKey,
    }: {
        key: string
        thousandSeparator?: string
        decimalSeparator?: string
        skipErrors?: boolean
        newKey?: string
    }): this {
        this.#updateSimpleData(
            valuesToInteger_(
                cloneData(this._data),
                key,
                thousandSeparator,
                decimalSeparator,
                skipErrors,
                newKey
            )
        )

        return this
    }

    @logCall()
    valuesToFloat({
        key,
        thousandSeparator = ",",
        decimalSeparator = ".",
        skipErrors = false,
        newKey,
    }: {
        key: string
        thousandSeparator?: string
        decimalSeparator?: string
        skipErrors?: boolean
        newKey?: string
    }): this {
        this.#updateSimpleData(
            valuesToFloat_(
                cloneData(this._data),
                key,
                thousandSeparator,
                decimalSeparator,
                skipErrors,
                newKey
            )
        )

        return this
    }

    @logCall()
    valuesToDate({
        key,
        format,
        skipErrors = false,
        newKey,
    }: {
        key: string
        format: string
        skipErrors?: boolean
        newKey?: string
    }): this {
        this.#updateSimpleData(
            valuesToDate_(
                cloneData(this._data),
                key,
                format,
                skipErrors,
                newKey
            )
        )

        return this
    }

    @logCall()
    datesToString({
        key,
        format,
        skipErrors = false,
        newKey,
    }: {
        key: string
        format: string
        skipErrors?: boolean
        newKey?: string
    }): this {
        this.#updateSimpleData(
            datesToString_(
                cloneData(this._data),
                key,
                format,
                skipErrors,
                newKey
            )
        )

        return this
    }

    @logCall()
    roundValues({
        key,
        nbDigits = 1,

        skipErrors = false,
        newKey,
    }: {
        key: string
        nbDigits?: number
        skipErrors?: boolean

        newKey?: string
    }): this {
        this.#updateSimpleData(
            roundValues_(
                cloneData(this._data),
                key,
                nbDigits,
                skipErrors,
                newKey
            )
        )

        return this
    }

    @logCall()
    replaceValues({
        key,
        oldValue,
        newValue,
        method = undefined,
        skipErrors = false,
        newKey,
    }: {
        key: string
        oldValue: string
        newValue: string
        method?: undefined | "entireString" | "partialString"
        skipErrors?: boolean
        newKey?: string
    }): this {
        this.#updateSimpleData(
            replaceValues_(
                cloneData(this._data),
                key,
                oldValue,
                newValue,
                method,
                skipErrors,
                newKey
            )
        )

        return this
    }

    @logCall()
    modifyValues({
        key,
        valueGenerator,
        newKey,
    }: {
        key: string
        valueGenerator: (val: SimpleDataValue) => SimpleDataValue
        newKey?: string
    }): this {
        this.#updateSimpleData(
            modifyValues_(cloneData(this._data), key, valueGenerator, newKey)
        )

        return this
    }

    @logCall()
    modifyItems({
        key,
        itemGenerator,
        newKey,
    }: {
        key: string
        itemGenerator: (item: SimpleDataItem) => SimpleDataValue
        newKey?: string
    }): this {
        this.#updateSimpleData(
            modifyItems_(cloneData(this._data), key, itemGenerator, newKey)
        )

        return this
    }

    @logCall()
    excludeOutliers({
        key,
        nbTestedValues = 10000,
    }: {
        key: string
        nbTestedValues?: number
    }): this {
        this.#updateSimpleData(
            excludeOutliers_(
                cloneData(this._data),
                key,
                nbTestedValues,
                this.verbose
            )
        )

        return this
    }

    // *** RESTRUCTURING METHODS *** //

    @logCall()
    removeKey({ key }: { key: string }): this {
        this.#updateSimpleData(removeKey_(cloneData(this._data), key))

        return this
    }

    @logCall()
    addKey({
        key,
        itemGenerator,
    }: {
        key: string
        itemGenerator: (item: SimpleDataItem) => SimpleDataValue
    }): this {
        this.#updateSimpleData(
            addKey_(cloneData(this._data), key, itemGenerator)
        )

        return this
    }

    @logCall()
    addRank({
        newKey,
        key,
        sortInPlace,
        order,
        locale,
        handleTies,
    }: {
        newKey: string
        key?: string | string[]
        sortInPlace?: true | false
        order?: "ascending" | "descending"
        locale?: string | (string | undefined | null | boolean)[]
        handleTies?: "tieNoGaps" | "tie" | "noTie"
    }): this {
        this.#updateSimpleData(
            addRank_(
                cloneData(this._data),
                newKey,
                key,
                sortInPlace,
                order,
                handleTies,
                locale
            )
        )

        return this
    }

    @logCall()
    addItems({
        dataToBeAdded,
        fillMissingKeys = false,
        defaultValue = undefined,
    }: {
        dataToBeAdded: SimpleDataItem[] | SimpleData
        fillMissingKeys?: boolean
        defaultValue?: SimpleDataValue
    }): this {
        this.#updateSimpleData(
            addItems_(
                cloneData(this._data),
                dataToBeAdded,
                fillMissingKeys,
                defaultValue,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    mergeItems({
        dataToBeMerged,
        commonKey,
        nbTestedValues = 10000,
    }: {
        dataToBeMerged: SimpleDataItem[] | SimpleData
        commonKey: string
        nbTestedValues?: number
    }): this {
        this.#updateSimpleData(
            mergeItems_(
                cloneData(this._data),
                dataToBeMerged,
                commonKey,
                this.verbose,
                nbTestedValues
            )
        )

        return this
    }

    @logCall()
    valuesToKeys({
        newKeys,
        newValues,
    }: {
        newKeys: string
        newValues: string
    }): this {
        this.#updateSimpleData(
            valuesToKeys_(
                cloneData(this._data),
                newKeys,
                newValues,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    keysToValues({
        keys,
        newKeyForKeys,
        newKeyForValues,
    }: {
        keys: string[]
        newKeyForKeys: string
        newKeyForValues: string
    }): this {
        this.#updateSimpleData(
            keysToValues_(
                cloneData(this._data),
                keys,
                newKeyForKeys,
                newKeyForValues,
                this.verbose
            )
        )

        return this
    }

    //*** SELECTION METHODS ***/

    @logCall()
    selectKeys({ keys }: { keys: string[] }): this {
        this.#updateSimpleData(selectKeys_(cloneData(this._data), keys))

        return this
    }

    @logCall()
    filterValues({
        key,
        valueComparator,
    }: {
        key: string
        valueComparator: (val: SimpleDataValue) => SimpleDataValue
    }): this {
        this.#updateSimpleData(
            filterValues_(
                cloneData(this._data),
                key,
                valueComparator,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    filterItems({
        itemComparator,
    }: {
        itemComparator: (val: SimpleDataItem) => boolean
    }): this {
        this.#updateSimpleData(
            filterItems_(cloneData(this._data), itemComparator, this.verbose)
        )

        return this
    }

    @logCall()
    pickRandomItems({
        nbItems,
        seed,
    }: {
        nbItems: number
        seed?: number
    }): this {
        this.#updateSimpleData(
            pickRandomItems_(cloneData(this._data), nbItems, seed, this.verbose)
        )

        return this
    }

    @logCall()
    removeDuplicates({
        key,
        keepDuplicatesOnly = false,
        nbToKeep = 1,
    }: {
        key?: string
        keepDuplicatesOnly?: boolean
        nbToKeep?: number
    } = {}): this {
        this.#updateSimpleData(
            removeDuplicates_(
                cloneData(this._data),
                key,
                keepDuplicatesOnly,
                nbToKeep,
                this.verbose
            )
        )

        return this
    }

    // *** ANALYSIS METHODS *** //

    @logCall()
    sortValues({
        key,
        order = "ascending",

        locale,
    }: {
        key: string | string[]
        order: "ascending" | "descending"

        locale?: string
    }): this {
        this.#updateSimpleData(
            sortValues_(cloneData(this._data), key, order, locale)
        )

        return this
    }

    @logCall()
    addProportions({
        method,
        key,
        keys,
        newKey,
        keyCategory,
        suffix,
        nbDigits = 2,
        nbTestedValues = 10000,
    }: {
        method: "item" | "data"
        key?: string
        keys?: string[]
        newKey?: string
        keyCategory?: string | string[]
        suffix?: string
        nbDigits?: number
        nbTestedValues?: number
    }): this {
        this.#updateSimpleData(
            addProportions_(cloneData(this._data), {
                method,
                keys,
                key,
                newKey,
                keyCategory,
                suffix,
                nbDigits,
                nbTestedValues,
                verbose: this.verbose,
            })
        )
        return this
    }

    @logCall()
    addVariation({
        key,
        newKey,
        valueGenerator,
        order = undefined,
        firstValue = undefined,
        nbTestedValues = 10000,
    }: {
        key: string
        newKey: string
        valueGenerator: (
            a: SimpleDataValue,
            b: SimpleDataValue
        ) => SimpleDataValue
        order?: "ascending" | "descending" | undefined
        firstValue?: SimpleDataValue
        nbTestedValues?: number
    }) {
        this.#updateSimpleData(
            addVariation_(
                cloneData(this._data),
                key,
                newKey,
                valueGenerator,
                order,
                firstValue,
                nbTestedValues,
                this.verbose
            )
        )
        return this
    }

    @logCall()
    summarize({
        keyValue,
        keyCategory,
        summary,
        weight,
        nbTestedValues = 10000,
        nbDigits,
    }: {
        keyValue?: string | string[]
        keyCategory?: string | string[]
        summary?: string | string[]
        weight?: string
        nbTestedValues?: number
        nbDigits?: number
    } = {}): this {
        this.#updateSimpleData(
            summarize_(
                cloneData(this._data),
                keyValue,
                keyCategory,
                summary,
                weight,
                nbTestedValues,
                this.verbose,
                nbDigits
            )
        )
        return this
    }

    @logCall()
    correlation({
        keyX,
        keyY,
        keyCategory,
        nbDigits = 4,

        nbTestedValues = 10000,
    }: {
        keyX?: string
        keyY?: string | string[]
        keyCategory?: string

        nbDigits?: number
        nbTestedValues?: number
    } = {}): this {
        this.#updateSimpleData(
            correlation_(
                cloneData(this._data),
                keyX,
                keyY,
                keyCategory,
                nbDigits,
                this.verbose,
                nbTestedValues
            )
        )

        return this
    }

    @logCall()
    regression({
        keyX,
        keyY,
        keyCategory,
        type = "linear",
        order,
        nbDigits = 4,

        nbTestedValues = 10000,
    }: {
        keyX?: string
        keyY?: string | string[]
        keyCategory?: string
        type?:
            | "linear"
            | "quadratic"
            | "polynomial"
            | "exponential"
            | "logarithmic"
            | "power"
        order?: number

        nbDigits?: number
        nbTestedValues?: number
    } = {}): this {
        this.#updateSimpleData(
            regression_(
                cloneData(this._data),
                keyX,
                keyY,
                type,
                keyCategory,
                order,
                nbDigits,
                this.verbose,
                nbTestedValues
            )
        )

        return this
    }

    @logCall()
    addQuantiles({
        key,
        newKey,
        nbQuantiles,
        nbTestedValues = 10000,
    }: {
        key: string
        newKey: string
        nbQuantiles: number
        nbTestedValues?: number
    }): this {
        this.#updateSimpleData(
            addQuantiles_(
                cloneData(this._data),
                key,
                newKey,
                nbQuantiles,
                nbTestedValues,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    addBins({
        key,
        newKey,
        nbBins,
        nbTestedValues = 10000,
    }: {
        key: string
        newKey: string
        nbBins: number
        nbTestedValues?: number
    }): this {
        this.#updateSimpleData(
            addBins_(
                cloneData(this._data),
                key,
                newKey,
                nbBins,
                nbTestedValues,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    addOutliers({
        key,
        newKey,
        nbTestedValues = 10000,
    }: {
        key: string
        newKey: string
        nbTestedValues?: number
    }): this {
        this.#updateSimpleData(
            addOutliers_(
                cloneData(this._data),
                key,
                newKey,
                nbTestedValues,
                this.verbose
            )
        )

        return this
    }

    // *** VISUALIZATION METHODS *** //

    @logCall()
    getChart({
        type,
        x,
        y,
        color,
        colorScale,
        trend = false,
        showTrendEquation = false,
        width,
        height,
        marginLeft,
        marginBottom,
        title,
        smallMultipleKey,
        smallMultipleWidth,
        smallMultipleHeight,
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
        colorScale?: "linear" | "diverging" | "categorical" | "ordinal"
        trend?: boolean
        showTrendEquation?: boolean
        width?: number
        height?: number
        marginLeft?: number
        marginBottom?: number
        title?: string
        smallMultipleKey?: string
        smallMultipleWidth?: number
        smallMultipleHeight?: number
    }): string {
        return getChart_(
            cloneData(this._data),
            type,
            x,
            y,
            color,
            colorScale,
            trend,
            showTrendEquation,
            marginLeft,
            marginBottom,
            width,
            height,
            title,
            smallMultipleKey,
            smallMultipleWidth,
            smallMultipleHeight
        )
    }

    @logCall()
    getCustomChart({ plotOptions }: { plotOptions: object }): string {
        return getCustomChart_(plotOptions)
    }

    // ** EXPORTING METHODS *** //

    @logCall()
    clone(): this {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new this.constructor({
            data: this._data,
            verbose: this.verbose,
            logParameters: this.logParameters,
            noLogs: this.noLogs,
            nbTableItemsToLog: this.nbTableItemsToLog,
        })
    }

    // No @logCall otherwise it's triggered everywhere, including in methods
    getData(): SimpleDataItem[] {
        return this._data
    }

    // No @logCall otherwise it's triggered everywhere, including in methods
    getFirst(): SimpleDataItem {
        return this._data[0]
    }

    // No @logCall otherwise it's triggered everywhere, including in methods
    getLast(): SimpleDataItem {
        return this._data[this._data.length - 1]
    }

    //No @logCall otherwise it's triggered everywhere, including in methods
    getLength(): number {
        return this._data.length
    }

    //No @logCall otherwise it's triggered everywhere, including in methods
    getKeys(): string[] {
        return this._data.length > 0 ? Object.keys(this._data[0]) : []
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getItem({
        conditions,
        noWarning = false,
    }: {
        conditions: SimpleDataItem
        noWarning?: boolean
    }): SimpleDataItem | undefined {
        return getItem_(this._data, conditions, noWarning)
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getArray({ key }: { key: string | string[] }): SimpleDataValue[] {
        return getArray_(this._data, key)
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getDataAsArrays() {
        return getDataAsArrays_(this._data)
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getUniqueValues({ key }: { key: string }): SimpleDataValue[] {
        return getUniqueValues_(this._data, key)
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getMin({
        key,
        nbDigits = undefined,
        nbTestedValues = 10000,
        type = "number",
    }: {
        key: string
        nbDigits?: number
        nbTestedValues?: number
        type?: "number" | "Date"
    }): SimpleDataValue {
        return getMin_(
            this._data,
            key,
            nbDigits,
            nbTestedValues,
            type,
            this.verbose
        )
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getMax({
        key,
        nbDigits = undefined,
        nbTestedValues = 10000,
        type = "number",
    }: {
        key: string
        nbDigits?: number | undefined
        nbTestedValues?: number
        type?: "number" | "Date"
    }): SimpleDataValue {
        return getMax_(
            this._data,
            key,
            nbDigits,
            nbTestedValues,
            type,
            this.verbose
        )
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getMean({
        key,
        nbDigits = 2,
        nbTestedValues = 10000,
        type = "number",
    }: {
        key: string
        nbDigits?: number
        nbTestedValues?: number
        type?: "number" | "Date"
    }): SimpleDataValue {
        return getMean_(
            this._data,
            key,
            nbDigits,
            nbTestedValues,
            type,
            this.verbose
        )
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getMedian({
        key,
        nbDigits = 2,
        nbTestedValues = 10000,
        type = "number",
    }: {
        key: string
        nbDigits?: number
        nbTestedValues?: number
        type?: "number" | "Date"
    }): SimpleDataValue {
        return getMedian_(
            this._data,
            key,
            nbDigits,
            nbTestedValues,
            type,
            this.verbose
        )
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getSum({
        key,
        nbDigits = 2,
        nbTestedValues = 10000,
    }: {
        key: string
        nbDigits?: number
        nbTestedValues?: number
    }): SimpleDataValue {
        return getSum_(this._data, key, nbDigits, nbTestedValues, this.verbose)
    }

    // No @logCall for methods starting with get. It's not returning a simpleData class
    getQuantile({
        key,
        quantile,
        nbDigits = 2,
        nbTestedValues = 10000,
    }: {
        key: string
        quantile: number
        nbDigits?: number
        nbTestedValues?: number
    }): SimpleDataValue {
        return getQuantile_(
            this._data,
            key,
            quantile,
            nbDigits,
            nbTestedValues,
            this.verbose
        )
    }

    getDuration() {
        return this.duration
    }

    // *** LOGGING METHODS AND OTHERS *** //

    // No log call, otherwise the table is shown twice.
    showTable({
        nbItemInTable = 5,
    }: { nbItemInTable?: "all" | number } = {}): this {
        if (!this.noLogs) {
            // TODO: test this!
            showTable_(this._data, nbItemInTable, true)
        }
        return this
    }

    showDuration() {
        if (!this.noLogs) {
            log(`Total duration ${round(this.duration / 1000, 3)}.`)
        }
        return this
    }
}
