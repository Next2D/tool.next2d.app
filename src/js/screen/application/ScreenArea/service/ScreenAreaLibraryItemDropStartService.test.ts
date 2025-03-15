import { execute } from "./ScreenAreaLibraryItemDropStartService";
import { $SCREEN_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("ScreenAreaLibraryItemDropStartServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            parent.appendChild(document.createElement("div"));
        }

        for (let idx = 0; idx < 10; ++idx) {
            const node = parent.children[idx] as HTMLElement;
            expect(node.style.pointerEvents).toBe("");
        }

        execute();

        for (let idx = 0; idx < 10; ++idx) {
            const node = parent.children[idx] as HTMLElement;
            expect(node.style.pointerEvents).toBe("none");
        }

        parent.remove();
    });
});