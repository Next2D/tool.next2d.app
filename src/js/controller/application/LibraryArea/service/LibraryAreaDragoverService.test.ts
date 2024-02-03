import { execute } from "./LibraryAreaDragoverService";

describe("LibraryAreaDragoverServiceTest", () =>
{
    test("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const eventMock = {
            "stopPropagation": () => {
                stopPropagation = true;
            },
            "preventDefault": () => {
                preventDefault = true;
            }
        };

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});