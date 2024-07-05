import assert from "assert"
import SimpleDB from "../../../src/class/SimpleDB.js"

describe("union", () => {
    let sdb: SimpleDB
    before(async function () {
        sdb = new SimpleDB()
    })
    after(async function () {
        await sdb.done()
    })

    it("should compute the union of geometries", async () => {
        const poly = sdb.newTable()
        await poly.loadGeoData("test/geodata/files/polygonsGroups.json")
        await poly.renameColumns({ geom: "polygons" })

        const circle = sdb.newTable()
        await circle.loadGeoData(
            "test/geodata/files/circleOverlapPolygonsGroups.json"
        )
        await circle.renameColumns({ geom: "circle" })

        await poly.crossJoin(circle)

        await poly.union("polygons", "circle", "result")
        await poly.selectColumns("result")
        await poly.reducePrecision(2)

        const data = await poly.getGeoData()

        assert.deepStrictEqual(data, {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-76.97, 46.53],
                                [-77.03, 46.47],
                                [-77.16, 46.31],
                                [-77.27, 46.13],
                                [-77.36, 45.95],
                                [-77.41, 45.76],
                                [-77.44, 45.57],
                                [-77.45, 45.38],
                                [-77.43, 45.19],
                                [-77.38, 45],
                                [-77.3, 44.82],
                                [-77.2, 44.64],
                                [-77.08, 44.47],
                                [-76.94, 44.31],
                                [-76.77, 44.16],
                                [-76.59, 44.02],
                                [-76.39, 43.89],
                                [-76.17, 43.78],
                                [-75.94, 43.69],
                                [-75.7, 43.61],
                                [-75.45, 43.55],
                                [-75.19, 43.5],
                                [-74.93, 43.47],
                                [-74.67, 43.46],
                                [-74.41, 43.47],
                                [-74.15, 43.5],
                                [-73.89, 43.55],
                                [-73.64, 43.61],
                                [-73.4, 43.69],
                                [-73.17, 43.78],
                                [-72.95, 43.89],
                                [-72.75, 44.02],
                                [-72.66, 44.09],
                                [-68, 43.43],
                                [-64.09, 47.83],
                                [-72.88, 52.49],
                                [-77.57, 49.49],
                                [-76.97, 46.53],
                            ],
                        ],
                    },
                    properties: {},
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-76.43, 42.31],
                                [-76.07, 43.74],
                                [-75.94, 43.69],
                                [-75.7, 43.61],
                                [-75.45, 43.55],
                                [-75.19, 43.5],
                                [-74.93, 43.47],
                                [-74.67, 43.46],
                                [-74.41, 43.47],
                                [-74.15, 43.5],
                                [-73.89, 43.55],
                                [-73.64, 43.61],
                                [-73.4, 43.69],
                                [-73.17, 43.78],
                                [-72.95, 43.89],
                                [-72.75, 44.02],
                                [-72.57, 44.16],
                                [-72.4, 44.31],
                                [-72.26, 44.47],
                                [-72.14, 44.64],
                                [-72.04, 44.82],
                                [-71.96, 45],
                                [-71.91, 45.19],
                                [-71.89, 45.38],
                                [-71.9, 45.57],
                                [-71.93, 45.76],
                                [-71.98, 45.95],
                                [-72.07, 46.13],
                                [-72.18, 46.31],
                                [-72.31, 46.47],
                                [-72.47, 46.63],
                                [-72.66, 46.78],
                                [-72.86, 46.91],
                                [-73.08, 47.03],
                                [-73.32, 47.13],
                                [-73.57, 47.21],
                                [-73.84, 47.28],
                                [-74.11, 47.33],
                                [-74.39, 47.36],
                                [-74.67, 47.37],
                                [-74.95, 47.36],
                                [-75.14, 47.34],
                                [-74.92, 48.18],
                                [-82.84, 50.63],
                                [-84.42, 44.57],
                                [-76.43, 42.31],
                            ],
                        ],
                    },
                    properties: {},
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-71.92, 45.71],
                                [-71.93, 45.76],
                                [-71.98, 45.95],
                                [-72.07, 46.13],
                                [-72.18, 46.31],
                                [-72.31, 46.47],
                                [-72.47, 46.63],
                                [-72.66, 46.78],
                                [-72.86, 46.91],
                                [-73.08, 47.03],
                                [-73.32, 47.13],
                                [-73.57, 47.21],
                                [-73.84, 47.28],
                                [-74.11, 47.33],
                                [-74.39, 47.36],
                                [-74.67, 47.37],
                                [-74.95, 47.36],
                                [-75.23, 47.33],
                                [-75.5, 47.28],
                                [-75.77, 47.21],
                                [-76.02, 47.13],
                                [-76.26, 47.03],
                                [-76.48, 46.91],
                                [-76.68, 46.78],
                                [-76.87, 46.63],
                                [-77.03, 46.47],
                                [-77.16, 46.31],
                                [-77.27, 46.13],
                                [-77.36, 45.95],
                                [-77.41, 45.76],
                                [-77.44, 45.57],
                                [-77.45, 45.38],
                                [-77.43, 45.19],
                                [-77.38, 45],
                                [-77.3, 44.82],
                                [-77.2, 44.64],
                                [-77.08, 44.47],
                                [-76.94, 44.31],
                                [-76.77, 44.16],
                                [-76.59, 44.02],
                                [-76.39, 43.89],
                                [-76.17, 43.78],
                                [-75.94, 43.69],
                                [-75.74, 43.62],
                                [-75.99, 43.48],
                                [-71.3, 39.19],
                                [-66.38, 38.66],
                                [-65.25, 44.32],
                                [-70.8, 46.32],
                                [-71.92, 45.71],
                            ],
                        ],
                    },
                    properties: {},
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-71.82, 43.78],
                                [-72.23, 44.51],
                                [-72.14, 44.64],
                                [-72.04, 44.82],
                                [-71.96, 45],
                                [-71.91, 45.19],
                                [-71.89, 45.38],
                                [-71.9, 45.57],
                                [-71.93, 45.76],
                                [-71.98, 45.95],
                                [-72.07, 46.13],
                                [-72.18, 46.31],
                                [-72.31, 46.47],
                                [-72.47, 46.63],
                                [-72.66, 46.78],
                                [-72.86, 46.91],
                                [-73.08, 47.03],
                                [-73.32, 47.13],
                                [-73.57, 47.21],
                                [-73.84, 47.28],
                                [-74.11, 47.33],
                                [-74.39, 47.36],
                                [-74.67, 47.37],
                                [-74.95, 47.36],
                                [-75.23, 47.33],
                                [-75.5, 47.28],
                                [-75.77, 47.21],
                                [-76.02, 47.13],
                                [-76.26, 47.03],
                                [-76.48, 46.91],
                                [-76.68, 46.78],
                                [-76.87, 46.63],
                                [-77.03, 46.47],
                                [-77.16, 46.31],
                                [-77.27, 46.13],
                                [-77.36, 45.95],
                                [-77.41, 45.76],
                                [-77.44, 45.61],
                                [-78.67, 45.36],
                                [-81.91, 41.78],
                                [-76.54, 39.26],
                                [-71.82, 43.78],
                            ],
                        ],
                    },
                    properties: {},
                },
            ],
        })
    })
    it("should compute the union of geometries and add a projection", async () => {
        const poly = sdb.newTable()
        await poly.loadGeoData("test/geodata/files/polygonsGroups.json")
        await poly.renameColumns({ geom: "polygons" })

        const circle = sdb.newTable()
        await circle.loadGeoData(
            "test/geodata/files/circleOverlapPolygonsGroups.json"
        )
        await circle.renameColumns({ geom: "circle" })

        await poly.crossJoin(circle)

        await poly.union("polygons", "circle", "result")

        assert.deepStrictEqual(poly.projections, {
            polygons: "+proj=latlong +datum=WGS84 +no_defs",
            circle: "+proj=latlong +datum=WGS84 +no_defs",
            result: "+proj=latlong +datum=WGS84 +no_defs",
        })
    })
})
