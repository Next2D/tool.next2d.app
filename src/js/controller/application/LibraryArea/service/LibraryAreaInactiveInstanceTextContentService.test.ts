import { execute } from "./LibraryAreaInactiveInstanceTextContentService";
import { $updateKeyLock, $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it } from "vitest";

describe("LibraryAreaInactiveInstanceTextContentService Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.style.borderBottom = "1px solid";

        $updateKeyLock(true);

        const eventMock = {
            "target": div
        } as unknown as FocusEvent;

        expect($useKeyboard()).toBe(true);
        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid");

        execute(eventMock);

        expect($useKeyboard()).toBe(false);
        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");
    });
});