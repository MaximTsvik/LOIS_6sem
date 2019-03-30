/*
    This program made Bobkov A.V,
    remade Shalik E.V. 
*/

var NEGATION = "!";

var CONJUNCTION = "&";
var DISJUNCTION = "|";
var IMPLICATION = "->";
var EQUIVALENCE = "~";

var OPENING_BRACKET = "(";
var CLOSING_BRACKET = ")";

var ANSWER = "answer";

function getSKNF(formula){
    var unicsymbol = getUnicsymbol(formula);
    unicsymbol.sort();
    var unicsymbolSize = unicsymbol.length;
    var n = Math.pow(2, unicsymbolSize);
    var table = {}
    for (var i = 0; i < n; i++){
        var currentNumber = numberInBinaryString(i, unicsymbolSize);
        var tempObject = getConstantForsymbol(unicsymbol, currentNumber);
        tempObject[ANSWER] = getAnswer(formula, tempObject);
        table[i] = tempObject;
    }
    console.log(table);
    return  {
                sknf: calculateSKNFFromTable(table, unicsymbolSize),
                table: table,
                unicsymbolSize: unicsymbolSize
            }
}

function getUnicsymbol(formula){
    var symbol = "([A-Z])";
    symbol = new RegExp(symbol, "g");
    var results = formula.match(symbol) || [];
    var unicsymbol = results.filter(function (symbol, index) { 
        return results.indexOf(symbol) == index; 
    });
    return unicsymbol;
}

function numberInBinaryString(number, stringLength){
    var string = (number >>> 0).toString(2);
    for (var i = string.length; i < stringLength; i++){
        string = "0" + string;
    }
    return string;
}

function getConstantForsymbol(unicsymbol, currentNumber){
    var object = {};
    for (var i = 0; i < unicsymbol.length; i++){
        var symbol = unicsymbol[i];
        object[symbol] = currentNumber[i];
    }
    return object;
}

function getAnswer(formula, tempObject){
    var constFormula = formula;
    for (var key of Object.keys(tempObject)) {
        var val = tempObject[key];
        constFormula = constFormula.replace(new RegExp(key, 'g'), val);
    }
    return calculateFormula(constFormula);
}

function calculateFormula(formula){
    var regFormula = "([(][" + NEGATION + "][0-1][)])|" + 
        "([(][0-1]((" + CONJUNCTION + ")|("+ IMPLICATION + ")|(" + EQUIVALENCE + ")|(" + "\\" + DISJUNCTION +   "))[0-1][)])";
    regFormula = new RegExp(regFormula);
    while (regFormula.exec(formula) != null){
        var subFormula = regFormula.exec(formula)[0];
        var result = calculateSimpleFormula(subFormula);
        formula = formula.replace(subFormula, result);
    }
    return formula;
}

function calculateSimpleFormula(formula){
    if (formula.indexOf(NEGATION) > -1){
        return calculateNOT(formula);
    } else if (formula.indexOf(CONJUNCTION) > -1){
        return calculateAND(formula);
    } else if (formula.indexOf(EQUIVALENCE) > -1){
        return calculateOR(formula);
    } else if (formula.indexOf(IMPLICATION) > -1){
        return calculateIF(formula);
    } else if (formula.indexOf(DISJUNCTION) > -1){
        return calculateEQ(formula);
    }
}

function calculateNOT(formula){
    //(!0) return 1
    //(!1) return 0
    var number = parseInt(formula[2]);
    return (!number) ? 1 : 0;
}

function calculateAND(formula){
    //(0&0) return 0
    //(0&1) return 0
    //(1&0) return 0
    //(1&1) return 1
    var number1 = parseInt(formula[1]);
    var number2 = parseInt(formula[3]);
    return (number1&&number2) ? 1 : 0;
}

function calculateOR(formula){
    //(0|0) return 0
    //(0|1) return 1
    //(1|0) return 1
    //(1|1) return 1
    var number1 = parseInt(formula[1]);
    var number2 = parseInt(formula[3]);
    return (number1||number2) ? 1 : 0;   
}

function calculateIF(formula){
    //(0->0) return 1
    //(0->1) return 1
    //(1->0) return 0
    //(1->1) return 1
    var number1 = parseInt(formula[1]);
    var number2 = parseInt(formula[4]);
    return ((!number1)||number2) ? 1 : 0; 
}

function calculateEQ(formula){
    //(0~0) return 1
    //(0~1) return 0
    //(1~0) return 0
    //(1~1) return 1
    var number1 = parseInt(formula[1]);
    var number2 = parseInt(formula[3]);
    return (number1==number2) ? 1 : 0; 
}


//remade ShalikEV
function calculateSKNFFromTable(table, unicsymbolSize){
    var n = Math.pow(2, unicsymbolSize);
    var count = 0;
    for (var i = 0; i < n; i++) {
        var object = table[i];
        if (object[ANSWER] == 0){
            count++;
        }
    }
    var formula = "";
    if (count > 1) {
        formula += OPENING_BRACKET;
    }
    for (var bracket = 0; bracket < count- 2; bracket++){
        formula += OPENING_BRACKET;
    }
    var countPrint = 0;
    for (var i = 0; i < n; i++) {  
        var object = table[i];
        if (object[ANSWER] == 0){
            formula += OPENING_BRACKET;
            for (var bracket = 0; bracket < unicsymbolSize - 2; bracket++){
                formula += OPENING_BRACKET;
            }
            var alreadyPrint = 0;
            for (var key of Object.keys(object)) {
                if (key != ANSWER){
                var val = object[key];
                if (val == 0){
                    alreadyPrint++;
                    formula += key;
                } else {
                    alreadyPrint++;
                    formula += OPENING_BRACKET + NEGATION + key + CLOSING_BRACKET;
                }
                if(alreadyPrint < unicsymbolSize){
                    if (alreadyPrint != 1) {
                        formula += CLOSING_BRACKET
                    }
                    formula += DISJUNCTION;
                }
            }
            }
            formula += CLOSING_BRACKET;
            countPrint++;
            if (countPrint < count) {
                if (countPrint != 1) {
                    formula += CLOSING_BRACKET
                }
                formula += CONJUNCTION;
            }
        }
    }    
    if (count > 1) {
        formula += CLOSING_BRACKET;
    }
    return formula;
}
//Remade ShalikEV
function objectToTable(tableG, unicsymbolSizeG){
    var n = Math.pow(2, unicsymbolSizeG);
    var innerHTML = "";
    var tr = "<tr>";
    for (var key of Object.keys(tableG[0])) {
        tr += "<td>" + key + "</td>"
    }
    tr += "</tr>";
    innerHTML += tr;
    for (var i = 0; i < n; i++) {
        var object = tableG[i];
        var tr = "<tr>";
        for (var key of Object.keys(object)) {
            var val = object[key];
            tr += "<td>" + val + "</td>"
        }
        tr += "</tr>";
        innerHTML += tr;
    } 
    return innerHTML;
}

