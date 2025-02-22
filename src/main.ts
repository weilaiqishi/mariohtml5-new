// 导入jQuery
import $ from 'jquery'
import nipplejs from 'nipplejs'

// 导入Enjine模块
import { Enjine } from './EnjineTs/core'

// 导入游戏代码
import './codeTs/setup.ts'
import './codeTs/spriteCuts.ts'
import './codeTs/level.ts'
import './codeTs/backgroundGenerator.ts'
import './codeTs/backgroundRenderer.ts'
import './codeTs/improvedNoise.ts'
import './codeTs/notchSprite.ts'
import './codeTs/character.ts'
import './codeTs/levelRenderer.ts'
import './codeTs/levelGenerator.ts'
import './codeTs/spriteTemplate.ts'
import './codeTs/enemy.ts'
import './codeTs/fireball.ts'
import './codeTs/sparkle.ts'
import './codeTs/coinAnim.ts'
import './codeTs/mushroom.ts'
import './codeTs/particle.ts'
import './codeTs/fireFlower.ts'
import './codeTs/bulletBill.ts'
import './codeTs/flowerEnemy.ts'
import './codeTs/shell.ts'

// 导入游戏状态
import './codeTs/titleState.ts'
import './codeTs/loadingState.ts'
import './codeTs/loseState.ts'
import './codeTs/winState.ts'
import './codeTs/mapState.ts'
import './codeTs/levelState.ts'

import { Mario } from './codeTs/setup.ts'

// 初始化移动端控制
function initializeMobileControls() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const shortWidth = windowWidth < windowHeight ? windowWidth : windowHeight;
    const joystick = nipplejs.create({
        zone: document.getElementById('joystick-area'),
        mode: 'static',
        position: { left: '12vw', bottom: '10vw' },
        color: 'white',
        size: Math.round(shortWidth * 0.5)
    });

    // 窗口大小改变时更新摇杆大小
    window.addEventListener('resize', () => {
        const nipple = joystick.get()[0];
        if (nipple) {
            nipple.options.size = Math.round(window.innerWidth * 0.12);
            nipple.destroy();
            joystick.create();
        }
    });

    // 模拟按键事件
    function simulateKey(keyCode: number, isDown: boolean) {
        const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
            keyCode: keyCode,
            which: keyCode,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // 摇杆控制
    let activeKeys = new Set<number>();
    joystick.on('move', (evt: any, data: any) => {
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

    joystick.on('end', () => {
        // 释放所有按键
        for (const key of activeKeys) {
            simulateKey(key, false);
        }
        activeKeys.clear();
    });

    // 添加虚拟按钮事件
    ['buttonA', 'buttonS'].forEach(id => {
        const button = document.getElementById(id);
        const keyCode = id === 'buttonA' ? 65 : 83; // A = 65, S = 83

        button?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            simulateKey(keyCode, true);
        });

        button?.addEventListener('touchend', (e) => {
            e.preventDefault();
            simulateKey(keyCode, false);
        });
    });
}

// 初始化应用
$(document).ready(function() {
    const state = new Mario.LoadingState()
    new Enjine.Application().Initialize(state, 320, 240)
    initializeMobileControls();
})