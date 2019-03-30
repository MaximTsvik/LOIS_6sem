/**
 * Created by Tsvik.
 */
var formula = "";
var subformulaAnswer = 0;
var isNeutralAnswer = false;
var subformulaCount = 0;
var ValidFormula = new RegExp('([(][!]([A-Z]|[a-z]|[0-1])[)])|([(]([A-Z]|[a-z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[a-z]|[0-1])[)])', 'g');
var AtomarFormula = new RegExp('([A-Z]|[a-z]|[0-1])', 'g');
var ComplexSubformula = new RegExp('([(][!]([A-Z]+|[0-1])[)])|([(]([A-Z]+|[0-1])((&)|(\\|)|(->)|(~))([A-Z]+|[0-1])[)])', 'g');
var AtomarOrConstantFormula = new RegExp('([A-Z]|[0-1])', 'g');

var ReplacementSymbol = "R";
var Formula = "";

var symbols = []
var tempFormula = "";
var subformulaNumber = 0;
var subformulas = [];
var neutrality;

function run() {
    clear();

    subformulaNumber = 0;
    subformulas = [];
    formula = document.getElementById("formula").value;
    if (!isFormula(formula)) {
        alert("Please input a valid formula");
        return 0;
    }
    subformulaCount = getNumberOfSubformulas();
    document.getElementById("output-field").innerHTML = "<p id='answer'>The correct answer is "
            + subformulaCount + " </p>";
    }

function getNumberOfSubformulas() {
    var formulaClone = formula;
    Formula = formula;
    searchSubformulas(formulaClone);
    return subformulaNumber;
}

function clear() {
    document.getElementById("formula").innerHTML = "";
    document.getElementById("output-field").innerHTML = "";
    formula = "";
}

//add subformula to subformula list if it's new
function addToSubformulas(subformula) {
    var firstTime = true;
    for (var i = 0; i < subformulaNumber; i++) {
        if (subformula == subformulas[i]) firstTime = false;
    }
    if (firstTime) {
        subformulas[subformulaNumber] = subformula;
        if (subformula.length == 1 && subformula != "1" && subformula != "0"){
            symbols[symbols.length] = subformula;
        }
        subformulaNumber++;
    }
}

//search all subformulas in a formula
function searchSubformulas(formula) {
    var result = formula.match(AtomarOrConstantFormula, 'g');
    for (var i = 0; i < result.length; i++) {
        addToSubformulas(result[i]);
    }
    while (formula !== tempFormula) {
        tempFormula = formula;
        result = formula.match(ComplexSubformula);
        if (result != null) {
            for (var temp = 0; temp < result.length; temp++) {
                var sub = result[temp];
                var beginIndex = formula.indexOf(sub);
                var endIndex = sub.length;
                var subFormula = "";

                formula = tempFormula.substring(0, beginIndex);
                for (var i = beginIndex; i < beginIndex + endIndex; i++) {
                    subFormula = subFormula + Formula[i];
                    formula = formula + ReplacementSymbol;
                }
                formula = formula + tempFormula.substring(beginIndex + endIndex, tempFormula.length);
                addToSubformulas(subFormula);
                subFormula = "";
            }
        }
    }
}

//check if the formula is correct
function isFormula() {
    var tempFormula;
    var formulaClone = formula;
    while (formulaClone != tempFormula) {
        tempFormula = formulaClone;
        formulaClone = formulaClone.replace(ValidFormula, ReplacementSymbol);
    }
    tempFormula = 0;
    var result = formulaClone.match(AtomarFormula, 'g');
    return formulaClone.length == 1 && result != null && result.length == 1;
}