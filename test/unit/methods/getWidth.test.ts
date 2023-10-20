import assert from "assert"
import SimpleNodeDB from "../../../src/class/SimpleNodeDB.js"

describe("getWidth", () => {
    let simpleNodeDB: SimpleNodeDB
    before(async function () {
        simpleNodeDB = await new SimpleNodeDB().start()
        await simpleNodeDB.loadData("employees", ["test/data/employees.json"])
    })
    after(async function () {
        await simpleNodeDB.done()
    })

    it("should return the number of columns", async () => {
        assert.deepStrictEqual(await simpleNodeDB.getWidth("employees"), 6)
    })
})
