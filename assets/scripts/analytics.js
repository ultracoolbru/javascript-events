console.log('This is an imported script file!');

let ticker = 0;
let timer = setInterval(this.startAnalytics, 1000, { runOnce: false });

function startAnalytics(runOnce) {
    ticker += 1;
    if (runOnce) {
        console.log(ticker);
    }

    if (ticker == 10) {
        console.log('Stopping timer!');
        clearInterval(timer);
        console.log('Timer stopped!');
        return;
    }
}

