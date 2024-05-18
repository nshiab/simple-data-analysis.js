import assert from "assert"
import SimpleDB from "../../../src/class/SimpleDB.js"

describe("join", () => {
    let sdb: SimpleDB
    before(async function () {
        sdb = new SimpleDB()
        await sdb.loadData("dishes", "test/data/joins/dishes.csv")
        await sdb.loadData("categories", "test/data/joins/categories.csv")
    })
    after(async function () {
        await sdb.done()
    })

    it("should put the result of an inner join into a new table", async () => {
        await sdb.join("dishes", "categories", {
            commonColumn: "dishId",
            type: "inner",
            outputTable: "innerJoin",
        })

        const data = await sdb.getData("innerJoin")

        assert.deepStrictEqual(data, [
            {
                dishId: 1,
                name: "Crème brûlée",
                country: "France",
                category: "Dessert",
            },
            { dishId: 2, name: "Pizza", country: "Italy", category: "Main" },
            {
                dishId: 3,
                name: "Churros",
                country: "Mexico",
                category: "Dessert",
            },
        ])
    })
    it("should put the result of a left join into a new table", async () => {
        await sdb.join("dishes", "categories", {
            commonColumn: "dishId",
            type: "left",
            outputTable: "leftJoin",
        })

        const data = await sdb.getData("leftJoin")

        assert.deepStrictEqual(data, [
            {
                dishId: 1,
                name: "Crème brûlée",
                country: "France",
                category: "Dessert",
            },
            { dishId: 2, name: "Pizza", country: "Italy", category: "Main" },
            {
                dishId: 3,
                name: "Churros",
                country: "Mexico",
                category: "Dessert",
            },
            {
                dishId: 4,
                name: "Couscous",
                country: "Morrocco",
                category: null,
            },
            { dishId: 5, name: "Mochi", country: "Japan", category: null },
        ])
    })
    it("should put the result of a right join into a new table", async () => {
        await sdb.join("dishes", "categories", {
            commonColumn: "dishId",
            type: "right",
            outputTable: "rightJoin",
        })

        const data = await sdb.getData("rightJoin")

        assert.deepStrictEqual(data, [
            {
                dishId: 1,
                name: "Crème brûlée",
                country: "France",
                category: "Dessert",
            },
            { dishId: 2, name: "Pizza", country: "Italy", category: "Main" },
            {
                dishId: 3,
                name: "Churros",
                country: "Mexico",
                category: "Dessert",
            },
            { dishId: null, name: null, country: null, category: "Main" },
            { dishId: null, name: null, country: null, category: "Main" },
            { dishId: null, name: null, country: null, category: "Dessert" },
        ])
    })
    it("should put the result of a full join into a new table", async () => {
        await sdb.join("dishes", "categories", {
            commonColumn: "dishId",
            type: "full",
            outputTable: "fullJoin",
        })

        const data = await sdb.getData("fullJoin")

        assert.deepStrictEqual(data, [
            {
                dishId: 1,
                name: "Crème brûlée",
                country: "France",
                category: "Dessert",
            },
            { dishId: 2, name: "Pizza", country: "Italy", category: "Main" },
            {
                dishId: 3,
                name: "Churros",
                country: "Mexico",
                category: "Dessert",
            },
            { dishId: null, name: null, country: null, category: "Main" },
            { dishId: null, name: null, country: null, category: "Main" },
            { dishId: null, name: null, country: null, category: "Dessert" },
            { dishId: 5, name: "Mochi", country: "Japan", category: null },
            {
                dishId: 4,
                name: "Couscous",
                country: "Morrocco",
                category: null,
            },
        ])
    })
    it("should automatically find a common column, make left join and put the result into leftTable", async () => {
        await sdb.join("dishes", "categories")

        const data = await sdb.getData("dishes")

        assert.deepStrictEqual(data, [
            {
                dishId: 1,
                name: "Crème brûlée",
                country: "France",
                category: "Dessert",
            },
            { dishId: 2, name: "Pizza", country: "Italy", category: "Main" },
            {
                dishId: 3,
                name: "Churros",
                country: "Mexico",
                category: "Dessert",
            },
            {
                dishId: 4,
                name: "Couscous",
                country: "Morrocco",
                category: null,
            },
            { dishId: 5, name: "Mochi", country: "Japan", category: null },
        ])
    })
})
