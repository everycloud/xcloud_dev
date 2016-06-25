# xcloud_dev

sql：
CREATE TABLE `host_pool` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '名字',
  `os` varchar(100) DEFAULT NULL COMMENT 'os类型',
  `ip` varchar(100) DEFAULT NULL COMMENT 'ip',
  `port` varchar(100) DEFAULT NULL COMMENT '端口',
  `protocol` varchar(100) DEFAULT NULL COMMENT '协议',
  `credent` varchar(100) DEFAULT NULL COMMENT '认证方式',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `key` varchar(100) DEFAULT NULL COMMENT 'key',
  `allocated` varchar(100) DEFAULT NULL COMMENT '是否已分配',
  `alive` varchar(100) DEFAULT NULL COMMENT '是否alivie',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;