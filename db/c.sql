DROP TABLE IF EXISTS `words`;
CREATE TABLE `words` (
	`lang` varchar(255) NOT NULL,
	`Level` varchar(255) NOT NULL,
	`index` smallint NOT NULL,
	`word` varchar(255) NOT NULL,
	`yomigana` varchar(255) NOT NULL,
	`meaning` varchar(255) NOT NULL,
	`learned` tinyint NOT NULL DEFAULT '0',
	`streak` tinyint NOT NULL,
	`lastCorrect` datetime,
	PRIMARY KEY (`Level`, `index`),
	KEY `streak` (`streak`)
);
