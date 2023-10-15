import { EventDispatcher } from "./EventDispatcher";

describe("EventDispatcherTest", () =>
{
    test("property test", () =>
    {
        const object = new EventDispatcher();
        if (!("_$events" in object)) {
            throw new Error("Not found. `_$events` property");
        }

        expect(object["_$events"].size).toBe(0);
    });

    test("addEventListener test", () =>
    {
        const object = new EventDispatcher();
        if (!("_$events" in object)) {
            throw new Error("Not found. `_$events` property");
        }

        expect(object["_$events"].size).toBe(0);

        object.addEventListener("test", () =>
        {
            return "OK";
        });

        expect(object["_$events"].size).toBe(1);
        expect(object["_$events"].has("test")).toBe(true);

        const values = object["_$events"].get("test");
        if (!values) {
            throw new Error("Not found. functions.");
        }

        expect(values.length).toBe(1);
        expect(values[0]()).toBe("OK");
    });

    test("dispatchEvent test", () =>
    {
        const object = new EventDispatcher();
        if (!("_$events" in object)) {
            throw new Error("Not found. `_$events` property");
        }

        expect(object["_$events"].size).toBe(0);

        let count = 0;
        object.addEventListener("test", () =>
        {
            count++;
        });

        expect(object["_$events"].size).toBe(1);
        expect(object["_$events"].has("test")).toBe(true);

        const values = object["_$events"].get("test");
        if (!values) {
            throw new Error("Not found. functions.");
        }

        expect(values.length).toBe(1);
        expect(count).toBe(0);

        object.dispatchEvent("test");
        expect(count).toBe(1);
    });
});