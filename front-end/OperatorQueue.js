export default class OperatorQueue {
    constructor(operators = ['+', '*', '/']) {

        this.operators = operators;
    }

    getOperator(operatorIndex) {
        return this.operators[operatorIndex];
    }

    getNextIndex(operatorIndex) {
        operatorIndex++;
        if (operatorIndex >= this.operators.length) {
            operatorIndex = 0;
        }
        return operatorIndex;
    }

    operate(score, number, operatorIndex) {

        let symbol = this.getOperator(operatorIndex);

        switch (symbol) {
            case '+':
                return score + number;
            case '-':
                return score - number;
            case '*':
                return score * number;
            case '/':
                return score / number;
        }
    }
    
}