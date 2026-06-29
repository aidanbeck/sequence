export default class Operators {
    constructor(operators = ['+', '×', '÷']) {

        this.operators = operators;
    }

    getOperator(moveIndex, offset = 0) {
        let index = moveIndex + offset;
        const length = this.operators.length;

        index < 0 && (index += length * Math.abs(index)); // normalize negative indexes

        return this.operators[index % length];
    }

    operate(score, number, moveIndex) {

        const symbol = this.getOperator(moveIndex);

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