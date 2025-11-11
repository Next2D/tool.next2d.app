import { execute } from "./ConvertMovieClipModalInputFocusOutEventUseCase";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalLibraryGetItemUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryGetItemUseCase";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";
import { $verifyValue } from "../ConvertMovieClipModalUtil";
import { execute as convertMovieClipModalUpdateButtonService } from "../service/ConvertMovieClipModalUpdateButtonService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/shortcut/ShortcutUtil");
vi.mock("@/core/application/CoreUtil");
vi.mock("@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryGetItemUseCase");
vi.mock("@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase");
vi.mock("../ConvertMovieClipModalUtil");
vi.mock("../service/ConvertMovieClipModalUpdateButtonService");

describe("ConvertMovieClipModalInputFocusOutEventUseCase", () =>
{
    let mockWorkspace: any;

    beforeEach(() =>
    {
        vi.clearAllMocks();
        
        mockWorkspace = {
            id: "workspace-1"
        };
        
        vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkspace);
    });

    it("should verify valid input when name is unique", async () =>
    {
        const mockInput = document.createElement("input");
        mockInput.value = "unique-name";
        
        const mockEvent = new FocusEvent("focusout", {
            bubbles: true,
            cancelable: true
        });
        
        Object.defineProperty(mockEvent, "target", {
            value: mockInput,
            writable: false
        });

        vi.mocked(externalLibraryGetItemUseCase).mockReturnValue(null);

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        await execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(externalLibraryGetItemUseCase).toHaveBeenCalledWith(mockWorkspace, "unique-name");
        expect($verifyValue).toHaveBeenCalledWith(true);
        expect($updateKeyLock).toHaveBeenCalledWith(false);
        expect(convertMovieClipModalUpdateButtonService).toHaveBeenCalled();
    });

    it("should show error when name is duplicate", async () =>
    {
        const mockInput = document.createElement("input");
        mockInput.value = "duplicate-name";
        
        const mockParent = document.createElement("div");
        Object.defineProperty(mockParent, "offsetLeft", { value: 100 });
        Object.defineProperty(mockParent, "offsetTop", { value: 200 });
        Object.defineProperty(mockInput, "offsetParent", {
            value: mockParent,
            writable: false
        });
        
        const mockEvent = new FocusEvent("focusout");
        Object.defineProperty(mockEvent, "target", {
            value: mockInput,
            writable: false
        });

        const mockItem = { id: "item-1" };
        vi.mocked(externalLibraryGetItemUseCase).mockReturnValue(mockItem);

        const focusSpy = vi.spyOn(mockInput, "focus").mockImplementation(() => {});

        await execute(mockEvent);

        expect(externalLibraryGetItemUseCase).toHaveBeenCalledWith(mockWorkspace, "duplicate-name");
        expect(detailModalCustomFadeInUseCase).toHaveBeenCalledWith(
            expect.any(String),
            65,
            145
        );
        expect($verifyValue).toHaveBeenCalledWith(false);
        expect(focusSpy).toHaveBeenCalled();
        expect(convertMovieClipModalUpdateButtonService).toHaveBeenCalled();
        
        focusSpy.mockRestore();
    });

    it("should return early when input element is null", async () =>
    {
        const mockEvent = new FocusEvent("focusout");
        Object.defineProperty(mockEvent, "target", {
            value: null,
            writable: false
        });

        await execute(mockEvent);

        expect(externalLibraryGetItemUseCase).not.toHaveBeenCalled();
        expect($verifyValue).not.toHaveBeenCalled();
        expect(convertMovieClipModalUpdateButtonService).not.toHaveBeenCalled();
    });

    it("should stop event propagation", async () =>
    {
        const mockInput = document.createElement("input");
        mockInput.value = "test-name";
        
        const mockEvent = new FocusEvent("focusout", {
            bubbles: true,
            cancelable: true
        });
        
        Object.defineProperty(mockEvent, "target", {
            value: mockInput,
            writable: false
        });

        vi.mocked(externalLibraryGetItemUseCase).mockReturnValue(null);

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        await execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });

    it("should return early when parent is null on duplicate", async () =>
    {
        const mockInput = document.createElement("input");
        mockInput.value = "duplicate-name";
        
        Object.defineProperty(mockInput, "offsetParent", {
            value: null,
            writable: false
        });
        
        const mockEvent = new FocusEvent("focusout");
        Object.defineProperty(mockEvent, "target", {
            value: mockInput,
            writable: false
        });

        const mockItem = { id: "item-1" };
        vi.mocked(externalLibraryGetItemUseCase).mockReturnValue(mockItem);

        await execute(mockEvent);

        expect(detailModalCustomFadeInUseCase).not.toHaveBeenCalled();
        expect($verifyValue).not.toHaveBeenCalled();
    });

    it("should disable key lock when input is valid", async () =>
    {
        const mockInput = document.createElement("input");
        mockInput.value = "valid-name";
        
        const mockEvent = new FocusEvent("focusout");
        Object.defineProperty(mockEvent, "target", {
            value: mockInput,
            writable: false
        });

        vi.mocked(externalLibraryGetItemUseCase).mockReturnValue(null);

        await execute(mockEvent);

        expect($updateKeyLock).toHaveBeenCalledWith(false);
    });

    it("should not disable key lock when input is invalid", async () =>
    {
        const mockInput = document.createElement("input");
        mockInput.value = "duplicate-name";
        
        const mockParent = document.createElement("div");
        Object.defineProperty(mockParent, "offsetLeft", { value: 100 });
        Object.defineProperty(mockParent, "offsetTop", { value: 200 });
        Object.defineProperty(mockInput, "offsetParent", {
            value: mockParent,
            writable: false
        });
        
        const mockEvent = new FocusEvent("focusout");
        Object.defineProperty(mockEvent, "target", {
            value: mockInput,
            writable: false
        });

        const mockItem = { id: "item-1" };
        vi.mocked(externalLibraryGetItemUseCase).mockReturnValue(mockItem);

        vi.spyOn(mockInput, "focus").mockImplementation(() => {});

        await execute(mockEvent);

        expect($updateKeyLock).not.toHaveBeenCalledWith(false);
    });
});
