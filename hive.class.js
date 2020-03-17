function Hive(params){
    params = params || {};

    return {
    gen: 0,
    hive: [],
    renderer: function(){
        return 0;
    },
    constants: {
        hiveSize: params.hiveSize||100,
        mutationRate: params.mutationRate || 0.1,
        mutationStretch: params.mutationStretch || 2
    },

    createHive(size, callback){
        size = size || this.constants.hiveSize;
        this.constants.hiveSize = size;

        for (let i = 0; i < size; i++) {
            (this.hive).push(new Bee({hive: this}))
        }

        callback.call(this);

    },

    applyAll(func){
        for (let bee of this.hive) {
            func(bee)
        }
    },

    thinkAll(env){
        this.applyAll(function(bee){
            bee.think(env);
        })
    },

    mutateAll(){
        var self = this;
        this.applyAll(function(bee){
            bee.mutate(self.constants.mutationRate, self.constants.mutationStretch);
        })
    },


    calculateHoney(){
        var maxHoney = 0;
        var honeySum = 0;
        var bestBee = null;

        for (const bee of this.hive) {
            bee.honey = this.renderer(bee)
            honeySum += bee.honey;

            if(bee.honey>maxHoney){
                maxHoney = bee.honey;
                bestBee = bee
                //onsole.log(maxHoney)
            }
        }

        for (const bee of this.hive) {
            bee.productivity = bee.honey/honeySum;
        }

        this.bestBee = bestBee;

        $("table").html(`
            <tr style="font-weight: bold">
                <td>${bestBee.brain[0].weights[0].weight}</td>
                <td>${bestBee.brain[0].bias}</td>
            </tr>
        `)
        this.applyAll(function(bee){
            var color = bee==bestBee ? "red" : "black";
            $("table").append(`
                <tr>
                    <td style="color: ${color}">${bee.brain[0].weights[0].weight}</td>
                    <td style="color: ${color}">${bee.brain[0].bias}</td>
                </tr>
            `)
        });

        return bestBee;

    },

    mate(){
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

        newHive.push(bestBee) // Mettre d'office le meilleur
        var stats = 0;

        for (let i = 0; i < this.constants.hiveSize-1; i++) {
            let ran = Math.random();

            for (const rater of mateRates) {
                var {min, max, bee} = rater;
                
                if(ran>=min && ran<max){
                    newHive.push(bee.clone());
                    if(bee==this.bestBee){
                        //console.log(stats)
                        stats++;
                    }
                }
            }
        }

        $("h2").text(stats);

        this.hive = newHive;
    },

    evolve(callback){
        this.mate();

        this.mutateAll();

        $("h3").text(this.gen++)

        if(typeof callback == "function") callback.call(this);
    }
}
}