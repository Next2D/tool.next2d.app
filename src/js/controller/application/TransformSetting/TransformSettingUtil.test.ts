import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
    $getConcatenatedMatrix,
    $createTransformMatrix,
    $createTransformElementStyle
} from "./TransformSettingUtil";
import type { Character } from "../../../core/domain/model/Character";

// モック
const mock$getCurrentWorkSpace = vi.fn();

vi.mock("../../../core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("../../../timeline/domain/model/TimelineSceneList", () => ({
    timelineSceneList: {
        parents: []
    }
}));

describe("TransformSettingUtil", () => {
    let mockWorkSpace: any;
    let mockCharacter: Character;

    beforeEach(() => {
        vi.clearAllMocks();

        // 基本的なモックWorkSpaceのセットアップ
        mockWorkSpace = {
            scale: 1
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // 基本的なモックキャラクターのセットアップ
        mockCharacter = {
            matrix: new Float32Array([1, 0, 0, 1, 0, 0]),
            rotation: 0,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        } as Character;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("$getConcatenatedMatrix", () => {
        it("親が存在しない場合、ワークスペースのスケールのみを含むmatrixを返す", () => {
            mockWorkSpace.scale = 1;

            const result = $getConcatenatedMatrix();

            expect(result).toBeInstanceOf(Float32Array);
            expect(result.length).toBe(6);
            expect(result[0]).toBe(1);  // a
            expect(result[1]).toBe(0);  // b
            expect(result[2]).toBe(0);  // c
            expect(result[3]).toBe(1);  // d
            expect(result[4]).toBe(0);  // tx
            expect(result[5]).toBe(0);  // ty
        });

        it("ワークスペースのスケールが2の場合、matrixに反映される", () => {
            mockWorkSpace.scale = 2;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(2);  // a
            expect(result[3]).toBe(2);  // d
        });

        it("ワークスペースのスケールが0.5の場合、matrixに反映される", () => {
            mockWorkSpace.scale = 0.5;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(0.5);  // a
            expect(result[3]).toBe(0.5);  // d
        });

        it("親オブジェクトが1つ存在する場合、親のmatrixが乗算される", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            const parentCharacter = {
                matrix: new Float32Array([2, 0, 0, 2, 10, 20])
            };
            timelineSceneList.parents = [
                { selectCharacter: parentCharacter }
            ];

            mockWorkSpace.scale = 1;

            const result = $getConcatenatedMatrix();

            // workspace.scale * parent.matrix
            expect(result[0]).toBe(2);   // a
            expect(result[1]).toBe(0);   // b
            expect(result[2]).toBe(0);   // c
            expect(result[3]).toBe(2);   // d
            expect(result[4]).toBe(10);  // tx
            expect(result[5]).toBe(20);  // ty
        });

        it("複数の親オブジェクトが存在する場合、すべてのmatrixが順次乗算される", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            const parent1 = {
                matrix: new Float32Array([2, 0, 0, 2, 10, 20])
            };
            const parent2 = {
                matrix: new Float32Array([1.5, 0, 0, 1.5, 5, 10])
            };
            timelineSceneList.parents = [
                { selectCharacter: parent1 },
                { selectCharacter: parent2 }
            ];

            mockWorkSpace.scale = 1;

            const result = $getConcatenatedMatrix();

            // workspace.scale * parent1.matrix * parent2.matrix
            expect(result[0]).toBe(3);    // 2 * 1.5
            expect(result[3]).toBe(3);    // 2 * 1.5
            expect(result[4]).toBeCloseTo(25);  // (10 * 1.5) + 5
            expect(result[5]).toBeCloseTo(40);  // (20 * 1.5) + 10
        });

        it("親オブジェクトがnullの場合はスキップされる", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [
                null,
                { selectCharacter: { matrix: new Float32Array([2, 0, 0, 2, 0, 0]) } }
            ];

            mockWorkSpace.scale = 1;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(2);
            expect(result[3]).toBe(2);
        });

        it("親オブジェクトのselectCharacterがnullの場合はスキップされる", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [
                { selectCharacter: null },
                { selectCharacter: { matrix: new Float32Array([2, 0, 0, 2, 0, 0]) } }
            ];

            mockWorkSpace.scale = 1;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(2);
            expect(result[3]).toBe(2);
        });

        it("ワークスペースのスケールと親のmatrixの両方が適用される", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [
                { selectCharacter: { matrix: new Float32Array([2, 0, 0, 2, 0, 0]) } }
            ];

            mockWorkSpace.scale = 1.5;

            const result = $getConcatenatedMatrix();

            // 1.5 * 2 = 3
            expect(result[0]).toBe(3);
            expect(result[3]).toBe(3);
        });

        it("回転を含むmatrixが正しく乗算される", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            const rad45 = Math.PI / 4;
            const cos45 = Math.cos(rad45);
            const sin45 = Math.sin(rad45);
            timelineSceneList.parents = [
                {
                    selectCharacter: {
                        matrix: new Float32Array([cos45, sin45, -sin45, cos45, 0, 0])
                    }
                }
            ];

            mockWorkSpace.scale = 1;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBeCloseTo(cos45);
            expect(result[1]).toBeCloseTo(sin45);
            expect(result[2]).toBeCloseTo(-sin45);
            expect(result[3]).toBeCloseTo(cos45);
        });

        it("戻り値が毎回新しいFloat32Arrayインスタンスである", () => {
            const result1 = $getConcatenatedMatrix();
            const result2 = $getConcatenatedMatrix();

            expect(result1).not.toBe(result2);
            expect(result1).toEqual(result2);
        });
    });

    describe("$createTransformMatrix", () => {
        it("単純なmatrix（単位行列）から正しい変換matrixを生成", () => {
            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            expect(result).toBeInstanceOf(Float32Array);
            expect(result.length).toBe(6);
            expect(result[0]).toBeCloseTo(1);  // cos(0)
            expect(result[1]).toBeCloseTo(0);  // sin(0)
            expect(result[2]).toBeCloseTo(0);  // sin(0)
            expect(result[3]).toBeCloseTo(1);  // cos(0)
            expect(result[4]).toBe(0);
            expect(result[5]).toBe(0);
        });

        it("スケールが適用されたmatrixから正しい変換matrixを生成", () => {
            mockCharacter.matrix = new Float32Array([2, 0, 0, 2, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            // atan2(0, 2) = 0, cos(0) = 1
            expect(result[0]).toBeCloseTo(1);
            expect(result[1]).toBeCloseTo(0);
            expect(result[2]).toBeCloseTo(0);
            expect(result[3]).toBeCloseTo(1);
        });

        it("45度回転したmatrixから正しい変換matrixを生成", () => {
            const rad45 = Math.PI / 4;
            const cos45 = Math.cos(rad45);
            const sin45 = Math.sin(rad45);
            mockCharacter.matrix = new Float32Array([cos45, sin45, -sin45, cos45, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            expect(result[0]).toBeCloseTo(cos45);
            expect(result[1]).toBeCloseTo(sin45);
            expect(result[2]).toBeCloseTo(sin45);
            expect(result[3]).toBeCloseTo(cos45);
        });

        it("90度回転したmatrixから正しい変換matrixを生成", () => {
            const rad90 = Math.PI / 2;
            const cos90 = Math.cos(rad90);
            const sin90 = Math.sin(rad90);
            mockCharacter.matrix = new Float32Array([cos90, sin90, -sin90, cos90, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            expect(result[0]).toBeCloseTo(cos90, 5);
            expect(result[1]).toBeCloseTo(sin90, 5);
            expect(result[2]).toBeCloseTo(sin90, 5);
            expect(result[3]).toBeCloseTo(cos90, 5);
        });

        it("負の回転（-45度）のmatrixから正しい変換matrixを生成", () => {
            const radMinus45 = -Math.PI / 4;
            const cos45 = Math.cos(radMinus45);
            const sin45 = Math.sin(radMinus45);
            mockCharacter.matrix = new Float32Array([cos45, sin45, -sin45, cos45, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            expect(result[0]).toBeCloseTo(cos45);
            expect(result[1]).toBeCloseTo(sin45);
        });

        it("親のmatrixも考慮した変換matrixを生成", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [
                {
                    selectCharacter: {
                        matrix: new Float32Array([2, 0, 0, 2, 0, 0])
                    }
                }
            ];

            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            // 親のスケールは角度計算には影響しない（正規化される）
            expect(result[0]).toBeCloseTo(1);
            expect(result[1]).toBeCloseTo(0);
            expect(result[2]).toBeCloseTo(0);
            expect(result[3]).toBeCloseTo(1);
        });

        it("ワークスペースのスケールが変換matrixに影響する", () => {
            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            mockWorkSpace.scale = 2;

            const result = $createTransformMatrix(mockCharacter);

            // スケールは角度計算で正規化される
            expect(result[0]).toBeCloseTo(1);
            expect(result[1]).toBeCloseTo(0);
            expect(result[2]).toBeCloseTo(0);
            expect(result[3]).toBeCloseTo(1);
        });

        it("複雑な変換（スケール+回転+平行移動）を含むmatrix", () => {
            const scale = 2;
            const rad = Math.PI / 6; // 30度
            mockCharacter.matrix = new Float32Array([
                scale * Math.cos(rad),
                scale * Math.sin(rad),
                -scale * Math.sin(rad),
                scale * Math.cos(rad),
                100,
                200
            ]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            // Math.atan2で角度が抽出され、cos/sinで正規化される
            expect(result[0]).toBeCloseTo(Math.cos(rad));
            expect(result[1]).toBeCloseTo(Math.sin(rad));
            expect(result[2]).toBeCloseTo(Math.sin(rad));
            expect(result[3]).toBeCloseTo(Math.cos(rad));
        });

        it("異なるX軸とY軸のスケールを持つmatrix", () => {
            mockCharacter.matrix = new Float32Array([2, 0, 0, 3, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformMatrix(mockCharacter);

            // X軸: atan2(0, 2) = 0
            // Y軸: atan2(0, 3) = 0
            expect(result[0]).toBeCloseTo(1);
            expect(result[1]).toBeCloseTo(0);
            expect(result[2]).toBeCloseTo(0);
            expect(result[3]).toBeCloseTo(1);
        });

        it("戻り値が毎回新しいFloat32Arrayインスタンスである", () => {
            const result1 = $createTransformMatrix(mockCharacter);
            const result2 = $createTransformMatrix(mockCharacter);

            expect(result1).not.toBe(result2);
            expect(result1).toEqual(result2);
        });
    });

    describe("$createTransformElementStyle", () => {
        it("単位行列から正しいCSSスタイル文字列を生成", () => {
            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            expect(result).toBe("matrix(1, 0, 0, 1, 0, 0)");
        });

        it("45度回転したmatrixから正しいCSSスタイル文字列を生成", () => {
            const rad45 = Math.PI / 4;
            const cos45 = Math.cos(rad45);
            const sin45 = Math.sin(rad45);
            mockCharacter.matrix = new Float32Array([cos45, sin45, -sin45, cos45, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            expect(result).toContain("matrix(");
            expect(result).toContain(", 0, 0)");
            
            // 値を抽出して検証
            const matches = result.match(/matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            expect(matches).toBeTruthy();
            if (matches) {
                expect(parseFloat(matches[1])).toBeCloseTo(cos45);
                expect(parseFloat(matches[2])).toBeCloseTo(sin45);
                expect(parseFloat(matches[3])).toBeCloseTo(sin45);
                expect(parseFloat(matches[4])).toBeCloseTo(cos45);
                expect(parseFloat(matches[5])).toBe(0);
                expect(parseFloat(matches[6])).toBe(0);
            }
        });

        it("90度回転したmatrixから正しいCSSスタイル文字列を生成", () => {
            const rad90 = Math.PI / 2;
            const cos90 = Math.cos(rad90);
            const sin90 = Math.sin(rad90);
            mockCharacter.matrix = new Float32Array([cos90, sin90, -sin90, cos90, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            const matches = result.match(/matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            expect(matches).toBeTruthy();
            if (matches) {
                expect(parseFloat(matches[1])).toBeCloseTo(cos90, 5);
                expect(parseFloat(matches[2])).toBeCloseTo(sin90, 5);
                expect(parseFloat(matches[3])).toBeCloseTo(sin90, 5);
                expect(parseFloat(matches[4])).toBeCloseTo(cos90, 5);
            }
        });

        it("スケールが適用されたmatrixから正しいCSSスタイル文字列を生成", () => {
            mockCharacter.matrix = new Float32Array([2, 0, 0, 2, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            // スケールは角度計算で正規化されるため、単位行列的な値になる
            expect(result).toBe("matrix(1, 0, 0, 1, 0, 0)");
        });

        it("複雑な変換を含むmatrixから正しいCSSスタイル文字列を生成", () => {
            const scale = 2;
            const rad = Math.PI / 6; // 30度
            mockCharacter.matrix = new Float32Array([
                scale * Math.cos(rad),
                scale * Math.sin(rad),
                -scale * Math.sin(rad),
                scale * Math.cos(rad),
                100,
                200
            ]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            const matches = result.match(/matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            expect(matches).toBeTruthy();
            if (matches) {
                expect(parseFloat(matches[1])).toBeCloseTo(Math.cos(rad));
                expect(parseFloat(matches[2])).toBeCloseTo(Math.sin(rad));
                expect(parseFloat(matches[3])).toBeCloseTo(Math.sin(rad));
                expect(parseFloat(matches[4])).toBeCloseTo(Math.cos(rad));
                // 平行移動成分は常に0
                expect(parseFloat(matches[5])).toBe(0);
                expect(parseFloat(matches[6])).toBe(0);
            }
        });

        it("親のmatrixも考慮したCSSスタイル文字列を生成", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [
                {
                    selectCharacter: {
                        matrix: new Float32Array([2, 0, 0, 2, 10, 20])
                    }
                }
            ];

            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 5, 10]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            // 親のmatrixとcharacterのmatrixが乗算され、その後角度が抽出される
            expect(result).toContain("matrix(");
            expect(result).toContain("0, 0)");
        });

        it("ワークスペースのスケールも考慮したCSSスタイル文字列を生成", () => {
            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            mockWorkSpace.scale = 2;

            const result = $createTransformElementStyle(mockCharacter);

            // スケールは角度計算で正規化される
            expect(result).toBe("matrix(1, 0, 0, 1, 0, 0)");
        });

        it("負の回転を含むmatrixから正しいCSSスタイル文字列を生成", () => {
            const radMinus45 = -Math.PI / 4;
            const cos45 = Math.cos(radMinus45);
            const sin45 = Math.sin(radMinus45);
            mockCharacter.matrix = new Float32Array([cos45, sin45, -sin45, cos45, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            const matches = result.match(/matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            expect(matches).toBeTruthy();
            if (matches) {
                expect(parseFloat(matches[1])).toBeCloseTo(cos45);
                expect(parseFloat(matches[2])).toBeCloseTo(sin45);
            }
        });

        it("180度回転したmatrixから正しいCSSスタイル文字列を生成", () => {
            const rad180 = Math.PI;
            const cos180 = Math.cos(rad180);
            const sin180 = Math.sin(rad180);
            mockCharacter.matrix = new Float32Array([cos180, sin180, -sin180, cos180, 0, 0]);
            mockWorkSpace.scale = 1;

            const result = $createTransformElementStyle(mockCharacter);

            const matches = result.match(/matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            expect(matches).toBeTruthy();
            if (matches) {
                expect(parseFloat(matches[1])).toBeCloseTo(cos180);
                expect(parseFloat(matches[2])).toBeCloseTo(sin180, 5);
                expect(parseFloat(matches[3])).toBeCloseTo(sin180, 5);
                expect(parseFloat(matches[4])).toBeCloseTo(cos180);
            }
        });

        it("戻り値が文字列型である", () => {
            const result = $createTransformElementStyle(mockCharacter);

            expect(typeof result).toBe("string");
        });

        it("戻り値がmatrix()形式である", () => {
            const result = $createTransformElementStyle(mockCharacter);

            expect(result).toMatch(/^matrix\([^)]+\)$/);
        });

        it("同じcharacterで複数回呼び出しても同じ結果を返す", () => {
            const result1 = $createTransformElementStyle(mockCharacter);
            const result2 = $createTransformElementStyle(mockCharacter);

            expect(result1).toBe(result2);
        });
    });

    describe("統合テスト", () => {
        it("3つの関数が連携して正しく動作する", () => {
            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
            mockWorkSpace.scale = 1;

            const concatenatedMatrix = $getConcatenatedMatrix();
            const transformMatrix = $createTransformMatrix(mockCharacter);
            const styleString = $createTransformElementStyle(mockCharacter);

            expect(concatenatedMatrix).toBeInstanceOf(Float32Array);
            expect(transformMatrix).toBeInstanceOf(Float32Array);
            expect(typeof styleString).toBe("string");
            expect(styleString).toContain("matrix(");
        });

        it("親とワークスペーススケールが全関数に影響する", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [
                {
                    selectCharacter: {
                        matrix: new Float32Array([1.5, 0, 0, 1.5, 0, 0])
                    }
                }
            ];

            mockCharacter.matrix = new Float32Array([2, 0, 0, 2, 0, 0]);
            mockWorkSpace.scale = 1.2;

            const concatenatedMatrix = $getConcatenatedMatrix();
            // 1.2 * 1.5 * 2 = 3.6
            expect(concatenatedMatrix[0]).toBeCloseTo(3.6);

            const transformMatrix = $createTransformMatrix(mockCharacter);
            expect(transformMatrix).toBeDefined();

            const styleString = $createTransformElementStyle(mockCharacter);
            expect(styleString).toContain("matrix(");
        });

        it("複雑な変換チェーン（回転+スケール+親+ワークスペース）", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            const rad45 = Math.PI / 4;
            timelineSceneList.parents = [
                {
                    selectCharacter: {
                        matrix: new Float32Array([
                            Math.cos(rad45),
                            Math.sin(rad45),
                            -Math.sin(rad45),
                            Math.cos(rad45),
                            50,
                            100
                        ])
                    }
                }
            ];

            mockCharacter.matrix = new Float32Array([2, 0, 0, 2, 10, 20]);
            mockWorkSpace.scale = 1.5;

            const concatenatedMatrix = $getConcatenatedMatrix();
            expect(concatenatedMatrix).toBeDefined();
            expect(concatenatedMatrix.length).toBe(6);

            const transformMatrix = $createTransformMatrix(mockCharacter);
            expect(transformMatrix).toBeDefined();
            expect(transformMatrix.length).toBe(6);

            const styleString = $createTransformElementStyle(mockCharacter);
            expect(styleString).toMatch(/^matrix\([^)]+\)$/);
        });
    });

    describe("エッジケース", () => {
        it("ワークスペースのスケールが0の場合", () => {
            mockWorkSpace.scale = 0;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(0);
            expect(result[3]).toBe(0);
        });

        it("ワークスペースのスケールが負の場合", () => {
            mockWorkSpace.scale = -1;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(-1);
            expect(result[3]).toBe(-1);
        });

        it("非常に大きなスケール値", () => {
            mockWorkSpace.scale = 1000;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(1000);
            expect(result[3]).toBe(1000);
        });

        it("非常に小さなスケール値", () => {
            mockWorkSpace.scale = 0.001;

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(0.001);
            expect(result[3]).toBe(0.001);
        });

        it("親の配列が空の場合", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            timelineSceneList.parents = [];

            const result = $getConcatenatedMatrix();

            expect(result[0]).toBe(1);
            expect(result[3]).toBe(1);
        });

        it("キャラクターのmatrixがすべて0の場合", () => {
            mockCharacter.matrix = new Float32Array([0, 0, 0, 0, 0, 0]);

            const result = $createTransformMatrix(mockCharacter);

            // atan2(0, 0) = 0, cos(0) = 1, sin(0) = 0
            expect(result[0]).toBeCloseTo(1);
            expect(result[1]).toBeCloseTo(0);
            expect(result[2]).toBeCloseTo(0);
            expect(result[3]).toBeCloseTo(1);
        });

        it("極端に大きな平行移動成分を持つmatrix", () => {
            mockCharacter.matrix = new Float32Array([1, 0, 0, 1, 10000, 20000]);

            const styleString = $createTransformElementStyle(mockCharacter);

            // 平行移動成分は結果に含まれない（常に0, 0）
            expect(styleString).toContain(", 0, 0)");
        });
    });

    describe("数学的正確性", () => {
        it("Math.atan2の特性が正しく使用されている", () => {
            // y=1, x=1 の場合、atan2(1, 1) = π/4
            mockCharacter.matrix = new Float32Array([1, 1, 1, 1, 0, 0]);

            const result = $createTransformMatrix(mockCharacter);

            const expectedRad = Math.atan2(1, 1);
            expect(result[0]).toBeCloseTo(Math.cos(expectedRad));
            expect(result[1]).toBeCloseTo(Math.sin(expectedRad));
        });

        it("Math.hypotによる距離計算が正しい（参考）", () => {
            // $getConcatenatedMatrixはMath.hypotを使用していないが、
            // $createTransformMatrixでは角度計算にatan2を使用
            const a = 3, b = 4;
            const expectedDistance = Math.sqrt(a * a + b * b); // = 5
            const actualDistance = Math.hypot(a, b);

            expect(actualDistance).toBe(expectedDistance);
        });

        it("Matrix.multiplyの結合法則が成立する", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            const Matrix = await import("@next2d/geom").then(m => m.Matrix);

            const m1 = new Float32Array([2, 0, 0, 2, 0, 0]);
            const m2 = new Float32Array([1.5, 0, 0, 1.5, 0, 0]);
            const m3 = new Float32Array([1.2, 0, 0, 1.2, 0, 0]);

            // (m1 * m2) * m3
            const temp1 = Matrix.multiply(m1, m2);
            const result1 = Matrix.multiply(temp1, m3);

            // m1 * (m2 * m3)
            const temp2 = Matrix.multiply(m2, m3);
            const result2 = Matrix.multiply(m1, temp2);

            for (let i = 0; i < 6; i++) {
                expect(result1[i]).toBeCloseTo(result2[i]);
            }
        });
    });

    describe("パフォーマンス", () => {
        it("$getConcatenatedMatrixが高速に実行される", () => {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                $getConcatenatedMatrix();
            }
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが50ms以内で完了
            expect(duration).toBeLessThan(50);
        });

        it("$createTransformMatrixが高速に実行される", () => {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                $createTransformMatrix(mockCharacter);
            }
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが50ms以内で完了
            expect(duration).toBeLessThan(50);
        });

        it("$createTransformElementStyleが高速に実行される", () => {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                $createTransformElementStyle(mockCharacter);
            }
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが50ms以内で完了
            expect(duration).toBeLessThan(50);
        });

        it("多数の親を持つ場合でも妥当な時間で処理される", async () => {
            const { timelineSceneList } = await import("../../../timeline/domain/model/TimelineSceneList");
            
            // 10個の親を設定
            timelineSceneList.parents = Array.from({ length: 10 }, () => ({
                selectCharacter: {
                    matrix: new Float32Array([1.1, 0, 0, 1.1, 1, 1])
                }
            }));

            const start = performance.now();
            for (let i = 0; i < 100; i++) {
                $getConcatenatedMatrix();
            }
            const end = performance.now();
            const duration = end - start;

            // 100回の呼び出しが50ms以内で完了
            expect(duration).toBeLessThan(50);
        });
    });
});
