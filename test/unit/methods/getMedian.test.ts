import { assertEquals } from "jsr:@std/assert";
import SimpleDB from "../../../src/class/SimpleDB.ts";

Deno.test("should return the median value", async () => {
  const sdb = new SimpleDB();
  const table = sdb.newTable("data");
  await table.loadData("test/data/files/data.json");
  assertEquals(await table.getMedian("key1"), 2.5);
  await sdb.done();
});

Deno.test("should return the median value rounded", async () => {
  const sdb = new SimpleDB();
  const table = sdb.newTable("data");
  await table.loadData("test/data/files/data.json");
  assertEquals(
    await table.getMedian("key1", { decimals: 0 }),
    3,
  );
  await sdb.done();
});
