require('./index.html');

import * as angular from 'angular';

const now = new Date();

console.log(`${now} is Date = ${angular.isDate(now)}`);
