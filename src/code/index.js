
// ==================== backgroundGenerator.js ====================

/**
	Generates the backgrounds for a level.
	Code by Rob Kleffner, 2011
*/

Mario.BackgroundGenerator = function(width, height, distant, type) {
    this.Width = width;
    this.Height = height;
    this.Distant = distant;
    this.Type = type;
};

Mario.BackgroundGenerator.prototype = {
    SetValues: function(width, height, distant, type) {
        this.Width = width;
        this.Height = height;
        this.Distant = distant;
        this.Type = type;
    },

    CreateLevel: function() {
        var level = new Mario.Level(this.Width, this.Height);
        switch (this.Type) {
            case Mario.LevelType.Overground:
                this.GenerateOverground(level);
                break;
            case Mario.LevelType.Underground:
                this.GenerateUnderground(level);
                break;
            case Mario.LevelType.Castle:
                this.GenerateCastle(level);
                break;
        }
        return level;
    },
    
    GenerateOverground: function(level) {
        var range = this.Distant ? 4 : 6;
        var offs = this.Distant ? 2 : 1;
        var oh = Math.floor(Math.random() * range) + offs;
        var h = Math.floor(Math.random() * range) + offs;
        
        var x = 0, y = 0, h0 = 0, h1 = 0, s = 2;
        for (x = 0; x < this.Width; x++) {
            oh = h;
            while (oh === h) {
                h = Math.floor(Math.random() * range) + offs;
            }
            
            for (y = 0; y < this.Height; y++) {
                h0 = (oh < h) ? oh : h;
                h1 = (oh < h) ? h : oh;
                s = 2;
                if (y < h0) {
                    if (this.Distant){
                        s = 2;
                        if (y < 2) { s = y; }
                        level.SetBlock(x, y, 4 + s * 8);
                    } else {
                        level.SetBlock(x, y, 5);
                    }
                } else if (y === h0) {
                    s = h0 === h ? 0 : 1;
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s);
                } else if (y === h1) {
                    s = h0 === h ? 0 : 1;
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s + 16);
                } else {
                    s = (y > h1) ? 1 : 0;
                    if (h0 === oh) { s = 1 - s; }
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s + 8);
                }
            }
        }
    },
    
    GenerateUnderground: function(level) {
        var x = 0, y = 0, t = 0, yy = 0;
        if (this.Distant) {
            var tt = 0;
            for (x = 0; x < this.Width; x++) {
                if (Math.random() < 0.75) { tt = 1 - tt; }
            
                for (y = 0; y < this.Height; y++) {
                    t = tt;
                    yy = y - 2;
                    
                    if (yy < 0 || yy > 4) {
                        yy = 2;
                        t = 0;
                    }
                    level.SetBlock(x, y, (4 + t + (3 + yy) * 8));
                }
            }
        } else {
            for (x = 0; x < this.Width; x++) {
                for (y = 0; y < this.Height; y++) {
                    t = x % 2;
                    yy = y - 1;
                    if (yy < 0 || yy > 7) {
                        yy = 7;
                        t = 0;
                    }
                    if (t === 0 && yy > 1 && yy < 5) {
                        t = -1;
                        yy = 0;
                    }
                    
                    level.SetBlock(x, y, (6 + t + yy * 8));
                }
            }
        }
    },
    
    GenerateCastle: function(level) {
        var x = 0, y = 0, t = 0, yy = 0;
        if (this.Distant) {
            for (x = 0; x < this.Width; x++) {
                for (y = 0; y < this.Height; y++) {
                    t = x % 2;
                    yy = y - 1;
                    
                    if (yy > 2 && yy < 5) {
                        yy = 2;
                    } else if (yy >= 5) {
                        yy -= 2;
                    }
                    
                    if (yy < 0) {
                        t = 0;
                        yy = 5;
                    } else if (yy > 4) {
                        t = 1;
                        yy = 5;
                    } else if (t < 1 && yy === 3) {
                        t = 0;
                        yy = 3;
                    } else if (t < 1 && yy > 0 && yy < 3) {
                        t = 0;
                        yy = 2;
                    }
                    
                    level.SetBlock(x, y, (1 + t + (yy + 4) * 8));
                }
            }
        } else {
            for (x = 0; x < this.Width; x++) {
                for (y = 0; y < this.Height; y++) {
                    t = x % 3;
                    yy = y - 1;
                    
                    if (yy > 2 && yy < 5) {
                        yy = 2;
                    } else if (yy >= 5) {
                        yy -= 2;
                    }
                    
                    if (yy < 0) {
                        t = 1;
                        yy = 5;
                    } else if (yy > 4) {
                        t = 2;
                        yy = 5;
                    } else if (t < 2 && yy === 4) {
                        t = 2;
                        yy = 4;
                    } else if (t < 2 && yy > 0 && yy < 4) {
                        t = 4;
                        yy = -3;
                    }
                    
                    level.SetBlock(x, y, (1 + t + (yy + 3) * 8));
                }
            }
        }
    }
    
};

// ==================== backgroundRenderer.js ====================

/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

Mario.BackgroundRenderer = function(level, width, height, distance) {
    this.Level = level;
    this.Width = width;
    this.Distance = distance;
    this.TilesY = ((height / 32) | 0) + 1;
    
    this.Background = Mario.SpriteCuts.GetBackgroundSheet();
};

Mario.BackgroundRenderer.prototype = new Enjine.Drawable();

Mario.BackgroundRenderer.prototype.Draw = function(context, camera) {
    var xCam = camera.X / this.Distance;
    var x = 0, y = 0, b = null, frame = null;
    
    //the OR truncates the decimal, quicker than Math.floor
    var xTileStart = (xCam / 32) | 0;
    //the +1 makes sure the right edge tiles get drawn
    var xTileEnd = (((xCam + this.Width) / 32) | 0);
    
    for (x = xTileStart; x <= xTileEnd; x++) {
        for (y = 0; y < this.TilesY; y++) {
            b = this.Level.GetBlock(x, y) & 0xff;
            frame = this.Background[b % 8][(b / 8) | 0];
            
            //bitshifting by five is the same as multiplying by 32
            context.drawImage(Enjine.Resources.Images["background"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 5) - xCam) | 0, (y << 5) | 0, frame.Width, frame.Height);
        }
    }
};

// ==================== bulletBill.js ====================

/**
	Represents a bullet bill enemy.
	Code by Rob Kleffner, 2011
*/

Mario.BulletBill = function(world, x, y, dir) {
	this.Image = Enjine.Resources.Images["enemies"];
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Facing = dir;
	
	this.XPicO = 8;
	this.YPicO = 31;
	this.Height = 12;
	this.Width = 4;
	this.PicWidth = 16;
	this.YPic = 5;
	this.XPic = 0;
	this.Ya = -5;
	this.DeadTime = 0;
	this.Dead = false;
	this.Anim = 0;
};

Mario.BulletBill.prototype = new Mario.NotchSprite();

Mario.BulletBill.prototype.CollideCheck = function() {
    if (this.Dead) {
        return;
    }
    
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
    if (xMarioD > -16 && xMarioD < 16) {
        if (yMarioD > -this.Height && yMarioD < this.World.Mario.Height) {
            if (Mario.MarioCharacter.Y > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
                Mario.MarioCharacter.Stomp(this);
                this.Dead = true;
                
                this.Xa = 0;
                this.Ya = 1;
                this.DeadTime = 100;
            } else {
                Mario.MarioCharacter.GetHurt();
            }
        }
    }
};

Mario.BulletBill.prototype.Move = function() {
    var i = 0, sideWaysSpeed = 4;
    if (this.DeadTime > 0) {
        this.DeadTime--;
        
        if (this.DeadTime === 0) {
            this.DeadTime = 1;
            for (i = 0; i < 8; i++) {
                this.World.AddSprite(new Mario.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.World.RemoveSprite(this);
        }
        
        this.X += this.Xa;
        this.Y += this.Ya;
        this.Ya *= 0.95;
        this.Ya += 1;
        
        return;
    }
    
    this.Xa = this.Facing * sideWaysSpeed;
    this.XFlip = this.Facing === -1;
    this.Move(this.Xa, 0);
};

Mario.BulletBill.prototype.SubMove = function(xa, ya) {
	this.X += xa;
	return true;
};

Mario.BulletBill.prototype.FireballCollideCheck = function(fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xD = fireball.X - this.X, yD = fireball.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < fireball.Height) {
            return true;
        }
    }
    return false;
};

Mario.BulletBill.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xD = shell.X - this.X, yD = shell.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < shell.Height) {
            Enjine.Resources.PlaySound("kick");
            this.Dead = true;
            this.Xa = 0;
            this.Ya = 1;
            this.DeadTime = 100;
            return true;
        }
    }
    return false;
};

// ==================== character.js ====================

/**
	Global representation of the mario character.
	Code by Rob Kleffner, 2011
*/

Mario.Character = function() {
    //these are static in Notch's code... here it doesn't seem necessary
    this.Large = false;
    this.Fire = false;
    this.Coins = 0;
    this.Lives = 3;
    this.LevelString = "none";
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    
    //non static variables in Notch's code
    this.RunTime = 0;
    this.WasOnGround = false;
    this.OnGround = false;
    this.MayJump = false;
    this.Ducking = false;
    this.Sliding = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.CanShoot = false;
    
    this.Width = 4;
    this.Height = 24;
    
    //Level scene
    this.World = null;
    this.Facing = 0;
    this.PowerUpTime = 0;
    
    this.XDeathPos = 0; this.YDeathPos = 0;
    this.DeathTime = 0;
    this.WinTime = 0;
    this.InvulnerableTime = 0;
    
    //Sprite
    this.Carried = null;
    
    this.LastLarge = false;
    this.LastFire = false;
    this.NewLarge = false;
    this.NewFire = false;
};

Mario.Character.prototype = new Mario.NotchSprite(null);

Mario.Character.prototype.Initialize = function(world) {
    this.World = world;
    this.X = 32;
    this.Y = 0;
	this.PowerUpTime = 0;
    
    //non static variables in Notch's code
    this.RunTime = 0;
    this.WasOnGround = false;
    this.OnGround = false;
    this.MayJump = false;
    this.Ducking = false;
    this.Sliding = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.CanShoot = false;
    
    this.Width = 4;
    this.Height = 24;
    
    //Level scene
    this.World = world;
    this.Facing = 0;
    this.PowerUpTime = 0;
    
    this.XDeathPos = 0; this.YDeathPos = 0;
    this.DeathTime = 0;
    this.WinTime = 0;
    this.InvulnerableTime = 0;
    
    //Sprite
    this.Carried = null;
    
    this.SetLarge(this.Large, this.Fire);
};

Mario.Character.prototype.SetLarge = function(large, fire) {
    if (fire) {
        large = true;
    }
    if (!large) {
        fire = false;
    }
    
    this.LastLarge = this.Large;
    this.LastFire = this.Fire;
    this.Large = large;
    this.Fire = fire;
    this.NewLarge = this.Large;
    this.NewFire = this.Fire;
    
    this.Blink(true);
};

Mario.Character.prototype.Blink = function(on) {
    this.Large = on ? this.NewLarge : this.LastLarge;
    this.Fire = on ? this.NewFire : this.LastFire;
    
    if (this.Large) {
        if (this.Fire) {
            this.Image = Enjine.Resources.Images["fireMario"];
        } else {
            this.Image = Enjine.Resources.Images["mario"];
        }
        
        this.XPicO = 16;
        this.YPicO = 31;
        this.PicWidth = this.PicHeight = 32;
    } else {
        this.Image = Enjine.Resources.Images["smallMario"];
        this.XPicO = 8;
        this.YPicO = 15;
        this.PicWidth = this.PicHeight = 16;
    }
};

Mario.Character.prototype.Move = function() {
    if (this.WinTime > 0) {
        this.WinTime++;
        this.Xa = 0;
        this.Ya = 0;
        return;
    }
    
    if (this.DeathTime > 0) {
        this.DeathTime++;
        if (this.DeathTime < 11) {
            this.Xa = 0;
            this.Ya = 0;
        } else if (this.DeathTime === 11) {
            this.Ya = -15;
        } else {
            this.Ya += 2;
        }
        this.X += this.Xa;
        this.Y += this.Ya;
        return;
    }
    
    if (this.PowerUpTime !== 0) {
        if (this.PowerUpTime > 0) {
            this.PowerUpTime--;
            this.Blink((((this.PowerUpTime / 3) | 0) & 1) === 0);
        } else {
            this.PowerUpTime++;
            this.Blink((((-this.PowerUpTime / 3) | 0) & 1) === 0);
        }
        
        if (this.PowerUpTime === 0) {
            this.World.Paused = false;
        }
        
        this.CalcPic();
        return;
    }
    
    if (this.InvulnerableTime > 0) {
        this.InvulnerableTime--;
    }
    
    this.Visible = (((this.InvulerableTime / 2) | 0) & 1) === 0;
    
    this.WasOnGround = this.OnGround;
    var sideWaysSpeed = Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) ? 1.2 : 0.6;
    
    if (this.OnGround) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && this.Large) {
            this.Ducking = true;
        } else {
            this.Ducking = false;
        }
    }
        
    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) || (this.JumpTime < 0 && !this.OnGround && !this.Sliding)) {
        if (this.JumpTime < 0) {
            this.Xa = this.XJumpSpeed;
            this.Ya = -this.JumpTime * this.YJumpSpeed;
            this.JumpTime++;
        } else if (this.OnGround && this.MayJump) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = 0;
            this.YJumpSpeed = -1.9;
            this.JumpTime = 7;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
        } else if (this.Sliding && this.MayJump) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = -this.Facing * 6;
            this.YJumpSpeed = -2;
            this.JumpTime = -6;
            this.Xa = this.XJumpSpeed;
            this.Ya = -this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
            this.Facing = -this.Facing;
        } else if (this.JumpTime > 0) {
            this.Xa += this.XJumpSpeed;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.JumpTime--;
        }
    } else {
        this.JumpTime = 0;
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !this.Ducking) {
        if (this.Facing === 1) {
            this.Sliding = false;
        }
        this.Xa -= sideWaysSpeed;
        if (this.JumpTime >= 0) {
            this.Facing = -1;
        }
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && !this.Ducking) {
        if (this.Facing === -1) {
            this.Sliding = false;
        }
        this.Xa += sideWaysSpeed;
        if (this.JumpTime >= 0) {
            this.Facing = 1;
        }
    }
    
    if ((!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) || this.Ducking || this.Ya < 0 || this.OnGround) {
        this.Sliding = false;  
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.CanShoot && this.Fire && this.World.FireballsOnScreen < 2) {
        Enjine.Resources.PlaySound("fireball");
        this.World.AddSprite(new Mario.Fireball(this.World, this.X + this.Facing * 6, this.Y - 20, this.Facing));
    }
    
    this.CanShoot = !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A);
    this.MayJump = (this.OnGround || this.Sliding) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S);
    this.XFlip = (this.Facing === -1);
    this.RunTime += Math.abs(this.Xa) + 5;
    
    if (Math.abs(this.Xa) < 0.5) {
        this.RunTime = 0;
        this.Xa = 0;
    }
    
    this.CalcPic();
    
    if (this.Sliding) {
        this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 4 - 2) | 0) + this.Facing * 8,
            ((this.Y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5));
        this.Ya *= 0.5;
    }
    
    this.OnGround = false;
    this.SubMove(this.Xa, 0);
    this.SubMove(0, this.Ya);
    if (this.Y > this.World.Level.Height * 16 + 16) {
        this.Die();
    }
    
    if (this.X < 0) {
        this.X = 0;
        this.Xa = 0;
    }
    
    if (this.X > this.World.Level.ExitX * 16) {
        this.Win();
    }
    
    if (this.X > this.World.Level.Width * 16) {
        this.X = this.World.Level.Width * 16;
        this.Xa = 0;
    }
    
    this.Ya *= 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        this.Ya += 3;
    }
    
    if (this.Carried !== null) {
        this.Carried.X *= this.X + this.Facing * 8;
        this.Carried.Y *= this.Y - 2;
        if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A)) {
            this.Carried.Release(this);
            this.Carried = null;
        }
    }
};

Mario.Character.prototype.CalcPic = function() {
    var runFrame = 0, i = 0;
    
    if (this.Large) {
        runFrame = ((this.RunTime / 20) | 0) % 4;
        if (runFrame === 3) {
            runFrame = 1;
        }
        if (this.Carried === null && Math.abs(this.Xa) > 10) {
            runFrame += 3;
        }
        if (this.Carried !== null) {
            runFrame += 10;
        }
        if (!this.OnGround) {
            if (this.Carried !== null) {
                runFrame = 12;
            } else if (Math.abs(this.Xa) > 10) {
                runFrame = 7;
            } else {
                runFrame = 6;
            }
        }
    } else {
        runFrame = ((this.RunTime / 20) | 0) % 2;
        if (this.Carried === null && Math.abs(this.Xa) > 10) {
            runFrame += 2;
        }
        if (this.Carried !== null) {
            runFrame += 8;
        }
        if (!this.OnGround) {
            if (this.Carried !== null) {
                runFrame = 9;
            } else if (Math.abs(this.Xa) > 10) {
                runFrame = 5;
            } else {
                runFrame = 4;
            }
        }
    }
    
    if (this.OnGround && ((this.Facing === -1 && this.Xa > 0) || (this.Facing === 1 && this.Xa < 0))) {
        if (this.Xa > 1 || this.Xa < -1) {
            runFrame = this.Large ? 9 : 7;
        }
        
        if (this.Xa > 3 || this.Xa < -3) {
            for (i = 0; i < 3; i++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
        }
    }
    
    if (this.Large) {
        if (this.Ducking) {
            runFrame = 14;
        }
        this.Height = this.Ducking ? 12 : 24;
    } else {
        this.Height = 12;
    }
    
    this.XPic = runFrame;
};

Mario.Character.prototype.SubMove = function(xa, ya) {
    var collide = false;
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }
    
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        this.Sliding = true;
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
    }
    if (xa < 0) {
        this.Sliding = true;
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.JumpTime = 0;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Character.prototype.IsBlocking = function(x, y, xa, ya) {
    var blocking = false, block = 0, xx = 0, yy = 0;
    
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false;
    }
    
    block = this.World.Level.GetBlock(x, y);
    
    if (((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.PickUpable) > 0) {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
        this.World.Level.SetBlock(x, y, 0);
        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5));
            }
        }
    }
    
    blocking = this.World.Level.IsBlocking(x, y, xa, ya);
    if (blocking && ya < 0) {
        this.World.Bump(x, y, this.Large);
    }
    return blocking;
};

Mario.Character.prototype.Stomp = function(object) {
    var targetY = 0;

    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }
    
    targetY = object.Y - object.Height / 2;
    this.SubMove(0, targetY - this.Y);
    
    if (object instanceof Mario.Enemy || object instanceof Mario.BulletBill) {
        
        Enjine.Resources.PlaySound("kick");
        this.XJumpSpeed = 0;
        this.YJumpSpeed = -1.9;
        this.JumpTime = 8;
        this.Ya = this.JumpTime * this.YJumpSpeed;
        this.OnGround = false;
        this.Sliding = false;
        this.InvulnerableTime = 1;
    } else if (object instanceof Mario.Shell) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && object.Facing === 0) {
            this.Carried = object;
            object.Carried = true;
        } else {
            Enjine.Resources.PlaySound("kick");
            this.XJumpSpeed = 0;
            this.YJumpSpeed = -1.9;
            this.JumpTime = 8;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
            this.InvulnerableTime = 1;
        }
    }
};

Mario.Character.prototype.GetHurt = function() {
    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }
    if (this.InvulnerableTime > 0) {
        return;
    }
    
    if (this.Large) {
        this.World.Paused = true;
        this.PowerUpTime = -18;
        Enjine.Resources.PlaySound("powerdown");
        if (this.Fire) {
            this.SetLarge(true, false);
        } else {
            this.SetLarge(false, false);
        }
        this.InvulnerableTime = 32;
    } else {
        this.Die();
    }
};

Mario.Character.prototype.Win = function() {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.WinTime = 1;
    Enjine.Resources.PlaySound("exit");
};

Mario.Character.prototype.Die = function() {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.DeathTime = 1;
    Enjine.Resources.PlaySound("death");
    this.SetLarge(false, false);
};

Mario.Character.prototype.GetFlower = function() {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }
    
    if (!this.Fire) {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, true);
    } else {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
    }
};

Mario.Character.prototype.GetMushroom = function() {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }
    
    if (!this.Large) {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, false);
    } else {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
    }
};

Mario.Character.prototype.Kick = function(shell) {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A)) {
        this.Carried = shell;
        shell.Carried = true;
    } else {
        Enjine.Resources.PlaySound("kick");
        this.InvulnerableTime = 1;
    }
};

Mario.Character.prototype.Get1Up = function() {
    Enjine.Resources.PlaySound("1up");
    this.Lives++;
    if (this.Lives === 99) {
        this.Lives = 99;
    }
};

Mario.Character.prototype.GetCoin = function() {
    this.Coins++;
    if (this.Coins === 100) {
        this.Coins = 0;
        this.Get1Up();
    }
};


// ==================== coinAnim.js ====================

/**
	Represents a simple little coin animation when popping out of the box.
	Code by Rob Kleffner, 2011
*/

Mario.CoinAnim = function(world, x, y) {
    this.World = world;
    this.Life = 10;
    this.Image = Enjine.Resources.Images["map"];
    this.PicWidth = this.PicHeight = 16;
    this.X = x * 16;
    this.Y = y * 16 - 16;
    this.Xa = 0;
    this.Ya = -6;
    this.XPic = 0;
    this.YPic = 2;
};

Mario.CoinAnim.prototype = new Mario.NotchSprite();

Mario.CoinAnim.prototype.Move = function() {
    var x = 0, y = 0;
    if (this.Life-- < 0) {
        this.World.RemoveSprite(this);
        for (x = 0; x < 2; x++) {
            for (y = 0; y < 2; y++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + x * 8 + Math.random() * 8) | 0, (this.Y + y * 8 + Math.random() * 8) | 0, 0, 0, 0, 2, 5));
            }
        }
    }
    
    this.XPic = this.Life & 3;
    this.X += this.Xa;
    this.Y += this.Ya;
    this.Ya += 1;
};

// ==================== enemy.js ====================

/**
	A generic template for an enemy in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Enemy = function(world, x, y, dir, type, winged) {
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    this.RunTime = 0;
    this.OnGround = false;
    this.MayJump = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.Width = 4;
    this.Height = 24;
    this.DeadTime = 0;
    this.FlyDeath = false;
    this.WingTime = 0;
    this.NoFireballDeath = false;
    
    this.X = x;
    this.Y = y;
    this.World = world;
    
    this.Type = type;
    this.Winged = winged;
    
    this.Image = Enjine.Resources.Images["enemies"];
    
    this.XPicO = 8;
    this.YPicO = 31;
    this.AvoidCliffs = this.Type === Mario.Enemy.RedKoopa;
    this.NoFireballDeath = this.Type === Mario.Enemy.Spiky;
    
    this.YPic = this.Type;
    if (this.YPic > 1) {
        this.Height = 12;
    }
    this.Facing = dir;
    if (this.Facing === 0) {
        this.Facing = 1;
    }
    
    this.PicWidth = 16;
};

Mario.Enemy.prototype = new Mario.NotchSprite();

Mario.Enemy.prototype.CollideCheck = function() {
    if (this.DeadTime !== 0) {
        return;
    }
    
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
        
    if (xMarioD > -this.Width * 2 - 4 && xMarioD < this.Width * 2 + 4) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            if (this.Type !== Mario.Enemy.Spiky && Mario.MarioCharacter.Ya > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
                Mario.MarioCharacter.Stomp(this);
                if (this.Winged) {
                    this.Winged = false;
                    this.Ya = 0;
                } else {
                    this.YPicO = 31 - (32 - 8);
                    this.PicHeight = 8;
                    
                    if (this.SpriteTemplate !== null) {
                        this.SpriteTemplate.IsDead = true;
                    }
                    
                    this.DeadTime = 10;
                    this.Winged = false;
                    
                    if (this.Type === Mario.Enemy.RedKoopa) {
                        this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 0));
                    } else if (this.Type === Mario.Enemy.GreenKoopa) {
                        this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 1));
                    }
                }
            } else {
                Mario.MarioCharacter.GetHurt();
            }
        }
    }
};

Mario.Enemy.prototype.Move = function() {
    var i = 0, sideWaysSpeed = 1.75, runFrame = 0;

    this.WingTime++;
    if (this.DeadTime > 0) {
        this.DeadTime--;
        
        if (this.DeadTime === 0) {
            this.DeadTime = 1;
            for (i = 0; i < 8; i++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y - Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.World.RemoveSprite(this);
        }
        
        if (this.FlyDeath) {
            this.X += this.Xa;
            this.Y += this.Ya;
            this.Ya *= 0.95;
            this.Ya += 1;
        }
        return;
    }
    
    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    
    this.Xa = this.Facing * sideWaysSpeed;
    
    this.MayJump = this.OnGround;
    
    this.XFlip = this.Facing === -1;
    
    this.RunTime += Math.abs(this.Xa) + 5;
    
    runFrame = ((this.RunTime / 20) | 0) % 2;
    
    if (!this.OnGround) {
        runFrame = 1;
    }
    
    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);
    
    this.Ya *= this.Winged ? 0.95 : 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        if (this.Winged) {
            this.Ya += 0.6;
        } else {
            this.Ya += 2;
        }
    } else if (this.Winged) {
        this.Ya = -10;
    }
    
    if (this.Winged) {
        runFrame = ((this.WingTime / 4) | 0) % 2;
    }
    
    this.XPic = runFrame;
};

Mario.Enemy.prototype.SubMove = function(xa, ya) {
    var collide = false;
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }
    
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
        
        if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa + this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
            collide = true;
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
        
        if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa - this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
            collide = true;
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.JumpTime = 0;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Enemy.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }
    
    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.Enemy.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xd = shell.X - this.X, yd = shell.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < shell.Height) {
            Enjine.Resources.PlaySound("kick");
            
            this.Xa = shell.Facing * 2;
            this.Ya = -5;
            this.FlyDeath = true;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            this.DeadTime = 100;
            this.Winged = false;
            this.YFlip = true;
            return true;
        }
    }
    return false;
};

Mario.Enemy.prototype.FireballCollideCheck = function(fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xd = fireball.X - this.X, yd = fireball.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < fireball.Height) {
            if (this.NoFireballDeath) {
                return true;
            }
        
            Enjine.Resources.PlaySound("kick");
            
            this.Xa = fireball.Facing * 2;
            this.Ya = -5;
            this.FlyDeath = true;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            this.DeadTime = 100;
            this.Winged = false;
            this.YFlip = true;
            return true;
        }
    }
};

Mario.Enemy.prototype.BumpCheck = function(xTile, yTile) {
    if (this.DeadTime !== 0) {
        return;
    }
    
    if (this.X + this.Width > xTile * 16 && this.X - this.Width < xTile * 16 + 16 && yTile === ((this.Y - 1) / 16) | 0) {
        Enjine.Resources.PlaySound("kick");
        
        this.Xa = -Mario.MarioCharacter.Facing * 2;
        this.Ya = -5;
        this.FlyDeath = true;
        if (this.SpriteTemplate !== null) {
            this.SpriteTemplate.IsDead = true;
        }
        this.DeadTime = 100;
        this.Winged = false;
        this.YFlip = true;
    }
};

Mario.Enemy.prototype.SubDraw = Mario.NotchSprite.prototype.Draw;

Mario.Enemy.prototype.Draw = function(context, camera) {
    var xPixel = 0, yPixel = 0;
    
    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
        
        if (this.Type !== Mario.Enemy.RedKoopa && this.Type !== Mario.Enemy.GreenKoopa) {
            this.XFlip = !this.XFlip;
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
            this.XFlip = !this.XFlip;
        }
    }
    
    this.SubDraw(context, camera);
    
    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
        
        if (this.Type === Mario.Enemy.RedKoopa && this.Type === Mario.Enemy.GreenKoopa) {
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel) : yPixel - 8, 16, 32);
            context.restore();
        } else {
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
        }
    }
};

//Static variables
Mario.Enemy.RedKoopa = 0;
Mario.Enemy.GreenKoopa = 1;
Mario.Enemy.Goomba = 2;
Mario.Enemy.Spiky = 3;
Mario.Enemy.Flower = 4;

// ==================== fireball.js ====================

/**
	Represents a fireball.
	Code by Rob Kleffner, 2011
*/

Mario.Fireball = function(world, x, y, facing) {
	this.GroundInertia = 0.89;
	this.AirInertia = 0.89;
	
	this.Image = Enjine.Resources.Images["particles"];
	
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Facing = facing;
	
	this.XPicO = 4;
	this.YPicO = 4;
	this.YPic = 3;
	this.XPic = 4;
	this.Height = 8;
	this.Width = 4;
	this.PicWidth = this.PicHeight = 8;
	this.Ya = 4;
	this.Dead = false;
	this.DeadTime = 0;
	this.Anim = 0;
	this.OnGround = false;
};

Mario.Fireball.prototype = new Mario.NotchSprite();

Mario.Fireball.prototype.Move = function() {
	var i = 0, sideWaysSpeed = 8;
	
	if (this.DeadTime > 0) {
		for (i = 0; i < 8; i++) {
			this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 8 - 4) | 0) + 4, ((this.Y + Math.random() * 8 - 4) | 0) + 2, Math.random() * 2 - 1 * this.Facing, Math.random() * 2 - 1, 0, 1, 5));
		}
		this.World.RemoveSprite(this);
		return;
	}
	
	if (this.Facing != 0) {
		this.Anim++;
	}
	
	if (this.Xa > 2) {
		this.Facing = 1;
	}
	if (this.Xa < -2) {
		this.Facing = -1;
	}
	
	this.Xa = this.Facing * sideWaysSpeed;
	
	this.World.CheckFireballCollide(this);
	
	this.FlipX = this.Facing === -1;
	
	this.XPic = this.Anim % 4;
	
	if (!this.SubMove(this.Xa, 0)) {
		this.Die();
	}
	
	this.OnGround = false;
	this.SubMove(0, this.Ya);
	if (this.OnGround) {
		this.Ya = -10;
	}
	
	this.Ya *= 0.95;
	if (this.OnGround) {
		this.Xa *= this.GroundInertia;
	} else {
		this.Xa *= this.AirInertia;
	}
	
	if (!this.OnGround) {
		this.Ya += 1.5;
	}
};

Mario.Fireball.prototype.SubMove = function(xa, ya) {
    var collide = false;
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }
    
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Fireball.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }
    
    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.Fireball.prototype.Die = function() {
	this.Dead = true;
	this.Xa = -this.Facing * 2;
	this.Ya = -5;
	this.DeadTime = 100;
};

// ==================== fireFlower.js ====================

/**
	Represents a fire powerup.
	Code by Rob Kleffner, 2011
*/

Mario.FireFlower = function(world, x, y) {
	this.Width = 4;
	this.Height = 24;
	
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Image = Enjine.Resources.Images["items"];
	
	this.XPicO = 8;
	this.YPicO = 15;
	this.XPic = 1;
	this.YPic = 0;
	this.Height = 12;
	this.Facing = 1;
	this.PicWidth = this.PicHeight = 16;
	
	this.Life = 0;
};

Mario.FireFlower.prototype = new Mario.NotchSprite();

Mario.FireFlower.prototype.CollideCheck = function() {
	var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
	if (xMarioD > -16 && xMarioD < 16) {
		if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
			Mario.MarioCharacter.GetFlower();
			this.World.RemoveSprite(this);
		}
	}
};

Mario.FireFlower.prototype.Move = function() {
	if (this.Life < 9) {
		this.Layer = 0;
		this.Y--;
		this.Life++;
		return;
	}
};

// ==================== flowerEnemy.js ====================

/**
	Represents a flower enemy.
	Code by Rob Kleffner, 2011
*/

Mario.FlowerEnemy = function(world, x, y) {
    this.Image = Enjine.Resources.Images["enemies"];
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Facing = 1;
    this.Type = Mario.Enemy.Spiky;
    this.Winged = false;
    this.NoFireballDeath = false;
    this.XPic = 0;
    this.YPic = 6;
    this.YPicO = 24;
    this.Height = 12;
    this.Width = 2;
    this.YStart = y;
    this.Ya = -8;
    this.Y -= 1;
    this.Layer = 0;
    this.JumpTime = 0;
    this.Tick = 0;
    
    var i = 0;
    for (i = 0; i < 4; i++) {
        this.Move();
    }
};

Mario.FlowerEnemy.prototype = new Mario.Enemy();

Mario.FlowerEnemy.prototype.Move = function() {
    var i = 0, xd = 0;
    if (this.DeadTime > 0) {
        this.DeadTime--;
        
        if (this.DeadTime === 0) {
            this.DeadTime = 1;
            for (i = 0; i < 8; i++) {
                this.World.AddSprite(new Mario.Sparkle(((this.X + Math.random() * 16 - 8) | 0)  + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.World.RemoveSprite(this);
        }
        
        this.X += this.Xa;
        this.Y += this.Ya;
        this.Ya *= 0.95;
        this.Ya += 1;
        
        return;
    }
    
    this.Tick++;
    
    if (this.Y >= this.YStart) {
        this.YStart = this.Y;
        xd = Math.abs(Mario.MarioCharacter.X - this.X) | 0;
        this.JumpTime++;
        if (this.JumpTime > 40 && xd > 24) {
            this.Ya = -8;
        } else {
            this.Ya = 0;
        }
    } else {
        this.JumpTime = 0;
    }
    
    this.Y += this.Ya;
    this.Ya *= 0.9;
    this.Ya += 0.1;
    
    this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
};

// ==================== improvedNoise.js ====================

/**
	Noise function to generate the world maps.
	Code by Rob Kleffner, 2011
*/

Mario.ImprovedNoise = function(seed) {
    this.P = [];
    this.Shuffle(seed);
};

Mario.ImprovedNoise.prototype = {
    Shuffle: function(seed) {
        var permutation = [];
        var i = 0, j = 0, tmp = 0;
        
        for (i = 0; i < 256; i++) {
            permutation[i] = i;
        }
        
        for (i = 0; i < 256; i++) {
            j = ((Math.random() * (256 - 1)) | 0) + i;
            tmp = permutation[i];
            permutation[i] = permutation[j];
            permutation[j] = tmp;
            this.P[i + 256] = this.P[i] = permutation[i];
        }
    },
    
    PerlinNoise: function(x, y) {
        var i = 0, n = 0, stepSize = 0;
        
        for (i = 0; i < 8; i++) {
            stepSize = 64 / (1 << i);
            n += this.Noise(x / stepSize, y / stepSize, 128) / (1 << i);
        }
        
        return n;
    },
    
    Noise: function(x, y, z) {
        var nx = (x | 0) & 255, ny = (y | 0) & 255, nz = (z | 0) & 255;
        x -= (x | 0);
        y -= (y | 0);
        z -= (z | 0);
        
        var u = this.Fade(x), v = this.Fade(y), w = this.Fade(z);
        var A = this.P[nx] + ny, AA = this.P[A] + nz, AB = this.P[A + 1] + nz,
        B = this.P[nx + 1] + ny, BA = this.P[B] + nz, BB = this.P[B + 1] + nz;
        
        return this.Lerp(w, this.Lerp(v, this.Lerp(u, this.Grad(this.P[AA], x, y, z),
            this.Grad(this.P[BA], x - 1, y, z)),
            this.Lerp(u, this.Grad(this.P[AB], x, y - 1, z),
                this.Grad(this.P[BB], x - 1, y - 1, z))),
            this.Lerp(v, this.Lerp(u, this.Grad(this.P[AA + 1], x, y, z - 1),
                this.Grad(this.P[BA + 1], x - 1, y, z - 1)),
                this.Lerp(u, this.Grad(this.P[AB + 1], x, y - 1, z - 1), this.Grad(this.P[BB + 1], x - 1, y - 1, z - 1))));
    },
    
    Fade: function(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },
    
    Lerp: function(t, x, y) {
        return x + t * (y - x);
    },
    
    Grad: function(hash, x, y, z) {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : (h === 12 || h === 14) ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
};

// ==================== level.js ====================

/**
	Represents a playable level in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Tile = {
    BlockUpper: 1 << 0,
    BlockAll: 1 << 1,
    BlockLower: 1 << 2,
    Special: 1 << 3,
    Bumpable: 1 << 4,
    Breakable: 1 << 5,
    PickUpable: 1 << 6,
    Animated: 1 << 7,
    Behaviors: [],
    
    LoadBehaviors: function() {
        var b = [];
        b[0] = 0;
        b[1] = 20;
        b[2] = 28;
        b[3] = 0;
        b[4] = 130;
        b[5] = 130;
        b[6] = 130;
        b[7] = 130;
        b[8] = 2;
        b[9] = 2;
        b[10] = 2;
        b[11] = 2;
        b[12] = 2;
        b[13] = 0;
        b[14] = 138;
        b[15] = 0;
        b[16] = 162;
        b[17] = 146;
        b[18] = 154;
        b[19] = 162;
        b[20] = 146;
        b[21] = 146;
        b[22] = 154;
        b[23] = 146;
        b[24] = 2;
        b[25] = 0;
        b[26] = 2;
        b[27] = 2;
        b[28] = 2;
        b[29] = 0;
        b[30] = 2;
        b[31] = 0;
        b[32] = 192;
        b[33] = 192;
        b[34] = 192;
        b[35] = 192;
        b[36] = 0;
        b[37] = 0;
        b[38] = 0;
        b[39] = 0;
        b[40] = 2;
        b[41] = 2;
        b[42] = 0;
        b[43] = 0;
        b[44] = 0;
        b[45] = 0;
        b[46] = 2;
        b[47] = 0;
        b[48] = 0;
        b[49] = 0;
        b[50] = 0;
        b[51] = 0;
        b[52] = 0;
        b[53] = 0;
        b[54] = 0;
        b[55] = 0;
        b[56] = 2;
        b[57] = 2;
        
        var i = 0;
        for (i = 58; i < 128; i++) {
            b[i] = 0;
        }
        
        b[128] = 2;
        b[129] = 2;
        b[130] = 2;
        b[131] = 0;
        b[132] = 1;
        b[133] = 1;
        b[134] = 1;
        b[135] = 0;
        b[136] = 2;
        b[137] = 2;
        b[138] = 2;
        b[139] = 0;
        b[140] = 2;
        b[141] = 2;
        b[142] = 2;
        b[143] = 0;
        b[144] = 2;
        b[145] = 0;
        b[146] = 2;
        b[147] = 0;
        b[148] = 0;
        b[149] = 0;
        b[150] = 0;
        b[151] = 0;
        b[152] = 2;
        b[153] = 2;
        b[154] = 2;
        b[155] = 0;
        b[156] = 2;
        b[157] = 2;
        b[158] = 2;
        b[159] = 0;
        b[160] = 2;
        b[161] = 2;
        b[162] = 2;
        b[163] = 0;
        b[164] = 0;
        b[165] = 0;
        b[166] = 0;
        b[167] = 0;
        b[168] = 2;
        b[169] = 2;
        b[170] = 2;
        b[171] = 0;
        b[172] = 2;
        b[173] = 2;
        b[174] = 2;
        b[175] = 0;
        b[176] = 2;
        b[177] = 2;
        b[178] = 2;
        b[179] = 0;
        b[180] = 1;
        b[181] = 1;
        b[182] = 1;
        
        for (i = 183; i < 224; i++) {
            b[i] = 0;
        }
        
        b[224] = 1;
        b[225] = 1;
        b[226] = 1;
        
        for (i = 227; i < 256; i++) {
            b[i] = 0;
        }
        
        this.Behaviors = b;
    }
};

Mario.LevelType = {
    Overground: 0,
    Underground: 1,
    Castle: 2
};

Mario.Odds = {
    Straight: 0,
    HillStraight: 1,
    Tubes: 2,
    Jump: 3,
    Cannons: 4
};

Mario.Level = function(width, height) {
    this.Width = width;
    this.Height = height;
    this.ExitX = 10;
    this.ExitY = 10;
    
    this.Map = [];
    this.Data = [];
    this.SpriteTemplates = [];
    
    var x = 0, y = 0;
    for (x = 0; x < this.Width; x++) {
        this.Map[x] = [];
        this.Data[x] = [];
        this.SpriteTemplates[x] = [];
        
        for (y = 0; y < this.Height; y++) {
            this.Map[x][y] = 0;
            this.Data[x][y] = 0;
            this.SpriteTemplates[x][y] = null;
        }
    }
};

Mario.Level.prototype = {
    Update: function() {
        var x = 0, y = 0;
        for (x = 0; x < this.Width; x++) {
            for (y = 0; y < this.Height; y++) {
                if (this.Data[x][y] > 0) {
                    this.Data[x][y]--;
                }
            }
        }
    },
    
    GetBlockCapped: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    },
    
    GetBlock: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { return 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    },
    
    SetBlock: function(x, y, block) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.Map[x][y] = block;
    },
    
    SetBlockData: function(x, y, data) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.Data[x][y] = data;
    },
    
    IsBlocking: function(x, y, xa, ya) {
        var block = this.GetBlock(x, y);
        var blocking = ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockAll) > 0;
        blocking |= (ya > 0) && ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockUpper) > 0;
        blocking |= (ya < 0) && ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockLower) > 0;

        return blocking;
    },
    
    GetSpriteTemplate: function(x, y) {
        if (x < 0) { return null; }
        if (y < 0) { return null; }
        if (x >= this.Width) { return null; }
        if (y >= this.Height) { return null; }
        return this.SpriteTemplates[x][y];
    },
    
    SetSpriteTemplate: function(x, y, template) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.SpriteTemplates[x][y] = template;
    }
};

// ==================== levelGenerator.js ====================

/**
	Generates a psuedo-random procedural level.
	Code by Rob Kleffner, 2011
*/

Mario.LevelGenerator = function(width, height) {
    this.Width = width;
    this.Height = height;
    this.Odds = [];
    this.TotalOdds = 0;
    this.Difficulty = 0;
    this.Type = 0;
};

Mario.LevelGenerator.prototype = {
    CreateLevel: function(type, difficulty) {
        var i = 0, length = 0, floor = 0, x = 0, y = 0, ceiling = 0, run = 0, level = null;
        
        this.Type = type;
        this.Difficulty = difficulty;
        this.Odds[Mario.Odds.Straight] = 20;
        this.Odds[Mario.Odds.HillStraight] = 10;
        this.Odds[Mario.Odds.Tubes] = 2 + difficulty;
        this.Odds[Mario.Odds.Jump] = 2 * difficulty;
        this.Odds[Mario.Odds.Cannon] = -10 + 5 * difficulty;
        
        if (this.Type !== Mario.LevelType.Overground) {
            this.Odds[Mario.Odds.HillStraight] = 0;
        }
        
        for (i = 0; i < this.Odds.length; i++) {
            if (this.Odds[i] < 0) {
                this.Odds[i] = 0;
            }
            this.TotalOdds += this.Odds[i];
            this.Odds[i] = this.TotalOdds - this.Odds[i];
        }
        
        level = new Mario.Level(this.Width, this.Height);
        length += this.BuildStraight(level, 0, level.Width, true);
        while (length < level.Width - 64) {
            length += this.BuildZone(level, length, level.Width - length);
        }
        
        floor = this.Height - 1 - (Math.random() * 4) | 0;
        level.ExitX = length + 8;
        level.ExitY = floor;
        
        for (x = length; x < level.Width; x++) {
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                }
            }
        }
        
        if (type === Mario.LevelType.Castle || type === Mario.LevelType.Underground) {
            for (x = 0; x < level.Width; x++) {
                if (run-- <= 0 && x > 4) {
                    ceiling = (Math.random() * 4) | 0;
                    run = ((Math.random() * 4) | 0) + 4;
                }
                for (y = 0; y < level.Height; y++) {
                    if ((x > 4 && y <= ceiling) || x < 1) {
                        level.SetBlock(x, y, 1 + 9 * 16);
                    }
                }
            }
        }
        
        this.FixWalls(level);
        
        return level;
    },
    
    BuildZone: function(level, x, maxLength) {
        var t = (Math.random() * this.TotalOdds) | 0, type = 0, i = 0;
        for (i = 0; i < this.Odds.length; i++) {
            if (this.Odds[i] <= t) {
                type = i;
            }
        }
        
        switch (type) {
            case Mario.Odds.Straight:
                return this.BuildStraight(level, x, maxLength, false);
            case Mario.Odds.HillStraight:
                return this.BuildHillStraight(level, x, maxLength);
            case Mario.Odds.Tubes:
                return this.BuildTubes(level, x, maxLength);
            case Mario.Odds.Jump:
                return this.BuildJump(level, x, maxLength);
            case Mario.Odds.Cannons:
                return this.BuildCannons(level, x, maxLength);
        }
        return 0;
    },
    
    BuildJump: function(level, xo, maxLength) {
        var js = ((Math.random() * 4) | 0) + 2, jl = ((Math.random() * 2) | 0) + 2, length = js * 2 + jl, x = 0, y = 0,
            hasStairs = ((Math.random() * 3) | 0) === 0, floor = this.Height - 1 - ((Math.random() * 4) | 0);
        
        for (x = xo; x < xo + length; x++) {
            if (x < xo + js || x > xo + length - js - 1) {
                for (y = 0; y < this.Height; y++) {
                    if (y >= floor) {
                        level.SetBlock(x, y, 1 + 9 * 16);
                    } else if (hasStairs) {
                        if (x < xo + js) {
                            if (y >= floor - (x - xo) + 1) {
                                level.SetBlock(x, y, 9);
                            }
                        } else {
                            if (y >= floor - ((xo + length) - x) + 2) {
                                level.SetBlock(x, y, 9);
                            }
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    BuildCannons: function(level, xo, maxLength) {
		alert("cannons");
        var length = ((Math.random() * 10) | 0) + 2, floor = this.Height - 1 - (Math.random() * 4) | 0,
            xCannon = xo + 1 + (Math.random() * 4) | 0, x = 0, y = 0, cannonHeight = 0;
            
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            if (x > xCannon) {
                xCannon += 2 * (Math.random() * 4) | 0;
            }
            if (xCannon === xo + length - 1) {
                xCannon += 10;
            }
            cannonHeight = floor - ((Math.random() * 4) | 0) - 1;
            
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                } else {
                    if (x === xCannon && y >= cannonHeight) {
                        if (y === cannonHeight) {
                            level.SetBlock(x, y, 14);
                        } else if (y === cannonHeight + 1) {
                            level.SetBlock(x, y, 14 + 16);
                        } else {
                            level.SetBlock(x, y, 14 + 2 * 16);
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    BuildHillStraight: function(level, xo, maxLength) {
        var length = ((Math.random() * 10) | 0) + 10, floor = this.Height - 1 - (Math.random() * 4) | 0,
            x = 0, y = 0, h = floor, keepGoing = true, l = 0, xxo = 0, occupied = [], xx = 0, yy = 0;
        
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                }
            }
        }
        
        this.AddEnemyLine(level, xo + 1, xo + length - 1, floor - 1);
        
        while (keepGoing) {
            h = h - 2 - (Math.random() * 3) | 0;
            if (h <= 0) {
                keepGoing = false;
            } else {
                l = ((Math.random() * 5) | 0) + 3;
                xxo = ((Math.random() * (length - l - 2)) | 0) + xo + 1;
                
                if (occupied[xxo - xo] || occupied[xxo - xo + l] || occupied[xxo - xo - 1] || occupied[xxo - xo + l + 1]) {
                    keepGoing = false;
                } else {
                    occupied[xxo - xo] = true;
                    occupied[xxo - xo + l] = true;
                    this.AddEnemyLine(level, xxo, xxo + l, h - 1);
                    if (((Math.random() * 4) | 0) === 0) {
                        this.Decorate(level, xxo - 1, xxo + l + 1, h);
                        keepGoing = false;
                    }
                    
                    for (x = xxo; x < xxo + l; x++) {
                        for (y = h; y < floor; y++) {
                            xx = 5;
                            yy = 9;
                            if (x === xxo) {
                                xx = 4;
                            }
                            if (x === xxo + l - 1) {
                                xx = 6;
                            }
                            if (y === h) {
                                yy = 8;
                            }
                            
                            if (level.GetBlock(x, y) === 0) {
                                level.SetBlock(x, y, xx + yy * 16);
                            } else {
                                if (level.GetBlock(x, y) === (4 + 8 * 16)) {
                                    level.SetBlock(x, y, 4 + 11 * 16);
                                }
                                if (level.GetBlock(x, y) === (6 + 8 * 16)) {
                                    level.SetBlock(x, y, 6 + 11 * 16);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    AddEnemyLine: function(level, x0, x1, y) {
        var x = 0, type = 0;
        for (x = x0; x < x1; x++) {
            if (((Math.random() * 35) | 0) < this.Difficulty + 1) {
                type = (Math.random() * 4) | 0;
                if (this.Difficulty < 1) {
                    type = Mario.Enemy.Goomba;
                } else if (this.Difficulty < 3) {
                    type = (Math.random() * 3) | 0;
                }
                level.SetSpriteTemplate(x, y, new Mario.SpriteTemplate(type, ((Math.random() * 35) | 0) < this.Difficulty));
            }
        }
    },
    
    BuildTubes: function(level, xo, maxLength) {
        var length = ((Math.random() * 10) | 0) + 5, floor = this.Height - 1 - (Math.random() * 4) | 0,
            xTube = xo + 1 + (Math.random() * 4) | 0, tubeHeight = floor - ((Math.random() * 2) | 0) - 2,
            x = 0, y = 0, xPic = 0;
        
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            if (x > xTube + 1) {
                xTube += 3 + ((Math.random() * 4) | 0);
                tubeHeight = floor - ((Math.random() * 2) | 0) - 2;
            }
            if (xTube >= xo + length - 2) {
                xTube += 10;
            }
            
            if (x === xTube && ((Math.random() * 11) | 0) < this.Difficulty + 1) {
                level.SetSpriteTemplate(x, tubeHeight, new Mario.SpriteTemplate(Mario.Enemy.Flower, false));
            }
            
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                } else {
                    if ((x === xTube || x === xTube + 1) && y >= tubeHeight) {
                        xPic = 10 + x - xTube;
                        if (y === tubeHeight) {
                            level.SetBlock(x, y, xPic);
                        } else {
                            level.SetBlock(x, y, xPic + 16);
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    BuildStraight: function(level, xo, maxLength, safe) {
        var length = ((Math.random() * 10) | 0) + 2, floor = this.Height - 1 - ((Math.random() * 4) | 0), x = 0, y = 0;
        
        if (safe) {
            length = 10 + ((Math.random() * 5) | 0);
        }
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            for (y = 0; y < this.Height; y++) {
                if (y >= floor) {
                    level.SetBlock(x, y, 1 + 9 * 16);
                }
            }
        }
        
        if (!safe) {
            if (length > 5) {
                this.Decorate(level, xo, xo + length, floor);
            }
        }
        
        return length;
    },
    
    Decorate: function(level, x0, x1, floor) {
        if (floor < 1) {
            return;
        }
        
        var rocks = true, s = (Math.random() * 4) | 0, e = (Math.random() * 4) | 0, x = 0;
        
        this.AddEnemyLine(level, x0 + 1, x1 - 1, floor - 1);
        
        if (floor - 2 > 0) {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 1) {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++) {
                    level.SetBlock(x, floor - 2, 2 + 2 * 16);
                }
            }
        }
        
        s = (Math.random() * 4) | 0;
        e = (Math.random() * 4) | 0;
        
        if (floor - 4 > 0) {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 2) {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++) {
                    if (rocks) {
                        if (x !== x0 + 1 && x !== x1 - 2 && ((Math.random() * 3) | 0) === 0) {
                            if (((Math.random() * 4) | 0) === 0) {
                                level.SetBlock(x, floor - 4, 4 + 2 + 16);
                            } else {
                                level.SetBlock(x, floor - 4, 4 + 1 + 16);
                            }
                        } else if (((Math.random() * 4) | 0) === 0) {
                            if (((Math.random() * 4) | 0) === 0) {
                                level.SetBlock(x, floor - 4, 2 + 16);
                            } else {
                                level.SetBlock(x, floor - 4, 1 + 16);
                            }
                        } else {
                            level.SetBlock(x, floor - 4, 16);
                        }
                    }
                }
            }
        }
    },
    
    FixWalls: function(level) {
        var blockMap = [], x = 0, y = 0, xx = 0, yy = 0, blocks = 0;
        
        for (x = 0; x < this.Width + 1; x++) {
            blockMap[x] = [];
        
            for (y = 0; y < this.Height + 1; y++) {
                blocks = 0;
                for (xx = x - 1; xx < x + 1; xx++) {
                    for (yy = y - 1; yy < y + 1; yy++) {
                        if (level.GetBlockCapped(xx, yy) === (1 + 9 * 16)) {
                            blocks++;
                        }
                    }
                }
                blockMap[x][y] = blocks === 4;
            }
        }
        
        this.Blockify(level, blockMap, this.Width + 1, this.Height + 1);
    },
    
    Blockify: function(level, blocks, width, height) {
        var to = 0, b = [], x = 0, y = 0, xx = 0, yy = 0, i = 0, _xx = 0, _yy = 0;
        
        for (i = 0; i < 2; i++) {
            b[i] = [];
        }
        
        if (this.Type === Mario.LevelType.Castle) {
            to = 8;
        } else if (this.Type === Mario.LevelType.Underground) {
            to = 12;
        }
        
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                for (xx = x; xx <= x + 1; xx++) {
                    for (yy = y; yy <= y + 1; yy++) {
                        _xx = xx;
                        _yy = yy;
                        if (_xx < 0) {
                            _xx = 0;
                        }
                        if (_yy < 0) {
                            _yy = 0;
                        }
                        if (_xx > width - 1) {
                            _xx = width - 1;
                        }
                        if (_yy > height - 1) {
                            _yy = height - 1;
                        }
                        
                        b[xx - x][yy - y] = blocks[_xx][_yy];
                    }
                }
                
                if (b[0][0] === b[1][0] && b[0][1] === b[1][1]) {
                    if (b[0][0] === b[0][1]) {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 1 + 9 * 16 + to);
                        }
                    } else {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 1 + 10 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 1 + 8 * 16 + to);
                        }
                    }
                } else if (b[0][0] === b[0][1] && b[1][0] === b[1][1]) {
                    if (b[0][0]) {
                        level.SetBlock(x, y, 2 + 9 * 16 + to);
                    } else {
                        level.SetBlock(x, y, 9 * 16 + to);
                    }
                } else if (b[0][0] === b[1][1] && b[0][1] === b[1][0]) {
                    level.SetBlock(x, y, 1 + 9 * 16 + to);
                } else if (b[0][0] === b[1][0]) {
                    if (b[0][0]) {
                        if (b[0][1]) {
                            level.SetBlock(x, y, 3 + 10 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 3 + 11 * 16 + to);
                        }
                    } else {
                        if (b[0][1]) {
                            level.SetBlock(x, y, 2 + 8 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 8 * 16 + to);
                        }
                    }
                } else if (b[0][1] === b[1][1]) {
                    if (b[0][1]) {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 3 + 9 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 3 + 8 * 16 + to);
                        }
                    } else {
                        if (b[0][0]) {
                            level.SetBlock(x, y, 2 + 10 * 16 + to);
                        } else {
                            level.SetBlock(x, y, 10 * 16 + to);
                        }
                    }
                } else {
                    level.SetBlock(x, y, 1 + 16 * to);
                }
            }
        }
    }
};

// ==================== levelRenderer.js ====================

/**
	Renders a playable level.
	Code by Rob Kleffner, 2011
*/

Mario.LevelRenderer = function(level, width, height) {
    this.Width = width;
    this.Height = height;
    this.Level = level;
    this.TilesY = ((height / 16) | 0) + 1;
    this.Delta = 0;
    this.Tick = 0;
    this.Bounce = 0;
    this.AnimTime = 0;
    
    this.Background = Mario.SpriteCuts.GetLevelSheet();
};

Mario.LevelRenderer.prototype = new Enjine.Drawable();

Mario.LevelRenderer.prototype.Update = function(delta) {
    this.AnimTime += delta;
    this.Tick = this.AnimTime | 0;
    this.Bounce += delta * 30;
    this.Delta = delta;
};

Mario.LevelRenderer.prototype.Draw = function(context, camera) {
    this.DrawStatic(context, camera);
    this.DrawDynamic(context, camera);
};

Mario.LevelRenderer.prototype.DrawStatic = function(context, camera) {
    var x = 0, y = 0, b = 0, frame = null, xTileStart = (camera.X / 16) | 0, xTileEnd = ((camera.X + this.Width) / 16) | 0;
    
    for (x = xTileStart; x < xTileEnd + 1; x++) {
        for (y = 0; y < this.TilesY; y++) {
            b = this.Level.GetBlock(x, y) & 0xff;
            if ((Mario.Tile.Behaviors[b] & Mario.Tile.Animated) === 0) {
                frame = this.Background[b % 16][(b / 16) | 0];
                context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 4) - camera.X) | 0, (y << 4) | 0, frame.Width, frame.Height);
            }
        }
    }
};

Mario.LevelRenderer.prototype.DrawDynamic = function(context, camera) {
    var x = 0, y = 0, b = 0, animTime = 0, yo = 0, frame = null;
    for (x = (camera.X / 16) | 0; x <= ((camera.X + this.Width) / 16) | 0; x++) {
        for (y = (camera.Y / 16) | 0; y <= ((camera.Y + this.Height) / 16) | 0; y++) {
            b = this.Level.GetBlock(x, y);
            
            if (((Mario.Tile.Behaviors[b & 0xff]) & Mario.Tile.Animated) > 0) {
                animTime = ((this.Bounce / 3) | 0) % 4;
                if ((((b % 16) / 4) | 0) === 0 && ((b / 16) | 0) === 1) {
                    animTime = ((this.Bounce / 2 + (x + y) / 8) | 0) % 20;
                    if (animTime > 3) {
                        animTime = 0;
                    }
                }
                if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                    animTime = 2;
                }
                yo = 0;
                if (x >= 0 && y >= 0 && x < this.Level.Width && y < this.Level.Height) {
                    yo = this.Level.Data[x][y];
                }
                if (yo > 0) {
                    yo = (Math.sin((yo - this.Delta) / 4 * Math.PI) * 8) | 0;
                }
                frame = this.Background[(((b % 16) / 4) | 0) * 4 + animTime][(b / 16) | 0];
                context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (x << 4) - camera.X, (y << 4) - camera.Y - yo, frame.Width, frame.Height);
            }
        }
    }
};

Mario.LevelRenderer.prototype.DrawExit0 = function(context, camera, bar) {
    var y = 0, yh = 0, frame = null;
    for (y = this.Level.ExitY - 8; y < this.Level.ExitY; y++) {
        frame = this.Background[12][y === this.Level.ExitY - 8 ? 4 : 5];
        context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X - 16, (y << 4) - camera.Y, frame.Width, frame.Height);
    }
    
    if (bar) {
        yh = this.Level.ExitY * 16 - (3 * 16) - (Math.sin(this.AnimTime) * 3 * 16) - 8;// - ((Math.sin(((this.Bounce + this.Delta) / 20) * 0.5 + 0.5) * 7 * 16) | 0) - 8;
        frame = this.Background[12][3];
        context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X - 16, yh - camera.Y, frame.Width, frame.Height);
        frame = this.Background[13][3];
        context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X, yh - camera.Y, frame.Width, frame.Height);
    }
};

Mario.LevelRenderer.prototype.DrawExit1 = function(context, camera) {
    var y = 0, frame = null;
    for (y = this.Level.ExitY - 8; y < this.Level.ExitY; y++) {
        frame = this.Background[13][y === this.Level.ExitY - 8 ? 4 : 5];
        context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X + 16, (y << 4) - camera.Y, frame.Width, frame.Height);
    }
};

// ==================== levelState.js ====================

/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Mario.LevelState = function(difficulty, type) {
    this.LevelDifficulty = difficulty;
    this.LevelType = type;
    this.Level = null;
    this.Layer = null;
    this.BgLayer = [];

    this.Paused = false;
    this.Sprites = null;
    this.SpritesToAdd = null;
    this.SpritesToRemove = null;
    this.Camera = null;
    this.ShellsToCheck = null;
    this.FireballsToCheck = null;

    this.FontShadow = null;
    this.Font = null;

    this.TimeLeft = 0;
    this.StartTime = 0;
    this.FireballsOnScreen = 0;
    this.Tick = 0;

    this.Delta = 0;

	this.GotoMapState = false;
	this.GotoLoseState = false;
};

Mario.LevelState.prototype = new Enjine.GameState();

Mario.LevelState.prototype.Enter = function() {
    var levelGenerator = new Mario.LevelGenerator(320, 15), i = 0, scrollSpeed = 0, w = 0, h = 0, bgLevelGenerator = null;
    this.Level = levelGenerator.CreateLevel(this.LevelType, this.LevelDifficulty);

    //play music here
    if (this.LevelType === Mario.LevelType.Overground) {
    	Mario.PlayOvergroundMusic();
    } else if (this.LevelType === Mario.LevelType.Underground) {
    	Mario.PlayUndergroundMusic();
    } else if (this.LevelType === Mario.LevelType.Castle) {
    	Mario.PlayCastleMusic();
    }

    this.Paused = false;
    this.Layer = new Mario.LevelRenderer(this.Level, 320, 240);
    this.Sprites = new Enjine.DrawableManager();
    this.Camera = new Enjine.Camera();
    this.Tick = 0;

    this.ShellsToCheck = [];
    this.FireballsToCheck = [];
    this.SpritesToAdd = [];
    this.SpritesToRemove = [];

    this.FontShadow = Mario.SpriteCuts.CreateBlackFont();
    this.Font = Mario.SpriteCuts.CreateWhiteFont();

    for (i = 0; i < 2; i++) {
        scrollSpeed = 4 >> i;
        w = ((((this.Level.Width * 16) - 320) / scrollSpeed) | 0) + 320;
        h = ((((this.Level.Height * 16) - 240) / scrollSpeed) | 0) + 240;
        bgLevelGenerator = new Mario.BackgroundGenerator(w / 32 + 1, h / 32 + 1, i === 0, this.LevelType);
        this.BgLayer[i] = new Mario.BackgroundRenderer(bgLevelGenerator.CreateLevel(), 320, 240, scrollSpeed);
    }

    Mario.MarioCharacter.Initialize(this);

    this.Sprites.Add(Mario.MarioCharacter);
    this.StartTime = 1;
    this.TimeLeft = 200;

	this.GotoMapState = false;
	this.GotoLoseState = false;
};

Mario.LevelState.prototype.Exit = function() {

    delete this.Level;
    delete this.Layer;
    delete this.BgLayer;
    delete this.Sprites;
    delete this.Camera;
    delete this.ShellsToCheck;
    delete this.FireballsToCheck;
    delete this.FontShadow;
    delete this.Font;
};

Mario.LevelState.prototype.CheckShellCollide = function(shell) {
    this.ShellsToCheck.push(shell);
};

Mario.LevelState.prototype.CheckFireballCollide = function(fireball) {
    this.FireballsToCheck.push(fireball);
};

Mario.LevelState.prototype.Update = function(delta) {
    var i = 0, j = 0, xd = 0, yd = 0, sprite = null, hasShotCannon = false, xCannon = 0, x = 0, y = 0,
        dir = 0, st = null, b = 0;

    this.Delta = delta;

    this.TimeLeft -= delta;
    if ((this.TimeLeft | 0) === 0) {
        Mario.MarioCharacter.Die();
    }

    if (this.StartTime > 0) {
        this.StartTime++;
    }

    this.Camera.X = Mario.MarioCharacter.X - 160;
    if (this.Camera.X < 0) {
        this.Camera.X = 0;
    }
    if (this.Camera.X > this.Level.Width * 16 - 320) {
        this.Camera.X = this.Level.Width * 16 - 320;
    }

    this.FireballsOnScreen = 0;

    for (i = 0; i < this.Sprites.Objects.length; i++) {
        sprite = this.Sprites.Objects[i];
        if (sprite !== Mario.MarioCharacter) {
            xd = sprite.X - this.Camera.X;
            yd = sprite.Y - this.Camera.Y;
            if (xd < -64 || xd > 320 + 64 || yd < -64 || yd > 240 + 64) {
                this.Sprites.RemoveAt(i);
            } else {
                if (sprite instanceof Mario.Fireball) {
                    this.FireballsOnScreen++;
                }
            }
        }
    }

    if (this.Paused) {
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            if (this.Sprites.Objects[i] === Mario.MarioCharacter) {
                this.Sprites.Objects[i].Update(delta);
            } else {
                this.Sprites.Objects[i].UpdateNoMove(delta);
            }
        }
    } else {
        this.Layer.Update(delta);
        this.Level.Update();

        hasShotCannon = false;
        xCannon = 0;
		this.Tick++;

        for (x = ((this.Camera.X / 16) | 0) - 1; x <= (((this.Camera.X + this.Layer.Width) / 16) | 0) + 1; x++) {
            for (y = ((this.Camera.Y / 16) | 0) - 1; y <= (((this.Camera.Y + this.Layer.Height) / 16) | 0) + 1; y++) {
                dir = 0;

                if (x * 16 + 8 > Mario.MarioCharacter.X + 16) {
                    dir = -1;
                }
                if (x * 16 + 8 < Mario.MarioCharacter.X - 16) {
                    dir = 1;
                }

                st = this.Level.GetSpriteTemplate(x, y);

                if (st !== null) {
                    if (st.LastVisibleTick !== this.Tick - 1) {
                        if (st.Sprite === null || !this.Sprites.Contains(st.Sprite)) {
                            st.Spawn(this, x, y, dir);
                        }
                    }

                    st.LastVisibleTick = this.Tick;
                }

                if (dir !== 0) {
                    b = this.Level.GetBlock(x, y);
                    if (((Mario.Tile.Behaviors[b & 0xff]) & Mario.Tile.Animated) > 0) {
                        if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                            if ((this.Tick - x * 2) % 100 === 0) {
                                xCannon = x;
                                for (i = 0; i < 8; i++) {
                                    this.AddSprite(new Mario.Sparkle(this, x * 16 + 8, y * 16 + ((Math.random() * 16) | 0), Math.random() * dir, 0, 0, 1, 5));
                                }
                                this.AddSprite(new Mario.BulletBill(this, x * 16 + 8 + dir * 8, y * 16 + 15, dir));
                                hasShotCannon = true;
                            }
                        }
                    }
                }
            }
        }

        if (hasShotCannon) {
            Enjine.Resources.PlaySound("cannon");
        }

        for (i = 0; i < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].Update(delta);
        }

        for (i = 0; i < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].CollideCheck();
        }

        for (i = 0; i < this.ShellsToCheck.length; i++) {
            for (j = 0; j < this.Sprites.Objects.length; j++) {
                if (this.Sprites.Objects[j] !== this.ShellsToCheck[i] && !this.ShellsToCheck[i].Dead) {
                    if (this.Sprites.Objects[j].ShellCollideCheck(this.ShellsToCheck[i])) {
                        if (Mario.MarioCharacter.Carried === this.ShellsToCheck[i] && !this.ShellsToCheck[i].Dead) {
                            Mario.MarioCharacter.Carried = null;
                            this.ShellsToCheck[i].Die();
                        }
                    }
                }
            }
        }
        this.ShellsToCheck.length = 0;

        for (i = 0; i < this.FireballsToCheck.length; i++) {
            for (j = 0; j < this.Sprites.Objects.length; j++) {
                if (this.Sprites.Objects[j] !== this.FireballsToCheck[i] && !this.FireballsToCheck[i].Dead) {
                    if (this.Sprites.Objects[j].FireballCollideCheck(this.FireballsToCheck[i])) {
                        this.FireballsToCheck[i].Die();
                    }
                }
            }
        }

        this.FireballsToCheck.length = 0;
    }

    this.Sprites.AddRange(this.SpritesToAdd);
    this.Sprites.RemoveList(this.SpritesToRemove);
    this.SpritesToAdd.length = 0;
    this.SpritesToRemove.length = 0;

    this.Camera.X = (Mario.MarioCharacter.XOld + (Mario.MarioCharacter.X - Mario.MarioCharacter.XOld) * delta) - 160;
    this.Camera.Y = (Mario.MarioCharacter.YOld + (Mario.MarioCharacter.Y - Mario.MarioCharacter.YOld) * delta) - 120;
};

Mario.LevelState.prototype.Draw = function(context) {
    var i = 0, time = 0, t = 0;

    if (this.Camera.X < 0) {
        this.Camera.X = 0;
    }
    if (this.Camera.Y < 0) {
        this.Camera.Y = 0;
    }
    if (this.Camera.X > this.Level.Width * 16 - 320) {
        this.Camera.X = this.Level.Width * 16 - 320;
    }
    if (this.Camera.Y > this.Level.Height * 16 - 240) {
        this.Camera.Y = this.Level.Height * 16 - 240;
    }

    for (i = 0; i < 2; i++) {
        this.BgLayer[i].Draw(context, this.Camera);
    }

    context.save();
    context.translate(-this.Camera.X, -this.Camera.Y);
    for (i = 0; i < this.Sprites.Objects.length; i++) {
        if (this.Sprites.Objects[i].Layer === 0) {
            this.Sprites.Objects[i].Draw(context, this.Camera);
        }
    }
    context.restore();

    this.Layer.Draw(context, this.Camera);
    this.Layer.DrawExit0(context, this.Camera, Mario.MarioCharacter.WinTime === 0);

    context.save();
    context.translate(-this.Camera.X, -this.Camera.Y);
    for (i = 0; i < this.Sprites.Objects.length; i++) {
        if (this.Sprites.Objects[i].Layer === 1) {
            this.Sprites.Objects[i].Draw(context, this.Camera);
        }
    }
    context.restore();

    this.Layer.DrawExit1(context, this.Camera);

    this.DrawStringShadow(context, "MARIO " + Mario.MarioCharacter.Lives, 0, 0);
    this.DrawStringShadow(context, "00000000", 0, 1);
    this.DrawStringShadow(context, "COIN", 14, 0);
    this.DrawStringShadow(context, " " + Mario.MarioCharacter.Coins, 14, 1);
    this.DrawStringShadow(context, "WORLD", 24, 0);
    this.DrawStringShadow(context, " " + Mario.MarioCharacter.LevelString, 24, 1);
    this.DrawStringShadow(context, "TIME", 34, 0);
    time = this.TimeLeft | 0;
    if (time < 0) {
        time = 0;
    }
    this.DrawStringShadow(context, " " + time, 34, 1);

    if (this.StartTime > 0) {
        t = this.StartTime + this.Delta - 2;
        t = t * t * 0.6;
        this.RenderBlackout(context, 160, 120, t | 0);
    }

    if (Mario.MarioCharacter.WinTime > 0) {
    	Mario.StopMusic();
        t = Mario.MarioCharacter.WinTime + this.Delta;
        t = t * t * 0.2;

        if (t > 900) {
            //TODO: goto map state with level won
			Mario.GlobalMapState.LevelWon();
			this.GotoMapState = true;
        }

        this.RenderBlackout(context, ((Mario.MarioCharacter.XDeathPos - this.Camera.X) | 0), ((Mario.MarioCharacter.YDeathPos - this.Camera.Y) | 0), (320 - t) | 0);
    }

    if (Mario.MarioCharacter.DeathTime > 0) {
    	Mario.StopMusic();
        t = Mario.MarioCharacter.DeathTime + this.Delta;
        t = t * t * 0.1;

        if (t > 900) {
            //TODO: goto map with level lost
			Mario.MarioCharacter.Lives--;
			this.GotoMapState = true;
			if (Mario.MarioCharacter.Lives <= 0) {
				this.GotoLoseState = true;
			}
        }

        this.RenderBlackout(context, ((Mario.MarioCharacter.XDeathPos - this.Camera.X) | 0), ((Mario.MarioCharacter.YDeathPos - this.Camera.Y) | 0), (320 - t) | 0);
    }
};

Mario.LevelState.prototype.DrawStringShadow = function(context, string, x, y) {
    this.Font.Strings[0] = { String: string, X: x * 8 + 4, Y: y * 8 + 4 };
    this.FontShadow.Strings[0] = { String: string, X: x * 8 + 5, Y: y * 8 + 5 };
    this.FontShadow.Draw(context, this.Camera);
    this.Font.Draw(context, this.Camera);
};

Mario.LevelState.prototype.RenderBlackout = function(context, x, y, radius) {
    if (radius > 320) {
        return;
    }

    var xp = [], yp = [], i = 0;
    for (i = 0; i < 16; i++) {
        xp[i] = x + (Math.cos(i * Math.PI / 15) * radius) | 0;
        yp[i] = y + (Math.sin(i * Math.PI / 15) * radius) | 0;
    }
    xp[16] = 0;
    yp[16] = y;
    xp[17] = 0;
    yp[17] = 240;
    xp[18] = 320;
    yp[18] = 240;
    xp[19] = 320;
    yp[19] = y;

    context.fillStyle = "#000";
    context.beginPath();
    context.moveTo(xp[19], yp[19]);
    for (i = 18; i >= 0; i--) {
        context.lineTo(xp[i], yp[i]);
    }
    context.closePath();
    context.fill();

    for (i = 0; i < 16; i++) {
        xp[i] = x - (Math.cos(i * Math.PI / 15) * radius) | 0;
        yp[i] = y - (Math.sin(i * Math.PI / 15) * radius) | 0;
    }
    //cure a strange problem where the circle gets cut
    yp[15] += 5;

    xp[16] = 320;
    yp[16] = y;
    xp[17] = 320;
    yp[17] = 0;
    xp[18] = 0;
    yp[18] = 0;
    xp[19] = 0;
    yp[19] = y;

    context.fillStyle = "#000";
    context.beginPath();
    context.moveTo(xp[0], yp[0]);
    for (i = 0; i <= xp.length - 1; i++) {
        context.lineTo(xp[i], yp[i]);
    }
    context.closePath();
    context.fill();
};

Mario.LevelState.prototype.AddSprite = function(sprite) {
    this.Sprites.Add(sprite);
};

Mario.LevelState.prototype.RemoveSprite = function(sprite) {
    this.Sprites.Remove(sprite);
};

Mario.LevelState.prototype.Bump = function(x, y, canBreakBricks) {
    var block = this.Level.GetBlock(x, y), xx = 0, yy = 0;

    if ((Mario.Tile.Behaviors[block & 0xff] & Mario.Tile.Bumpable) > 0) {
        this.BumpInto(x, y - 1);
        this.Level.SetBlock(x, y, 4);
        this.Level.SetBlockData(x, y, 4);

        if ((Mario.Tile.Behaviors[block & 0xff] & Mario.Tile.Special) > 0) {
            Enjine.Resources.PlaySound("sprout");
            if (!Mario.MarioCharacter.Large) {
                this.AddSprite(new Mario.Mushroom(this, x * 16 + 8, y * 16 + 8));
            } else {
                this.AddSprite(new Mario.FireFlower(this, x * 16 + 8, y * 16 + 8));
            }
        } else {
            Mario.MarioCharacter.GetCoin();
            Enjine.Resources.PlaySound("coin");
            this.AddSprite(new Mario.CoinAnim(this, x, y));
        }
    }

    if ((Mario.Tile.Behaviors[block & 0xff] & Mario.Tile.Breakable) > 0) {
        this.BumpInto(x, y - 1);
        if (canBreakBricks) {
            Enjine.Resources.PlaySound("breakblock");
            this.Level.SetBlock(x, y, 0);
            for (xx = 0; xx < 2; xx++) {
                for (yy = 0; yy < 2; yy++) {
                    this.AddSprite(new Mario.Particle(this, x * 16 + xx * 8 + 4, y * 16 + yy * 8 + 4, (xx * 2 - 1) * 4, (yy * 2 - 1) * 4 - 8));
                }
            }
        }
    }
};

Mario.LevelState.prototype.BumpInto = function(x, y) {
    var block = this.Level.GetBlock(x, y), i = 0;
    if (((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.PickUpable) > 0) {
        Mario.MarioCharacter.GetCoin();
        Enjine.Resources.PlaySound("coin");
        this.Level.SetBlock(x, y, 0);
        this.AddSprite(new Mario.CoinAnim(x, y + 1));
    }

    for (i = 0; i < this.Sprites.Objects.length; i++) {
        this.Sprites.Objects[i].BumpCheck(x, y);
    }
};

Mario.LevelState.prototype.CheckForChange = function(context) {
	if (this.GotoLoseState) {
		context.ChangeState(new Mario.LoseState());
	}
	else {
		if (this.GotoMapState) {
			context.ChangeState(Mario.GlobalMapState);
		}
	}
};


// ==================== loadingState.js ====================

/**
	State that loads all the resources for the game.
	Code by Rob Kleffner, 2011
*/

Mario.LoadingState = function() {
    this.Images = [];
    this.ImagesLoaded = false;
    this.ScreenColor = 0;
    this.ColorDirection = 1;
    this.ImageIndex = 0;
    this.SoundIndex = 0;
};

Mario.LoadingState.prototype = new Enjine.GameState();

Mario.LoadingState.prototype.Enter = function() {
    var i = 0;
    for (i = 0; i < 15; i++) {
        this.Images[i] = {};
    }
    
    this.Images[0].name = "background";
    this.Images[1].name = "endScene";
    this.Images[2].name = "enemies";
    this.Images[3].name = "fireMario";
    this.Images[4].name = "font";
    this.Images[5].name = "gameOverGhost";
    this.Images[6].name = "items";
    this.Images[7].name = "logo";
    this.Images[8].name = "map";
    this.Images[9].name = "mario";
    this.Images[10].name = "particles";
    this.Images[11].name = "racoonMario";
    this.Images[12].name = "smallMario";
    this.Images[13].name = "title";
    this.Images[14].name = "worldMap";

    this.Images[0].src = "images/bgsheet.png";
    this.Images[1].src = "images/endscene.gif";
    this.Images[2].src = "images/enemysheet.png";
    this.Images[3].src = "images/firemariosheet.png";
    this.Images[4].src = "images/font.gif";
    this.Images[5].src = "images/gameovergost.gif";
    this.Images[6].src = "images/itemsheet.png";
    this.Images[7].src = "images/logo.gif";
    this.Images[8].src = "images/mapsheet.png";
    this.Images[9].src = "images/mariosheet.png";
    this.Images[10].src = "images/particlesheet.png";
    this.Images[11].src = "images/racoonmariosheet.png";
    this.Images[12].src = "images/smallmariosheet.png";
    this.Images[13].src = "images/title.gif";
    this.Images[14].src = "images/worldmap.png";
    
    Enjine.Resources.AddImages(this.Images);
    
    var testAudio = new Audio();
	
    if (testAudio.canPlayType("audio/mp3")) {
    	Enjine.Resources.AddSound("1up", "sounds/1-up.mp3", 1)
		    .AddSound("breakblock", "sounds/breakblock.mp3")
		    .AddSound("bump", "sounds/bump.mp3", 4)
		    .AddSound("cannon", "sounds/cannon.mp3")
		    .AddSound("coin", "sounds/coin.mp3", 5)
		    .AddSound("death", "sounds/death.mp3", 1)
		    .AddSound("exit", "sounds/exit.mp3", 1)
		    .AddSound("fireball", "sounds/fireball.mp3", 1)
		    .AddSound("jump", "sounds/jump.mp3")
		    .AddSound("kick", "sounds/kick.mp3")
		    .AddSound("pipe", "sounds/pipe.mp3", 1)
		    .AddSound("powerdown", "sounds/powerdown.mp3", 1)
		    .AddSound("powerup", "sounds/powerup.mp3", 1)
		    .AddSound("sprout", "sounds/sprout.mp3", 1)
		    .AddSound("stagestart", "sounds/stagestart.mp3", 1)
		    .AddSound("stomp", "sounds/stomp.mp3", 2);
    } else {
	    Enjine.Resources.AddSound("1up", "sounds/1-up.wav", 1)
		    .AddSound("breakblock", "sounds/breakblock.wav")
		    .AddSound("bump", "sounds/bump.wav", 2)
		    .AddSound("cannon", "sounds/cannon.wav")
		    .AddSound("coin", "sounds/coin.wav", 5)
		    .AddSound("death", "sounds/death.wav", 1)
		    .AddSound("exit", "sounds/exit.wav", 1)
		    .AddSound("fireball", "sounds/fireball.wav", 1)
		    .AddSound("jump", "sounds/jump.wav", 1)
		    .AddSound("kick", "sounds/kick.wav", 1)
		    .AddSound("message", "sounds/message.wav", 1)
		    .AddSound("pipe", "sounds/pipe.wav", 1)
		    .AddSound("powerdown", "sounds/powerdown.wav", 1)
		    .AddSound("powerup", "sounds/powerup.wav", 1)
		    .AddSound("sprout", "sounds/sprout.wav", 1)
		    .AddSound("stagestart", "sounds/stagestart.wav", 1)
		    .AddSound("stomp", "sounds/stomp.wav", 1);
    }
    
    //load the array of tile behaviors
    Mario.Tile.LoadBehaviors();
};

Mario.LoadingState.prototype.Exit = function() {
    delete this.Images;
};

Mario.LoadingState.prototype.Update = function(delta) {
    if (!this.ImagesLoaded) {
        this.ImagesLoaded = true;
        var i = 0;
        for (i = 0; i < this.Images.length; i++) {
            if (Enjine.Resources.Images[this.Images[i].name].complete !== true) {
                this.ImagesLoaded = false;
                break;
            }
        }
    }
    
    this.ScreenColor += this.ColorDirection * 255 * delta;
    if (this.ScreenColor > 255) {
        this.ScreenColor = 255;
        this.ColorDirection = -1;
    } else if (this.ScreenColor < 0) {
        this.ScreenColor = 0;
        this.ColorDirection = 1;
    }
};

Mario.LoadingState.prototype.Draw = function(context) {
    if (!this.ImagesLoaded) {
        var color = parseInt(this.ScreenColor, 10);
        context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
        context.fillRect(0, 0, 640, 480);
    } else {
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, 640, 480);
    }
};

Mario.LoadingState.prototype.CheckForChange = function(context) {
    if (this.ImagesLoaded) {
		//set up the global map state variable
		Mario.GlobalMapState = new Mario.MapState();
	
        context.ChangeState(new Mario.TitleState());
    }
};

// ==================== loseState.js ====================

/**
	State shown when the player loses!
	Code by Rob Kleffner, 2011
*/

Mario.LoseState = function() {
    this.drawManager = null;
    this.camera = null;
    this.gameOver = null;
    this.font = null;
    this.wasKeyDown = false;
};

Mario.LoseState.prototype = new Enjine.GameState();

Mario.LoseState.prototype.Enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();
    
    this.gameOver = new Enjine.AnimatedSprite();
    this.gameOver.Image = Enjine.Resources.Images["gameOverGhost"];
    this.gameOver.SetColumnCount(9);
    this.gameOver.SetRowCount(1);
    this.gameOver.AddNewSequence("turnLoop", 0, 0, 0, 8);
    this.gameOver.PlaySequence("turnLoop", true);
    this.gameOver.FramesPerSecond = 1/15;
    this.gameOver.X = 112;
    this.gameOver.Y = 68;
    
    this.font = Mario.SpriteCuts.CreateBlackFont();
    this.font.Strings[0] = { String: "Game over!", X: 116, Y: 160 };
    
    this.drawManager.Add(this.font);
    this.drawManager.Add(this.gameOver);
};

Mario.LoseState.prototype.Exit = function() {
    this.drawManager.Clear();
    delete this.drawManager;
    delete this.camera;
    delete this.gameOver;
    delete this.font;
};

Mario.LoseState.prototype.Update = function(delta) {
    this.drawManager.Update(delta);
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
        this.wasKeyDown = true;
    }
};

Mario.LoseState.prototype.Draw = function(context) {
    this.drawManager.Draw(context, this.camera);
};

Mario.LoseState.prototype.CheckForChange = function(context) {
    if (this.wasKeyDown && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
        context.ChangeState(new Mario.TitleState());
    }
};

// ==================== mapState.js ====================

/**
	State for moving between different playable levels.
	Code by Rob Kleffner, 2011
*/

Mario.MapTile = {
    Grass: 0,
    Water: 1,
    Level: 2,
    Road: 3,
    Decoration: 4
};

Mario.MapState = function() {
    this.camera = new Enjine.Camera();

    this.Level = [];
    this.Data = [];
    this.XMario = 0; this.YMario = 0;
    this.XMarioA = 0; this.YMarioA = 0;
    this.MoveTime = 0;
    this.LevelId = 0;
    this.Farthest = 0;
    this.XFarthestCap = 0;
    this.YFarthestCap = 0;
    this.MapImage = document.createElement("canvas");
    this.MapImage.width = 320;
    this.MapImage.height = 240;
    this.MapContext = this.MapImage.getContext("2d");
    this.CanEnterLevel = false;
    this.EnterLevel = false;
    this.LevelDifficulty = 0;
    this.LevelType = 0;

    this.WorldNumber = -1;
    this.NextWorld();
};

Mario.MapState.prototype = new Enjine.GameState();

Mario.MapState.prototype.Enter = function() {
    this.WaterSprite = new Enjine.AnimatedSprite();
    this.WaterSprite.Image = Enjine.Resources.Images["worldMap"];
    this.WaterSprite.SetColumnCount(16);
    this.WaterSprite.SetRowCount(16);
    this.WaterSprite.AddNewSequence("loop", 14, 0, 14, 3);
    this.WaterSprite.FramesPerSecond = 1/3;
    this.WaterSprite.PlaySequence("loop", true);
    this.WaterSprite.X = 0;
    this.WaterSprite.Y = 0;

    this.DecoSprite = new Enjine.AnimatedSprite();
    this.DecoSprite.Image = Enjine.Resources.Images["worldMap"];
    this.DecoSprite.SetColumnCount(16);
    this.DecoSprite.SetRowCount(16);
    this.DecoSprite.AddNewSequence("world0", 10, 0, 10, 3);
    this.DecoSprite.AddNewSequence("world1", 11, 0, 11, 3);
    this.DecoSprite.AddNewSequence("world2", 12, 0, 12, 3);
    this.DecoSprite.AddNewSequence("world3", 13, 0, 13, 3);
    this.DecoSprite.FramesPerSecond = 1/3;
    this.DecoSprite.PlaySequence("world0", true);
    this.DecoSprite.X = 0;
    this.DecoSprite.Y = 0;

    this.HelpSprite = new Enjine.AnimatedSprite();
    this.HelpSprite.Image = Enjine.Resources.Images["worldMap"];
    this.HelpSprite.SetColumnCount(16);
    this.HelpSprite.SetRowCount(16);
    this.HelpSprite.AddNewSequence("help", 7, 3, 7, 5);
    this.HelpSprite.FramesPerSecond = 1/2;
    this.HelpSprite.PlaySequence("help", true);
    this.HelpSprite.X = 0;
    this.HelpSprite.Y = 0;

    this.SmallMario = new Enjine.AnimatedSprite();
    this.SmallMario.Image = Enjine.Resources.Images["worldMap"];
    this.SmallMario.SetColumnCount(16);
    this.SmallMario.SetRowCount(16);
    this.SmallMario.AddNewSequence("small", 1, 0, 1, 1);
    this.SmallMario.FramesPerSecond = 1/3;
    this.SmallMario.PlaySequence("small", true);
    this.SmallMario.X = 0;
    this.SmallMario.Y = 0;

    this.LargeMario = new Enjine.AnimatedSprite();
    this.LargeMario.Image = Enjine.Resources.Images["worldMap"];
    this.LargeMario.SetColumnCount(16);
    this.LargeMario.SetRowCount(8);
    this.LargeMario.AddNewSequence("large", 0, 2, 0, 3);
    this.LargeMario.AddNewSequence("fire", 0, 4, 0, 5);
    this.LargeMario.FramesPerSecond = 1/3;
    this.LargeMario.PlaySequence("large", true);
    this.LargeMario.X = 0;
    this.LargeMario.Y = 0;

    this.FontShadow = Mario.SpriteCuts.CreateBlackFont();
    this.Font = Mario.SpriteCuts.CreateWhiteFont();

    //get the correct world decoration
    this.DecoSprite.PlaySequence("world" + (this.WorldNumber % 4), true);

    if (!Mario.MarioCharacter.Fire) {
        this.LargeMario.PlaySequence("large", true);
    } else {
        this.LargeMario.PlaySequence("fire", true);
    }

    this.EnterLevel = false;
    this.LevelDifficulty = 0;
    this.LevelType = 0;

	Mario.PlayMapMusic();
};

Mario.MapState.prototype.Exit = function() {
	  Mario.StopMusic();

    delete this.WaterSprite;
    delete this.DecoSprite;
    delete this.HelpSprite;
    delete this.SmallMario;
    delete this.LargeMario;
    delete this.FontShadow;
    delete this.Font;
};

Mario.MapState.prototype.NextWorld = function() {
    var generated = false;
    this.WorldNumber++;

    //The player has won, wait for CheckForChange to get called
    if (this.WorldNumber === 8) {
        return;
    }

    this.MoveTime = 0;
    this.LevelId = 0;
    this.Farthest = 0;
    this.XFarthestCap = 0;
    this.YFarthestCap = 0;

    while (!generated) {
        generated = this.GenerateLevel();
    }
    this.RenderStatic();
};

Mario.MapState.prototype.GenerateLevel = function() {
    var x = 0, y = 0, t0 = 0, t1 = 0, td = 0, t = 0;

    var n0 = new Mario.ImprovedNoise((Math.random() * 9223372036854775807) | 0);
    var n1 = new Mario.ImprovedNoise((Math.random() * 9223372036854775807) | 0);
    var dec = new Mario.ImprovedNoise((Math.random() * 9223372036854775807) | 0);

    var width = 320 / 16 + 1;
    var height = 240 / 16 + 1;
    this.Level = [];
    this.Data = [];

    var xo0 = Math.random() * 512;
    var yo0 = Math.random() * 512;
    var xo1 = Math.random() * 512;
    var yo1 = Math.random() * 512;

    for (x = 0; x < width; x++) {
        this.Level[x] = [];
        this.Data[x] = [];

        for (y = 0; y < height; y++) {

            t0 = n0.PerlinNoise(x * 10 + xo0, y * 10 + yo0);
            t1 = n1.PerlinNoise(x * 10 + xo1, y * 10 + yo1);
            td = t0 - t1;
            t = td * 2;

            this.Level[x][y] = t > 0 ? Mario.MapTile.Water : Mario.MapTile.Grass;
        }
    }

    var lowestX = 9999, lowestY = 9999, i = 0;
    t = 0;

    for (i = 0; i < 100 && t < 12; i++) {
        x = ((Math.random() * (((width - 1) / 3) | 0)) | 0) * 3 + 2;
        y = ((Math.random() * (((height - 1) / 3) | 0)) | 0) * 3 + 1;
        if (this.Level[x][y] === Mario.MapTile.Grass) {
            if (x < lowestX) {
                lowestX = x;
                lowestY = y;
            }
            this.Level[x][y] = Mario.MapTile.Level;
            this.Data[x][y] = -1;
            t++;
        }
    }

    this.Data[lowestX][lowestY] = -2;

    var connection = true;
    while (connection) { connection = this.FindConnection(width, height); }
    this.FindCaps(width, height);

    if (this.XFarthestCap === 0) {
        return false;
    }

    this.Data[this.XFarthestCap][this.YFarthestCap] = -2;
    this.Data[(this.XMario / 16) | 0][(this.YMario / 16) | 0] = -11;

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            if (this.Level[x][y] === Mario.MapTile.Grass && (x !== this.XFarthestCap || y !== this.YFarthestCap - 1)) {
                t0 = dec.PerlinNoise(x * 10 + xo0, y * 10 + yo0);
                if (t0 > 0) {
                    this.Level[x][y] = Mario.MapTile.Decoration;
                }
            }
        }
    }

    return true;
};

Mario.MapState.prototype.FindConnection = function(width, height) {
    var x = 0, y = 0;
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            if (this.Level[x][y] === Mario.MapTile.Level && this.Data[x][y] === -1) {
                this.Connect(x, y, width, height);
                return true;
            }
        }
    }
    return false;
};

Mario.MapState.prototype.Connect = function(xSource, ySource, width, height) {
    var maxDistance = 10000, xTarget = 0, yTarget = 0, x = 0, y = 0,
        xd = 0, yd = 0, d = 0;

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            if (this.Level[x][y] === Mario.MapTile.Level && this.Data[x][y] === -2) {
                xd = Math.abs(xSource - x) | 0;
                yd = Math.abs(ySource - y) | 0;
                d = xd * xd + yd * yd;
                if (d < maxDistance) {
                    xTarget = x;
                    yTarget = y;
                    maxDistance = d;
                }
            }
        }
    }

    this.DrawRoad(xSource, ySource, xTarget, yTarget);
    this.Level[xSource][ySource] = Mario.MapTile.Level;
    this.Data[xSource][ySource] = -2;
    return;
};

Mario.MapState.prototype.DrawRoad = function(x0, y0, x1, y1) {
    var xFirst = false;
    if (Math.random() > 0.5) {
        xFirst = true;
    }

    if (xFirst) {
        while (x0 > x1) {
            this.Data[x0][y0] = 0;
            this.Level[x0--][y0] = Mario.MapTile.Road;
        }
        while (x0 < x1) {
            this.Data[x0][y0] = 0;
            this.Level[x0++][y0] = Mario.MapTile.Road;
        }
    }

    while (y0 > y1) {
        this.Data[x0][y0] = 0;
        this.Level[x0][y0--] = Mario.MapTile.Road;
    }
    while (y0 < y1) {
        this.Data[x0][y0] = 0;
        this.Level[x0][y0++] = Mario.MapTile.Road;
    }

    if (!xFirst) {
        while (x0 > x1) {
            this.Data[x0][y0] = 0;
            this.Level[x0--][y0] = Mario.MapTile.Road;
        }
        while (x0 < x1) {
            this.Data[x0][y0] = 0;
            this.Level[x0++][y0] = Mario.MapTile.Road;
        }
    }
};

Mario.MapState.prototype.FindCaps = function(width, height) {
    var x = 0, y = 0, xCap = -1, yCap = -1, roads = 0, xx = 0, yy = 0;

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            if (this.Level[x][y] === Mario.MapTile.Level) {
                roads = 0;

                for (xx = x - 1; xx <= x + 1; xx++) {
                    for (yy = y - 1; yy <= y + 1; yy++) {
                        if (this.Level[xx][yy] === Mario.MapTile.Road) {
                            roads++;
                        }
                    }
                }

                if (roads === 1) {
                    if (xCap === -1) {
                        xCap = x;
                        yCap = y;
                    }
                    this.Data[x][y] = 0;
                } else {
                    this.Data[x][y] = 1;
                }
            }
        }
    }

    this.XMario = xCap * 16;
    this.YMario = yCap * 16;

    this.Travel(xCap, yCap, -1, 0);
};

Mario.MapState.prototype.Travel = function(x, y, dir, depth) {
    if (this.Level[x][y] !== Mario.MapTile.Road && this.Level[x][y] !== Mario.MapTile.Level) {
        return;
    }

    if (this.Level[x][y] === Mario.MapTile.Road) {
        if (this.Data[x][y] === 1) {
            return;
        } else {
            this.Data[x][y] = 1;
        }
    }

    if (this.Level[x][y] === Mario.MapTile.Level) {
        if (this.Data[x][y] > 0) {
            if (this.LevelId !== 0 && ((Math.random() * 4) | 0) === 0) {
                this.Data[x][y] = -3;
            } else {
                this.Data[x][y] = ++this.LevelId;
            }
        } else if (depth > 0) {
            this.Data[x][y] = -1;
            if (depth > this.Farthest) {
                this.Farthest = depth;
                this.XFarthestCap = x;
                this.YFarthestCap = y;
            }
        }
    }

    if (dir !== 2) {
        this.Travel(x - 1, y, 0, depth++);
    }
    if (dir !== 3) {
        this.Travel(x, y - 1, 1, depth++);
    }
    if (dir !== 0) {
        this.Travel(x + 1, y, 2, depth++);
    }
    if (dir !== 1) {
        this.Travel(x, y + 1, 3, depth++);
    }
};

Mario.MapState.prototype.RenderStatic = function() {
    var x = 0, y = 0, p0 = 0, p1 = 0, p2 = 0, p3 = 0, s = 0, xx = 0, yy = 0,
        image = Enjine.Resources.Images["worldMap"], type = 0;

    //320 / 16 = 20
    for (x = 0; x < 20; x++) {
        //240 / 16 = 15
        for (y = 0; y < 15; y++) {
            this.MapContext.drawImage(image, ((this.WorldNumber / 4) | 0) * 16, 0, 16, 16, x * 16, y * 16, 16, 16);

            if (this.Level[x][y] === Mario.MapTile.Level) {
                type = this.Data[x][y];
                if (type === 0) {
                    this.MapContext.drawImage(image, 0, 7 * 16, 16, 16, x * 16, y * 16, 16, 16);
                } else if (type === -1) {
                    this.MapContext.drawImage(image, 3 * 16, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                } else if (type === -3) {
                    this.MapContext.drawImage(image, 0, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                } else if (type === -10) {
                    this.MapContext.drawImage(image, 16, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                } else if (type === -11) {
                    this.MapContext.drawImage(image, 16, 7 * 16, 16, 16, x * 16, y * 16, 16, 16);
                } else if (type === -2) {
                    this.MapContext.drawImage(image, 2 * 16, 7 * 16, 16, 16, x * 16, (y - 1) * 16, 16, 16);
                    this.MapContext.drawImage(image, 2 * 16, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                } else {
                    this.MapContext.drawImage(image, (type - 1) * 16, 6 * 16, 16, 16, x * 16, y * 16, 16, 16);
                }
            } else if (this.Level[x][y] === Mario.MapTile.Road) {
                p0 = this.IsRoad(x - 1, y) ? 1 : 0;
                p1 = this.IsRoad(x, y - 1) ? 1 : 0;
                p2 = this.IsRoad(x + 1, y) ? 1 : 0;
                p3 = this.IsRoad(x, y + 1) ? 1 : 0;
                s = p0 + (p1 * 2) + (p2 * 4) + (p3 * 8);
                this.MapContext.drawImage(image, s * 16, 32, 16, 16, x * 16, y * 16, 16, 16);
            } else if (this.Level[x][y] === Mario.MapTile.Water) {
                for (xx = 0; xx < 2; xx++) {
                    for (yy = 0; yy < 2; yy++) {
                        p0 = this.IsWater(x * 2 + (xx - 1), y * 2 + (yy - 1)) ? 0 : 1;
                        p1 = this.IsWater(x * 2 + xx, y * 2 + (yy - 1)) ? 0 : 1;
                        p2 = this.IsWater(x * 2 + (xx - 1), y * 2 + yy) ? 0 : 1;
                        p3 = this.IsWater(x * 2 + xx, y * 2 + yy) ? 0 : 1;
                        s = p0 + (p1 * 2) + (p2 * 4) + (p3 * 8) - 1;
                        if (s >= 0 && s <= 14) {
                            this.MapContext.drawImage(image, s * 16, (4 + ((xx + yy) & 1)) * 16, 16, 16, x * 16 + xx * 8, y * 16 + yy * 8, 16, 16);
                        }
                    }
                }
            }
        }
    }
};

Mario.MapState.prototype.IsRoad = function(x, y) {
    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }
    if (this.Level[x][y] === Mario.MapTile.Road) {
        return true;
    }
    if (this.Level[x][y] === Mario.MapTile.Level) {
        return true;
    }
    return false;
};

Mario.MapState.prototype.IsWater = function(x, y) {
    var xx = 0, yy = 0;
    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }

    for (xx = 0; xx < 2; xx++) {
        for (yy = 0; yy < 2; yy++) {
            if (this.Level[((x + xx) / 2) | 0][((y + yy) / 2) | 0] !== Mario.MapTile.Water) {
                return false;
            }
        }
    }

    return true;
};

Mario.MapState.prototype.Update = function(delta) {
    var x = 0, y = 0, difficulty = 0, type = 0;

    if (this.WorldNumber === 8) {
        return;
    }

    this.XMario += this.XMarioA;
    this.YMario += this.YMarioA;

    x = (this.XMario / 16) | 0;
    y = (this.YMario / 16) | 0;

    if (this.Level[x][y] === Mario.MapTile.Road) {
        this.Data[x][y] = 0;
    }

    if (this.MoveTime > 0) {
        this.MoveTime--;
    } else {
        this.XMarioA = 0;
        this.YMarioA = 0;

        if (this.CanEnterLevel && Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            if (this.Level[x][y] === Mario.MapTile.Level && this.Data[x][y] !== -11) {
                if (this.Level[x][y] === Mario.MapTile.Level && this.Data[x][y] !== 0 && this.Data[x][y] > -10) {
                    difficulty = this.WorldNumber + 1;
                    Mario.MarioCharacter.LevelString = difficulty + "-";
                    type = Mario.LevelType.Overground;

                    if (this.Data[x][y] > 1 && ((Math.random() * 3) | 0) === 0) {
                        type = Mario.LevelType.Underground;
                    }

                    if (this.Data[x][y] < 0) {
                        if (this.Data[x][y] === -2) {
                            Mario.MarioCharacter.LevelString += "X";
                            difficulty += 2;
                        } else if (this.Data[x][y] === -1) {
                            Mario.MarioCharacter.LevelString += "?";
                        } else {
                            Mario.MarioCharacter.LevelString += "#";
                            difficulty += 1;
                        }

                        type = Mario.LevelType.Castle;
                    } else {
                        Mario.MarioCharacter.LevelString += this.Data[x][y];
                    }

                    //TODO: stop music here
                    this.EnterLevel = true;
                    this.LevelDifficulty = difficulty;
                    this.LevelType = type;
                }
            }
        }

        this.CanEnterLevel = !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S);

        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) {
            this.TryWalking(-1, 0);
        }
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
            this.TryWalking(1, 0);
        }
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
            this.TryWalking(0, -1);
        }
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
            this.TryWalking(0, 1);
        }
    }

    this.WaterSprite.Update(delta);
    this.DecoSprite.Update(delta);
    this.HelpSprite.Update(delta);
    if (!Mario.MarioCharacter.Large) {
        this.SmallMario.X = this.XMario + (this.XMarioA * delta) | 0;
        this.SmallMario.Y = this.YMario + ((this.YMarioA * delta) | 0) - 6;
        this.SmallMario.Update(delta);
    } else {
        this.LargeMario.X = this.XMario + (this.XMarioA * delta) | 0;
        this.LargeMario.Y = this.YMario + ((this.YMarioA * delta) | 0) - 22;
        this.LargeMario.Update(delta);
    }
};

Mario.MapState.prototype.TryWalking = function(xd, yd) {
    var x = (this.XMario / 16) | 0, y = (this.YMario / 16) | 0, xt = x + xd, yt = y + yd;

    if (this.Level[xt][yt] === Mario.MapTile.Road || this.Level[xt][yt] === Mario.MapTile.Level) {
        if (this.Level[xt][yt] === Mario.MapTile.Road) {
            if ((this.Data[xt][yt] !== 0) && (this.Data[x][y] !== 0 && this.Data[x][y] > -10)) {
                return;
            }
        }

        this.XMarioA = xd * 8;
        this.YMarioA = yd * 8;
        this.MoveTime = this.CalcDistance(x, y, xd, yd) * 2 + 1;
    }
};

Mario.MapState.prototype.CalcDistance = function(x, y, xa, ya) {
    var distance = 0;
    while (true) {
        x += xa;
        y += ya;
        if (this.Level[x][y] !== Mario.MapTile.Road) {
            return distance;
        }
        if (this.Level[x - ya][y + xa] === Mario.MapTile.Road) {
            return distance;
        }
        if (this.Level[x + ya][y - xa] === Mario.MapTile.Road) {
            return distance;
        }
        distance++;
    }
};

Mario.MapState.prototype.Draw = function(context) {
    var x = 0, y = 0;

    if (this.WorldNumber === 8) {
        return;
    }

    context.drawImage(this.MapImage, 0, 0);

    for (y = 0; y <= 15; y++) {
        for (x = 20; x >= 0; x--) {
            if (this.Level[x][y] === Mario.MapTile.Water) {
                if (this.IsWater(x * 2 - 1, y * 2 - 1)) {
                    this.WaterSprite.X = x * 16 - 8;
                    this.WaterSprite.Y = y * 16 - 8;
                    this.WaterSprite.Draw(context, this.camera);
                }
            } else if (this.Level[x][y] === Mario.MapTile.Decoration) {
                this.DecoSprite.X = x * 16;
                this.DecoSprite.Y = y * 16;
                this.DecoSprite.Draw(context, this.camera);
            } else if (this.Level[x][y] === Mario.MapTile.Level && this.Data[x][y] === -2) {
                this.HelpSprite.X = x * 16 + 16;
                this.HelpSprite.Y = y * 16 - 16;
                this.HelpSprite.Draw(context, this.camera);
            }
        }
    }

    if (!Mario.MarioCharacter.Large) {
        this.SmallMario.Draw(context, this.camera);
    } else {
        this.LargeMario.Draw(context, this.camera);
    }

    this.Font.Strings[0] = { String: "MARIO " + Mario.MarioCharacter.Lives, X: 4, Y: 4 };
    this.FontShadow.Strings[0] = { String: "MARIO " + Mario.MarioCharacter.Lives, X: 5, Y: 5 };
    this.Font.Strings[1] = { String: "WORLD " + (this.WorldNumber + 1), X: 256, Y: 4 };
    this.FontShadow.Strings[1] = { String: "WORLD " + (this.WorldNumber + 1), X: 257, Y: 5 };

    this.FontShadow.Draw(context, this.camera);
    this.Font.Draw(context, this.camera);
};

Mario.MapState.prototype.LevelWon = function() {
    var x = this.XMario / 16, y = this.YMario / 16;
    if (this.Data[x][y] === -2) {
        this.NextWorld();
        return;
    }
    if (this.Data[x][y] !== -3) {
        this.Data[x][y] = 0;
    } else {
        this.Data[x][y] = -10;
    }
    this.RenderStatic();
};

Mario.MapState.prototype.GetX = function() {
    return 160;
};

Mario.MapState.prototype.GetY = function() {
    return 120;
};

Mario.MapState.prototype.CheckForChange = function(context) {
    if (this.WorldNumber === 8) {
        context.ChangeState(new Mario.WinState());
    }
    if (this.EnterLevel) {
        context.ChangeState(new Mario.LevelState(this.LevelDifficulty, this.LevelType));
    }
};


// ==================== mushroom.js ====================

/**
	Represents a life-giving mushroom.
	Code by Rob Kleffner, 2011
*/

Mario.Mushroom = function(world, x, y) {
    this.RunTime = 0;
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    this.OnGround = false;
    this.Width = 4;
    this.Height = 24;
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Image = Enjine.Resources.Images["items"];
    this.XPicO = 8;
    this.YPicO = 15;
    this.YPic = 0;
    this.Height = 12;
    this.Facing = 1;
    this.PicWidth = this.PicHeight = 16;
    this.Life = 0;
};

Mario.Mushroom.prototype = new Mario.NotchSprite();

Mario.Mushroom.prototype.CollideCheck = function() {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
    if (xMarioD > -16 && xMarioD < 16) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            Mario.MarioCharacter.GetMushroom();
            this.World.RemoveSprite(this);
        }
    }
};

Mario.Mushroom.prototype.Move = function() {
    if (this.Life < 9) {
        this.Layer = 0;
        this.Y--;
        this.Life++;
        return;
    }
    
    var sideWaysSpeed = 1.75;
    this.Layer = 1;
    
    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    
    this.Xa = this.Facing * sideWaysSpeed;
    
    this.XFlip = this.Facing === -1;
    this.RunTime += Math.abs(this.Xa) + 5;
    
    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);
    
    this.Ya *= 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        this.Ya += 2;
    }
};

Mario.Mushroom.prototype.SubMove = function(xa, ya) {
    var collide = false;
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }
    
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.JumpTime = 0;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Mushroom.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }
    
    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.Mushroom.prototype.BumpCheck = function(x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 - 16 && y === ((y - 1) / 16) | 0) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};

// ==================== music.js ====================

/*
* using cross platform MIDI library MIDI.js http://www.midijs.net/
*/

var midifiles = {
	"title" : "midi/title.mid",
	"map" : "midi/map.mid",
	"background" : "midi/background.mid",
	"overground" : "midi/overground.mid",
	"underground" : "midi/underground.mid",
	"castle" : "midi/castle.mid",
};

Mario.PlayMusic = function(name) {
	if(name in midifiles)
	{
		// Currently we stop all playing tracks when playing a new one
		// MIDIjs can't play multiple at one time
		//MIDIjs.stop();;
		//MIDIjs.play(midifiles[name]);
	}else{
		console.error("Cannot play music track " + name + " as i have no data for it.");
	}
};

Mario.PlayTitleMusic = function() {
	Mario.PlayMusic("title");
};

Mario.PlayMapMusic = function() {
	Mario.PlayMusic("map");
};

Mario.PlayOvergroundMusic = function() {
	Mario.PlayMusic("background");
};

Mario.PlayUndergroundMusic = function() {
	Mario.PlayMusic("underground");
};

Mario.PlayCastleMusic = function() {
	Mario.PlayMusic("castle");
};

Mario.StopMusic = function() {
	//MIDIjs.stop();
};


// ==================== notchSprite.js ====================

/**
	Notch made his own sprite class for this game. Rather than hack around my own,
    I directly ported his to JavaScript and used that where needed.
	Code by Rob Kleffner, 2011
*/

Mario.NotchSprite = function(image) {
    this.XOld = 0; this.YOld = 0;
    this.X = 0; this.Y = 0;
    this.Xa = 0; this.Ya = 0;
    this.XPic = 0; this.YPic = 0;
    this.XPicO = 0; this.YPicO = 0;
    this.PicWidth = 32; this.PicHeight = 32;
    this.XFlip = false; this.YFlip = false;
    this.Visible = true;
    this.Image = image;
    this.Delta = 0;
    this.SpriteTemplate = null;
    this.Layer = 1;
};

Mario.NotchSprite.prototype = new Enjine.Drawable();

Mario.NotchSprite.prototype.Draw = function(context, camera) {
    var xPixel = 0, yPixel = 0;
    if (!this.Visible) {
        return;
    }
    
    xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
    yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
    
    context.save();
    context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
    context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
    context.drawImage(this.Image, this.XPic * this.PicWidth, this.YPic * this.PicHeight, this.PicWidth, this.PicHeight,
        this.XFlip ? (320 - xPixel - this.PicWidth) : xPixel, this.YFlip ? (240 - yPixel - this.PicHeight) : yPixel, this.PicWidth, this.PicHeight);
    context.restore();
};

Mario.NotchSprite.prototype.Update = function(delta) {
    this.XOld = this.X;
    this.YOld = this.Y;
    this.Move();
    this.Delta = delta;
};

Mario.NotchSprite.prototype.UpdateNoMove = function(delta) {
    this.XOld = this.X;
    this.YOld = this.Y;
    this.Delta = 0;
};

Mario.NotchSprite.prototype.Move = function() {
    this.X += this.Xa;
    this.Y += this.Ya;
};

Mario.NotchSprite.prototype.GetX = function(delta) {
    return ((this.XOld + (this.X - this.XOld) * delta) | 0) - this.XPicO;
};

Mario.NotchSprite.prototype.GetY = function(delta) {
    return ((this.YOld + (this.Y - this.YOld) * delta) | 0) - this.YPicO;
};

Mario.NotchSprite.prototype.CollideCheck = function() { };

Mario.NotchSprite.prototype.BumpCheck = function(xTile, yTile) { };

Mario.NotchSprite.prototype.Release = function(mario) { };

Mario.NotchSprite.prototype.ShellCollideCheck = function(shell) {
    return false;
};

Mario.NotchSprite.prototype.FireballCollideCheck = function(fireball) {
    return false;
};

// ==================== particle.js ====================

/**
	Represents a piece of a broken block.
	Code by Rob Kleffner, 2011
*/

Mario.Particle = function(world, x, y, xa, ya, xPic, yPic) {
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Xa = xa;
	this.Ya = ya;
	this.XPic = (Math.random() * 2) | 0;
	this.YPic = 0;
	this.XPicO = 4;
	this.YPicO = 4;
	
	this.PicWidth = 8;
	this.PicHeight = 8;
	this.Life = 10;
	
	this.Image = Enjine.Resources.Images["particles"];
};

Mario.Particle.prototype = new Mario.NotchSprite();

Mario.Particle.prototype.Move = function() {
	if (this.Life - this.Delta < 0) {
		this.World.RemoveSprite(this);
	}
	this.Life -= this.Delta;
	
	this.X += this.Xa;
	this.Y += this.Ya;
	this.Ya *= 0.95;
	this.Ya += 3;
};

// ==================== setup.js ====================

/**
	Just create the global mario object.
	Code by Rob Kleffner, 2011
*/

var Mario = {};

// ==================== shell.js ====================

/**
	Represents a shell that once belonged to a now expired koopa.
	Code by Rob Kleffner, 2011
*/

Mario.Shell = function(world, x, y, type) {
	this.World = world;
	this.X = x;
	this.Y = y;
	
	this.YPic = type;
	this.Image = Enjine.Resources.Images["enemies"];
	
	this.XPicO = 8;
	this.YPicO = 31;
	this.Width = 4;
	this.Height = 12;
	this.Facing = 0;
	this.PicWidth = 16;
	this.XPic = 4;
	this.Ya = -5;
	
	this.Dead = false;
	this.DeadTime = 0;
	this.Carried = false;
	
	this.GroundInertia = 0.89;
	this.AirInertia = 0.89;
	this.OnGround = false;
	this.Anim = 0;
};

Mario.Shell.prototype = new Mario.NotchSprite();

Mario.Shell.prototype.FireballCollideCheck = function(fireball) {
	if (this.DeadTime !== 0) {
        return false;
    }
    
    var xD = fireball.X - this.X, yD = fireball.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < fireball.Height) {
			if (this.Facing !== 0) {
				return true;
			}
			
			Enjine.Resources.PlaySound("kick");
			
			this.Xa = fireball.Facing * 2;
			this.Ya = -5;
			if (this.SpriteTemplate !== null) {
				this.SpriteTemplate.IsDead = true;
			}
			this.DeadTime = 100;
			this.YFlip = true;
			
            return true;
        }
    }
    return false;
};

Mario.Shell.prototype.CollideCheck = function() {
	if (this.Carried || this.Dead || this.DeadTime > 0) {
		return;
	}
	
	var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
	if (xMarioD > -16 && xMarioD < 16) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
			if (Mario.MarioCharacter.Ya > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
				Mario.MarioCharacter.Stomp(this);
				if (this.Facing !== 0) {
					this.Xa = 0;
					this.Facing = 0;
				} else {
					this.Facing = Mario.MarioCharacter.Facing;
				}
			} else {
				if (this.Facing !== 0) {
					Mario.MarioCharacter.GetHurt();
				} else {
					Mario.MarioCharacter.Kick(this);
					this.Facing = Mario.MarioCharacter.Facing;
				}
			}
		}
	}
};

Mario.Shell.prototype.Move = function() {
	var sideWaysSpeed = 11, i = 0;
	if (this.Carried) {
		this.World.CheckShellCollide(this);
		return;
	}
	
	if (this.DeadTime > 0) {
		this.DeadTime--;
		
		if (this.DeadTime === 0) {
			this.DeadTime = 1;
			for (i = 0; i < 8; i++) {
                this.World.AddSprite(new Mario.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
			this.World.RemoveSprite(this);
		}
		
		this.X += this.Xa;
		this.Y += this.Ya;
		this.Ya *= 0.95;
		this.Ya += 1;
		return;
	}
	
	if (this.Facing !== 0) {
		this.Anim++;
	}
	
	if (this.Xa > 2) {
		this.Facing = 1;
	}
	if (this.Xa < -2) {
		this.Facing = -1;
	}
	
	this.Xa = this.Facing * sideWaysSpeed;
	
	if (this.Facing !== 0) {
		this.World.CheckShellCollide(this);
	}
	
	this.XFlip = this.Facing === -1;
	
	this.XPic = ((this.Anim / 2) | 0) % 4 + 3;
    
    if (!this.SubMove(this.Xa, 0)) {
        Enjine.Resources.PlaySound("bump");
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);
    
    this.Ya *= 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        this.Ya += 2;
    }
};

Mario.Shell.prototype.SubMove = function(xa, ya) {
    var collide = false;
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }
    
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Shell.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false;
    }
    
    var blocking = this.World.Level.IsBlocking(x, y, xa, ya);
    
    if (blocking && ya === 0 && xa !== 0) {
        this.World.Bump(x, y, true);
    }
    return blocking;
};

Mario.Shell.prototype.BumpCheck = function(x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 + 16 && y === (((this.Y - 1) / 16) | 0)) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};

Mario.Shell.prototype.Die = function() {
    this.Dead = true;
    this.Carried = false;
    this.Xa = -this.Facing * 2;
    this.Ya = -5;
    this.DeadTime = 100;
};

Mario.Shell.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xD = shell.X - this.X, yD = shell.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < shell.Height) {
            Enjine.Resources.PlaySound("kick");
            if (Mario.MarioCharacter.Carried === shell || Mario.MarioCharacter.Carried === this) {
                Mario.MarioCharacter.Carried = null;
            }
            this.Die();
            shell.Die();
            return true;
        }
    }
    return false;
};

Mario.Shell.prototype.Release = function(mario) {
    this.Carried = false;
    this.Facing = Mario.MarioCharacter.Facing;
    this.X += this.Facing * 8;
};

// ==================== sparkle.js ====================

/**
	Represents a little sparkle object in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Sparkle = function(world, x, y, xa, ya) {
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Xa = xa;
    this.Ya = ya;
    this.XPic = (Math.random() * 2) | 0;
    this.YPic = 0;
    
    this.Life = 10 + ((Math.random() * 5) | 0);
    this.XPicStart = this.XPic;
    this.XPicO = 4;
    this.YPicO = 4;
    
    this.PicWidth = 8;
    this.PicHeight = 8;
    this.Image = Enjine.Resources.Images["particles"];
};

Mario.Sparkle.prototype = new Mario.NotchSprite();

Mario.Sparkle.prototype.Move = function() {
    if (this.Life > 10) {
        this.XPic = 7;
    } else {
        this.XPic = (this.XPicStart + (10 - this.Life) * 0.4) | 0;
    }
    
    if (this.Life-- < 0) {
        this.World.RemoveSprite(this);
    }
    
    this.X += this.Xa;
    this.Y += this.Ya;
};

// ==================== spriteCuts.js ====================

/**
	Helper to cut up the sprites.
	Code by Rob Kleffner, 2011
*/

Mario.SpriteCuts = {
    
    /*********************
     * Font related
     ********************/         
    CreateBlackFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(0));
    },
    
    CreateRedFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(8));
    },
    
    CreateGreenFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(16));
    },
    
    CreateBlueFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(24));
    },
    
    CreateYellowFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(32));
    },
    
    CreatePinkFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(40));
    },
    
    CreateCyanFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(48));
    },
    
    CreateWhiteFont: function() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, this.GetCharArray(56));
    },
    
    GetCharArray: function(y) {
        var letters = [];
        var i = 0;
        for (i = 32; i < 127; i++) {
            letters[i] = { X: (i - 32) * 8, Y: y };
        }
        return letters;
    },
    
    /*********************
     * Spritesheet related
     ********************/
    GetBackgroundSheet: function() {
        var sheet = [];
        var x = 0, y = 0, width = Enjine.Resources.Images["background"].width / 32, height = Enjine.Resources.Images["background"].height / 32;
        
        for (x = 0; x < width; x++) {
            sheet[x] = [];
        
            for (y = 0; y < height; y++) {
                sheet[x][y] = { X: x * 32, Y: y * 32, Width: 32, Height: 32 };
            }
        }
        return sheet;
    },
    
    GetLevelSheet: function() {
        var sheet = [], x = 0, y = 0, width = Enjine.Resources.Images["map"].width / 16, height = Enjine.Resources.Images["map"].height / 16;
        
        for (x = 0; x < width; x++) {
            sheet[x] = [];
            
            for (y = 0; y < height; y++) {
                sheet[x][y] = { X: x * 16, Y: y * 16, Width: 16, Height: 16 };
            }
        }
        return sheet;
    }
};

// ==================== spriteTemplate.js ====================

/**
	Creates a specific type of sprite based on the information given.
	Code by Rob Kleffner, 2011
*/

Mario.SpriteTemplate = function(type, winged) {
    this.Type = type;
    this.Winged = winged;
    this.LastVisibleTick = -1;
    this.IsDead = false;
    this.Sprite = null;
};

Mario.SpriteTemplate.prototype = {
    Spawn: function(world, x, y, dir) {
        if (this.IsDead) {
            return;
        }
        
        if (this.Type === Mario.Enemy.Flower) {
            this.Sprite = new Mario.FlowerEnemy(world, x * 16 + 15, y * 16 + 24);
        } else {
            this.Sprite = new Mario.Enemy(world, x * 16 + 8, y * 16 + 15, dir, this.Type, this.Winged);
        }
        this.Sprite.SpriteTemplate = this;
        world.AddSprite(this.Sprite);
    }
};

// ==================== titleState.js ====================

/**
	Displays the title screen and menu.
	Code by Rob Kleffner, 2011
*/

Mario.TitleState = function() {
    this.drawManager = null;
    this.camera = null;
    this.logoY = null;
    this.bounce = null;
    this.font = null;
};

Mario.TitleState.prototype = new Enjine.GameState();

Mario.TitleState.prototype.Enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();

    var bgGenerator = new Mario.BackgroundGenerator(2048, 15, true, Mario.LevelType.Overground);
    var bgLayer0 = new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 2);
    bgGenerator.SetValues(2048, 15, false, Mario.LevelType.Overground);
    var bgLayer1 = new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 1);

    this.title = new Enjine.Sprite();
    this.title.Image = Enjine.Resources.Images["title"];
    this.title.X = 0, this.title.Y = 120;

    this.logo = new Enjine.Sprite();
    this.logo.Image = Enjine.Resources.Images["logo"];
    this.logo.X = 0, this.logo.Y = 0;

    this.font = Mario.SpriteCuts.CreateRedFont();
    this.font.Strings[0] = { String: "Press S to Start", X: 96, Y: 120 };

    this.logoY = 20;

    this.drawManager.Add(bgLayer0);
    this.drawManager.Add(bgLayer1);

    this.bounce = 0;

	Mario.GlobalMapState = new Mario.MapState();
	//set up the global main character variable
	Mario.MarioCharacter = new Mario.Character();
	Mario.MarioCharacter.Image = Enjine.Resources.Images["smallMario"];

	Mario.PlayTitleMusic();
};

Mario.TitleState.prototype.Exit = function() {
    Mario.StopMusic();
	
    this.drawManager.Clear();
    delete this.drawManager;
    delete this.camera;
    delete this.font;
};

Mario.TitleState.prototype.Update = function(delta) {
    this.bounce += delta * 2;
    this.logoY = 20 + Math.sin(this.bounce) * 10;

    this.camera.X += delta * 25;

    this.drawManager.Update(delta);
};

Mario.TitleState.prototype.Draw = function(context) {
    this.drawManager.Draw(context, this.camera);

    context.drawImage(Enjine.Resources.Images["title"], 0, 120);
    context.drawImage(Enjine.Resources.Images["logo"], 0, this.logoY);

    this.font.Draw(context, this.Camera);
};

Mario.TitleState.prototype.CheckForChange = function(context) {
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
        context.ChangeState(Mario.GlobalMapState);
    }
};


// ==================== winState.js ====================

/**
	State that's shown when the player wins the game!
	Code by Rob Kleffner, 2011
*/

Mario.WinState = function() {
    this.waitTime = 2;
    this.drawManager = null;
    this.camera = null;
    this.font = null;
    this.kissing = null;
    this.wasKeyDown = false;
};

Mario.WinState.prototype = new Enjine.GameState();

Mario.WinState.prototype.Enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();
    
    this.font = Mario.SpriteCuts.CreateBlackFont();
    this.font.Strings[0] = { String: "Thank you for saving me, Mario!", X: 36, Y: 160 };
    
    this.kissing = new Enjine.AnimatedSprite();
    this.kissing.Image = Enjine.Resources.Images["endScene"];
    this.kissing.X = 112;
    this.kissing.Y = 52;
    this.kissing.SetColumnCount(2);
    this.kissing.SetRowCount(1);
    this.kissing.AddNewSequence("loop", 0, 0, 0, 1);
    this.kissing.PlaySequence("loop", true);
    this.kissing.FramesPerSecond = 1/2;
    
    this.waitTime = 2;
    
    this.drawManager.Add(this.font);
    this.drawManager.Add(this.kissing);
};

Mario.WinState.prototype.Exit = function() {
    this.drawManager.Clear();
    delete this.drawManager;
    delete this.camera;
};

Mario.WinState.prototype.Update = function(delta) {
    this.drawManager.Update(delta);
    
    if (this.waitTime > 0) {
        this.waitTime -= delta;
    } else {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            this.wasKeyDown = true;
        }
    }
};

Mario.WinState.prototype.Draw = function(context) {
    this.drawManager.Draw(context, this.camera);
};

Mario.WinState.prototype.CheckForChange = function(context) {
    if (this.waitTime <= 0) {
        if (this.wasKeyDown && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            context.ChangeState(new Mario.TitleState());
        }
    }
};
