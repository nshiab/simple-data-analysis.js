import { existsSync, mkdirSync, readFileSync } from "fs"
import assert from "assert"
import SimpleNodeDB from "../../../src/class/SimpleNodeDB.js"

describe("writeGeoData", () => {
    const output = "./test/output/"

    let simpleNodeDB: SimpleNodeDB
    before(async function () {
        if (!existsSync(output)) {
            mkdirSync(output)
        }
        simpleNodeDB = new SimpleNodeDB({ spatial: true })
    })
    after(async function () {
        await simpleNodeDB.done()
    })

    it("should write geojson file", async () => {
        const originalFile = "test/geodata/files/polygons.geojson"

        await simpleNodeDB.loadGeoData("data", originalFile)
        await simpleNodeDB.writeGeoData("data", `${output}data.geojson`)

        const originalData = JSON.parse(readFileSync(originalFile, "utf-8"))
        originalData.name = "data"
        const writtenData = JSON.parse(
            readFileSync(`${output}data.geojson`, "utf-8")
        )

        assert.deepStrictEqual(writtenData, originalData)
    })

    it("should write geojson file with coordinates rounded to 3 decimals", async () => {
        const originalFile = "test/geodata/files/polygons.geojson"

        await simpleNodeDB.loadGeoData("data", originalFile)
        await simpleNodeDB.writeGeoData(
            "data",
            `${output}dataPrecision.geojson`,
            {
                precision: 3,
            }
        )

        const writtenData = JSON.parse(
            readFileSync(`${output}dataPrecision.geojson`, "utf-8")
        )

        assert.deepStrictEqual(writtenData, {
            type: "FeatureCollection",
            name: "dataPrecision",
            features: [
                {
                    type: "Feature",
                    properties: { name: "polygonA" },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-80.593, 50.345],
                                [-81.468, 44.964],
                                [-75.091, 46.969],
                                [-75.56, 50.147],
                                [-80.593, 50.345],
                            ],
                        ],
                    },
                },
                {
                    type: "Feature",
                    properties: { name: "polygonB" },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-121.958, 62.011],
                                [-122.302, 56.046],
                                [-112.246, 51.569],
                                [-104.838, 51.434],
                                [-96.842, 53.442],
                                [-98.049, 62.426],
                                [-121.958, 62.011],
                            ],
                        ],
                    },
                },
            ],
        })
    })
})
