const express = require('express');
const api = express();

require('./user')(api);

api.listen(3000);
