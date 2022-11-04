
const { writeFile } = require('fs');
const { argv } = require('yargs');

//read variables from environment file
require('dotenv').config();

//read command line args passed with yargs
const environment = argv.environment;
const isProd = environment === 'prod';

if (!process.env['MAPTILER_API_KEY'] || !process.env['MAP_STYLE']) {
    console.error('All the required environment variables were not provided!');
    process.exit(-1);
}

const targetPath = isProd
    ? './src/environments/environment.prod.ts'
    : './src/environments/environment.ts';

//using environment variables from dotenv 
const environmentFileContent = `
    export const environment = {
        production: ${isProd},
        MAPTILER_API_KEY: "${process.env['MAPTILER_API_KEY']}",
        MAP_STYLE: "${process.env['MAP_STYLE']}",
        DESTINATION_ACCOUNT: "${process.env['DESTINATION_ACCOUNT']}",
        URL: "${process.env["URL"]}",
    };
`;
//writing content to respective file
writeFile(targetPath, environmentFileContent, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Successfully written variables to ', targetPath);
    }
});