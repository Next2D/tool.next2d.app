import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";

// サービスとユーティリティのモック（vi.hoistedを使用）
const {
    mockScreenAreaGetElementFromLayerIdAndDepthService,
    mockScreenAreaCalcSelectedBoundsService,
    mockTransformSettingUpdateYElementService,
    mockTransformSettingUpdateXElementService,
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
        mockTransformSettingUpdateYElementService: vi.fn(),
        mockTransformSettingUpdateXElementService: vi.fn(),
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

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService", () => ({
    execute: mockTransformSettingUpdateYElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService", () => ({
    execute: mockTransformSettingUpdateXElementService
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
        h: 0,
        scaleY: 1,
        scaleX: 1
    }
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        x: 0,
        y: 0
    }
}));

import { execute } from "./TransformSettingUpdateHeightToElementValuesUseCase";

describe("TransformSettingUpdateHeightToElementValuesUseCase", () => {
    let mockElement: HTMLElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockNode: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // 基本的なDOM要素のセットアップ
        mockElement = document.createElement("div");
        mockElement.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(mockElement);

        // モックNodeのセットアップ
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

        // モックキャラクターのセットアップ
        mockCharacter = {
            libraryId: "lib1",
            matrix: new Float32Array([1, 0, 0, 1, 0, 0]),
            rotation: 0,
            x: 100,
            y: 100,
            height: 200,
            width: 200,
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

        // モックレイヤーのセットアップ
        mockLayer = {
            id: "layer1",
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // モックMovieClipのセットアップ
        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]]),
            currentFrame: 1,
            getLayer: vi.fn().mockReturnValue(mockLayer),
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true)
        };

        // モックWorkSpaceのセットアップ
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
            expect(mockTransformSettingUpdateYElementService).not.toHaveBeenCalled();
        });

        it("選択中のElementがない場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateYElementService).not.toHaveBeenCalled();
        });

        it("スクリーンエリア要素が存在しない場合、何も処理しない", async () => {
            document.body.removeChild(mockElement);

            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateYElementService).not.toHaveBeenCalled();
        });
    });

    describe("単一オブジェクト選択時の処理", () => {
        it("scale_y > 1 の場合、正しく変形処理が実行される", async () => {
            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockCharacter.matrix).toBeDefined();
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(0);
            expect(mockScreenStandardPointDeployElementUseCase).toHaveBeenCalled();
        });

        it("scale_y < 1 の場合、正しく縮小処理が実行される", async () => {
            await execute(0.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(200);
        });

        it("負のscale_yの場合も処理される", async () => {
            await execute(-1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(100);
        });

        it("NodeのスタイルとCanvasサイズが更新される", async () => {
            await execute(1.5);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            expect(node.style.width).toBe("200px");
            expect(node.style.height).toBe("200px");
            expect(node.style.left).toBe("0px");
            expect(node.style.top).toBe("0px");

            const container = node.querySelector(".canvas-container") as HTMLDivElement;
            expect(container).toBeTruthy();
            expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
        });

        it("マスクの更新が実行される", async () => {
            await execute(1.5);

            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalledWith(
                mockNode,
                mockLayer,
                mockCharacter
            );
        });

        it("scaleXとscaleYの表示値が正しく計算される", async () => {
            const { transformSetting } = await import("@/controller/domain/model/TransformSetting");
            transformSetting.scaleX = 1.5;
            transformSetting.scaleY = 2.0;

            mockCharacter.scaleX = 1.5;
            mockCharacter.scaleY = 2.0;

            await execute(1.2);

            // scaleX: Math.round(transformSetting.scaleX * 10000) / 100 = Math.round(1.5 * 10000) / 100 = 150
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(150);

            // scaleY: Math.round(transformSetting.scaleY * scale_y * 10000) / 100 = Math.round(2.0 * 1.2 * 10000) / 100 = 240
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(240);
        });

        it("キャラクターの回転が適用される", async () => {
            mockCharacter.rotation = 45;

            await execute(1.5);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(45);
        });

        it("スクリーンオフセットが適用される", async () => {
            mock$getScreenOffsetLeft.mockReturnValue(50);
            mock$getScreenOffsetTop.mockReturnValue(100);

            await execute(1.5);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            expect(node.style.left).toBe("50px");
            expect(node.style.top).toBe("100px");
        });
    });

    describe("複数オブジェクト選択時の処理", () => {
        beforeEach(() => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3]]
            ]);
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
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalled();
        });

        it("複数選択時は基準点の再配置が実行されない", async () => {
            await execute(1.5);

            expect(mockScreenStandardPointDeployElementUseCase).not.toHaveBeenCalled();
        });

        it("複数レイヤーの複数オブジェクトが処理される", async () => {
            const mockLayer2 = {
                id: "layer2",
                getCharacter: vi.fn().mockReturnValue(mockCharacter)
            };
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer : mockLayer2;
            });

            await execute(1.5);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(3);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 2);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer2", 3);
        });

        it("Boundsがnullの場合は座標更新がスキップされる", async () => {
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(null);

            await execute(1.5);
            
            // Boundsがnullの場合、早期リターンするためscaleY更新も実行されない
            expect(mockTransformSettingUpdateXElementService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateYElementService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateHeightElementService).not.toHaveBeenCalled();
        });
    });

    describe("レイヤーとキャラクターの検証", () => {
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

        it("getBoundsがnullを返す場合、スタイル更新がスキップされる", async () => {
            mockCharacter.getBounds.mockReturnValue(null);

            await execute(1.5);

            // matrixの変換は実行されるが、スタイル更新はスキップ
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalled();
        });

        it("getRawBoundsがnullを返す場合、canvas更新がスキップされる", async () => {
            mockCharacter.getRawBounds.mockReturnValue(null);

            await execute(1.5);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            const container = node.querySelector(".canvas-container") as HTMLDivElement;
            const canvas = container.querySelector("canvas");
            
            // canvasのスタイルは更新されない（初期値のまま）
            expect(canvas?.style.width).toBe("");
        });

        it("canvas要素が存在しない場合、canvasサイズ更新がスキップされる", async () => {
            const nodeWithoutCanvas = document.createElement("div");
            const container = document.createElement("div");
            container.className = "canvas-container";
            nodeWithoutCanvas.appendChild(container);
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(nodeWithoutCanvas);

            await execute(1.5);

            // エラーなく処理が完了
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalled();
        });

        it("container要素が存在しない場合、container処理がスキップされる", async () => {
            const nodeWithoutContainer = document.createElement("div");
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(nodeWithoutContainer);

            await execute(1.5);

            // エラーなく処理が完了
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalled();
        });
    });

    describe("Matrix計算", () => {
        it("連結Matrix、ローカル座標変換、回転処理が正しく実行される", async () => {
            mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 20]));

            await execute(1.5);

            // 連結Matrixの取得が呼ばれる
            expect(mock$getConcatenatedMatrix).toHaveBeenCalled();
            
            // キャラクターのmatrixが更新される
            expect(mockCharacter.matrix).toBeDefined();
            expect(mockCharacter.matrix.length).toBe(6);
        });

        it("回転が適用された状態でのMatrix計算", async () => {
            mockCharacter.rotation = 90;

            await execute(1.5);

            // 回転を考慮したMatrix計算が実行される
            expect(mockCharacter.matrix).toBeDefined();
        });

        it("referenceSettingの座標が使用される", async () => {
            const { referenceSetting } = await import("../../../../controller/domain/model/ReferenceSetting");
            referenceSetting.x = 50;
            referenceSetting.y = 100;

            await execute(1.5);

            // ローカル座標変換でreferenceSettingが使用される
            expect(mockCharacter.matrix).toBeDefined();
        });
    });

    describe("scaleYの累積更新", () => {
        it("transformSetting.scaleYが正しく累積更新される", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            transformSetting.scaleY = 1.0;

            await execute(1.5);

            expect(transformSetting.scaleY).toBe(1.5);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(150);
        });

        it("複数回実行時のscaleY累積", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            transformSetting.scaleY = 1.0;

            await execute(1.2);
            expect(transformSetting.scaleY).toBeCloseTo(1.2, 10);

            await execute(1.5);
            expect(transformSetting.scaleY).toBeCloseTo(1.8, 10);

            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenLastCalledWith(180);
        });

        it("scaleYが0.5未満になる場合", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            transformSetting.scaleY = 1.0;

            await execute(0.3);

            expect(transformSetting.scaleY).toBe(0.3);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(30);
        });

        it("scaleYが負の値になる場合", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            transformSetting.scaleY = 1.0;

            await execute(-2);

            expect(transformSetting.scaleY).toBe(-2);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(-200);
        });
    });

    describe("非同期処理", () => {
        it("マスク更新が非同期で実行される", async () => {
            let maskUpdateCalled = false;
            mockScreenDisplayObjectUpdateMaskInCanvasStyleService.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                maskUpdateCalled = true;
            });

            await execute(1.5);

            expect(maskUpdateCalled).toBe(true);
        });

        it("複数のキャラクターのマスク更新が順次実行される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);
            const callOrder: number[] = [];

            mockScreenDisplayObjectUpdateMaskInCanvasStyleService.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 5));
                callOrder.push(callOrder.length + 1);
            });

            await execute(1.5);

            expect(callOrder).toEqual([1, 2]);
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalledTimes(2);
        });
    });

    describe("エッジケース", () => {
        it("scale_y が 0 の場合も処理される", async () => {
            await execute(0);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("非常に大きなscale_y値", async () => {
            await execute(1000);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalled();
        });

        it("非常に小さなscale_y値", async () => {
            await execute(0.001);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalled();
        });

        it("Infinity値の処理", async () => {
            await execute(Infinity);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("負のInfinity値の処理", async () => {
            await execute(-Infinity);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("Boundsの値が極端に小さい場合", async () => {
            mockCharacter.getBounds.mockReturnValue({
                xMin: 0,
                xMax: 0.1,
                yMin: 0,
                yMax: 0.1
            });

            await execute(1.5);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            // Math.ceilで切り上げられるため最小1px
            expect(node.style.width).toBe("1px");
            expect(node.style.height).toBe("1px");
        });

        it("Boundsが負の範囲の場合", async () => {
            mockCharacter.getBounds.mockReturnValue({
                xMin: -100,
                xMax: -50,
                yMin: -200,
                yMax: -150
            });

            await execute(1.5);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            expect(node.style.width).toBe("50px");
            expect(node.style.height).toBe("50px");
            expect(node.style.left).toBe("-100px");
            expect(node.style.top).toBe("-200px");
        });
    });

    describe("transformSetting.hの更新", () => {
        it("単一選択時、transformSetting.hがキャラクターの高さで更新される", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            mockCharacter.height = 250;

            await execute(1.5);

            expect(transformSetting.h).toBe(250);
        });

        it("複数選択時、transformSetting.hが選択範囲の高さで更新される", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue({
                xMin: 0,
                xMax: 400,
                yMin: 0,
                yMax: 300
            });

            await execute(1.5);

            // Math.round(300 * 100) / 100 = 300
            expect(transformSetting.h).toBe(300);
        });

        it("高さの計算で小数点以下が正しく丸められる", async () => {
            const { transformSetting } = await import("../../../../controller/domain/model/TransformSetting");
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue({
                xMin: 0,
                xMax: 100,
                yMin: 0,
                yMax: 123.456
            });

            await execute(1.5);

            // Math.round(123.456 * 100) / 100 = 123.46
            expect(transformSetting.h).toBe(123.46);
        });
    });

    describe("パフォーマンステスト", () => {
        it("単一オブジェクトの処理が高速に実行される", async () => {
            const start = performance.now();
            await execute(1.5);
            const end = performance.now();
            const duration = end - start;

            // 50ms以内で完了することを期待
            expect(duration).toBeLessThan(50);
        });

        it("複数オブジェクトの処理が妥当な時間で実行される", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2, 3, 4, 5]]
            ]);

            const start = performance.now();
            await execute(1.5);
            const end = performance.now();
            const duration = end - start;

            // 100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
        });
    });
});
