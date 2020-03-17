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
		elitism: 0.1, // Best networks kepts unchanged for the next
        randomBehaviour: 0.2, // New random networks for the next generation
        crossoverRate: 0.5,
		mutationRate: 0.5, // Mutation rate on the weights of synapses.
		mutationRange: 0.5, // Interval of the mutation changes on the
		// synapse weight.
		historic: 0, // Latest generations saved.
		lowHistoric: false, // Only save score (not the network).
		scoreSort: -1, // Sort order (-1 = desc, 1 = asc).
        nbChild: 1, // Number of children by breeding.

        shape: [2, 1],
        activation: function(x){
            return x
        }
    }

    for(let key in options){
        self.constants[key] = options[key]
    }


    var Neuron = function(numberOfLinks){
        this.bias = self.constants.rand();
        this.weights = [];
        this.output = 0;


        for (let i = 0; i < numberOfLinks; i++) {
            this.weights[i] = self.constants.rand();
        }
    }

    var Layer = function(index){
        this.id = index;
        this.neurons = [];
    }
    Layer.prototype.addNeuron = function(neuron){
        this.neurons.push(neuron);
    }

    var Brain = function(){
        this.layers = [];
        this.activation = function (a) {
            ap = (-a) / 1;
            // return Math.max(0, a);
			return (1 / (1 + Math.exp(ap))) 
		}
    }

    /**
     * Create links between the layers
     * 
     * @param {shape} Array specifying shape of perceptron 
     * 
     */
    Brain.prototype.createNetwork = function(shape){
        var prevNeurons = 0;
        
        for(let i in shape){
            let n  = shape[i];
            let layer = new Layer(i);

            for (let j = 0; j < n; j++) {
                let neuron = new Neuron(prevNeurons)
                layer.addNeuron(neuron);
            }

            this.layers.push(layer);

            prevNeurons = shape[i];
        }
    }

    Brain.prototype.getClone = function(){
        var layers = this.layers;
        return {...layers};
    }

    Brain.prototype.setNetwork = function(layers){
        this.layers = layers;
    }

    p = [];
    Brain.prototype.compute = function(input, t){
        let output = [];

        for(let i in this.layers){

            i = +i;
            let layer = this.layers[i];

            let isOutput = 1+i === Object.keys(this.layers).length;         


            if(layer.id == 0){
                for(let j in layer.neurons){
                    layer.neurons[j].output = input[j];
                }

                continue;
            }

            let prevLayer = this.layers[i-1];

            for(let j in layer.neurons){
                let neuron = layer.neurons[j];
                neuron.output = neuron.bias;

                for(let w in neuron.weights){
                    neuron.output += neuron.weights[w] * prevLayer.neurons[w].output
                }

                var  o = neuron.output
                neuron.output = this.activation(neuron.output);
                
                if(isOutput){
                    p.push([o,neuron.output])
                    output.push(neuron.output);
                }
            }
        }

        return output;
    }


    var Bee = function(){
        this.brain = new Brain();
        this.honey = 0;
        this.isBestBee = false;

        this.brain.createNetwork(self.constants.shape);
    }
    Bee.prototype.compute = function(inputs, t){
        return this.brain.compute(inputs, t);
    }
    Bee.prototype.clone = function(){
        var newBee = new Bee();
        newBee.brain.setNetwork( this.brain.getClone() );
        return newBee;
    }

    /****** GENERATION ******/
    var Generation = function(){
        this.population = self.constants.population;
        this.hive = [];
    }
    Generation.prototype.start = function(){
        for (let i = 0; i < this.population; i++) {
            this.hive.push(new Bee());
        }
    }
    Generation.prototype.setHive = function(hive){
        this.hive = hive;
    }
    Generation.prototype.applyAll = function(fn){
        for(let bee of this.hive){
            fn(bee);
        }
    }
    Generation.prototype.mate = function(best, poorest){
        var clone = poorest.clone();

        // Crossover & mutation
        for(let n_l in clone.brain.layers){
            let l = clone.brain.layers[n_l]
            for(let n_n in l.neurons){
                let n = l.neurons[n_n]
                for(let n_w in n.weights){
                    let w = n.weights[n_w]
                    if(self.constants.randInt(0,1) > self.constants.crossoverRate){
                        w = best.brain.layers[n_l].neurons[n_n].weights[n_w]; //Crossover
                    }
                    
                    if(self.constants.randInt(0,1) > self.constants.mutationRate){
                        w += self.constants.rand();
                        w = w<0 ? 0 : 0; w = w>1 ? 1 : 0;
                    }
                }

                let b = n.bias;
                if(self.constants.randInt(0,1) > self.constants.crossoverRate){
                    b = best.brain.layers[n_l].neurons[n_n].bias;
                }
                
                if(self.constants.randInt(0,1) > self.constants.mutationRate){
                    b += self.constants.rand();
                }
            }
        }

        return clone;
    }
    Generation.prototype.next = function(){
        var future = [];

        this.calculateHoney();
    
        for (var i = 0; i < Math.round(self.constants.elitism * self.constants.population); i++) {
			if (future.length < self.constants.population) {
                
                var oldBee = this.hive[i];

                var newBee = oldBee.clone();

                if(oldBee.isBestBee){
                    newBee.isBestBee = true;
                }
                future.push(newBee);
                
			}
        }

        // Apparition de caractères aléatoires
        for (var i = 0; i < Math.round(self.constants.randomBehaviour * self.constants.population); i++) {
			if (future.length < self.constants.population) {
				future.push(new Bee());
			}
        }
        
        // Reproduction
        for (let i = 0; future.length < self.constants.population; i++) {
            for (let j = 0; j < self.constants.population; j++) {
                
                if(future.length >= self.constants.population) break;

                var best = this.hive[i];
                var poorest = this.hive[j];

                future.push(this.mate(best, poorest));
                
            }           
        }


        var g = new Generation();
        g.setHive(future);
        return g;
    }
    
    Generation.prototype.calculateHoney = function(){
        var honeySum = 0;
        var maxHoney = 0;
        var bestBee = null;

        this.applyAll(function(bee){
            bee.honey = bee.score;
            honeySum += bee.honey;
            
            if(bee.honey>maxHoney){
                maxHoney = bee.honey;
                bestBee = bee;
            }
        })

        this.applyAll(function(bee){
            bee.productivity = bee.honey/honeySum;
        });

        this.bestBee = bestBee;
        bestBee.isBestBee = true;

        this.hive.sort(function(a,b){
            return b.honey - a.honey
        })

    }
    
    self.getBee = function(n){
        return this.generation.hive[n];
    }

    var generation = new Generation();
    generation.start();
    self.generation = generation;
    this.gen = 1;
    $("h2").text(this.gen);
    
 
    self.next = function(){
        this.generation = self.generation.next();
        this.gen++;
        $("h2").text(this.gen);
    }
}
