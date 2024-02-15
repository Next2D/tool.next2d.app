import { execute } from "./LibraryAreaInstanceTextContentKeyPressEventService";

describe("LibraryAreaInstanceTextContentKeyPressEventServiceTest", () =>
{
    test("execute test", () =>
    {
        let preventDefault = false;
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            },
            "key": "Enter",
            "currentTarget": document.createElement("div")
        };

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});