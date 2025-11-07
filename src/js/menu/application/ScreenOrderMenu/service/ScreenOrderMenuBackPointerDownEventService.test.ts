import { execute } from "./ScreenOrderMenuBackPointerDownEventService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/core/application/CoreUtil");
vi.mock("../../MenuUtil");
vi.mock("@/external/core/domain/model/ExternalCharacter");

describe("ScreenOrderMenuBackPointerDownEventService", () =>
{
    let mockEvent: PointerEvent;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockExternalCharacter: any;

    beforeEach(() =>
    {
        mockEvent = {
            stopPropagation: vi.fn()
        } as unknown as PointerEvent;

        mockCharacter = {
            depth: 5
        };

        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true),
            selectedDepths: new Map([[1, [0]]]),
            currentFrame: 0,
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        mockWorkSpace = {
            scene: mockMovieClip
        };

        mockExternalCharacter = {
            changeDepth: vi.fn().mockResolvedValue(undefined)
        };

        vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkSpace);
        vi.mocked($allHideMenu).mockReturnValue(undefined);
        vi.mocked(ExternalCharacter).mockImplementation(function() { return mockExternalCharacter; } as any);
    });

    afterEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should execute successfully and move character to backmost (depth 0)", async () =>
    {
        await execute(mockEvent);

        expect($allHideMenu).toHaveBeenCalled();
        expect($getCurrentWorkSpace).toHaveBeenCalled();
        expect(mockMovieClip.isSingleSelectedOfDisplayObject).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);
        expect(mockLayer.getCharacter).toHaveBeenCalledWith(0, 0);
        expect(ExternalCharacter).toHaveBeenCalledWith(
            mockWorkSpace,
            mockMovieClip,
            mockLayer,
            mockCharacter
        );
        expect(mockExternalCharacter.changeDepth).toHaveBeenCalledWith(0);
    });

    it("should return early if no single display object is selected", async () =>
    {
        mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);

        await execute(mockEvent);

        expect($allHideMenu).toHaveBeenCalled();
        expect(mockMovieClip.isSingleSelectedOfDisplayObject).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        expect(mockExternalCharacter.changeDepth).not.toHaveBeenCalled();
    });

    it("should return early if layer is not found", async () =>
    {
        mockMovieClip.getLayer.mockReturnValue(null);

        await execute(mockEvent);

        expect($allHideMenu).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockMovieClip.getLayer).toHaveBeenCalled();
        expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        expect(mockExternalCharacter.changeDepth).not.toHaveBeenCalled();
    });

    it("should return early if character is not found", async () =>
    {
        mockLayer.getCharacter.mockReturnValue(null);

        await execute(mockEvent);

        expect($allHideMenu).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockLayer.getCharacter).toHaveBeenCalled();
        expect(ExternalCharacter).not.toHaveBeenCalled();
        expect(mockExternalCharacter.changeDepth).not.toHaveBeenCalled();
    });

    it("should work with KeyboardEvent", async () =>
    {
        const keyEvent = {
            stopPropagation: vi.fn()
        } as unknown as KeyboardEvent;

        await execute(keyEvent);

        expect(keyEvent.stopPropagation).toHaveBeenCalled();
        expect(mockExternalCharacter.changeDepth).toHaveBeenCalledWith(0);
    });
});
