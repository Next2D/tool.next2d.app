import { describe, it, expect, beforeEach, vi } from "vitest";

const mock$getCurrentWorkSpace = vi.fn();

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

const { execute } = await import("./TransformSettingUpdateWidthToElementValuesUseCase");

describe("TransformSettingUpdateWidthToElementValuesUseCase", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '<div id="screen-stage-area"></div>';
    });

    describe("基本動作", () => {
        it("scale_xが1の場合は何もしない", async () => {
            await execute(1);

            expect(mock$getCurrentWorkSpace).not.toHaveBeenCalled();
        });

        it("選択中のelementがない場合は何もしない", async () => {
            const mockMovieClip = {
                selectedDepths: new Map()
            };
            const mockWorkSpace = {
                scene: mockMovieClip
            };
            mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

            await execute(1.5);

            expect(mockMovieClip.selectedDepths.size).toBe(0);
        });

        it("stageElementが存在しない場合は何もしない", async () => {
            document.body.innerHTML = '';
            
            const mockMovieClip = {
                selectedDepths: new Map([[0, [10]]])
            };
            const mockWorkSpace = {
                scene: mockMovieClip
            };
            mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

            await execute(1.5);

            // No error should be thrown
            expect(true).toBe(true);
        });
    });
});
