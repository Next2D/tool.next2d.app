import { execute } from "./LibraryAreaDragoverService";
import { describe, expect, it } from "vitest";

describe("LibraryAreaDragoverServiceTest", () =>
{
    it("execute test", () =>
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
        } as unknown as DragEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});