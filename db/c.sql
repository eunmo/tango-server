DROP TABLE IF EXISTS `words`;
CREATE TABLE `words` (
	`lang` varchar(255) NOT NULL,
	`level` varchar(255) NOT NULL,
	`index` smallint NOT NULL,
	`word` varchar(255) NOT NULL,
	`yomigana` varchar(255) NOT NULL,
	`meaning` varchar(255) NOT NULL,
	`learned` tinyint NOT NULL DEFAULT '0',
	`streak` tinyint NOT NULL DEFAULT '0',
	`lastCorrect` datetime,
	PRIMARY KEY (`level`, `index`),
	KEY `streak` (`streak`),
	KEY `lang` (`lang`, `streak`)
);
