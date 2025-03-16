import { execute } from "./LibraryMenuOpenFileLoadingModalService";
import { describe, expect, it, vi } from "vitest";
import { $LIBRARY_FILE_INPUT_ID } from "../../../../config/LibraryConfig";

describe("LibraryMenuOpenFileLoadingModalService Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $LIBRARY_FILE_INPUT_ID;

        let clicked = false;
        div.click = vi.fn(() => clicked = true);

        expect(clicked).toBe(false);
        execute();
        expect(clicked).toBe(true);

        div.remove();
    });
});