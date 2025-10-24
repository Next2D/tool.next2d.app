import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const {
    mock$getCurrentWorkSpace,
    mockExternalCharacter
} = vi.hoisted(() => {
    return {
        mock$getCurrentWorkSpace: vi.fn(),
        mockExternalCharacter: vi.fn()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: mockExternalCharacter
}));

vi.mock("@/controller/domain/model/TransformSetting", () => ({
    transformSetting: {
        matrixs: []
    }
}));

import { execute } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";

describe("TransformSettingUpdateScaleToRedrawCanvasUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockExternalCharacterInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockExternalCharacterInstance = {
            setScaleX: vi.fn().mockResolvedValue(undefined),
            setScaleY: vi.fn().mockResolvedValue(undefined),
            setX: vi.fn().mockResolvedValue(undefined),
            setY: vi.fn().mockResolvedValue(undefined)
        };

        mockExternalCharacter.mockImplementation(function() { return mockExternalCharacterInstance; });

        mockCharacter = {
            scaleX: 1.5,
            scaleY: 2.0,
            x: 100,
            y: 150,
            matrix: new Float32Array([1, 0, 0, 1, 0, 0])
        };

        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]]),
            currentFrame: 1,
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        mockWorkSpace = {
            scene: mockMovieClip
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("早期リターン条件", () => {
        it("選択中のElementがない場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute();

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });
    });

    describe("スケールの再描画処理", () => {
        it("スケールが正しく適用される", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.matrixs = [new Float32Array([1, 0, 0, 1, 50, 60])];

            await execute();

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockCharacter.matrix).toEqual(new Float32Array([1, 0, 0, 1, 50, 60]));
            expect(mockExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
            expect(mockExternalCharacterInstance.setScaleX).toHaveBeenCalledWith(1.5);
            expect(mockExternalCharacterInstance.setX).toHaveBeenCalledWith(100);
            expect(mockExternalCharacterInstance.setScaleY).toHaveBeenCalledWith(2.0);
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(150);
        });

        it("複数のキャラクターが処理される", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);
            transformSetting.matrixs = [
                new Float32Array([1, 0, 0, 1, 10, 20]),
                new Float32Array([1, 0, 0, 1, 30, 40])
            ];

            await execute();

            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacter).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterInstance.setScaleX).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterInstance.setScaleY).toHaveBeenCalledTimes(2);
        });

        it("レイヤーが見つからない場合はスキップ", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.matrixs = [new Float32Array([1, 0, 0, 1, 0, 0])];
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute();

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("キャラクターが見つからない場合はスキップ", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.matrixs = [new Float32Array([1, 0, 0, 1, 0, 0])];
            mockLayer.getCharacter.mockReturnValue(null);

            await execute();

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("beforeMatrixがない場合はスキップ", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.matrixs = [];

            await execute();

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("複数レイヤーの処理", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);
            const mockLayer2 = {
                getCharacter: vi.fn().mockReturnValue(mockCharacter)
            };
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer : mockLayer2;
            });
            transformSetting.matrixs = [
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 0, 0, 1, 10, 10])
            ];

            await execute();

            expect(mockExternalCharacter).toHaveBeenCalledTimes(2);
        });

        it("異なるスケール値が適用される", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.matrixs = [new Float32Array([1, 0, 0, 1, 0, 0])];
            mockCharacter.scaleX = 0.5;
            mockCharacter.scaleY = 3.0;

            await execute();

            expect(mockExternalCharacterInstance.setScaleX).toHaveBeenCalledWith(0.5);
            expect(mockExternalCharacterInstance.setScaleY).toHaveBeenCalledWith(3.0);
        });
    });
});
