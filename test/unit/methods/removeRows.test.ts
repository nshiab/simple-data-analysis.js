import assert from "assert"
import SimpleNodeDB from "../../../src/class/SimpleNodeDB.js"

describe("removeRows", () => {
    let simpleNodeDB: SimpleNodeDB
    before(async function () {
        simpleNodeDB = new SimpleNodeDB()
    })
    after(async function () {
        await simpleNodeDB.done()
    })

    it("should remove rows based on one condition", async () => {
        await simpleNodeDB.loadData("employeesOneCondition", [
            "test/data/files/employees.csv",
        ])

        await simpleNodeDB.removeRows(
            "employeesOneCondition",
            `"Department or unit" = '50'`
        )
        const data = await simpleNodeDB.getData("employeesOneCondition")

        assert.deepStrictEqual(data, [
            {
                Name: null,
                "Hire date": "17-SEP-03",
                Job: "Assistant",
                Salary: "4400",
                "Department or unit": "10",
                "End-of_year-BONUS?": "17,51%",
            },
            {
                Name: "Hartstein, Michael",
                "Hire date": "17-FEB-04",
                Job: "Manager",
                Salary: "13000",
                "Department or unit": "20",
                "End-of_year-BONUS?": "2,71%",
            },
            {
                Name: "Fay, Pat",
                "Hire date": "17-AUG-05",
                Job: "Representative",
                Salary: "6000",
                "Department or unit": "20",
                "End-of_year-BONUS?": "18,68%",
            },
            {
                Name: "Mavris, Susan",
                "Hire date": "07-JUN-02",
                Job: "Salesperson",
                Salary: "6500",
                "Department or unit": "40",
                "End-of_year-BONUS?": "23,47%",
            },
            {
                Name: "NaN",
                "Hire date": "07-JUN-02",
                Job: "Salesperson",
                Salary: "10000",
                "Department or unit": "xyz",
                "End-of_year-BONUS?": "17,63%",
            },
            {
                Name: "Higgins, Shelley",
                "Hire date": "07-JUN-02",
                Job: "Manager",
                Salary: "12008",
                "Department or unit": "110",
                "End-of_year-BONUS?": "17,09%",
            },
            {
                Name: "null",
                "Hire date": "07-JUN-02",
                Job: "Accountant",
                Salary: "8300",
                "Department or unit": "110",
                "End-of_year-BONUS?": "15,7%",
            },
            {
                Name: "King, Steven",
                "Hire date": null,
                Job: "President",
                Salary: "24000",
                "Department or unit": "90",
                "End-of_year-BONUS?": "2,46%",
            },
            {
                Name: "Kochhar, Neena",
                "Hire date": "21-SEP-05",
                Job: "Vice-president",
                Salary: "&6%",
                "Department or unit": "90",
                "End-of_year-BONUS?": "11,6%",
            },
            {
                Name: "De Haan, Lex",
                "Hire date": "null",
                Job: "Vice-president",
                Salary: "17000",
                "Department or unit": "90",
                "End-of_year-BONUS?": "23,43%",
            },
            {
                Name: "Hunold, Alexander",
                "Hire date": "03-JAN-06",
                Job: "Programmer",
                Salary: "9000",
                "Department or unit": "60",
                "End-of_year-BONUS?": "23,01%",
            },
            {
                Name: "Ernst, Bruce",
                "Hire date": "21-MAY-07",
                Job: "Programmer",
                Salary: "6000",
                "Department or unit": "60",
                "End-of_year-BONUS?": "25,91%",
            },
            {
                Name: "Austin, David",
                "Hire date": "NaN",
                Job: "Programmer",
                Salary: "4800",
                "Department or unit": "null",
                "End-of_year-BONUS?": "6,89%",
            },
            {
                Name: "Pataballa, Valli",
                "Hire date": "abc",
                Job: "Programmer",
                Salary: null,
                "Department or unit": "60",
                "End-of_year-BONUS?": "1,62%",
            },
            {
                Name: "Lorentz, Diana",
                "Hire date": "07-ARB-07",
                Job: "Programmer",
                Salary: "4200",
                "Department or unit": "60",
                "End-of_year-BONUS?": "13,17%",
            },
            {
                Name: "Greenberg, Nancy",
                "Hire date": "17-AUG-02",
                Job: "Manager",
                Salary: "12008",
                "Department or unit": "100",
                "End-of_year-BONUS?": "74,69%",
            },
            {
                Name: "Faviet, Daniel",
                "Hire date": "16-AUG-02",
                Job: "Accountant",
                Salary: "9000",
                "Department or unit": "100",
                "End-of_year-BONUS?": "2,92%",
            },
            {
                Name: "Chen, John",
                "Hire date": "28-SEP-05",
                Job: "Accountant",
                Salary: "8200",
                "Department or unit": "100",
                "End-of_year-BONUS?": "9,31%",
            },
            {
                Name: "Sciarra, Ismael",
                "Hire date": "30-SEP-05",
                Job: "Accountant",
                Salary: "7700",
                "Department or unit": "100",
                "End-of_year-BONUS?": "13,18%",
            },
            {
                Name: "Urman, Jose Manuel",
                "Hire date": "07-MAR-06",
                Job: "Accountant",
                Salary: "7800",
                "Department or unit": "100",
                "End-of_year-BONUS?": "1,33%",
            },
            {
                Name: "Popp, Luis",
                "Hire date": "07-DEC-07",
                Job: "Accountant",
                Salary: "6900",
                "Department or unit": "100",
                "End-of_year-BONUS?": "2,98%",
            },
            {
                Name: "Raphaely, Den",
                "Hire date": "07-DEC-02",
                Job: "Manager",
                Salary: "11000",
                "Department or unit": "30",
                "End-of_year-BONUS?": "3,35%",
            },
            {
                Name: "Khoo, Alexander",
                "Hire date": "18-MAY-03",
                Job: "Clerk",
                Salary: "3100",
                "Department or unit": "30",
                "End-of_year-BONUS?": "19,81%",
            },
            {
                Name: "Baida, Shelli",
                "Hire date": "24-DEC-05",
                Job: "Clerk",
                Salary: "2900",
                "Department or unit": "30",
                "End-of_year-BONUS?": "11,06%",
            },
            {
                Name: "Tobias, Sigal",
                "Hire date": "24-JUL-05",
                Job: "NaN",
                Salary: "2800",
                "Department or unit": null,
                "End-of_year-BONUS?": "undefined",
            },
            {
                Name: "Himuro, Guy",
                "Hire date": "15-NOV-05",
                Job: "Clerk",
                Salary: "2600",
                "Department or unit": "30",
                "End-of_year-BONUS?": "25,98%",
            },
            {
                Name: "Colmenares, Karen",
                "Hire date": "10-AUG-07",
                Job: "Clerk",
                Salary: "2500",
                "Department or unit": "30",
                "End-of_year-BONUS?": "15,8%",
            },
            {
                Name: "Kaufling, Payam",
                "Hire date": "01-MAY-03",
                Job: "Manager",
                Salary: "7900",
                "Department or unit": "undefined",
                "End-of_year-BONUS?": "21,33%",
            },
            {
                Name: "Olson, TJ",
                "Hire date": "10-APR-07",
                Job: "Clerk",
                Salary: "2100",
                "Department or unit": "null",
                "End-of_year-BONUS?": "22,3%",
            },
            {
                Name: "Philtanker, Hazel",
                "Hire date": "06-FEB-08",
                Job: "Clerk",
                Salary: "2200",
                "Department or unit": "NaN",
                "End-of_year-BONUS?": "24,17%",
            },
        ])
    })
    it("should remove rows based on multiple conditions", async () => {
        await simpleNodeDB.loadData("employeesMultipleConditions", [
            "test/data/files/employees.csv",
        ])

        await simpleNodeDB.removeRows(
            "employeesMultipleConditions",
            `"Job" = 'Clerk' AND "Department or unit" = '50'`
        )
        const data = await simpleNodeDB.getData("employeesMultipleConditions")

        assert.deepStrictEqual(data, [
            {
                Name: null,
                "Hire date": "17-SEP-03",
                Job: "Assistant",
                Salary: "4400",
                "Department or unit": "10",
                "End-of_year-BONUS?": "17,51%",
            },
            {
                Name: "Hartstein, Michael",
                "Hire date": "17-FEB-04",
                Job: "Manager",
                Salary: "13000",
                "Department or unit": "20",
                "End-of_year-BONUS?": "2,71%",
            },
            {
                Name: "Fay, Pat",
                "Hire date": "17-AUG-05",
                Job: "Representative",
                Salary: "6000",
                "Department or unit": "20",
                "End-of_year-BONUS?": "18,68%",
            },
            {
                Name: "Mavris, Susan",
                "Hire date": "07-JUN-02",
                Job: "Salesperson",
                Salary: "6500",
                "Department or unit": "40",
                "End-of_year-BONUS?": "23,47%",
            },
            {
                Name: "NaN",
                "Hire date": "07-JUN-02",
                Job: "Salesperson",
                Salary: "10000",
                "Department or unit": "xyz",
                "End-of_year-BONUS?": "17,63%",
            },
            {
                Name: "Higgins, Shelley",
                "Hire date": "07-JUN-02",
                Job: "Manager",
                Salary: "12008",
                "Department or unit": "110",
                "End-of_year-BONUS?": "17,09%",
            },
            {
                Name: "null",
                "Hire date": "07-JUN-02",
                Job: "Accountant",
                Salary: "8300",
                "Department or unit": "110",
                "End-of_year-BONUS?": "15,7%",
            },
            {
                Name: "King, Steven",
                "Hire date": null,
                Job: "President",
                Salary: "24000",
                "Department or unit": "90",
                "End-of_year-BONUS?": "2,46%",
            },
            {
                Name: "Kochhar, Neena",
                "Hire date": "21-SEP-05",
                Job: "Vice-president",
                Salary: "&6%",
                "Department or unit": "90",
                "End-of_year-BONUS?": "11,6%",
            },
            {
                Name: "De Haan, Lex",
                "Hire date": "null",
                Job: "Vice-president",
                Salary: "17000",
                "Department or unit": "90",
                "End-of_year-BONUS?": "23,43%",
            },
            {
                Name: "Hunold, Alexander",
                "Hire date": "03-JAN-06",
                Job: "Programmer",
                Salary: "9000",
                "Department or unit": "60",
                "End-of_year-BONUS?": "23,01%",
            },
            {
                Name: "Ernst, Bruce",
                "Hire date": "21-MAY-07",
                Job: "Programmer",
                Salary: "6000",
                "Department or unit": "60",
                "End-of_year-BONUS?": "25,91%",
            },
            {
                Name: "Austin, David",
                "Hire date": "NaN",
                Job: "Programmer",
                Salary: "4800",
                "Department or unit": "null",
                "End-of_year-BONUS?": "6,89%",
            },
            {
                Name: "Pataballa, Valli",
                "Hire date": "abc",
                Job: "Programmer",
                Salary: null,
                "Department or unit": "60",
                "End-of_year-BONUS?": "1,62%",
            },
            {
                Name: "Lorentz, Diana",
                "Hire date": "07-ARB-07",
                Job: "Programmer",
                Salary: "4200",
                "Department or unit": "60",
                "End-of_year-BONUS?": "13,17%",
            },
            {
                Name: "Greenberg, Nancy",
                "Hire date": "17-AUG-02",
                Job: "Manager",
                Salary: "12008",
                "Department or unit": "100",
                "End-of_year-BONUS?": "74,69%",
            },
            {
                Name: "Faviet, Daniel",
                "Hire date": "16-AUG-02",
                Job: "Accountant",
                Salary: "9000",
                "Department or unit": "100",
                "End-of_year-BONUS?": "2,92%",
            },
            {
                Name: "Chen, John",
                "Hire date": "28-SEP-05",
                Job: "Accountant",
                Salary: "8200",
                "Department or unit": "100",
                "End-of_year-BONUS?": "9,31%",
            },
            {
                Name: "Sciarra, Ismael",
                "Hire date": "30-SEP-05",
                Job: "Accountant",
                Salary: "7700",
                "Department or unit": "100",
                "End-of_year-BONUS?": "13,18%",
            },
            {
                Name: "Urman, Jose Manuel",
                "Hire date": "07-MAR-06",
                Job: "Accountant",
                Salary: "7800",
                "Department or unit": "100",
                "End-of_year-BONUS?": "1,33%",
            },
            {
                Name: "Popp, Luis",
                "Hire date": "07-DEC-07",
                Job: "Accountant",
                Salary: "6900",
                "Department or unit": "100",
                "End-of_year-BONUS?": "2,98%",
            },
            {
                Name: "Raphaely, Den",
                "Hire date": "07-DEC-02",
                Job: "Manager",
                Salary: "11000",
                "Department or unit": "30",
                "End-of_year-BONUS?": "3,35%",
            },
            {
                Name: "Khoo, Alexander",
                "Hire date": "18-MAY-03",
                Job: "Clerk",
                Salary: "3100",
                "Department or unit": "30",
                "End-of_year-BONUS?": "19,81%",
            },
            {
                Name: "Baida, Shelli",
                "Hire date": "24-DEC-05",
                Job: "Clerk",
                Salary: "2900",
                "Department or unit": "30",
                "End-of_year-BONUS?": "11,06%",
            },
            {
                Name: "Tobias, Sigal",
                "Hire date": "24-JUL-05",
                Job: "NaN",
                Salary: "2800",
                "Department or unit": null,
                "End-of_year-BONUS?": "undefined",
            },
            {
                Name: "Himuro, Guy",
                "Hire date": "15-NOV-05",
                Job: "Clerk",
                Salary: "2600",
                "Department or unit": "30",
                "End-of_year-BONUS?": "25,98%",
            },
            {
                Name: "Colmenares, Karen",
                "Hire date": "10-AUG-07",
                Job: "Clerk",
                Salary: "2500",
                "Department or unit": "30",
                "End-of_year-BONUS?": "15,8%",
            },
            {
                Name: "Weiss, Matthew",
                "Hire date": "18-JUL-04",
                Job: "Manager",
                Salary: "8000",
                "Department or unit": "50",
                "End-of_year-BONUS?": "25,17%",
            },
            {
                Name: "Fripp, Adam",
                "Hire date": "10-APR-05",
                Job: "Manager",
                Salary: "8200",
                "Department or unit": "50",
                "End-of_year-BONUS?": "21%",
            },
            {
                Name: "Kaufling, Payam",
                "Hire date": "01-MAY-03",
                Job: "Manager",
                Salary: "7900",
                "Department or unit": "undefined",
                "End-of_year-BONUS?": "21,33%",
            },
            {
                Name: "Vollman, Shanta",
                "Hire date": "10-OCT-05",
                Job: "null",
                Salary: "6500",
                "Department or unit": "50",
                "End-of_year-BONUS?": "3,45%",
            },
            {
                Name: "Mourgos, Kevin",
                "Hire date": "undefined",
                Job: "Manager",
                Salary: "5800",
                "Department or unit": "50",
                "End-of_year-BONUS?": "19,07%",
            },
            {
                Name: "Bissot, Laura",
                "Hire date": "20-AUG-05",
                Job: "undefined",
                Salary: "3300",
                "Department or unit": "50",
                "End-of_year-BONUS?": "4,53%",
            },
            {
                Name: "Olson, TJ",
                "Hire date": "10-APR-07",
                Job: "Clerk",
                Salary: "2100",
                "Department or unit": "null",
                "End-of_year-BONUS?": "22,3%",
            },
            {
                Name: "Gee, Ki",
                "Hire date": "12-DEC-07",
                Job: "NaN",
                Salary: "2400",
                "Department or unit": "50",
                "End-of_year-BONUS?": "12,64%",
            },
            {
                Name: "Philtanker, Hazel",
                "Hire date": "06-FEB-08",
                Job: "Clerk",
                Salary: "2200",
                "Department or unit": "NaN",
                "End-of_year-BONUS?": "24,17%",
            },
            {
                Name: "Ladwig, Renske",
                "Hire date": "14-JUL-03",
                Job: null,
                Salary: "3600",
                "Department or unit": "50",
                "End-of_year-BONUS?": "17,86%",
            },
        ])
    })
    it("should remove the rows based on booleans", async () => {
        await simpleNodeDB.loadArray("tableWithBooleans", [
            { name: "Nael", value: true },
            { name: "Graeme", value: false },
        ])
        await simpleNodeDB.removeRows("tableWithBooleans", `value = TRUE`)
        const data = await simpleNodeDB.getData("tableWithBooleans")

        assert.deepStrictEqual(data, [{ name: "Graeme", value: false }])
    })
})
