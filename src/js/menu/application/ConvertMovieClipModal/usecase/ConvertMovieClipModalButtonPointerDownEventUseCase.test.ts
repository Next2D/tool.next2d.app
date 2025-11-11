import { execute } from "./ConvertMovieClipModalButtonPointerDownEventUseCase";
import { $CONVERT_MOVIE_CLIP_INPUT_ID } from "@/config/ConvertMovieClipConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as convertMovieClipModalHideUseCase } from "./ConvertMovieClipModalHideUseCase";
import { execute as externalLibraryAddNewMovieClipUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewMovieClipUseCase";
import { execute as convertMovieClipModalCalcPositionService } from "../service/ConvertMovieClipModalCalcPositionService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $selectReference } from "../ConvertMovieClipModalUtil";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/config/ConvertMovieClipConfig");
vi.mock("@/core/application/CoreUtil");
vi.mock("./ConvertMovieClipModalHideUseCase");
vi.mock("@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewMovieClipUseCase");
vi.mock("../service/ConvertMovieClipModalCalcPositionService");
vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService");
vi.mock("../ConvertMovieClipModalUtil");

describe("ConvertMovieClipModalButtonPointerDownEventUseCase", () =>
{
    let mockInput: HTMLInputElement;
    let mockWorkspace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockEvent: PointerEvent;

    beforeEach(() =>
    {
        vi.clearAllMocks();

        mockInput = document.createElement("input");
        mockInput.id = $CONVERT_MOVIE_CLIP_INPUT_ID;
        mockInput.value = "test-movieclip";
        document.body.appendChild(mockInput);

        mockCharacter = {
            x: 100,
            y: 200,
            startFrame: 1,
            endFrame: 10,
            libraryId: "char-1"
        };

        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        mockMovieClip = {
            selectedDepths: new Map([[1, [0]]]),
            currentFrame: 1,
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        mockWorkspace = {
            scene: mockMovieClip,
            id: "workspace-1"
        };

        vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkspace);
        vi.mocked($selectReference);

        mockEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true
        });
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should return early when no display object selected", async () =>
    {
        mockMovieClip.selectedDepths = new Map();

        await execute(mockEvent);

        expect(externalLibraryAddNewMovieClipUseCase).not.toHaveBeenCalled();
        expect(convertMovieClipModalHideUseCase).not.toHaveBeenCalled();
    });

    it("should return early when multiple display objects selected", async () =>
    {
        mockMovieClip.selectedDepths = new Map([
            [1, [0]],
            [2, [1]]
        ]);

        await execute(mockEvent);

        expect(externalLibraryAddNewMovieClipUseCase).not.toHaveBeenCalled();
        expect(convertMovieClipModalHideUseCase).not.toHaveBeenCalled();
    });

    it("should return early when input element not found", async () =>
    {
        document.body.removeChild(mockInput);

        await execute(mockEvent);

        expect(externalLibraryAddNewMovieClipUseCase).not.toHaveBeenCalled();
        expect(convertMovieClipModalHideUseCase).not.toHaveBeenCalled();
    });

    it("should return early when input value is empty", async () =>
    {
        mockInput.value = "";

        await execute(mockEvent);

        expect(externalLibraryAddNewMovieClipUseCase).not.toHaveBeenCalled();
        expect(convertMovieClipModalHideUseCase).not.toHaveBeenCalled();
    });

    it("should return early when layer not found", async () =>
    {
        mockMovieClip.getLayer.mockReturnValue(null);

        await execute(mockEvent);

        expect(externalLibraryAddNewMovieClipUseCase).not.toHaveBeenCalled();
        expect(convertMovieClipModalHideUseCase).not.toHaveBeenCalled();
    });

    it("should return early when bounds not calculated", async () =>
    {
        vi.mocked(screenAreaCalcSelectedBoundsService).mockReturnValue(null);

        await execute(mockEvent);

        expect(externalLibraryAddNewMovieClipUseCase).not.toHaveBeenCalled();
        expect(convertMovieClipModalHideUseCase).not.toHaveBeenCalled();
    });

    it("should call getCurrentWorkSpace", async () =>
    {
        await execute(mockEvent);

        expect($getCurrentWorkSpace).toHaveBeenCalled();
    });
});
