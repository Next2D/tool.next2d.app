import { execute } from "./ScreenAreaLibraryItemDropEndService";
import { $SCREEN_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("ScreenAreaLibraryItemDropEndServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            div.style.pointerEvents = "none";
            parent.appendChild(div);
        }

        for (let idx = 0; idx < 10; ++idx) {
            const node = parent.children[idx] as HTMLElement;
            expect(node.style.pointerEvents).toBe("none");
        }

        execute();

        for (let idx = 0; idx < 10; ++idx) {
            const node = parent.children[idx] as HTMLElement;
            expect(node.style.pointerEvents).toBe("");
        }

        parent.remove();
    });
});