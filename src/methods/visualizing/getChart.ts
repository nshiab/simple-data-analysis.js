import {
    dot,
    line,
    barY,
    barX,
    boxY,
    boxX,
    linearRegressionY,
} from "@observablehq/plot"
import { regressionLinear } from "d3-regression"

import { SimpleDataItem } from "../../types/index.js"
import helpers from "../../helpers/index.js"

export default function getChart(
    data: SimpleDataItem[],
    type:
        | "dot"
        | "line"
        | "bar"
        | "barVertical"
        | "barHorizontal"
        | "box"
        | "boxVertical"
        | "boxHorizontal",
    x: string,
    y: string,
    color?: string,
    trend?: boolean,
    showTrendEquation?: boolean,
    marginLeft?: number,
    marginBottom?: number
): string {
    const markOption: { [key: string]: string | number } = { x, y }

    if (
        color &&
        [
            "dot",
            "bar",
            "barVertical",
            "barHorizontal",
            "box",
            "boxVertical",
            "boxHorizontal",
        ].includes(type)
    ) {
        markOption.fill = color
    } else if (color) {
        markOption.stroke = color
    }

    let mark
    if (type === "dot") {
        mark = dot(data, markOption)
    } else if (type === "line") {
        mark = line(data, markOption)
    } else if (type === "bar" || type === "barVertical") {
        mark = barY(data, markOption)
    } else if (type === "barHorizontal") {
        mark = barX(data, markOption)
    } else if (type === "box" || type === "boxVertical") {
        mark = boxY(data, markOption)
    } else if (type === "boxHorizontal") {
        mark = boxX(data, markOption)
    } else {
        throw new Error("Unknown chart type.")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plotOptions: { [key: string]: any } = {
        grid: true,
        marks: [mark],
    }

    if (trend) {
        plotOptions.marks.push(linearRegressionY(data, { x: x, y: y }))
    }

    if (marginLeft) {
        plotOptions.marginLeft = marginLeft
    }
    if (marginBottom) {
        plotOptions.marginBottom = marginBottom
    }

    if (color && helpers.checkTypeOfKey(data, color, "string", 0.5, 100)) {
        if (plotOptions.color) {
            plotOptions.color.type = "ordinal"
        } else {
            plotOptions.color = { type: "ordinal" }
        }
    }

    if (helpers.checkTypeOfKey(data, x, "string", 0.5, 100)) {
        if (type === "dot") {
            plotOptions.x = { type: "point" }
        } else if (type !== "line") {
            plotOptions.x = { type: "band" }
        }
    }
    if (helpers.checkTypeOfKey(data, y, "string", 0.5, 100)) {
        if (type === "dot") {
            plotOptions.y = { type: "point" }
        }
    }

    const chart = helpers.plotChart(plotOptions)

    let legend
    if (color && ["line", "dot"].includes(type)) {
        legend = chart.plt.legend("color").outerHTML
    }

    if (showTrendEquation) {
        const linearRegression = regressionLinear()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .x((d) => d[x])
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .y((d) => d[y])(data)
        let nbDigits = 0

        while (
            nbDigits < 10 &&
            (Math.abs(linearRegression.a) < 1 / Math.pow(10, nbDigits) ||
                Math.abs(linearRegression.b) < 1 / Math.pow(10, nbDigits))
        ) {
            nbDigits += 1
        }

        return `<div>
            ${
                legend
                    ? "<div style='width:100%;max-width: 640px;'>" +
                      legend +
                      "</div>"
                    : null
            }
            <div style='width: 100%; max-width: 620px;font-family:system-ui, sans-serif;font-size:10px;text-align:right;'>
                <div>Linear regression: y=${linearRegression.a.toFixed(
                    nbDigits + 1
                )}x + ${linearRegression.b.toFixed(
            nbDigits + 1
        )} , R<sup>2</sup>: ${linearRegression.rSquared.toFixed(
            2
        )}, chart CI: 0.95</div>
            </div>
            <div>
                ${chart.html}
            </div>
        </div>`
    } else {
        return `
        ${
            legend
                ? "<div style='width:100%;max-width: 640px;'>" +
                  legend +
                  "</div>"
                : null
        }
        ${chart.html}
        `
    }
}
