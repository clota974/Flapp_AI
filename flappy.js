$(document).ready(function(){
    var svg = Snap("svg")
    var svgWidth = 400;
    var svgHeight = 500;
    const space = 250;
    const w = 50;
    const h = 150;
    const pos = 100;
    const r = 35;

    var step = 0.5;
    var time = 0;

    var gravity = 1.3*step;
    var jump = -4*step;

    var playing = true;

    var tubeList = [];

    window.hive = new Hive({shape: [3, 2, 1], population: 50});


    var Flappy = (function(id){
        this.id = id;

        hive = window.hive;
        var self = this;

        self.y = 250;
        self.sprite = svg.image("flappy.png",pos, self.y, r, r)

        self.vSpeed = gravity;
        self.jumping = false
        self.dead = false;

        self.score = 0;

        if(self.dead){
            self.kill();
            return false
        }
        
        self.update = function(index){
            self.score += step;

            self.y += self.vSpeed*self.y/500;
            self.sprite.attr({y: self.y})  


            if(self.jumping){
                self.vSpeed += 0.06
            }
            if(flappies.length <= 5){
                var z = self.vSpeed*16
                self.sprite.attr({transform: `rotateZ(${z}deg)`})  
            }
            

            // Test collision
            for (const tube of tubeList) {
                var collisionX = false;
                var collisionY = false;

    
                // Collision
                if((tube.x < pos+r && tube.x+w > pos+r) || (tube.x < pos && tube.x+w > pos)){
                    collisionX = true;
                }
    
                if(collisionX && (self.y-r < tube.y || self.y+r > tube.y+h)){
                    collisionY = true;
                }
    
                if(collisionX && collisionY || self.y<r || self.y>svgHeight){
                    self.kill()
                    return false;
                }
                
                if(tube.x <=-200){
                    tube.bottom.remove();
                    tube.top.remove();
                    
                    tubeList.splice(tubeList.indexOf(tube), 1)
                }
    
            }

            // Jump (or not)
           try {
                var bee = hive.getBee(self.id);

                var vDistance = Math.round(closestTube.y - self.y + h);
                var output = bee.compute([space-lastTube, vDistance, self.vSpeed])[0];
               
                if(bee.isBestBee){

                    self.sprite.attr({href: "bestflappy.png"})
                }

            } catch (error) {
                console.log(error)
            }

            bee.score = self.score;

            if(output>.50){
                
                self.jump();
            }   

        }

        self.jump = function(){
            self.vSpeed = jump;
            self.jumping = true;
        }

        self.kill = function(){
            self.dead = true;
            self.sprite.remove();
            // hive.hive.splice(hive.hive.indexOf(self),1)

            var flappyIndex = flappies.indexOf(self)
            delete flappies[flappyIndex];

            flappies.splice(flappyIndex,1)

            if(flappies.length===0) restart();
        }

        return this;
    })


    var Tubes = function(){
        var self_tube = this;
        var attr = {};

        attr.x = svgWidth;
        attr.y = Math.round(Math.random()*(svgHeight-200-h)+50);
        // attr.y = 100;
        

        var top = svg.rect(attr.x, 0, w, attr.y);
        top.attr({fill: "blue"})
        
        var bt = attr.y+h;
        var bottom = svg.rect(attr.x, bt, w, svgHeight-bt);
        bottom.attr({fill: "blue"})

        attr.top = top;
        attr.bottom = bottom;

        attr.move = function(x){
            attr.top.attr({x})
            attr.bottom.attr({x})
        }

        attr.delete = function(){
            top.remove();
            bottom.remove();
            delete self_tube;
        }

        return attr;
    }

    lastTube = space;
    closestTube = null;
    var update = function(){
        time += step;
        lastTube += step;

        $("h1").text(flappies.length);

        if(lastTube>=space){
            lastTube = 0;

            tubeList.push(Tubes())

        }

        tubeList.sort(function(a,b){

            if(b.x + w < pos){
                return -1;
            }
            if(a.x + w < pos){
                return 1;
            }
            return a.x - b.x;
        });

        closestTube = tubeList[0];
        
        for(let tube of tubeList){
            tube.bottom.attr({fill: "blue"})
        }
        tubeList[0].bottom.attr({fill: "red"})

        for (const tube of tubeList) {
            tube.move(tube.x-=step)
        }

        
        

        if(!playing) return false;

        if(flappies.length==0){
            playing = false;
        }

        for (let index = 0; index < flappies.length; index++) {
            const flappy = flappies[index];
            try{
                flappy.update(index);  
            } catch{
                //console.log(flappies)
            }
            
        }

    }

    setInterval(function(){
        if(playing) update();
    },1);

    var gen = 0;
    var flappies = [];

    restart = function(){
        time = 0;
        gen++;
        
        if(gen > 1){
            try {
                hive.next();
            } catch (error) {
                console.error(error);
            }
        }

        for(var tube of tubeList){
            tube.delete();
        }

        tubeList = [];
        lastTube = space;

        var ksum = 0;
        $(".k").html("");
        for (let i = 0; i < hive.constants.population; i++) {

            var n = hive.getBee(i).compute([100,100])[0];
            ksum += n;
            flappies.push(new Flappy(i))
        }

    }

    restart();
});