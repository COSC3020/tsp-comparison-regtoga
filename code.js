function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function generate_adjmatrixs(size, howmany){
    //generate a number matrixes of a certain size
    var matricies = [];
    for (var i = 0; i < howmany; i++){
        var matrix = [];

        for (var j = 0; j < size; j++){
            var row = [];
            for (var k = 0; k < size; k++){
                if (j == k){
                    row.push(0)
                }else{
                    row.push(getRandomInt(1, 25))
                }
            }
            matrix.push(row);
        }

        matricies.push(matrix);
    }

    return matricies;
}

function test_karp(matrix){
    const startTime = performance.now();

    var returnvalue = tsp_hk(matrix);
    console.log("karp: " + returnvalue);

    const endTime = performance.now();

    return [((endTime - startTime) / 1000).toFixed(2), returnvalue];
}

function test_ls(matrix){
    const startTime = performance.now();
    
    var returnvalue = tsp_ls(matrix);
    console.log("ls: " + returnvalue);

    const endTime = performance.now();

    return [((endTime - startTime) / 1000).toFixed(2), returnvalue];
}

function test_approaches(){
    results = [];
    var timetaken_ls = 0;
    var timetaken_karp = 0;
    var karp_averagee = [];
    var ls_averagee = [];
    var size = 1;
    var hour = 36; //3600 seconds

    while (timetaken_ls < hour || timetaken_karp < hour){
        var matricies = generate_adjmatrixs(size, 1);
        console.log("");
        console.log("size = " + size);

        if (timetaken_ls <= hour){
            for (var i = 0; i < matricies.length; i++){
                ls_averagee = test_ls(matricies[i]);
            }
            timetaken_ls = ls_averagee[0];
            console.log("ls took: " + ls_averagee[0] + " seconds");
        }else{
            ls_averagee = [0.00,0];
        }

        if (timetaken_karp <= hour && size < 20){
            for (var i = 0; i < matricies.length; i++){
                karp_averagee = test_karp(matricies[i]);
            }
            timetaken_karp = karp_averagee[0];
            console.log("karp took: " + karp_averagee[0] + " seconds");
        }else{
            karp_averagee = [0.00,0];
        }

        if (size >= 100){
            size = 100+size;
        }else{
            size++;
        }
        results.push([ls_averagee, karp_averagee]);
    }

    return results;
}

var results = test_approaches();
var StringResulstsls = "";

for (var i = 0; i < results.length; i++){
    StringResulstsls += "\n" + String(results[i][0]);
}

const fs = require('node:fs');

const filePathls = "C:Outputls.txt";

fs.writeFile(filePathls, StringResulstsls, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`File "${filePathls}" written successfully.`);
  }
});

var StringResulstskarp = "";

for (var i = 0; i < results.length; i++){
    StringResulstskarp += "\n" + String(results[i][1]);
}

const filePathkarp = "C:Outputkarp.txt";

fs.writeFile(filePathkarp, StringResulstskarp, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`File "${filePathkarp}" written successfully.`);
  }
});




//start held karp
function tsp_hk(distance_matrix) {
    var cities = [];
    for (var i = 0; i < distance_matrix.length; i++){
        cities.push(i);
    }

    //This selects multiple start cites over time. i is the start city.
    var minTour = Infinity;

    //I moved memo out of the loop so that it only clears the cache for every new call
    //I had thought that you wanted us to clear the cache after every starting position because you said: 
    //"If you use memoization, make sure that the cache is reset every time the function is called such that multiple calls"
    //but i interpreted it wrong.
    var memo = {};

    for (var i = 0; i < cities.length; i++) {
        var cost = heldKarp(cities, i, distance_matrix, memo);
        if (cost < minTour) {
            minTour = cost;
        }
    }

    if (minTour == Infinity){
        minTour = 0 ;
    }
    return minTour;
}


function heldKarp(cities, start, distance_matrix, memo){
    var key = cities.sort() + " divider " + start;
    
    if (memo[key] != undefined) {
        return memo[key];
    }

    if (cities.length == 2){
        let result;
        if (cities[0] == start){
            result = distance_matrix[start][cities[1]];
        } else {
            result = distance_matrix[start][cities[0]];
        }
        memo[key] = result;
        return result;
    } else {
        var holderofpaths = [];
        var city_minus_start = cities.filter(element => element !== start);

        for (var i = 0; i < cities.length; i++){
            //here i pick a new start city that is not the old start city.
            if (cities[i] != start){
                var distance_from_start_to_city = distance_matrix[start][cities[i]];
                holderofpaths.push(
                    heldKarp(city_minus_start, cities[i], distance_matrix, memo) + distance_from_start_to_city
                );
            }
        }

        memo[key] = Math.min(...holderofpaths);
        return memo[key];
    }
}





//start local search
function tsp_ls(distance_matrix) {
    //make initial og_route
    var og_route = [];
    for (var i = 0; i < distance_matrix.length; i++){
        og_route.push(i);
    }

    //initialize current best time
    cbt = route_time(og_route, distance_matrix);
    //current best route
    cbr = og_route;

    for (var h = 0; h < og_route.length; h++){
        for (var i = 0; i < og_route.length - 1; i++) {
            for (var j = i + 1; j < og_route.length; j++) {
                og_route = two_opt_swap(og_route, i, j);
        
                var time_of_route = route_time(og_route, distance_matrix);

                if (time_of_route < cbt) {
                    cbt = time_of_route;
                    cbr = og_route;
                }
            }
        }
    }
    return cbt;
}

function route_time(og_route, distance_matrix){
    //function finds the time a certain og_route takes.
    var time = 0;
    var whereiwas = null;
    var whereigo = null;

    for (var i = 0; i < og_route.length; i++){
        if (whereiwas == null){
            whereiwas = og_route[i];
            continue;
        }

        whereigo = og_route[i];

        time += distance_matrix[whereiwas][whereigo];

        whereiwas = whereigo;
    } 

    return time;
}

function two_opt_swap(route, i, k) {
    // Create a copy of the route
    var new_route = route.slice();
    while (i < k) {
        var temp = new_route[i];
        new_route[i] = new_route[k];
        new_route[k] = temp;
        i += 1;
        k -= 1;
    }
    return new_route;
}