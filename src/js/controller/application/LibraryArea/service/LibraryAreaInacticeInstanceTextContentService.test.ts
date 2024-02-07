import { execute } from "./LibraryAreaInacticeInstanceTextContentService";

describe("LibraryAreaInacticeInstanceTextContentServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.style.borderBottom = "1px solid";

        const eventMock = {
            "target": div
        };

        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid");
        execute(eventMock);
        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");
    });
});