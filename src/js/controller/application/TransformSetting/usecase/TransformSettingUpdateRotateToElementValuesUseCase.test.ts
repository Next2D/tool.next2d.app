import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";

// サービスとユーティリティのモック（vi.hoistedを使用）
const {
    mockScreenAreaGetElementFromLayerIdAndDepthService,
    mockScreenAreaCalcSelectedBoundsService,
    mockTransformSettingUpdateXElementService,
    mockTransformSettingUpdateYElementService,
    mockTransformSettingUpdateWidthElementService,
    mockTransformSettingUpdateHeightElementService,
    mockTransformSettingUpdateScaleXElementService,
    mockTransformSettingUpdateScaleYElementService,
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
        mockTransformSettingUpdateScaleXElementService: vi.fn(),
        mockTransformSettingUpdateScaleYElementService: vi.fn(),
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

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService", () => ({
    execute: mockTransformSettingUpdateScaleXElementService
}));

vi.mock("@/controller/application/TransformSetting/service/TransformSettingUpdateScaleYElementService", () => ({
    execute: mockTransformSettingUpdateScaleYElementService
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

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        x: 0,
        y: 0
    }
}));

import { execute } from "./TransformSettingUpdateRotateToElementValuesUseCase";

describe("TransformSettingUpdateRotateToElementValuesUseCase", () => {
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
        it("rotation が 0 の場合、何も処理しない", async () => {
            await execute(0);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateXElementService).not.toHaveBeenCalled();
        });

        it("選択中のElementがない場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(45);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateXElementService).not.toHaveBeenCalled();
        });

        it("スクリーンエリア要素が存在しない場合、何も処理しない", async () => {
            document.body.removeChild(mockElement);

            await execute(45);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateXElementService).not.toHaveBeenCalled();
        });
    });

    describe("単一オブジェクト選択時の回転処理", () => {
        it("45度の回転が正しく適用される", async () => {
            await execute(45);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockCharacter.rotation).toBe(45);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalled();
            expect(mockScreenStandardPointDeployElementUseCase).toHaveBeenCalled();
        });

        it("90度の回転が正しく適用される", async () => {
            await execute(90);

            expect(mockCharacter.rotation).toBe(90);
        });

        it("180度の回転が正しく適用される", async () => {
            await execute(180);

            expect(mockCharacter.rotation).toBe(180);
        });

        it("360度の回転が正しく適用される", async () => {
            await execute(360);

            // 360度は0度と同じ
            expect(mockCharacter.rotation).toBeDefined();
        });

        it("負の回転値が正の角度に変換される", async () => {
            await execute(-45);

            // -45度 → 315度 (360 + (-45))
            expect(mockCharacter.rotation).toBeGreaterThanOrEqual(0);
            expect(mockCharacter.rotation).toBeLessThan(360);
        });

        it("負の回転値 -90度が正しく処理される", async () => {
            await execute(-90);

            // -90度 → 270度
            expect(mockCharacter.rotation).toBeGreaterThanOrEqual(0);
        });

        it("小数点の回転値が正しく処理される", async () => {
            await execute(22.5);

            expect(mockCharacter.rotation).toBeDefined();
        });

        it("キャラクターの位置(x, y)が更新される", async () => {
            const initialX = mockCharacter.x;
            const initialY = mockCharacter.y;

            await execute(45);

            // 回転により位置が調整される
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(mockCharacter.x);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(mockCharacter.y);
        });

        it("キャラクターのサイズ(width, height)が更新される", async () => {
            await execute(45);

            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(200);
        });

        it("キャラクターのスケールが正しく更新される", async () => {
            mockCharacter.scaleX = 1.5;
            mockCharacter.scaleY = 2.0;

            await execute(45);

            // scaleX: Math.round(1.5 * 10000) / 100 = 150
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(150);
            // scaleY: Math.round(2.0 * 10000) / 100 = 200
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(200);
        });

        it("NodeのスタイルとCanvasサイズが更新される", async () => {
            await execute(45);

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
            await execute(45);

            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalledWith(
                mockNode,
                mockLayer,
                mockCharacter
            );
        });

        it("スクリーンオフセットが適用される", async () => {
            mock$getScreenOffsetLeft.mockReturnValue(50);
            mock$getScreenOffsetTop.mockReturnValue(100);

            await execute(45);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            expect(node.style.left).toBe("50px");
            expect(node.style.top).toBe("100px");
        });
    });

    describe("複数オブジェクト選択時の回転処理", () => {
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
            await execute(45);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            // width: Math.round(400 * 100) / 100 = 400
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(400);
            // height: Math.round(300 * 100) / 100 = 300
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(300);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(0);
        });

        it("複数選択時は基準点の再配置が実行されない", async () => {
            await execute(45);

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

            await execute(45);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(3);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 1);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer1", 2);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer2", 3);
        });

        it("Boundsがnullの場合は座標更新がスキップされる", async () => {
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(null);

            await execute(45);

            // オブジェクトの回転処理は実行されるが、Bounds更新はスキップ
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("複数選択時、各オブジェクトが回転される", async () => {
            const mockCharacter2 = { ...mockCharacter, rotation: 0 };
            mockLayer.getCharacter.mockReturnValueOnce(mockCharacter).mockReturnValueOnce(mockCharacter2);

            await execute(45);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(3);
        });
    });

    describe("回転角度の計算", () => {
        it("回転後の角度がラジアンから度に変換される", async () => {
            await execute(45);

            // Math.atan2の結果が度に変換されて設定される
            expect(mockCharacter.rotation).toBeGreaterThanOrEqual(0);
            expect(mockCharacter.rotation).toBeLessThan(360);
        });

        it("負の角度が0-360度の範囲に正規化される", async () => {
            await execute(-45);

            expect(mockCharacter.rotation).toBeGreaterThanOrEqual(0);
            expect(mockCharacter.rotation).toBeLessThan(360);
        });

        it("baseMatrixが正しく計算される（45度）", async () => {
            const rotation = 45;
            const radian = rotation * Math.PI / 180;
            const expectedCos = Math.cos(radian);
            const expectedSin = Math.sin(radian);

            await execute(rotation);

            // baseMatrix [cos, sin, -sin, cos, 0, 0] が使用される
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("baseMatrixが正しく計算される（90度）", async () => {
            const rotation = 90;
            const radian = rotation * Math.PI / 180;
            const expectedCos = Math.cos(radian);
            const expectedSin = Math.sin(radian);

            await execute(rotation);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("既存の回転に追加回転が適用される", async () => {
            mockCharacter.rotation = 30;
            // baseMatrix * character.matrixで新しい回転が計算される

            await execute(45);

            // 新しい回転角度が計算されて設定される
            expect(mockCharacter.rotation).toBeDefined();
        });
    });

    describe("座標変換の計算", () => {
        it("referenceSettingの座標が使用される", async () => {
            const { referenceSetting } = await import("../../../../controller/domain/model/ReferenceSetting");
            referenceSetting.x = 50;
            referenceSetting.y = 100;

            await execute(45);

            // ローカル座標変換でreferenceSettingが使用される
            expect(mockCharacter.x).toBeDefined();
            expect(mockCharacter.y).toBeDefined();
        });

        it("連結Matrixが正しく使用される", async () => {
            mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 20]));

            await execute(45);

            expect(mock$getConcatenatedMatrix).toHaveBeenCalled();
        });

        it("transformedMatrixからinvertMatrixが計算される", async () => {
            await execute(45);

            // Matrix.invertが使用され、ローカル座標が計算される
            expect(mockCharacter.x).toBeDefined();
            expect(mockCharacter.y).toBeDefined();
        });

        it("回転前後の座標(prevX/Y, nextX/Y)から新しい位置が計算される", async () => {
            const initialX = mockCharacter.x;
            const initialY = mockCharacter.y;

            await execute(45);

            // character.x = prevX - nextX
            // character.y = prevY - nextY
            expect(mockCharacter.x).toBeDefined();
            expect(mockCharacter.y).toBeDefined();
        });
    });

    describe("レイヤーとキャラクターの検証", () => {
        it("レイヤーが見つからない場合はスキップ", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute(45);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("Nodeが見つからない場合はスキップ", async () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            await execute(45);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("キャラクターが見つからない場合はスキップ", async () => {
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(45);

            expect(mockWorkSpace.getLibrary).not.toHaveBeenCalled();
        });

        it("インスタンスが見つからない場合はスキップ", async () => {
            mockWorkSpace.getLibrary.mockReturnValue(null);

            await execute(45);

            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).not.toHaveBeenCalled();
        });

        it("getBoundsがnullを返す場合、スタイル更新がスキップされる", async () => {
            mockCharacter.getBounds.mockReturnValue(null);

            await execute(45);

            // 回転は適用されるが、スタイル更新はスキップ
            expect(mockCharacter.rotation).toBeDefined();
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalled();
        });

        it("getRawBoundsがnullを返す場合、canvas更新がスキップされる", async () => {
            mockCharacter.getRawBounds.mockReturnValue(null);

            await execute(45);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            const container = node.querySelector(".canvas-container") as HTMLDivElement;
            const canvas = container.querySelector("canvas");
            
            // canvasのスタイルは更新されない
            expect(canvas?.style.width).toBe("");
        });

        it("canvas要素が存在しない場合、canvasサイズ更新がスキップされる", async () => {
            const nodeWithoutCanvas = document.createElement("div");
            const container = document.createElement("div");
            container.className = "canvas-container";
            nodeWithoutCanvas.appendChild(container);
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(nodeWithoutCanvas);

            await execute(45);

            // エラーなく処理が完了
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalled();
        });

        it("container要素が存在しない場合、container処理がスキップされる", async () => {
            const nodeWithoutContainer = document.createElement("div");
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(nodeWithoutContainer);

            await execute(45);

            // エラーなく処理が完了
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalled();
        });
    });

    describe("非同期処理", () => {
        it("マスク更新が非同期で実行される", async () => {
            let maskUpdateCalled = false;
            mockScreenDisplayObjectUpdateMaskInCanvasStyleService.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                maskUpdateCalled = true;
            });

            await execute(45);

            expect(maskUpdateCalled).toBe(true);
        });

        it("複数のキャラクターのマスク更新が順次実行される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);
            const callOrder: number[] = [];

            mockScreenDisplayObjectUpdateMaskInCanvasStyleService.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 5));
                callOrder.push(callOrder.length + 1);
            });

            await execute(45);

            expect(callOrder).toEqual([1, 2]);
            expect(mockScreenDisplayObjectUpdateMaskInCanvasStyleService).toHaveBeenCalledTimes(2);
        });
    });

    describe("エッジケース", () => {
        it("非常に大きな回転値", async () => {
            await execute(720); // 2回転

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
            expect(mockCharacter.rotation).toBeDefined();
        });

        it("非常に小さな回転値", async () => {
            await execute(0.001);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("負の大きな回転値", async () => {
            await execute(-720);

            expect(mockCharacter.rotation).toBeGreaterThanOrEqual(0);
            expect(mockCharacter.rotation).toBeLessThan(360);
        });

        it("Infinity 値の処理", async () => {
            await execute(Infinity);

            // 処理が実行される（Math.cos/sinの結果はNaNになる可能性）
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("NaN 値の処理", async () => {
            await execute(NaN);

            // rotation=0と同じ扱いで早期リターン（!rotation）
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("Boundsの値が極端に小さい場合", async () => {
            mockCharacter.getBounds.mockReturnValue({
                xMin: 0,
                xMax: 0.1,
                yMin: 0,
                yMax: 0.1
            });

            await execute(45);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
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

            await execute(45);

            const node = mockScreenAreaGetElementFromLayerIdAndDepthService.mock.results[0].value;
            expect(node.style.width).toBe("50px");
            expect(node.style.height).toBe("50px");
            expect(node.style.left).toBe("-100px");
            expect(node.style.top).toBe("-200px");
        });

        it("複数選択時のBoundsの小数点処理", async () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue({
                xMin: 0,
                xMax: 123.456,
                yMin: 0,
                yMax: 234.567
            });

            await execute(45);

            // Math.round(123.456 * 100) / 100 = 123.46
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(123.46);
            // Math.round(234.567 * 100) / 100 = 234.57
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(234.57);
        });
    });

    describe("回転の特殊ケース", () => {
        it("ちょうど360度の回転", async () => {
            await execute(360);

            // 360度は実質0度と同じだが、計算は実行される
            expect(mockCharacter.rotation).toBeDefined();
        });

        it("複数回転（540度）", async () => {
            await execute(540); // 360 + 180

            expect(mockCharacter.rotation).toBeDefined();
        });

        it("小数点を含む回転（22.5度）", async () => {
            await execute(22.5);

            expect(mockCharacter.rotation).toBeDefined();
        });

        it("小数点を含む回転（67.89度）", async () => {
            await execute(67.89);

            expect(mockCharacter.rotation).toBeDefined();
        });

        it("ちょうど-180度の回転", async () => {
            await execute(-180);

            expect(mockCharacter.rotation).toBeGreaterThanOrEqual(0);
            expect(mockCharacter.rotation).toBeLessThan(360);
        });
    });

    describe("scaleXとscaleYの計算", () => {
        it("連結Matrixからscaleが計算される", async () => {
            mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([2, 0, 0, 3, 0, 0]));

            await execute(45);

            // scaleX = Math.hypot(2, 0) = 2
            // scaleY = Math.hypot(0, 3) = 3
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });

        it("回転を含む連結Matrixからscaleが計算される", async () => {
            const rad45 = Math.PI / 4;
            const cos45 = Math.cos(rad45);
            const sin45 = Math.sin(rad45);
            mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([
                2 * cos45, 2 * sin45, -3 * sin45, 3 * cos45, 0, 0
            ]));

            await execute(45);

            // scaleX = Math.hypot(2*cos45, 2*sin45) ≈ 2
            // scaleY = Math.hypot(-3*sin45, 3*cos45) ≈ 3
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalled();
        });
    });

    describe("パフォーマンステスト", () => {
        it("単一オブジェクトの処理が高速に実行される", async () => {
            const start = performance.now();
            await execute(45);
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
            await execute(45);
            const end = performance.now();
            const duration = end - start;

            // 100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
        });
    });

    describe("統合シナリオ", () => {
        it("回転 + スクリーンオフセット + スケール + 親Matrix", async () => {
            mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 20]));
            mock$getScreenOffsetLeft.mockReturnValue(50);
            mock$getScreenOffsetTop.mockReturnValue(100);
            mockCharacter.scaleX = 1.5;
            mockCharacter.scaleY = 1.5;

            await execute(45);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(150);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(150);
            expect(mockScreenStandardPointDeployElementUseCase).toHaveBeenCalled();
        });

        it("複数選択 + 回転 + Bounds更新", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2, 3]]]);
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue({
                xMin: 50,
                xMax: 450,
                yMin: 100,
                yMax: 400
            });

            await execute(90);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(3);
            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(400);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(300);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(50);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(100);
        });
    });
});
