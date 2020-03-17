var gen = 0;
$(document).ready(function(){
    window.hive = Hive();
    hive.renderer = function(bee){
        var x = Math.random()*100
        var v = bee.think({x: x})
        var c = (x*(9/5))+32

        return 1/(Math.abs(v-c)+1)
    }
    
    hive.createHive(15,function(){
        setInterval(function(){
            live();
        },1);
    });
    
})

function live(_hive){
    hive.thinkAll({"x":1, })

    window.bestBee = hive.calculateHoney();

    try{
        $("h1").text(bestBee.brain[0].weights[0].weight)
    }catch{
        console.error("error")
    }

    hive.evolve();
}