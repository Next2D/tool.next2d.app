import { execute } from "./ConvertMovieClipModalInitializeRegisterEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import {
    $CONVERT_CANCEL_BUTTON_ID,
    $CONVERT_MOVIE_CLIP_INPUT_ID,
    $CONVERT_MOVIE_CLIP_BUTTON_ID
} from "@/config/ConvertMovieClipConfig";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("ConvertMovieClipModalInitializeRegisterEventUseCase", () =>
{
    let mockModalElement: HTMLElement;
    let mockCancelButton: HTMLElement;
    let mockInputField: HTMLInputElement;
    let mockConvertButton: HTMLElement;

    beforeEach(() =>
    {
        mockModalElement = document.createElement("div");
        mockModalElement.id = $CONVERT_MOVIE_CLIP_MODAL_NAME;
        
        for (let i = 0; i < 3; i++) {
            const child = document.createElement("div");
            child.className = "convert-movie-clip-box-child";
            mockModalElement.appendChild(child);
        }
        
        mockCancelButton = document.createElement("button");
        mockCancelButton.id = $CONVERT_CANCEL_BUTTON_ID;
        
        mockInputField = document.createElement("input");
        mockInputField.id = $CONVERT_MOVIE_CLIP_INPUT_ID;
        
        mockConvertButton = document.createElement("button");
        mockConvertButton.id = $CONVERT_MOVIE_CLIP_BUTTON_ID;

        document.body.appendChild(mockModalElement);
        document.body.appendChild(mockCancelButton);
        document.body.appendChild(mockInputField);
        document.body.appendChild(mockConvertButton);
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should register all event listeners", () =>
    {
        const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalled();
        
        addEventListenerSpy.mockRestore();
    });

    it("should register pointerdown events for child elements", () =>
    {
        execute();

        const children = mockModalElement.querySelectorAll(".convert-movie-clip-box-child");
        expect(children.length).toBe(3);
    });

    it("should register cancel button event", () =>
    {
        const addEventListenerSpy = vi.spyOn(mockCancelButton, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            expect.any(Function)
        );
        
        addEventListenerSpy.mockRestore();
    });

    it("should register input field events", () =>
    {
        const addEventListenerSpy = vi.spyOn(mockInputField, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", expect.any(Function));
        
        addEventListenerSpy.mockRestore();
    });

    it("should register convert button event", () =>
    {
        const addEventListenerSpy = vi.spyOn(mockConvertButton, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            expect.any(Function)
        );
        
        addEventListenerSpy.mockRestore();
    });

    it("should handle missing modal element", () =>
    {
        document.body.removeChild(mockModalElement);

        expect(() => execute()).not.toThrow();
    });

    it("should handle missing cancel button", () =>
    {
        document.body.removeChild(mockCancelButton);

        expect(() => execute()).not.toThrow();
    });

    it("should handle missing input field", () =>
    {
        document.body.removeChild(mockInputField);

        expect(() => execute()).not.toThrow();
    });

    it("should handle missing convert button", () =>
    {
        document.body.removeChild(mockConvertButton);

        expect(() => execute()).not.toThrow();
    });

    it("should handle no child elements", () =>
    {
        const emptyModal = document.createElement("div");
        emptyModal.id = $CONVERT_MOVIE_CLIP_MODAL_NAME;
        document.body.removeChild(mockModalElement);
        document.body.appendChild(emptyModal);

        expect(() => execute()).not.toThrow();
    });
});
