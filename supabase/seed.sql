insert into seasons (name) values ('Demo Season');

-- create an initial team for reference
insert into teams (season_id, name, short_name)
select id, 'Alabama', 'ALA' from seasons where name = 'Demo Season';

-- After your user signs in, set them as admin:
-- update profiles set role = 'admin' where id = '<user-id>';
