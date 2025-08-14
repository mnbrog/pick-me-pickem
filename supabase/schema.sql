create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create table seasons (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  name text not null,
  short_name text not null,
  primary_color text,
  created_by uuid references profiles(id),
  unique (season_id, name)
);

create table games (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  date timestamptz not null,
  opponent text not null,
  home_away text not null check (home_away in ('HOME','AWAY','NEUTRAL')),
  status text not null default 'SCHEDULED' check (status in ('SCHEDULED','FINAL')),
  result text check (result in ('W','L')),
  score_team int,
  score_opp int,
  lock_at timestamptz default (date - interval '1 hour'),
  created_at timestamptz default now()
);

create table picks (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  pick_for text not null,
  created_at timestamptz default now(),
  unique (game_id, user_id)
);

create view games_with_winner as
select g.*, t.name as team_name,
       case
         when g.result = 'W' then t.name
         when g.result = 'L' then g.opponent
         else null
       end as winner
from games g
join teams t on g.team_id = t.id;

create view standings_view as
select p.user_id,
       pr.full_name,
       g.season_id,
       count(*) filter (where g.status = 'FINAL') as played,
       count(*) filter (where g.status = 'SCHEDULED') as pending,
       count(*) filter (where g.status = 'FINAL' and (
         (g.result = 'W' and p.pick_for = t.name) or
         (g.result = 'L' and p.pick_for = g.opponent)
       )) as correct,
       round(
         (count(*) filter (where g.status = 'FINAL' and (
           (g.result = 'W' and p.pick_for = t.name) or
           (g.result = 'L' and p.pick_for = g.opponent)
         ))::numeric / nullif(count(*) filter (where g.status = 'FINAL'),0) * 100),
         1
       ) as win_pct
from picks p
join games g on p.game_id = g.id
join teams t on g.team_id = t.id
join profiles pr on p.user_id = pr.id
group by p.user_id, pr.full_name, g.season_id;
