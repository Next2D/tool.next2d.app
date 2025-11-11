import { execute } from "./ConvertMovieClipModalInputKeyPressEventService";
import { $setCursor, $setEditingElement } from "@/global/GlobalUtil";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/global/GlobalUtil");

describe("ConvertMovieClipModalInputKeyPressEventService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should handle Enter key press", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Enter",
            bubbles: true,
            cancelable: true
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect($setEditingElement).toHaveBeenCalledWith(null);
        expect($setCursor).toHaveBeenCalledWith("auto");
    });

    it("should stop event propagation on Enter", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Enter",
            bubbles: true,
            cancelable: true
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });

    it("should reset editing element to null on Enter", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Enter"
        });

        execute(mockEvent);

        expect($setEditingElement).toHaveBeenCalledWith(null);
    });

    it("should reset cursor to auto on Enter", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Enter"
        });

        execute(mockEvent);

        expect($setCursor).toHaveBeenCalledWith("auto");
    });

    it("should ignore non-Enter keys", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "a",
            bubbles: true,
            cancelable: true
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect($setEditingElement).not.toHaveBeenCalled();
        expect($setCursor).not.toHaveBeenCalled();
    });

    it("should ignore Escape key", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Escape"
        });

        execute(mockEvent);

        expect($setEditingElement).not.toHaveBeenCalled();
        expect($setCursor).not.toHaveBeenCalled();
    });

    it("should ignore Tab key", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Tab"
        });

        execute(mockEvent);

        expect($setEditingElement).not.toHaveBeenCalled();
        expect($setCursor).not.toHaveBeenCalled();
    });

    it("should ignore Space key", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: " "
        });

        execute(mockEvent);

        expect($setEditingElement).not.toHaveBeenCalled();
        expect($setCursor).not.toHaveBeenCalled();
    });

    it("should handle Enter key with different casing", () =>
    {
        const mockEvent = new KeyboardEvent("keypress", {
            key: "Enter",
            bubbles: true,
            cancelable: true
        });

        execute(mockEvent);

        expect($setEditingElement).toHaveBeenCalledWith(null);
        expect($setCursor).toHaveBeenCalledWith("auto");
    });
});
