import { describe, test, expect, beforeEach, vi } from "vitest";
import { ExternalAlign } from "./ExternalAlign";
import { execute as externalAlignLeftUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignLeftUseCase";
import { execute as externalAlignCenterUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignCenterUseCase";
import { execute as externalAlignRightUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignRightUseCase";
import { execute as externalAlignTopUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignTopUseCase";
import { execute as externalAlignMiddleUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignMiddleUseCase";
import { execute as externalAlignBottomUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignBottomUseCase";
import { execute as externalAlignStageLeftUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageLeftUseCase";
import { execute as externalAlignStageCenterUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageCenterUseCase";
import { execute as externalAlignStageRightUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageRightUseCase";
import { execute as externalAlignStageTopUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageTopUseCase";
import { execute as externalAlignStageMiddleUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageMiddleUseCase";
import { execute as externalAlignStageBottomUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageBottomUseCase";

// すべてのUseCaseをモック化
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignLeftUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignCenterUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignRightUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignTopUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignMiddleUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignBottomUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageLeftUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageCenterUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageRightUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageTopUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageMiddleUseCase");
vi.mock("@/external/controller/application/ExternalAlign/usecase/ExternalAlignStageBottomUseCase");

describe("ExternalAlign", () => {

    let externalAlign: ExternalAlign;
    let mockWorkSpace: any;
    let mockMovieClip: any;

    beforeEach(() => {
        // モックをクリア
        vi.clearAllMocks();

        // モックオブジェクトを作成
        mockWorkSpace = {
            scene: {}
        };

        mockMovieClip = {
            selectedDepths: new Map()
        };

        // ExternalAlignのインスタンスを作成
        externalAlign = new ExternalAlign(mockWorkSpace, mockMovieClip);
    });

    describe("constructor", () => {

        test("WorkSpaceとMovieClipを受け取ってインスタンスを生成できる", () => {
            expect(externalAlign).toBeInstanceOf(ExternalAlign);
        });

        test("異なるWorkSpaceとMovieClipで複数のインスタンスを生成できる", () => {
            const workSpace1 = { scene: {} } as any;
            const movieClip1 = { selectedDepths: new Map() } as any;
            const align1 = new ExternalAlign(workSpace1, movieClip1);

            const workSpace2 = { scene: {} } as any;
            const movieClip2 = { selectedDepths: new Map() } as any;
            const align2 = new ExternalAlign(workSpace2, movieClip2);

            expect(align1).toBeInstanceOf(ExternalAlign);
            expect(align2).toBeInstanceOf(ExternalAlign);
            expect(align1).not.toBe(align2);
        });

    });

    describe("選択範囲への整列メソッド", () => {

        describe("left()", () => {

            test("externalAlignLeftUseCaseが呼び出される", async () => {
                await externalAlign.left();

                expect(externalAlignLeftUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignLeftUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.left();
                await externalAlign.left();
                await externalAlign.left();

                expect(externalAlignLeftUseCase).toHaveBeenCalledTimes(3);
            });

            test("Promiseを返す", async () => {
                const result = externalAlign.left();
                expect(result).toBeInstanceOf(Promise);
                await result;
            });

        });

        describe("center()", () => {

            test("externalAlignCenterUseCaseが呼び出される", async () => {
                await externalAlign.center();

                expect(externalAlignCenterUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignCenterUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.center();
                await externalAlign.center();

                expect(externalAlignCenterUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("right()", () => {

            test("externalAlignRightUseCaseが呼び出される", async () => {
                await externalAlign.right();

                expect(externalAlignRightUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignRightUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.right();
                await externalAlign.right();

                expect(externalAlignRightUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("top()", () => {

            test("externalAlignTopUseCaseが呼び出される", async () => {
                await externalAlign.top();

                expect(externalAlignTopUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignTopUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.top();
                await externalAlign.top();

                expect(externalAlignTopUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("middle()", () => {

            test("externalAlignMiddleUseCaseが呼び出される", async () => {
                await externalAlign.middle();

                expect(externalAlignMiddleUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignMiddleUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.middle();
                await externalAlign.middle();

                expect(externalAlignMiddleUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("bottom()", () => {

            test("externalAlignBottomUseCaseが呼び出される", async () => {
                await externalAlign.bottom();

                expect(externalAlignBottomUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignBottomUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.bottom();
                await externalAlign.bottom();

                expect(externalAlignBottomUseCase).toHaveBeenCalledTimes(2);
            });

        });

    });

    describe("ステージへの整列メソッド", () => {

        describe("stageLeft()", () => {

            test("externalAlignStageLeftUseCaseが呼び出される", async () => {
                await externalAlign.stageLeft();

                expect(externalAlignStageLeftUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignStageLeftUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.stageLeft();
                await externalAlign.stageLeft();

                expect(externalAlignStageLeftUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("stageCenter()", () => {

            test("externalAlignStageCenterUseCaseが呼び出される", async () => {
                await externalAlign.stageCenter();

                expect(externalAlignStageCenterUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignStageCenterUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.stageCenter();
                await externalAlign.stageCenter();

                expect(externalAlignStageCenterUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("stageRight()", () => {

            test("externalAlignStageRightUseCaseが呼び出される", async () => {
                await externalAlign.stageRight();

                expect(externalAlignStageRightUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignStageRightUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.stageRight();
                await externalAlign.stageRight();

                expect(externalAlignStageRightUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("stageTop()", () => {

            test("externalAlignStageTopUseCaseが呼び出される", async () => {
                await externalAlign.stageTop();

                expect(externalAlignStageTopUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignStageTopUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.stageTop();
                await externalAlign.stageTop();

                expect(externalAlignStageTopUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("stageMiddle()", () => {

            test("externalAlignStageMiddleUseCaseが呼び出される", async () => {
                await externalAlign.stageMiddle();

                expect(externalAlignStageMiddleUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignStageMiddleUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.stageMiddle();
                await externalAlign.stageMiddle();

                expect(externalAlignStageMiddleUseCase).toHaveBeenCalledTimes(2);
            });

        });

        describe("stageBottom()", () => {

            test("externalAlignStageBottomUseCaseが呼び出される", async () => {
                await externalAlign.stageBottom();

                expect(externalAlignStageBottomUseCase).toHaveBeenCalledTimes(1);
                expect(externalAlignStageBottomUseCase).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            });

            test("複数回呼び出すことができる", async () => {
                await externalAlign.stageBottom();
                await externalAlign.stageBottom();

                expect(externalAlignStageBottomUseCase).toHaveBeenCalledTimes(2);
            });

        });

    });

    describe("メソッドの組み合わせテスト", () => {

        test("複数の整列メソッドを順番に実行できる", async () => {
            await externalAlign.left();
            await externalAlign.top();
            await externalAlign.center();
            await externalAlign.middle();

            expect(externalAlignLeftUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignTopUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignCenterUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignMiddleUseCase).toHaveBeenCalledTimes(1);
        });

        test("選択範囲とステージの整列を組み合わせて実行できる", async () => {
            await externalAlign.left();
            await externalAlign.stageTop();
            await externalAlign.right();
            await externalAlign.stageBottom();

            expect(externalAlignLeftUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageTopUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignRightUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageBottomUseCase).toHaveBeenCalledTimes(1);
        });

        test("すべての整列メソッドを実行できる", async () => {
            await externalAlign.left();
            await externalAlign.center();
            await externalAlign.right();
            await externalAlign.top();
            await externalAlign.middle();
            await externalAlign.bottom();
            await externalAlign.stageLeft();
            await externalAlign.stageCenter();
            await externalAlign.stageRight();
            await externalAlign.stageTop();
            await externalAlign.stageMiddle();
            await externalAlign.stageBottom();

            expect(externalAlignLeftUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignCenterUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignRightUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignTopUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignMiddleUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignBottomUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageLeftUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageCenterUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageRightUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageTopUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageMiddleUseCase).toHaveBeenCalledTimes(1);
            expect(externalAlignStageBottomUseCase).toHaveBeenCalledTimes(1);
        });

    });

    describe("エラーハンドリング", () => {

        test("UseCaseがエラーをthrowした場合、エラーが伝播する", async () => {
            const testError = new Error("Test error");
            (externalAlignLeftUseCase as any).mockRejectedValue(testError);

            await expect(externalAlign.left()).rejects.toThrow("Test error");
        });

        test("UseCaseが複数回エラーをthrowしても、それぞれ処理される", async () => {
            const testError = new Error("Test error");
            (externalAlignCenterUseCase as any).mockRejectedValue(testError);

            await expect(externalAlign.center()).rejects.toThrow("Test error");
            await expect(externalAlign.center()).rejects.toThrow("Test error");
        });

        test("異なるメソッドでエラーが発生しても独立している", async () => {
            const leftError = new Error("Left error");
            const rightError = new Error("Right error");
            
            (externalAlignLeftUseCase as any).mockRejectedValue(leftError);
            (externalAlignRightUseCase as any).mockRejectedValue(rightError);

            await expect(externalAlign.left()).rejects.toThrow("Left error");
            await expect(externalAlign.right()).rejects.toThrow("Right error");
        });

    });

    describe("非同期処理の確認", () => {

        test("すべてのメソッドがPromiseを返す", async () => {
            // モックを正常にresolveするように設定
            (externalAlignLeftUseCase as any).mockResolvedValue(undefined);
            (externalAlignCenterUseCase as any).mockResolvedValue(undefined);
            (externalAlignRightUseCase as any).mockResolvedValue(undefined);
            (externalAlignTopUseCase as any).mockResolvedValue(undefined);
            (externalAlignMiddleUseCase as any).mockResolvedValue(undefined);
            (externalAlignBottomUseCase as any).mockResolvedValue(undefined);
            (externalAlignStageLeftUseCase as any).mockResolvedValue(undefined);
            (externalAlignStageCenterUseCase as any).mockResolvedValue(undefined);
            (externalAlignStageRightUseCase as any).mockResolvedValue(undefined);
            (externalAlignStageTopUseCase as any).mockResolvedValue(undefined);
            (externalAlignStageMiddleUseCase as any).mockResolvedValue(undefined);
            (externalAlignStageBottomUseCase as any).mockResolvedValue(undefined);

            const methods = [
                externalAlign.left(),
                externalAlign.center(),
                externalAlign.right(),
                externalAlign.top(),
                externalAlign.middle(),
                externalAlign.bottom(),
                externalAlign.stageLeft(),
                externalAlign.stageCenter(),
                externalAlign.stageRight(),
                externalAlign.stageTop(),
                externalAlign.stageMiddle(),
                externalAlign.stageBottom()
            ];

            methods.forEach(method => {
                expect(method).toBeInstanceOf(Promise);
            });

            await Promise.all(methods);
        });

        test("awaitで順次実行される", async () => {
            const callOrder: string[] = [];

            (externalAlignLeftUseCase as any).mockImplementation(async () => {
                callOrder.push("left");
            });
            (externalAlignRightUseCase as any).mockImplementation(async () => {
                callOrder.push("right");
            });
            (externalAlignTopUseCase as any).mockImplementation(async () => {
                callOrder.push("top");
            });

            await externalAlign.left();
            await externalAlign.right();
            await externalAlign.top();

            expect(callOrder).toEqual(["left", "right", "top"]);
        });

    });

    describe("引数の受け渡し確認", () => {

        test("コンストラクタで渡したWorkSpaceとMovieClipが正しく渡される", async () => {
            const customWorkSpace = { scene: { custom: true } };
            const customMovieClip = { selectedDepths: new Map([[1, [2, 3]]]) };
            
            const customAlign = new ExternalAlign(customWorkSpace as any, customMovieClip as any);
            
            await customAlign.left();
            
            expect(externalAlignLeftUseCase).toHaveBeenCalledWith(customWorkSpace, customMovieClip);
        });

        test("複数のインスタンスがそれぞれ独立したWorkSpaceとMovieClipを持つ", async () => {
            const workSpace1 = { scene: { id: 1 } };
            const movieClip1 = { selectedDepths: new Map([[1, [1]]]) };
            const align1 = new ExternalAlign(workSpace1 as any, movieClip1 as any);

            const workSpace2 = { scene: { id: 2 } };
            const movieClip2 = { selectedDepths: new Map([[2, [2]]]) };
            const align2 = new ExternalAlign(workSpace2 as any, movieClip2 as any);

            await align1.left();
            await align2.right();

            expect(externalAlignLeftUseCase).toHaveBeenCalledWith(workSpace1, movieClip1);
            expect(externalAlignRightUseCase).toHaveBeenCalledWith(workSpace2, movieClip2);
        });

    });

});
