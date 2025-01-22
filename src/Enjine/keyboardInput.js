/**
	Class that helps to manage keyboard input.
	Code by Rob Kleffner, 2011
*/

Enjine.Keys = {
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 80,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40
};

Enjine.KeyboardInput = {
    Pressed: new Array(),
    
    Initialize: function() {
        var self = this;
        document.onkeydown = function(event) { self.KeyDownEvent(event); }
        document.onkeyup = function(event) { self.KeyUpEvent(event); }
    },
    
    IsKeyDown: function(key) {
        if (this.Pressed[key] != null)
            return this.Pressed[key];
        return false;
    },
    
    KeyDownEvent: function(event) {
        this.Pressed[event.keyCode] = true;
	this.PreventScrolling(event);
    },
    
    KeyUpEvent: function(event) {
        this.Pressed[event.keyCode] = false;
	this.PreventScrolling(event);
    },

    PreventScrolling: function(event) {
        // 37: left, 38: up, 39: right, 40: down
        if(event.keyCode >= 37 && event.keyCode <= 40){
            event.preventDefault();
        }
    }
};

/**
	Simple demo of the engine.
	Code by Rob Kleffner, 2011
*/

Enjine.Application = function() {
    this.canvas = null;
    this.timer = null;
    this.stateContext = null;
};

Enjine.Application.prototype = {
    Update: function(delta) {
        
        this.stateContext.Update(delta);
        
        this.canvas.BeginDraw();
        
        this.stateContext.Draw(this.canvas.BackBufferContext2D);
        
        this.canvas.EndDraw();
    },
    
    Initialize: function(defaultState, resWidth, resHeight) {
        this.canvas = new Enjine.GameCanvas();
        this.timer = new Enjine.GameTimer();
        Enjine.KeyboardInput.Initialize();      
        this.canvas.Initialize("canvas", resWidth, resHeight);
        this.timer.UpdateObject = this;
        
        this.stateContext = new Enjine.GameStateContext(defaultState);
        
        this.timer.Start();
    }
};