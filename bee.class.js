Bee = function(params){
    var ret = {}
    
    params = JSON.parse(JSON.stringify(params)) || {}
    var mutationStretch = params.hive.constants.mutationStretch;
    
    var attr =  {     
        honey: 0, // Fitness    
        sterile: params.sterile || false,
        hive: params.hive,
        
        inputs: params.inputs || [
            {
                name: "x",
            },
            {
                name: "y1",
            },
            {
                name: "y2",
            },
        ],
        
        
        
        brain: params.brain || [
            {
                name: "Calculator",
                bias: Math.random()*mutationStretch,
                weights: [
                    {
                        name: "x",
                        weight: Math.random()*mutationStretch
                    }, 
                    {
                        name: "y1",
                        weight: Math.random()*mutationStretch
                    }, 
                    {
                        name: "y2",
                        weight: Math.random()*mutationStretch
                    }, 
                ]
            }
        ],  
        
        actions: params.actions || {},
        
        productivity: 0, // Fitness percentage (0<->1)
        
        prop: params.prop || {}
        }
        
        this.think = function(env){
            var output = 0;
            
            for (const neuron of this.brain) {
                for (const synapse of neuron.weights) {
                    output += synapse.weight*env[synapse.name]
                }
                
                output += neuron.bias
            }
            
            this.output = output;
            return output;
        }
        
        this.mutate = function(rate, stretch=1){
            rate = rate || this.hive.constants.mutationRate;
            for (const neuron of this.brain) {
                for (const synapse of neuron.weights) {
                    var ran = Math.random();
                    if(ran<=rate){
                        synapse.weight += (Math.random()*stretch*2)-stretch // Can also be negative      
                    }
                    
                    ran2 = Math.random();
                    if(ran2<=rate){
                        neuron.bias += (Math.random()*stretch*2)-stretch // Can also be negative      
                    }
                }
            }
            
        }
        
        
        this.prototype.clone = function(){
            return new Bee(this);
        }

        return this;
    
}