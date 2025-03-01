// 导入jQuery
import $ from "jquery";
import nipplejs, { JoystickManager } from "nipplejs";
import { throttle } from "es-toolkit";
// 导入Enjine模块
import { Enjine } from "./EnjineTs/core";

// 导入游戏代码
import "./codeTs/setup.ts";
import "./codeTs/spriteCuts.ts";
import "./codeTs/level.ts";
import "./codeTs/backgroundGenerator.ts";
import "./codeTs/backgroundRenderer.ts";
import "./codeTs/improvedNoise.ts";
import "./codeTs/notchSprite.ts";
import "./codeTs/character.ts";
import "./codeTs/levelRenderer.ts";
import "./codeTs/levelGenerator.ts";
import "./codeTs/spriteTemplate.ts";
import "./codeTs/enemy.ts";
import "./codeTs/fireball.ts";
import "./codeTs/sparkle.ts";
import "./codeTs/coinAnim.ts";
import "./codeTs/mushroom.ts";
import "./codeTs/particle.ts";
import "./codeTs/fireFlower.ts";
import "./codeTs/bulletBill.ts";
import "./codeTs/flowerEnemy.ts";
import "./codeTs/shell.ts";

// 导入游戏状态
import "./codeTs/titleState.ts";
import "./codeTs/loadingState.ts";
import "./codeTs/loseState.ts";
import "./codeTs/winState.ts";
import "./codeTs/mapState.ts";
import "./codeTs/levelState.ts";

import { Mario } from "./codeTs/setup.ts";
import Bowser from "bowser";

// 模拟按键事件
function simulateKey(keyCode: number, isDown: boolean) {
    const event = new KeyboardEvent(isDown ? "keydown" : "keyup", {
        keyCode: keyCode,
        which: keyCode,
        bubbles: true,
    });
    document.dispatchEvent(event);
}

function init() {
    // 使用 bowser 检测设备类型
    function detectDevice() {
        const parser = Bowser.getParser(window.navigator.userAgent);
        const isDesktop = parser.getPlatformType() === "desktop";

        // 获取移动控制器元素
        const mobileControls = document.querySelector<HTMLBaseElement>(".mobile-controls");
        const joystickArea = document.getElementById("joystick-area");

        if (mobileControls && joystickArea) {
            if (isDesktop) {
                // 桌面设备，隐藏控制器
                mobileControls.style.display = "none";
            } else {
                // 移动设备，显示控制器
                mobileControls.style.display = "block";
                joystickArea.style.display = "block";
            }
        }
    }
    detectDevice();

    // 添加虚拟按钮事件
    ["buttonA", "buttonS"].forEach((id) => {
        const button = document.getElementById(id);
        const keyCode = id === "buttonA" ? 65 : 83; // A = 65, S = 83

        button?.addEventListener("touchstart", (e) => {
            e.preventDefault();
            simulateKey(keyCode, true);
        });

        button?.addEventListener("touchend", (e) => {
            e.preventDefault();
            simulateKey(keyCode, false);
        });
    });
    initializeMobileControls();
    // 监听窗口大小和横竖屏变化
    window.addEventListener("resize", () => {
        initializeMobileControls();
    });
}

let joystick: JoystickManager;

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 初始化移动端控制
const initializeMobileControls = throttle(
    async () => {
        if (joystick) {
            joystick?.destroy();
            await sleep(66);
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const shortWidth = windowWidth < windowHeight ? windowWidth : windowHeight;
        const config = {
            zone: document.getElementById("joystick-area"),
            mode: "static",
            position: { left: "24vmin", bottom: "24vmin" },
            color: "white",
            size: Math.round(shortWidth * 0.4),
        } as const;
        if (windowWidth < windowHeight) {
            Object.assign(config, {
                position: { left: "16vw", bottom: "24vh" },
                size: Math.round(shortWidth * 0.3),
            });
        }
        joystick = nipplejs.create(config);

        // 窗口大小改变时更新摇杆大小

        // 摇杆控制
        let activeKeys = new Set<number>();
        joystick.on("move", (evt: any, data: any) => {
            const angle = data.angle.degree;
            const newKeys = new Set<number>();

            if (angle > 45 && angle < 135) newKeys.add(38); // Up
            if (angle > 135 && angle < 225) newKeys.add(37); // Left
            if (angle > 225 && angle < 315) newKeys.add(40); // Down
            if (angle < 45 || angle > 315) newKeys.add(39); // Right

            // 释放不再激活的按键
            for (const key of activeKeys) {
                if (!newKeys.has(key)) {
                    simulateKey(key, false);
                }
            }
            // 按下新激活的按键
            for (const key of newKeys) {
                if (!activeKeys.has(key)) {
                    simulateKey(key, true);
                }
            }
            activeKeys = newKeys;
        });

        joystick.on("end", () => {
            // 释放所有按键
            for (const key of activeKeys) {
                simulateKey(key, false);
            }
            activeKeys.clear();
        });
    },
    1000,
    { edges: ["leading"] }
);

// 初始化应用
$(document).ready(function () {
    const state = new Mario.LoadingState();
    new Enjine.Application().Initialize(state, 320, 240);
    init();
});
