import { SimpleDataItem } from "../../types/SimpleData.types.js"
import { sampleCorrelation, combinations } from "simple-statistics"
import checkTypeOfKey from "../../helpers/checkTypeOfKey.js"
import hasKey from "../../helpers/hasKey.js"
import round from "../../helpers/round.js"

export default function correlation(
    data: SimpleDataItem[],
    keyX?: string,
    keyY?: string | string[],
    nbDigits = 4,
    verbose = false,
    nbTestedValues = 10000
): SimpleDataItem[] {
    const correlations = []

    if (
        keyX === undefined &&
        (keyY === undefined || (Array.isArray(keyY) && keyY.length === 0))
    ) {
        const keys = Object.keys(data[0]).filter((d) =>
            checkTypeOfKey(data, d, "number", 1, nbTestedValues, verbose)
        )
        const combi = combinations(keys, 2)

        for (const c of combi) {
            correlations.push({
                keyX: c[0],
                keyY: c[1],
            })
        }
    } else if (typeof keyX === "string" && Array.isArray(keyY)) {
        if (!hasKey(data[0], keyX)) {
            throw new Error(`No key ${keyX} in data`)
        }
        if (!checkTypeOfKey(data, keyX, "number", 1, nbTestedValues, verbose)) {
            throw new Error(`At least one value in ${keyX} is not a number.`)
        }

        for (const key of keyY) {
            if (!hasKey(data[0], key)) {
                throw new Error(`No key ${key} in data`)
            }
            if (
                !checkTypeOfKey(data, key, "number", 1, nbTestedValues, verbose)
            ) {
                throw new Error(`At least one value in ${key} is not a number.`)
            }
            correlations.push({
                keyX: keyX,
                keyY: key,
            })
        }
    } else if (typeof keyX === "string" && typeof keyY === "string") {
        if (!hasKey(data[0], keyX)) {
            throw new Error(`No key ${keyX} in data`)
        }
        if (!checkTypeOfKey(data, keyX, "number", 1, nbTestedValues, verbose)) {
            throw new Error(`At least one value in ${keyX} is not a number.`)
        }
        if (!hasKey(data[0], keyY)) {
            throw new Error(`No key ${keyY} in data`)
        }
        if (!checkTypeOfKey(data, keyY, "number", 1, nbTestedValues, verbose)) {
            throw new Error(`At least one value in ${keyY} is not a number.`)
        }
        correlations.push({
            keyX: keyX,
            keyY: keyY,
        })
    } else {
        throw new Error(
            "keyX should be a string and keyY should be a string or array of strings"
        )
    }

    const correlationData = []

    for (const corr of correlations) {
        const x = data.map((d) => d[corr.keyX])
        const y = data.map((d) => d[corr.keyY])

        const result = sampleCorrelation(x as number[], y as number[])

        correlationData.push({
            ...corr,
            correlation: Number.isNaN(result) ? NaN : round(result, nbDigits),
        })
    }

    return correlationData
}
