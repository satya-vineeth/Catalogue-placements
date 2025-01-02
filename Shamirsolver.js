function convertFromBase(num, base) {
    if (base <= 10) {
        return BigInt(parseInt(num, base));
    }
    
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let val = 0n;
    num = num.toLowerCase();
    
    for (let i = 0; i < num.length; i++) {
        val = val * BigInt(base) + BigInt(digits.indexOf(num[i]));
    }
    
    return val;
}

function createVandermondeMatrix(points, k) {
    const matrix = [];
    
    for (let i = 0; i < k; i++) {
        const row = [];
        for (let j = k - 1; j >= 0; j--) {
            row.push(points[i].x ** BigInt(j));
        }
        matrix.push(row);
    }
    
    return matrix;
}

function gaussianElimination(matrix, values) {
    const n = matrix.length;
    const augmentedMatrix = matrix.map((row, i) => [...row, values[i]]);
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (augmentedMatrix[j][i] > augmentedMatrix[maxRow][i]) {
                maxRow = j;
            }
        }
        
        [augmentedMatrix[i], augmentedMatrix[maxRow]] = 
        [augmentedMatrix[maxRow], augmentedMatrix[i]];
        
        for (let j = i + 1; j < n; j++) {
            const factor = augmentedMatrix[j][i] / augmentedMatrix[i][i];
            for (let k = i; k <= n; k++) {
                augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
            }
        }
    }
    
    const solution = new Array(n).fill(0n);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0n;
        for (let j = i + 1; j < n; j++) {
            sum += augmentedMatrix[i][j] * solution[j];
        }
        solution[i] = (augmentedMatrix[i][n] - sum) / augmentedMatrix[i][i];
    }
    
    return solution;
}

function findSecret(testCase) {
    const { n, k } = testCase.keys;
    const points = [];
    
    // Convert the first k points to (x, y) coordinates
    let count = 0;
    for (let i = 1; count < k; i++) {
        if (testCase[i]) {
            const x = BigInt(i);
            const y = convertFromBase(testCase[i].value, parseInt(testCase[i].base));
            points.push({ x, y });
            count++;
        }
    }
    
    const matrix = createVandermondeMatrix(points, k);
    const values = points.map(p => p.y);
    
    // Solve the system of equations
    const coefficients = gaussianElimination(matrix, values);
    
    // Return the constant term (last coefficient)
    return coefficients[coefficients.length - 1];
}

const testCase1 = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

const testCase2 = {
    "keys": {
        "n": 10,
        "k": 7
    },
    "1": {
        "base": "6",
        "value": "13444211440455345511"
    },
    "2": {
        "base": "15",
        "value": "aed7015a346d63"
    },
    "3": {
        "base": "15",
        "value": "6aeeb69631c227c"
    },
    "4": {
        "base": "16",
        "value": "e1b5e05623d881f"
    },
    "5": {
        "base": "8",
        "value": "316034514573652620673"
    },
    "6": {
        "base": "3",
        "value": "2122212201122002221120200210011020220200"
    },
    "7": {
        "base": "3",
        "value": "20120221122211000100210021102001201112121"
    },
    "8": {
        "base": "6",
        "value": "20220554335330240002224253"
    },
    "9": {
        "base": "12",
        "value": "45153788322a1255483"
    },
    "10": {
        "base": "7",
        "value": "1101613130313526312514143"
    }
};

console.log("Secret for Test Case 1:", findSecret(testCase1).toString());
console.log("Secret for Test Case 2:", findSecret(testCase2).toString());
