import { execute } from "./ConvertMovieClipModalChildPointerDownEventUseCase";
import { $selectReference } from "../ConvertMovieClipModalUtil";
import { execute as convertMovieClipModalChildInactiveService } from "../service/ConvertMovieClipModalChildInactiveService";
import { execute as convertMovieClipModalUpdateButtonService } from "../service/ConvertMovieClipModalUpdateButtonService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../ConvertMovieClipModalUtil");
vi.mock("../service/ConvertMovieClipModalChildInactiveService");
vi.mock("../service/ConvertMovieClipModalUpdateButtonService");

describe("ConvertMovieClipModalChildPointerDownEventUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should handle child element click", () =>
    {
        const mockElement = document.createElement("div");
        mockElement.dataset.position = "top-left";
        
        const mockEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true
        });
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockElement,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(convertMovieClipModalChildInactiveService).toHaveBeenCalled();
        expect(mockElement.classList.contains("active")).toBe(true);
        expect($selectReference).toHaveBeenCalledWith("top-left");
        expect(convertMovieClipModalUpdateButtonService).toHaveBeenCalled();
    });

    it("should return early when element is null", () =>
    {
        const mockEvent = new PointerEvent("pointerdown");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: null,
            writable: false
        });

        execute(mockEvent);

        expect(convertMovieClipModalChildInactiveService).not.toHaveBeenCalled();
        expect($selectReference).not.toHaveBeenCalled();
        expect(convertMovieClipModalUpdateButtonService).not.toHaveBeenCalled();
    });

    it("should stop event propagation", () =>
    {
        const mockElement = document.createElement("div");
        mockElement.dataset.position = "middle-center";
        
        const mockEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true
        });
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockElement,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });

    it("should add active class to element", () =>
    {
        const mockElement = document.createElement("div");
        mockElement.dataset.position = "bottom-right";
        
        const mockEvent = new PointerEvent("pointerdown");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockElement,
            writable: false
        });

        expect(mockElement.classList.contains("active")).toBe(false);

        execute(mockEvent);

        expect(mockElement.classList.contains("active")).toBe(true);
    });

    it("should select correct reference position", () =>
    {
        const mockElement = document.createElement("div");
        mockElement.dataset.position = "top-center";
        
        const mockEvent = new PointerEvent("pointerdown");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockElement,
            writable: false
        });

        execute(mockEvent);

        expect($selectReference).toHaveBeenCalledWith("top-center");
    });

    it("should update button service", () =>
    {
        const mockElement = document.createElement("div");
        mockElement.dataset.position = "middle-left";
        
        const mockEvent = new PointerEvent("pointerdown");
        
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockElement,
            writable: false
        });

        execute(mockEvent);

        expect(convertMovieClipModalUpdateButtonService).toHaveBeenCalled();
    });
});
