var Hive = function(options){
    var self = this;

    self.constants = {
        randInt: function (min,max) {
            var p = max-min
			return Math.random() * p + min;
        },

        rand: function(){
            return self.constants.randInt(-1,1);
        },
        
        population: 50, // Population by generation.
		elitism: 0.3, // Best networks kepts unchanged for the next
		randomBehaviour: 0.2, // New random networks for the next generation
		mutationRate: 0.2, // Mutation rate on the weights of synapses.
		mutationRange: 0.2, // Interval of the mutation changes on the
		// synapse weight.
		historic: 0, // Latest generations saved.
		lowHistoric: false, // Only save score (not the network).
		scoreSort: -1, // Sort order (-1 = desc, 1 = asc).
        nbChild: 1, // Number of children by breeding.

        brain:[2, 1],
        activation: function(x){
            return x
        }
    }

    var Bee = function(options){
        var self_bee = this;
        
        this.weights = options || [[self.constants.rand(), self.constants.rand()], self.constants.rand()]; // Last is bias
        // X1 = Distance to next tube ; X2 = Vertical distance to top of the tube
        this.isBestBee = false;

        this.output = function(inputs){
            var sum = 0;
            for(let i = 0; i < self.constants.brain[0]; i++){
                sum += inputs[i]*this.weights[0][i]
            }

            sum += this.weights[1] // Bias
            
            return self.constants.activation(sum);
        }
        
        this.clone = function(){
            return new Bee(JSON.parse(JSON.stringify(this.weights)))
        }
        
        this.mutate = function(rate, stretch=1){
            rate = rate || self.constants.mutationRate;
            var w = self_bee.weights[0]

            if(this.isBestBee) console.log("shit")

            for (const ix in w) {
                var ran = Math.random();
                if(ran<=rate){
                    w[ix] += (Math.random()*stretch*2)-stretch // Can also be negative      
                }
            }
            
            var ran2 = Math.random();
            if(ran2<=rate){
                self_bee.weights[1] += (Math.random()*stretch*2)-stretch // Can also be negative      
            }
        }

        this.score = 0;

        return this;
    }

    

    Bee.prototype = function(){
        return {x:1}
    }

    self.hive = [];
    
    for (let i = 0; i < self.constants.population; i++) {
        self.hive.push( new Bee() )    
    }


    self.calculateHoney = function(){
        var maxHoney = 0;
        var honeySum = 0;
        var bestBee = null;

        var p = {};

        for (const bee of self.hive) {
            bee.honey = bee.score
            honeySum += bee.honey;

            if(p.hasOwnProperty(bee.honey)){
                p["b"+Math.random()] = bee.weights[1];
            }else{
                p[bee.honey] = bee.weights[1];
            }

            if(bee.honey>maxHoney){
                maxHoney = bee.honey;
                bestBee = bee
            }
        }

        for (const bee of this.hive) {
            bee.productivity = bee.honey/honeySum;
        }
        
        console.table(maxHoney)
        this.bestBee = bestBee;
    }

    self.mate = function(){
        var newHive = [];
        var mateRates = [];
        var index = 0;

        for(const bee of this.hive){
            let max = index + bee.productivity
            let rater = {
                min: index,
                max,
                bee
            }

            mateRates.push(rater)
            index = max;
        }


        var stats = 0;

        for (let i = 1; i < self.constants.elitism * self.constants.population; i++) {
            let c = self.bestBee.clone();
            c.mutate();
            newHive.push(c) // Mettre d'office le meilleur   

            stats++;
        }


        console.log(stats);

        for (let i = newHive.length; i < self.constants.population-1; i++) {
            let ran = Math.random();

            for (const rater of mateRates) {
                var {min, max, bee} = rater;
                
                if(ran>=min && ran<max){

                    let cloned = bee.clone();
                    newHive.push(cloned)

                    if(bee==self.bestBee){
                        stats++;
                    }

                    cloned.mutate();
                }
            }
        }



        var clone = self.bestBee.clone();
        clone.isBestBee = true;
        bestBee = clone;
        newHive.push(clone) // Mettre d'office le meilleur   

        this.hive = newHive;
    }

    self.applyAll = function(func){
        for (let bee of self.hive) {
            func(bee)
        }
    }

    self.mutateAll = function(){
        self.applyAll(function(bee){
            bee.mutate(self.constants.mutationRate, self.constants.mutationRange);
        })
    }
}