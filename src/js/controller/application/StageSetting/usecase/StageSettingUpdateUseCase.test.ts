import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// サービスのモック
vi.mock("../service/StageSettingUpdateWidthService", () => ({
    execute: vi.fn()
}));

vi.mock("../service/StageSettingUpdateHeightService", () => ({
    execute: vi.fn()
}));

vi.mock("../service/StageSettingUpdateFpsService", () => ({
    execute: vi.fn()
}));

vi.mock("../service/StageSettingUpdateColorService", () => ({
    execute: vi.fn()
}));

import { execute } from "./StageSettingUpdateUseCase";
import { execute as stageSettingUpdateWidthService } from "../service/StageSettingUpdateWidthService";
import { execute as stageSettingUpdateHeightService } from "../service/StageSettingUpdateHeightService";
import { execute as stageSettingUpdateFpsService } from "../service/StageSettingUpdateFpsService";
import { execute as stageSettingUpdateColorService } from "../service/StageSettingUpdateColorService";
import type { Stage } from "@/core/domain/model/Stage";

describe("StageSettingUpdateUseCase", () => {
    let mockStage: Stage;

    beforeEach(() => {
        vi.clearAllMocks();

        // 基本的なモックStageのセットアップ
        mockStage = {
            width: 800,
            height: 600,
            fps: 30,
            bgColor: "#FFFFFF"
        } as Stage;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("すべてのステージ設定更新サービスが正しく呼ばれる", () => {
            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(800);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(600);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(30);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#FFFFFF");
        });

        it("すべてのサービスが1回ずつ呼ばれる", () => {
            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledTimes(1);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledTimes(1);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledTimes(1);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledTimes(1);
        });

        it("戻り値がundefinedである（voidを返す）", () => {
            const result = execute(mockStage);

            expect(result).toBeUndefined();
        });
    });

    describe("様々なステージサイズ", () => {
        it("小さなステージサイズ（320x240）", () => {
            mockStage.width = 320;
            mockStage.height = 240;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(320);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(240);
        });

        it("大きなステージサイズ（1920x1080）", () => {
            mockStage.width = 1920;
            mockStage.height = 1080;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(1920);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(1080);
        });

        it("正方形のステージサイズ（600x600）", () => {
            mockStage.width = 600;
            mockStage.height = 600;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(600);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(600);
        });

        it("縦長のステージサイズ（480x800）", () => {
            mockStage.width = 480;
            mockStage.height = 800;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(480);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(800);
        });

        it("非常に大きなステージサイズ（4096x2160）", () => {
            mockStage.width = 4096;
            mockStage.height = 2160;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(4096);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(2160);
        });

        it("小数点を含むステージサイズ", () => {
            mockStage.width = 800.5;
            mockStage.height = 600.75;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(800.5);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(600.75);
        });
    });

    describe("様々なFPS値", () => {
        it("低いFPS（12）", () => {
            mockStage.fps = 12;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(12);
        });

        it("標準的なFPS（24）", () => {
            mockStage.fps = 24;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(24);
        });

        it("高いFPS（60）", () => {
            mockStage.fps = 60;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(60);
        });

        it("非常に高いFPS（120）", () => {
            mockStage.fps = 120;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(120);
        });

        it("小数点を含むFPS", () => {
            mockStage.fps = 29.97;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(29.97);
        });
    });

    describe("様々な背景色", () => {
        it("白色の背景（#FFFFFF）", () => {
            mockStage.bgColor = "#FFFFFF";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#FFFFFF");
        });

        it("黒色の背景（#000000）", () => {
            mockStage.bgColor = "#000000";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#000000");
        });

        it("赤色の背景（#FF0000）", () => {
            mockStage.bgColor = "#FF0000";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#FF0000");
        });

        it("緑色の背景（#00FF00）", () => {
            mockStage.bgColor = "#00FF00";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#00FF00");
        });

        it("青色の背景（#0000FF）", () => {
            mockStage.bgColor = "#0000FF";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#0000FF");
        });

        it("グレーの背景（#CCCCCC）", () => {
            mockStage.bgColor = "#CCCCCC";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#CCCCCC");
        });

        it("小文字のカラーコード（#ffffff）", () => {
            mockStage.bgColor = "#ffffff";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#ffffff");
        });

        it("3桁のカラーコード（#FFF）", () => {
            mockStage.bgColor = "#FFF";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#FFF");
        });

        it("RGB形式のカラーコード", () => {
            mockStage.bgColor = "rgb(255, 255, 255)";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("rgb(255, 255, 255)");
        });

        it("RGBA形式のカラーコード", () => {
            mockStage.bgColor = "rgba(255, 255, 255, 0.5)";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("rgba(255, 255, 255, 0.5)");
        });

        it("色名形式（white）", () => {
            mockStage.bgColor = "white";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("white");
        });
    });

    describe("エッジケース", () => {
        it("幅が0の場合", () => {
            mockStage.width = 0;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(0);
        });

        it("高さが0の場合", () => {
            mockStage.height = 0;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(0);
        });

        it("FPSが0の場合", () => {
            mockStage.fps = 0;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(0);
        });

        it("負の幅", () => {
            mockStage.width = -100;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(-100);
        });

        it("負の高さ", () => {
            mockStage.height = -100;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(-100);
        });

        it("負のFPS", () => {
            mockStage.fps = -30;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(-30);
        });

        it("空文字列の背景色", () => {
            mockStage.bgColor = "";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("");
        });

        it("非常に大きな幅", () => {
            mockStage.width = Number.MAX_SAFE_INTEGER;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
        });

        it("非常に大きな高さ", () => {
            mockStage.height = Number.MAX_SAFE_INTEGER;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
        });

        it("非常に大きなFPS", () => {
            mockStage.fps = Number.MAX_SAFE_INTEGER;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
        });

        it("Infinity の幅", () => {
            mockStage.width = Infinity;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(Infinity);
        });

        it("NaN の高さ", () => {
            mockStage.height = NaN;

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(NaN);
        });
    });

    describe("サービス呼び出し順序", () => {
        it("サービスが正しい順序で呼ばれる（width → height → fps → color）", () => {
            const callOrder: string[] = [];

            vi.mocked(stageSettingUpdateWidthService).mockImplementation(() => {
                callOrder.push("width");
            });
            vi.mocked(stageSettingUpdateHeightService).mockImplementation(() => {
                callOrder.push("height");
            });
            vi.mocked(stageSettingUpdateFpsService).mockImplementation(() => {
                callOrder.push("fps");
            });
            vi.mocked(stageSettingUpdateColorService).mockImplementation(() => {
                callOrder.push("color");
            });

            execute(mockStage);

            expect(callOrder).toEqual(["width", "height", "fps", "color"]);
        });
    });

    describe("複数回の呼び出し", () => {
        it("2回呼び出した場合、各サービスが2回呼ばれる", () => {
            execute(mockStage);
            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledTimes(2);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledTimes(2);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledTimes(2);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledTimes(2);
        });

        it("異なるステージ設定で複数回呼び出し", () => {
            const stage1 = { width: 800, height: 600, fps: 30, bgColor: "#FFFFFF" } as Stage;
            const stage2 = { width: 1024, height: 768, fps: 60, bgColor: "#000000" } as Stage;

            execute(stage1);
            execute(stage2);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenNthCalledWith(1, 800);
            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenNthCalledWith(2, 1024);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenNthCalledWith(1, 600);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenNthCalledWith(2, 768);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenNthCalledWith(1, 30);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenNthCalledWith(2, 60);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenNthCalledWith(1, "#FFFFFF");
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenNthCalledWith(2, "#000000");
        });
    });

    describe("エラーハンドリング", () => {
        it("widthサービスでエラーが発生した場合", () => {
            vi.mocked(stageSettingUpdateWidthService).mockImplementation(() => {
                throw new Error("Width update failed");
            });

            expect(() => execute(mockStage)).toThrow("Width update failed");
        });

        it("heightサービスでエラーが発生した場合", () => {
            vi.mocked(stageSettingUpdateHeightService).mockImplementation(() => {
                throw new Error("Height update failed");
            });

            expect(() => execute(mockStage)).toThrow("Height update failed");
        });

        it("fpsサービスでエラーが発生した場合", () => {
            vi.mocked(stageSettingUpdateFpsService).mockImplementation(() => {
                throw new Error("FPS update failed");
            });

            expect(() => execute(mockStage)).toThrow("FPS update failed");
        });

        it("colorサービスでエラーが発生した場合", () => {
            vi.mocked(stageSettingUpdateColorService).mockImplementation(() => {
                throw new Error("Color update failed");
            });

            expect(() => execute(mockStage)).toThrow("Color update failed");
        });

        it("heightサービスでエラーが発生した場合、それ以降のサービスは呼ばれない", () => {
            vi.mocked(stageSettingUpdateHeightService).mockImplementation(() => {
                throw new Error("Height update failed");
            });

            expect(() => execute(mockStage)).toThrow("Height update failed");

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledTimes(1);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledTimes(1);
            expect(vi.mocked(stageSettingUpdateFpsService)).not.toHaveBeenCalled();
            expect(vi.mocked(stageSettingUpdateColorService)).not.toHaveBeenCalled();
        });
    });

    describe("実際のステージ設定シナリオ", () => {
        it("HD解像度（1280x720, 60fps, 白背景）", () => {
            mockStage.width = 1280;
            mockStage.height = 720;
            mockStage.fps = 60;
            mockStage.bgColor = "#FFFFFF";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(1280);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(720);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(60);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#FFFFFF");
        });

        it("フルHD解像度（1920x1080, 30fps, 黒背景）", () => {
            mockStage.width = 1920;
            mockStage.height = 1080;
            mockStage.fps = 30;
            mockStage.bgColor = "#000000";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(1920);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(1080);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(30);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#000000");
        });

        it("モバイル解像度（375x667, 30fps, グレー背景）", () => {
            mockStage.width = 375;
            mockStage.height = 667;
            mockStage.fps = 30;
            mockStage.bgColor = "#CCCCCC";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(375);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(667);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(30);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#CCCCCC");
        });

        it("タブレット解像度（768x1024, 24fps, 青背景）", () => {
            mockStage.width = 768;
            mockStage.height = 1024;
            mockStage.fps = 24;
            mockStage.bgColor = "#0000FF";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(768);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(1024);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(24);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#0000FF");
        });

        it("4K解像度（3840x2160, 60fps, 白背景）", () => {
            mockStage.width = 3840;
            mockStage.height = 2160;
            mockStage.fps = 60;
            mockStage.bgColor = "#FFFFFF";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(3840);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(2160);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(60);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#FFFFFF");
        });

        it("レトロゲーム解像度（320x240, 12fps, 黒背景）", () => {
            mockStage.width = 320;
            mockStage.height = 240;
            mockStage.fps = 12;
            mockStage.bgColor = "#000000";

            execute(mockStage);

            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledWith(320);
            expect(vi.mocked(stageSettingUpdateHeightService)).toHaveBeenCalledWith(240);
            expect(vi.mocked(stageSettingUpdateFpsService)).toHaveBeenCalledWith(12);
            expect(vi.mocked(stageSettingUpdateColorService)).toHaveBeenCalledWith("#000000");
        });
    });

    describe("型の検証", () => {
        it("widthがnumber型として渡される", () => {
            execute(mockStage);

            const widthCall = vi.mocked(stageSettingUpdateWidthService).mock.calls[0][0];
            expect(typeof widthCall).toBe("number");
        });

        it("heightがnumber型として渡される", () => {
            execute(mockStage);

            const heightCall = vi.mocked(stageSettingUpdateHeightService).mock.calls[0][0];
            expect(typeof heightCall).toBe("number");
        });

        it("fpsがnumber型として渡される", () => {
            execute(mockStage);

            const fpsCall = vi.mocked(stageSettingUpdateFpsService).mock.calls[0][0];
            expect(typeof fpsCall).toBe("number");
        });

        it("bgColorがstring型として渡される", () => {
            execute(mockStage);

            const colorCall = vi.mocked(stageSettingUpdateColorService).mock.calls[0][0];
            expect(typeof colorCall).toBe("string");
        });
    });

    describe("パフォーマンステスト", () => {
        it("高速に実行される", () => {
            const start = performance.now();
            execute(mockStage);
            const end = performance.now();
            const duration = end - start;

            // 1ms以内で完了することを期待
            expect(duration).toBeLessThan(1);
        });

        it("大量の呼び出しでもパフォーマンスが安定している", () => {
            const start = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                execute(mockStage);
            }
            
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが50ms以内で完了することを期待
            expect(duration).toBeLessThan(50);
            expect(vi.mocked(stageSettingUpdateWidthService)).toHaveBeenCalledTimes(1000);
        });
    });

    describe("統合テスト", () => {
        it("すべてのサービスが正常に完了する", () => {
            let widthUpdated = false;
            let heightUpdated = false;
            let fpsUpdated = false;
            let colorUpdated = false;

            vi.mocked(stageSettingUpdateWidthService).mockImplementation(() => {
                widthUpdated = true;
            });
            vi.mocked(stageSettingUpdateHeightService).mockImplementation(() => {
                heightUpdated = true;
            });
            vi.mocked(stageSettingUpdateFpsService).mockImplementation(() => {
                fpsUpdated = true;
            });
            vi.mocked(stageSettingUpdateColorService).mockImplementation(() => {
                colorUpdated = true;
            });

            execute(mockStage);

            expect(widthUpdated).toBe(true);
            expect(heightUpdated).toBe(true);
            expect(fpsUpdated).toBe(true);
            expect(colorUpdated).toBe(true);
        });

        it("ステージ設定が段階的に更新される", () => {
            const updates: string[] = [];

            vi.mocked(stageSettingUpdateWidthService).mockImplementation((width) => {
                updates.push(`width:${width}`);
            });
            vi.mocked(stageSettingUpdateHeightService).mockImplementation((height) => {
                updates.push(`height:${height}`);
            });
            vi.mocked(stageSettingUpdateFpsService).mockImplementation((fps) => {
                updates.push(`fps:${fps}`);
            });
            vi.mocked(stageSettingUpdateColorService).mockImplementation((color) => {
                updates.push(`color:${color}`);
            });

            execute(mockStage);

            expect(updates).toEqual([
                "width:800",
                "height:600",
                "fps:30",
                "color:#FFFFFF"
            ]);
        });
    });
});
