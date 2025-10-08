import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Instance } from "@/core/domain/model/Instance";
import { Matrix } from "@next2d/geom";

// モック（vi.hoistedを使用）
const {
    mock$getCurrentWorkSpace,
    mock$createTransformMatrix,
    mock$getConcatenatedMatrix,
    mockScreenDisplayObjectSvgTagComponent
} = vi.hoisted(() => {
    return {
        mock$getCurrentWorkSpace: vi.fn(),
        mock$createTransformMatrix: vi.fn(),
        mock$getConcatenatedMatrix: vi.fn(),
        mockScreenDisplayObjectSvgTagComponent: vi.fn()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/controller/application/TransformSetting/TransformSettingUtil", () => ({
    $createTransformMatrix: mock$createTransformMatrix,
    $getConcatenatedMatrix: mock$getConcatenatedMatrix
}));

vi.mock("../component/ScreenDisplayObjectSvgTagComponent", () => ({
    execute: mockScreenDisplayObjectSvgTagComponent
}));

vi.mock("@/config/LayerModeConfig", () => ({
    $MASK_IN_MODE: "MASK_IN"
}));

vi.mock("@/config/InstanceConfig", () => ({
    $BITMAP_TYPE: "BITMAP",
    $VIDEO_TYPE: "VIDEO"
}));

import { execute } from "./ScreenDisplayObjectUpdateMaskInCanvasStyleService";

describe("ScreenDisplayObjectUpdateMaskInCanvasStyleService", () => {
    let mockElement: HTMLElement;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockMaskLayer: Layer;
    let mockMaskCharacter: Character;
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("div");
        
        mockCanvas = document.createElement("canvas");
        mockCanvas.width = 200;
        mockCanvas.height = 150;
        mockCanvas.toDataURL = vi.fn(() => "data:image/png;base64,mockbase64");

        mockMaskCharacter = {
            libraryId: 1,
            matrix: new Float32Array([1, 0, 0, 1, 0, 0]),
            getBounds: vi.fn(() => ({
                xMin: 10,
                xMax: 110,
                yMin: 20,
                yMax: 120
            })),
            createElement: vi.fn(async (div: HTMLElement) => {
                div.appendChild(mockCanvas);
            })
        } as unknown as Character;

        mockMaskLayer = {
            lock: true,
            getActiveCharacters: vi.fn(() => [mockMaskCharacter])
        } as unknown as Layer;

        mockCharacter = {
            getBounds: vi.fn(() => ({
                xMin: 0,
                xMax: 200,
                yMin: 0,
                yMax: 200
            }))
        } as unknown as Character;

        mockMovieClip = {
            currentFrame: 1,
            getLayerById: vi.fn(() => mockMaskLayer)
        } as unknown as MovieClip;

        mockWorkSpace = {
            scene: mockMovieClip,
            getLibrary: vi.fn(() => ({
                type: "SHAPE"
            } as unknown as Instance))
        } as unknown as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$createTransformMatrix.mockReturnValue(new Float32Array([1, 0, 0, 1, 0, 0]));
        mock$getConcatenatedMatrix.mockReturnValue(new Float32Array([1, 0, 0, 1, 0, 0]));
        mockScreenDisplayObjectSvgTagComponent.mockReturnValue("<svg>test</svg>");

        mockLayer = {
            mode: "MASK_IN",
            parentId: 123
        } as unknown as Layer;
    });

    describe("早期リターン条件", () => {
        it("layer.modeがMASK_INでない場合は何もしない", async () => {
            mockLayer.mode = 0; // NORMAL

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMovieClip.getLayerById).not.toHaveBeenCalled();
        });

        it("maskLayerが存在しない場合は何もしない", async () => {
            mockMovieClip.getLayerById = vi.fn(() => null);

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMaskLayer.getActiveCharacters).not.toHaveBeenCalled();
        });

        it("maskLayerがロックされていない場合は何もしない", async () => {
            mockMaskLayer.lock = false;

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMaskLayer.getActiveCharacters).not.toHaveBeenCalled();
        });

        it("activeCharactersが空の場合は何もしない", async () => {
            mockMaskLayer.getActiveCharacters = vi.fn(() => []);

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMaskCharacter.getBounds).not.toHaveBeenCalled();
        });

        it("maskCharacterが存在しない場合は何もしない", async () => {
            mockMaskLayer.getActiveCharacters = vi.fn(() => [null as unknown as Character]);

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockWorkSpace.getLibrary).not.toHaveBeenCalled();
        });

        it("maskBoundsが存在しない場合は何もしない", async () => {
            mockMaskCharacter.getBounds = vi.fn(() => null);

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockCharacter.getBounds).not.toHaveBeenCalled();
        });

        it("boundsが存在しない場合は何もしない", async () => {
            mockCharacter.getBounds = vi.fn(() => null);

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockWorkSpace.getLibrary).not.toHaveBeenCalled();
        });

        it("instanceが存在しない場合は何もしない", async () => {
            mockWorkSpace.getLibrary = vi.fn(() => null);

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMaskCharacter.createElement).not.toHaveBeenCalled();
        });

        it("canvasが存在しない場合は何もしない", async () => {
            mockMaskCharacter.createElement = vi.fn(async () => {
                // canvasを追加しない
                return null;
            });

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockScreenDisplayObjectSvgTagComponent).not.toHaveBeenCalled();
        });
    });

    describe("正常系 - マスクスタイルの適用", () => {
        it("SHAPEタイプの場合、マスクスタイルが正しく設定される", async () => {
            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMovieClip.getLayerById).toHaveBeenCalledWith(123);
            expect(mockMaskLayer.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockMaskCharacter.getBounds).toHaveBeenCalledWith(1, true);
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, true);
            expect(mockWorkSpace.getLibrary).toHaveBeenCalledWith(1);
            
            // createElement呼び出しの確認
            expect(mockMaskCharacter.createElement).toHaveBeenCalled();
            
            // canvasのbase64データセット確認
            expect(mockCanvas.dataset.base64).toBe("data:image/png;base64,mockbase64");
            
            // $createTransformMatrixが呼ばれる（BITMAPやVIDEO以外）
            expect(mock$createTransformMatrix).toHaveBeenCalledWith(mockMaskCharacter);
            
            // SVGコンポーネントの呼び出し確認
            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                "data:image/png;base64,mockbase64",
                100, // width: Math.ceil(110 - 10)
                100, // height: Math.ceil(120 - 20)
                200 / window.devicePixelRatio, // canvasWidth adjusted
                150 / window.devicePixelRatio, // canvasHeight adjusted
                expect.any(Float32Array)
            );
            
            // スタイル設定の確認
            expect(mockElement.style.mask).toContain("url('data:image/svg+xml;utf8,<svg>test</svg>')");
            expect(mockElement.style.maskSize).toBe("100px 100px");
            expect(mockElement.style.maskRepeat).toBe("no-repeat");
            expect(mockElement.style.maskPosition).toBe("10px 20px"); // maskBounds.xMin - bounds.xMin, maskBounds.yMin - bounds.yMin
        });

        it("BITMAPタイプの場合、Matrix.multiplyが使われる", async () => {
            mockWorkSpace.getLibrary = vi.fn(() => ({
                type: "BITMAP"
            } as unknown as Instance));

            const concatenatedMatrix = new Float32Array([2, 0, 0, 2, 10, 10]);
            mock$getConcatenatedMatrix.mockReturnValue(concatenatedMatrix);
            vi.spyOn(Matrix, "multiply").mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 10]));

            await execute(mockElement, mockLayer, mockCharacter);

            expect(Matrix.multiply).toHaveBeenCalledWith(
                concatenatedMatrix,
                mockMaskCharacter.matrix
            );
            
            // devicePixelRatioの調整がされない
            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                expect.any(String),
                100,
                100,
                200, // devicePixelRatioで割られない
                150, // devicePixelRatioで割られない
                expect.any(Float32Array)
            );
        });

        it("VIDEOタイプの場合、Matrix.multiplyが使われる", async () => {
            mockWorkSpace.getLibrary = vi.fn(() => ({
                type: "VIDEO"
            } as unknown as Instance));

            const concatenatedMatrix = new Float32Array([2, 0, 0, 2, 10, 10]);
            mock$getConcatenatedMatrix.mockReturnValue(concatenatedMatrix);
            vi.spyOn(Matrix, "multiply").mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 10]));

            await execute(mockElement, mockLayer, mockCharacter);

            expect(Matrix.multiply).toHaveBeenCalledWith(
                concatenatedMatrix,
                mockMaskCharacter.matrix
            );
        });

        it("webkit接頭辞付きのスタイルも設定される", async () => {
            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockElement.style.webkitMask).toContain("url('data:image/svg+xml;utf8,<svg>test</svg>')");
            expect(mockElement.style.webkitMaskSize).toBe("100px 100px");
            expect(mockElement.style.webkitMaskRepeat).toBe("no-repeat");
            expect(mockElement.style.webkitMaskPosition).toBe("10px 20px");
        });
    });

    describe("bounds計算", () => {
        it("負の座標のマスクバウンドが正しく処理される", async () => {
            mockMaskCharacter.getBounds = vi.fn(() => ({
                xMin: -50,
                xMax: 50,
                yMin: -30,
                yMax: 70
            }));

            mockCharacter.getBounds = vi.fn(() => ({
                xMin: -100,
                xMax: 100,
                yMin: -100,
                yMax: 100
            }));

            await execute(mockElement, mockLayer, mockCharacter);

            // width: Math.ceil(Math.abs(50 - (-50))) = 100
            // height: Math.ceil(Math.abs(70 - (-30))) = 100
            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                expect.any(String),
                100,
                100,
                expect.any(Number),
                expect.any(Number),
                expect.any(Float32Array)
            );

            // position: -50 - (-100) = 50, -30 - (-100) = 70
            expect(mockElement.style.maskPosition).toBe("50px 70px");
        });

        it("小数点を含むバウンドがMath.ceilで切り上げられる", async () => {
            mockMaskCharacter.getBounds = vi.fn(() => ({
                xMin: 0,
                xMax: 99.3,
                yMin: 0,
                yMax: 49.7
            }));

            await execute(mockElement, mockLayer, mockCharacter);

            // width: Math.ceil(99.3) = 100
            // height: Math.ceil(49.7) = 50
            expect(mockElement.style.maskSize).toBe("100px 50px");
        });

        it("マスクとキャラクターのバウンドオフセットが正しく計算される", async () => {
            mockMaskCharacter.getBounds = vi.fn(() => ({
                xMin: 50,
                xMax: 150,
                yMin: 100,
                yMax: 200
            }));

            mockCharacter.getBounds = vi.fn(() => ({
                xMin: 0,
                xMax: 300,
                yMin: 0,
                yMax: 300
            }));

            await execute(mockElement, mockLayer, mockCharacter);

            // position: 50 - 0 = 50, 100 - 0 = 100
            expect(mockElement.style.maskPosition).toBe("50px 100px");
        });
    });

    describe("canvas処理", () => {
        it("canvasにbase64データが既に存在する場合、toDataURLは呼ばれない", async () => {
            mockCanvas.dataset.base64 = "data:image/png;base64,existing";
            const toDataURLSpy = vi.spyOn(mockCanvas, "toDataURL");

            await execute(mockElement, mockLayer, mockCharacter);

            expect(toDataURLSpy).not.toHaveBeenCalled();
            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                "data:image/png;base64,existing",
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Float32Array)
            );
        });

        it("canvasがcreateElement後にDOMから削除される", async () => {
            const removeSpy = vi.spyOn(mockCanvas, "remove");

            await execute(mockElement, mockLayer, mockCharacter);

            expect(removeSpy).toHaveBeenCalled();
        });

        it("複数のcanvasが存在する場合、最初のcanvasが使用される", async () => {
            const mockCanvas2 = document.createElement("canvas");
            mockCanvas2.width = 300;
            mockCanvas2.height = 250;

            mockMaskCharacter.createElement = vi.fn(async (div: HTMLElement) => {
                div.appendChild(mockCanvas);
                div.appendChild(mockCanvas2);
                return null;
            });

            await execute(mockElement, mockLayer, mockCharacter);

            // 最初のcanvasのサイズが使用される
            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                expect.any(Number),
                200 / window.devicePixelRatio,
                150 / window.devicePixelRatio,
                expect.any(Float32Array)
            );
        });
    });

    describe("devicePixelRatio処理", () => {
        it("SHAPEタイプの場合、canvasサイズがdevicePixelRatioで割られる", async () => {
            const originalDevicePixelRatio = window.devicePixelRatio;
            Object.defineProperty(window, "devicePixelRatio", {
                writable: true,
                configurable: true,
                value: 2
            });

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                expect.any(Number),
                100, // 200 / 2
                75,  // 150 / 2
                expect.any(Float32Array)
            );

            Object.defineProperty(window, "devicePixelRatio", {
                writable: true,
                configurable: true,
                value: originalDevicePixelRatio
            });
        });

        it("BITMAPタイプの場合、canvasサイズがdevicePixelRatioで割られない", async () => {
            mockWorkSpace.getLibrary = vi.fn(() => ({
                type: "BITMAP"
            } as unknown as Instance));

            vi.spyOn(Matrix, "multiply").mockReturnValue(new Float32Array([1, 0, 0, 1, 0, 0]));

            const originalDevicePixelRatio = window.devicePixelRatio;
            Object.defineProperty(window, "devicePixelRatio", {
                writable: true,
                configurable: true,
                value: 2
            });

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                expect.any(Number),
                200, // devicePixelRatioで割られない
                150, // devicePixelRatioで割られない
                expect.any(Float32Array)
            );

            Object.defineProperty(window, "devicePixelRatio", {
                writable: true,
                configurable: true,
                value: originalDevicePixelRatio
            });
        });
    });

    describe("統合シナリオ", () => {
        it("完全なマスクイン適用フロー", async () => {
            await execute(mockElement, mockLayer, mockCharacter);

            // 全ての処理が実行される
            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            expect(mockMovieClip.getLayerById).toHaveBeenCalledWith(123);
            expect(mockMaskLayer.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockMaskCharacter.getBounds).toHaveBeenCalledWith(1, true);
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, true);
            expect(mockWorkSpace.getLibrary).toHaveBeenCalledWith(1);
            expect(mockMaskCharacter.createElement).toHaveBeenCalled();
            expect(mock$createTransformMatrix).toHaveBeenCalled();
            expect(mockScreenDisplayObjectSvgTagComponent).toHaveBeenCalled();
            
            // 最終的なスタイルが設定される
            expect(mockElement.style.mask).toBeTruthy();
            expect(mockElement.style.maskSize).toBeTruthy();
            expect(mockElement.style.maskRepeat).toBe("no-repeat");
            expect(mockElement.style.maskPosition).toBeTruthy();
        });

        it("異なるフレームでの処理", async () => {
            mockMovieClip.currentFrame = 10;

            await execute(mockElement, mockLayer, mockCharacter);

            expect(mockMaskLayer.getActiveCharacters).toHaveBeenCalledWith(10);
            expect(mockMaskCharacter.getBounds).toHaveBeenCalledWith(10, true);
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(10, true);
        });

        it("複数のマスクレイヤーが存在する場合、最初のアクティブキャラクターのみ使用", async () => {
            const mockMaskCharacter2 = {
                libraryId: 2,
                matrix: new Float32Array([1, 0, 0, 1, 0, 0]),
                getBounds: vi.fn(() => ({
                    xMin: 200,
                    xMax: 300,
                    yMin: 200,
                    yMax: 300
                })),
                createElement: vi.fn()
            } as unknown as Character;

            mockMaskLayer.getActiveCharacters = vi.fn(() => [mockMaskCharacter, mockMaskCharacter2]);

            await execute(mockElement, mockLayer, mockCharacter);

            // 最初のキャラクターのみが使用される
            expect(mockMaskCharacter.getBounds).toHaveBeenCalled();
            expect(mockMaskCharacter2.getBounds).not.toHaveBeenCalled();
            expect(mockWorkSpace.getLibrary).toHaveBeenCalledWith(1); // 最初のlibraryId
        });
    });
});
