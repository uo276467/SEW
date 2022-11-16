// CalculadoraBasica.js
// Funcionalidad básica de una calculadora
'use strict';
class Calculadora {

    constructor(){
        this.output = "";
        this.op1;
        this.op2;
        this.operation = "";
        this.index = 0;
        this.memory = "";
        this.clearNext=0;
    }

    write(number){
        if(this.clearNext==1){
            this.output=number;
            this.clearNext=0;
        }else{
            this.output+=number;
        }
        if(this.index==1){
            this.index = 2;
        }
        this.viewOutput();
    }

    writeZero(){
        if(this.clearNext==1){
            this.output=0;
            this.clearNext=0;
        }else if(this.output!="0"){
            this.output+="0";
            this.viewOutput();
        }
    }

    writeOperator(op){
        if(this.index==0){
            this.operation = op;
            this.op1 = new Number(this.output);
            this.clearNext=1;
            this.index=1;
        }else if(this.index==2){
            this.calc();
            this.operation = op;
            this.index=1;
        }
        this.viewOutput();
    }

    calc(){
        if(this.operation != "%"){
            this.op2 = new Number(this.output);
            this.output = eval(this.op1 + this.operation +  this.op2);
            this.op1 = new Number(this.output);
            this.index=0;
            this.memory = this.output;
            this.clearNext=1;
            this.viewOutput();
        }else{
            this.percentage();
        }
    }

    removeAll(){
        this.output="";
        this.index=0;
        this.memory=0;
        this.op1 = new Number("0");
        this.op2 = new Number("0");
        this.viewOutput();
    }

    sumMemory(){
        this.memory+=new Number(this.output);
    }

    subtractMemory(){
        this.memory-=new Number(this.output);
    }

    showMemory(){
        document.getElementById('output').value = this.memory;
        this.output=this.memory;
        this.clearNext=1;
        this.viewOutput();
    }

    opposite(){
        if(this.index==2){
            this.calc();
        }
        this.index=0;
        this.op1 = new Number(this.output);
        this.op1*=-1;
        this.output = this.op1;
        this.viewOutput();
    }

    squareRoot(){
        if(this.index==2){
            this.calc();
        }
        this.index=0;
        this.op1 = new Number (this.output);
        this.op1 = Math.pow(this.op1, 1/2);
        this.output = this.op1;
        this.viewOutput();
    }

    percentage(){
        if(this.index==0){
            this.op1 = new Number(this.output);
            this.index=1;
        }
        if(this.index==2){
            this.op2 = new Number(this.output);
            this.output = this.op1 * this.op2 / 100;
            this.op1 = this.output;
            this.index=1;
            this.viewOutput();
        }
        this.operation="%";
        this.clearNext=1;
    }

    //Para la gestión de eventos no hacer un switch. Pasar el evento
    //a una función pulsarTecla
    pulsarTecla(keyName){
        if(keyName == 1 || keyName == 2 || keyName == 3 || keyName == 4 ||
            keyName == 5 || keyName == 6 || keyName == 7 || keyName == 8 ||
            keyName == 9 || keyName == "."){
                this.write(keyName);
        }else if(keyName == 0){
            this.writeZero();
        }else if(keyName == "+" || keyName == "-" || keyName == "*" || keyName == "/"){
            this.writeOperator(keyName);
        }else if(keyName == "%"){
            this.percentage();
        }else if(keyName == "="){
            this.calc();
        }else if(keyName == "o"){
            this.opposite();
        }else if(keyName == "s"){
            this.squareRoot();
        }else if(keyName == "m"){
            this.showMemory();
        }else if(keyName == "j"){
            this.sumMemory();
        }else if(keyName == "k"){
            this.subtractMemory();
        }else if(keyName == "c"){
            this.removeAll();
        }
    }

    viewOutput(){
        document.getElementById('output').value = this.output;
    }
}
var p = new Calculadora();
