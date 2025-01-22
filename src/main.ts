// 导入jQuery
import $ from 'jquery'

// 导入Enjine模块
import './Enjine/core.js'
import './Enjine/gameCanvas.js'
import './Enjine/keyboardInput.js'
import './Enjine/resources.js'
import './Enjine/drawable.js'
import './Enjine/state.js'
import './Enjine/gameTimer.js'
import './Enjine/camera.js'
import './Enjine/drawableManager.js'
import './Enjine/sprite.js'
import './Enjine/spriteFont.js'
import './Enjine/frameSprite.js'
import './Enjine/animatedSprite.js'
import './Enjine/collideable.js'
import './Enjine/application.js'

// 导入游戏代码
import './code/setup.js'
import './code/spriteCuts.js'
import './code/level.js'
import './code/backgroundGenerator.js'
import './code/backgroundRenderer.js'
import './code/improvedNoise.js'
import './code/notchSprite.js'
import './code/character.js'
import './code/levelRenderer.js'
import './code/levelGenerator.js'
import './code/spriteTemplate.js'
import './code/enemy.js'
import './code/fireball.js'
import './code/sparkle.js'
import './code/coinAnim.js'
import './code/mushroom.js'
import './code/particle.js'
import './code/fireFlower.js'
import './code/bulletBill.js'
import './code/flowerEnemy.js'
import './code/shell.js'

// 导入游戏状态
import './code/titleState.js'
import './code/loadingState.js'
import './code/loseState.js'
import './code/winState.js'
import './code/mapState.js'
import './code/levelState.js'

// 导入音乐模块
import './code/music.js'

// 初始化应用
$(document).ready(function() { 
    new Enjine.Application().Initialize(new Mario.LoadingState(), 320, 240)
}) 