// 导入jQuery
import $ from 'jquery'

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

// 初始化应用
$(document).ready(function() {
    const state = new Mario.LoadingState()
    new Enjine.Application().Initialize(state, 320, 240)
}) 