var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 1500;
var particles =[];
var num_particles=4;
var vx=0.450;
var vy=0.450;
var mass=40;
var G=5;
var delta =0.06;



var Particle = function () {
        this.pos = new Vector();
        this.pos.x =100+ 300* Math.random();
        this.pos.y = 100+ 300* Math.random();
        //this.t= Math.random()
        this.r=Math.log(mass);
        this.mass=mass;
        this.vx=0;
        this.vy=0;
        this.oldpos = new Vector().xy(this.pos.x-vx, this.pos.y-vy);
        this.accel= new Vector().xy(0,0);
        this.oldt=1;
        this.doGrav=function(other)
        {

        var dx = other.pos.x - this.pos.x;
        var dy = other.pos.y - this.pos.y;
       
        var distSq = dx*dx + dy*dy;
        

        var forceMag = (G*this.mass * other.mass) / distSq;
        var forceVec = new Vector().xy(dx, dy);
        forceVec.m = forceMag;
        forceVec.updateXY();
        
        this.accel = this.accel.add(forceVec);
        other.accel = other.accel.add(forceVec.multiply(-1));
        
       // console.log(this.accel.x);
       }
        
       this.Move = function(t)
       {
        var tcv = t/this.oldt;

        var vel = this.pos.subtract(this.oldpos).multiply(tcv);
        var tSq = t*t;
        
        var newpos = this.pos.add(vel).add(this.accel.multiply(tSq));

        this.oldpos = this.pos;
        this.pos = newpos;

        this.accel = new Vector();
        this.oldt = t;
       }
       
       this.checkHit = function(other)
       {

        var dx = other.pos.x - this.pos.x;
        var dy = other.pos.y - this.pos.y;
        
      
        
        var rSq = (this.r*this.r + other.r*other.r);
        
        
       
        if (Math.pow(dx,2)+Math.pow(dy,2) <= 2*rSq) {
            
            var newMass = this.mass + other.mass;
            var thisP = this.pos.subtract(this.oldpos).multiply(this.mass);
            var otherP = other.pos.subtract(other.oldpos).multiply(other.mass);
            var newV = thisP.add(otherP).divide(newMass);

           
            
            this.r = Math.log(newMass)
            this.mass = newMass;
            this.oldpos = this.pos.subtract(newV);
            return true;
        }
        return false;
       }
}

for( let i=0;i<num_particles;i++)
{
  particles.push(new Particle());
}





Particle.prototype.Draw = function (ctx) {
       ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.beginPath();
            ctx.arc(0,0,this.r,0,2*Math.PI,true);
            ctx.closePath();
            ctx.fill();
        ctx.restore();
}

function loop() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(let i=0;i<num_particles-1;i++)
      {
         for(let j=i+1;j<num_particles;j++)
         {
          particles[i].doGrav(particles[j])
         }
      } 
      for(let i=0;i<num_particles;i++)
      {
        particles[i].Move(delta);
      }

      for (let i = 0; i < num_particles - 1; i++) {
        for (let j = i + 1; j < num_particles; j++) {
            if (particles[i].checkHit(particles[j])) {
                
                particles.splice(j,1);
                j--;
                 num_particles--;
            }
        }
    }
      for(i=0;i<num_particles;i++)
      {
        particles[i].Draw(ctx);
        //particles[i].pos.x=100;
      }


      
      //requestAnimationFrame(loop);
}
//loop();

setInterval(loop,60);


function Vector() {
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.m = 0;

    this.xy = function(x,y) {
        this.x = x;
        this.y = y;
        this.updatePolar();
        return this;
    }

    this.polar = function(m,a) {
        this.m = m;
        this.a = a;
        this.updateXY();
        return this;
    }

    this.updateXY = function() {
        this.x = this.m * Math.cos(this.a);
        this.y = this.m * Math.sin(this.a);
    }

    this.updatePolar = function() {
        this.m = Math.sqrt(this.x*this.x + this.y*this.y);
        this.a = Math.atan2(this.y,this.x);
    }

    this.add = function(v1) {
        return new Vector().xy(this.x + v1.x, this.y + v1.y);
    }

    this.subtract = function(v1) {
        return new Vector().xy(this.x - v1.x, this.y - v1.y);
    }

    this.multiply = function(s) {
        return new Vector().polar(this.m * s, this.a);
    }

    this.divide = function(s) {
        return new Vector().polar(this.m / s, this.a);
    }

    this.unit = function() {
        return new Vector.polar(this.a, 1);
    }

    this.dot = function(v) {
        return this.x * v.x + this.y * v.y;
    }

    // calculates a right hand normal
    this.normal = function() {
        return new Vector().xy(-this.y, this.x).unit();
    }

    this.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
    }
}
