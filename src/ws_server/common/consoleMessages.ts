import colors from "./colors";

export function showReqMessage(message: object) {
    console.log(`${colors.cyan}Message received <= ${colors.reset}`);
    console.log(message);
    console.log(`${colors.cyan}----------------- ${colors.reset}`);
}

export function showResMessage(message: object) {
    console.log(`${colors.magenta}Message send => ${colors.reset}`);
    console.log(message);
    console.log(`${colors.magenta}----------------- ${colors.reset}`);
}

