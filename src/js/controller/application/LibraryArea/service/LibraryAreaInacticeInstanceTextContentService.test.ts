import { execute } from "./LibraryAreaInacticeInstanceTextContentService";
import { describe, expect, it } from "vitest";

describe("LibraryAreaInacticeInstanceTextContentServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.style.borderBottom = "1px solid";

        const eventMock = {
            "target": div
        } as unknown as FocusEvent;

        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid");
        execute(eventMock);
        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");
    });
});