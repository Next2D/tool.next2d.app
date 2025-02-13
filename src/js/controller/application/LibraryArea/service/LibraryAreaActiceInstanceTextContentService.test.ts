import { execute } from "./LibraryAreaActiceInstanceTextContentService";
import { describe, expect, it } from "vitest";

describe("LibraryAreaActiceInstanceTextContentServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "false";
        div.style.borderBottom = "";

        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");
        execute(div);
        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid #f5f5f5");
    });
});