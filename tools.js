const printTerminalLogo = () => {
    var logo = `
    _____ _             _                               
    / ____| |           | |            /\                
   | (___ | |_ ___   ___| | _____     /  \   _ __  _ __  
    \___ \| __/ _ \ / __| |/ / __|   / /\ \ | '_ \| '_ \ 
    ____) | || (_) | (__|   <\__ \  / ____ \| |_) | |_) |
   |_____/ \__\___/ \___|_|\_\___/ /_/    \_\ .__/| .__/ 
                                            | |   | |    
                                            |_|   |_|    
    `;
    console.log(logo);
}

const printVersion = () => {
    let version = require('./package.json').version
    console.log(`v${version}`);
}

module.exports = {
    printTerminalLogo: printTerminalLogo,
    printVersion: printVersion
};