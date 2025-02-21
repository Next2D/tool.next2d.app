import { execute } from "./LibraryAreaInstanceNameMouseDownEventUseCase";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import {
    $getNameSelectedLibraryId,
    $getSymbolSelectedLibraryId,
    $setNameSelectedLibraryId,
    $setSymbolSelectedLibraryId
} from "../LibraryAreaUtil";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaInstanceNameMouseDownEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const div1 = document.createElement("div");
        div1.dataset.libraryId = "1";

        let preventDefault = false;
        let stopPropagation = false;
        $setNameSelectedLibraryId(-1);
        $setSymbolSelectedLibraryId(-1);
        const mockEvent = {
            "currentTarget": div1,
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0,
            "altKey": false,
            "metaKey": false,
            "shiftKey": false,
        } as unknown as PointerEvent;

        expect($useKeyboard()).toBe(false);
        expect($getNameSelectedLibraryId()).toBe(-1);
        expect($getSymbolSelectedLibraryId()).toBe(-1);

        execute(mockEvent);
        expect($useKeyboard()).toBe(false);
        expect($getNameSelectedLibraryId()).toBe(1);
        expect($getSymbolSelectedLibraryId()).toBe(-1);

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        expect($useKeyboard()).toBe(true);
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
        expect($getNameSelectedLibraryId()).toBe(1);
        expect($getSymbolSelectedLibraryId()).toBe(-1);

        const div2 = document.createElement("div");
        div2.dataset.libraryId = "2";

        const mockEvent2 = {
            "currentTarget": div2,
            "preventDefault": vi.fn(),
            "stopPropagation": vi.fn(),
            "button": 0,
            "altKey": false,
            "metaKey": false,
            "shiftKey": false,
        } as unknown as PointerEvent;

        execute(mockEvent2);
        expect($getNameSelectedLibraryId()).toBe(2);
        expect($getSymbolSelectedLibraryId()).toBe(-1);
    });
});