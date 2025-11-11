import { execute } from "./ConvertMovieClipModalInputFocusInEventService";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/shortcut/ShortcutUtil");
vi.mock("@/global/GlobalUtil");

describe("ConvertMovieClipModalInputFocusInEventService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should handle focus event correctly", () =>
    {
        const mockInput = document.createElement("input");
        const mockEvent = new FocusEvent("focusin", {
            bubbles: true,
            cancelable: true
        });
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockInput,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect($updateKeyLock).toHaveBeenCalledWith(true);
        expect($setEditingElement).toHaveBeenCalledWith(mockInput);
    });

    it("should stop event propagation", () =>
    {
        const mockInput = document.createElement("input");
        const mockEvent = new FocusEvent("focusin", {
            bubbles: true,
            cancelable: true
        });
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockInput,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });

    it("should enable input mode", () =>
    {
        const mockInput = document.createElement("input");
        const mockEvent = new FocusEvent("focusin");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockInput,
            writable: false
        });

        execute(mockEvent);

        expect($updateKeyLock).toHaveBeenCalledWith(true);
    });

    it("should set editing element", () =>
    {
        const mockInput = document.createElement("input");
        const mockEvent = new FocusEvent("focusin");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockInput,
            writable: false
        });

        execute(mockEvent);

        expect($setEditingElement).toHaveBeenCalledWith(mockInput);
    });

    it("should return early when element is null", () =>
    {
        const mockEvent = new FocusEvent("focusin");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: null,
            writable: false
        });

        execute(mockEvent);

        expect($updateKeyLock).not.toHaveBeenCalled();
        expect($setEditingElement).not.toHaveBeenCalled();
    });

    it("should handle textarea element", () =>
    {
        const mockTextarea = document.createElement("textarea");
        const mockEvent = new FocusEvent("focusin");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockTextarea,
            writable: false
        });

        execute(mockEvent);

        expect($updateKeyLock).toHaveBeenCalledWith(true);
        expect($setEditingElement).toHaveBeenCalledWith(mockTextarea);
    });
});
