"use strict";
(() => {
    require('dotenv').config();
    const Server = require('./classes/server');
    const express = new Server();
    express.start();
})();
