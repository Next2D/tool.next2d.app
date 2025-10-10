import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

const {
    mockScreenAreaGetElementFromLayerIdAndDepthService,
    mockScreenAreaCalcSelectedBoundsService,
    mockTransformSettingUpdateXElementService,
    mockTransformSettingUpdateYElementService,
    mockTransformSettingUpdateWidthElementService,
    mockTransformSettingUpdateHeightElementService,
    mockTransformSettingUpdateScaleYElementService,
    mockTransformSettingUpdateScaleXElementService,
    mockTransformSettingUpdateRotationElementService,
    mockScreenStandardPointDeployElementUseCase,
    mockScreenDisplayObjectUpdateMaskInCanvasStyleService,
    mock$getCurrentWorkSpace,
    mock$getConcatenatedMatrix,
    mock$getScreenOffsetLeft,
    mock$getScreenOffsetTop,
    mock$createTransformElementStyle
} = vi.hoisted(() => {
    return {
        mockScreenAreaGetElementFromLayerIdAndDepthService: vi.fn(),
        mockScreenAreaCalcSelectedBoundsService: vi.fn(),
        mockTransformSettingUpdateXElementService: vi.fn(),
        mockTransformSettingUpdateYElementService: vi.fn(),
        mockTransformSettingUpdateWidthElementService: vi.fn(),
        mockTransformSettingUpdateHeightElementService: vi.fn(),
        mockTransformSettingUpdateScaleYElementService: vi.fn(),
        mockTransformSettingUpdateScaleXElementService: vi.fn(),
        mockTransformSettingUpdateRotationElementService: vi.fn(),
        mockScreenStandardPointDeployElementUseCase: vi.fn(),
        mockScreenDisplayObjectUpdateMaskInCanvasStyleService: vi.fn(),
        mock$getCurrentWorkSpace: vi.fn(),
        mock$getConcatenatedMatrix: vi.fn(),
        mock$getScreenOffsetLeft: vi.fn(),
        mock$getScreenOffsetTop: vi.fn(),
        mock$createTransformElementStyle: vi.fn()
    };
});

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: mockScreenAreaGetElementFromLayerIdAndDepthService
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({
    execute: mockScreenAreaCalcSelectedBoundsService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService", () => ({
    execute: mockTransformSettingUpdateXElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService", () => ({
    execute: mockTransformSettingUpdateYElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService", () => ({
    execute: mockTransformSettingUpdateWidthElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateHeightElementService", () => ({
    execute: mockTransformSettingUpdateHeightElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateScaleYElementService", () => ({
    execute: mockTransformSettingUpdateScaleYElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService", () => ({
    execute: mockTransformSettingUpdateScaleXElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateRotationElementService", () => ({
    execute: mockTransformSettingUpdateRotationElementService
}));

vi.mock("@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase", () => ({
    execute: mockScreenStandardPointDeployElementUseCase
}));

vi.mock("@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService", () => ({
    execute: mockScreenDisplayObjectUpdateMaskInCanvasStyleService
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/controller/application/TransformSetting/TransformSettingUtil", () => ({
    $getConcatenatedMatrix: mock$getConcatenatedMatrix,
    $createTransformElementStyle: mock$createTransformElementStyle
}));

vi.mock("@/global/GlobalUtil", () => ({
    $getScreenOffsetLeft: mock$getScreenOffsetLeft,
    $getScreenOffsetTop: mock$getScreenOffsetTop
}));

vi.mock("@/controller/domain/model/TransformSetting", () => ({
    transformSetting: {
        scaleX: 1,
        scaleY: 1
    }
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        x: 0,
        y: 0
    }
}));

import { execute } from "./TransformSettingUpdateScaleYToElementValuesUseCase";

describe("TransformSettingUpdateScaleYToElementValuesUseCase", () => {
    let mockElement: HTMLElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockNode: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("div");
        mockElement.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(mockElement);

        mockNode = document.createElement("div");
        mockNode.style.width = "100px";
        mockNode.style.height = "100px";
        mockNode.style.left = "0px";
        mockNode.style.top = "0px";

        const container = document.createElement("div");
        container.className = "canvas-container";
        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        mockNode.appendChild(container);

        mockCharacter = {
            libraryId: "lib1",
            matrix: new Float32Array([1, 0, 0, 1, 0, 0]),
            rotation: 0,
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            scaleX: 1,
            scaleY: 1,
            getBounds: vi.fn().mockReturnValue({
                xMin: 0,
                xMax: 200,
                yMin: 0,
                yMax: 200
            }),
            getRawBounds: vi.fn().mockReturnValue({
                xMin: 0,
                xMax: 100,
                yMin: 0,
                yMax: 100
            })
        };

        mockLayer = {
            id: "layer1",
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]]),
            currentFrame: 1,
            getLayer: vi.fn().mockReturnValue(mockLayer),
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true)
        };

        mockWorkSpace = {
            scene: mockMovieClip,
            getLibrary: vi.fn().mockReturnValue({ id: "lib1" })
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([1, 0, 0, 1, 0, 0]));
        mock$getScreenOffsetLeft.mockReturnValue(0);
        mock$getScreenOffsetTop.mockReturnValue(0);
        mock$createTransformElementStyle.mockReturnValue("matrix(1, 0, 0, 1, 0, 0)");
        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
        mockScreenDisplayObjectUpdateMaskInCanvasStyleService.mockResolvedValue(undefined);
    });

    afterEach(() => {
        if (mockElement.parentNode) {
            document.body.removeChild(mockElement);
        }
        vi.resetAllMocks();
    });

    describe("早期リターン条件", () => {
        it("scale_y が 1 の場合、何も処理しない", async () => {
            await execute(1);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("選択中のElementがない場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("スクリーンエリア要素が存在しない場合、何も処理しない", async () => {
            document.body.removeChild(mockElement);

            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });
    });

    describe("単一オブジェクト選択時の処理", () => {
        it("scale_y > 1 の場合、正しく変形処理が実行される", async () => {
            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(0);
            expect(mockScreenStandardPointDeployElementUseCase).toHaveBeenCalled();
        });

        it("レイヤーが見つからない場合はスキップ", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("Nodeが見つからない場合はスキップ", async () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            await execute(1.5);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("キャラクターが見つからない場合はスキップ", async () => {
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(1.5);

            expect(mockWorkSpace.getLibrary).not.toHaveBeenCalled();
        });

        it("インスタンスが見つからない場合はスキップ", async () => {
            mockWorkSpace.getLibrary.mockReturnValue(null);

            await execute(1.5);

            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).not.toHaveBeenCalled();
        });
    });

    describe("複数オブジェクト選択時の処理", () => {
        beforeEach(() => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);

            const mockBounds = {
                xMin: 0,
                xMax: 400,
                yMin: 0,
                yMax: 300
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        });

        it("複数選択時は選択範囲のBoundsが使用される", async () => {
            await execute(1.5);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(0);
        });

        it("複数選択時は基準点の再配置が実行されない", async () => {
            await execute(1.5);

            expect(mockScreenStandardPointDeployElementUseCase).not.toHaveBeenCalled();
        });
    });

    describe("scaleYの累積更新", () => {
        it("transformSetting.scaleYが正しく累積更新される", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.scaleY = 1.0;

            await execute(1.5);

            expect(transformSetting.scaleY).toBe(1.5);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(150);
        });
    });
});
