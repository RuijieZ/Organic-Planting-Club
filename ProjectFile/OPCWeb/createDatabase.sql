drop database if exists OPCWeb_test;
create database OPCWeb_test;

use OPCWeb_test;

drop table if exists userInfo;
create table userInfo(
	id int auto_increment, 
	username varchar(255) not null,
	password varchar(255) not null,
	level int, 
	primary key (id)
);

drop table if exists taskInfo;
create table taskInfo(
	id int auto_increment,
	title varchar(255),
	description longtext,
	userId int,
	
	primary key(id),
	foreign key(userId) references userInfo(id)
);

drop table if exists fieldInfo;
create table fieldInfo(
	id int,
	taskId int not null, 
	primary key (id),
	foreign key (taskId) references taskInfo(id)
);