export default class Operators {
    constructor(operators = ['+', '×', '÷']) {

        this.operators = operators;
        this.index = 0;
    }

    getOperator(offset = 0) {
        let index = this.index + offset;
        const length = this.operators.length;

        index < 0 && (index += length * Math.abs(index)); // normalize negative indexes

        return this.operators[index % length];
    }

    setOperatorIndex(index) {
        this.index = index;
    }

    incrementOperator() {
        this.index++;
        if (this.index >= this.operators.length) {
            this.index = 0;
        }
    }

    decrementOperator() {
        this.index--;
        if (this.index < 0) {
            this.index = this.operators.length - 1;
        }
    }

    getNextOperator() {
        this.incrementOperator();
        return this.getOperator();
    }

    operate(score, number, symbol) {

        switch (symbol) {
            case '+':
                return score + number;
            case '-':
                return score - number;
            case '×':
                return score * number;
            case '÷':
                return score / number;
            case '^':
                return Math.pow(score, number);
            case '√':
                return Math.pow(score, 1 / number);
        }
    }
    
}