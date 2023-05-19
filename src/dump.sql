create database users;

create table all_users(
  id serial primary key,
  username varchar not null unique,
  name varchar,
  email varchar not null unique,
  password varchar not null);