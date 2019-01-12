'use strict';

var fs        = require('fs');
var path      = require('path');
var mysql			= require('mysql');
var dbconfig 	= require('./db.json');
var Promise = require('bluebird');

var pool = mysql.createPool({
	connectionLimit : 100, //important
	host     : dbconfig.host,
	user     : dbconfig.user,
	password : dbconfig.password,
	database : dbconfig.database,
	debug    : false,
	timezone : 'UTC+0',
	charset : 'utf8mb4',
	multipleStatements: true
});

var db = {pool: pool};

db.handleQuery = function (query, callback) {
	db.pool.getConnection(function (err, connection) {
		connection.query(query, function (err, rows) {
			connection.release();
			if (!err) {
				callback(rows);
			}
		});
	});
};

db.jsonQuery = function (query, res) {
	db.handleQuery(query, function (rows) { res.json(rows); });
};

db.promisifyQuery = function (query) {
	return new Promise(function (resolve, reject) {
		db.pool.getConnection(function (err, connection) {
			connection.query(query, function (err, rows) {
				connection.release();
				if (err) {
					return reject (err);
				}
				resolve(rows);
			});
		});
	});
};

module.exports = db;
