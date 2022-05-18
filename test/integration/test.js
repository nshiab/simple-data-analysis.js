import { loadData, SimpleData } from "../../dist/index.js"
import { temporaryDirectoryTask } from 'tempy'
import * as Plot from "@observablehq/plot"

const simpleData = await loadData({
    path: "data/employees.csv", 
    verbose: true, 
    logParameters: true
})


simpleData.getArray({key: "Name"})
simpleData.getUniqueValues({key: "Job"})


simpleData
    .describe()
    .formatAllKeys()
    .renameKey({oldKey: "departementOrUnit", newKey: "unit"})
    .renameKey({oldKey: "endOfYearBonus", newKey: "bonus"})
    .checkValues()
    .excludeMissingValues({key: "name"})
    .excludeMissingValues()
    .addKey({key: "firstName", func: item => item.name.split(",")[1].trim()})
    .removeKey({key: "name"})
    .replaceValues({key: "bonus", oldValue: "%", newValue: "", method: "partialString"})
    .replaceValues({key: "bonus", oldValue: ",", newValue: ".", method: "partialString"})
    .valuesToFloat({key: "bonus"})
    .modifyValues({key: "bonus", func: val => val / 100})
    .modifyItems({key: "bonus", func: item => item.salary * item.bonus})
    .roundValues({key: "bonus", nbDigits: 2 })
    .valuesToInteger({key: "unit"})
    .valuesToString({key: "unit"})
    .valuesToDate({key: "hireDate", format: "%d-%b-%y"})
    .datesToString({key: "hireDate", format: "%Y-%m-%d"})
    .filterValues({key: "bonus", func: val => val >= 100})
    .filterItems({func: item => item.hireDate > "2002-01-01" && item.unit !== "20"})
    .sortValues({key: "salary", order: "descending"})
    .sortValues({key: "bonus", order: "ascending"})
    .selectKeys({keys: ["firstName", "job", "bonus"], overwrite: false})

const moreEmployees = [
    {
        hireDate: "2022-05-12",
        job: "Clerk",
        salary: 2345,
        unit: "30",
        bonus: 10,
        firstName: "Marc"
    },
    {
        hireDate: "2022-02-03",
        job: "Manager",
        salary: 8500,
        unit: "50",
        bonus: 550,
        firstName: "Emily"
    }
]

simpleData.addItems({dataToBeAdded: moreEmployees})

const moreEmployeesSimpleData = new SimpleData([
    {
        hireDate: "2021-11-23",
        job: "Accountant",
        salary: 7845,
        unit: "30",
        bonus: 1150,
        firstName: "Roberto"
    },
    {
        hireDate: "2022-02-03",
        job: "Accountant",
        salary: 8000,
        unit: "50",
        bonus: 130,
        firstName: "Maxime"
    }
])

simpleData
    .addItems({dataToBeAdded: moreEmployeesSimpleData})

const unitsNames = [
    {
        unit: "30",
        unitName: "Marketing"
    },
    {
        unit: "100",
        unitName: "Finance"
    }
]

simpleData.mergeItems({dataToBeMerged: unitsNames, commonKey: "unit"})
    .removeKey({key: "unitName" })

const unitsNamesSimpleData = new SimpleData([
    {
        unit: "30",
        unitName: "Marketing"
    },
    {
        unit: "100",
        unitName: "Finance"
    },
    {
        unit: "60",
        unitName: "Engineering"
    }
])

simpleData.mergeItems({dataToBeMerged: unitsNamesSimpleData, commonKey: "unit"})

simpleData
    .addQuantiles({key: "bonus", newKey: "salaryQuintile", nbQuantiles:5})
    .addBins({key: "bonus", newKey: "salaryBins", nbBins: 5})
    .addOutliers({key: "bonus", newKey: "bonusOutlier"})
    .excludeOutliers({key: "bonus"})
    .correlation() 
    .correlation({key1: "salary", key2: "bonus"})
    .summarize()
    .summarize({value: simpleData.keys, key: "job"})
    .summarize({value: "salary", keys: ["job", "unit"]})
    .summarize({value: "salary", keys: "job", summary: "mean"})
    .summarize({value: "salary", summary: "mean"})
    .summarize({value: "salary", key: "job", summary: ["mean", "median"]})
    .summarize({value: "salary", key: "job", summary: "weightedMean", weight: "bonus"})


temporaryDirectoryTask((tempDir) => {
    simpleData
        .saveData({path: `${tempDir}/integrationTest.csv`})
        .saveData({path: `${tempDir}/integrationTest.json`})

    simpleData.saveChart({path: `${tempDir}/dot1.html`, type: "dot", x: "salary", y: "bonus"})
    simpleData.saveChart({path: `${tempDir}/dot2.html`, type: "dot", x: "salary", y: "bonus", color: "job"})

    simpleData.valuesToDate({key: "hireDate", format: "%Y-%m-%d"})

    simpleData.saveChart({path: `${tempDir}/line1.html`, type: "line", x: "hireDate", y: "salary"})
    simpleData.saveChart({path: `${tempDir}/line2.html`, type: "line", x: "hireDate", y: "salary", color: "unit"})
    simpleData.saveChart({path: `${tempDir}/bar1.html`, type: "bar", x: "unit", y: "salary"})
    simpleData.saveChart({path: `${tempDir}/bar2.html`, type: "bar", x: "unit", y: "salary", color: "unit"})
    simpleData.saveChart({path: `${tempDir}/box1.html`, type: "box", x: "unit", y: "salary"})
    simpleData.saveChart({path: `${tempDir}/box2.html`, type: "box", x: "unit", y: "salary", color: "unit"})

    simpleData
    .saveCustomChart({
        path: `${tempDir}/customChart.html`,
        plotOptions: {
            grid: true,
            facet: {
                data: simpleData.data,
                y: "unit"
            },
            marks: [
                Plot.dotX(simpleData.data, { x: "salary", fill: "unit" })
            ]
        }
    })
})