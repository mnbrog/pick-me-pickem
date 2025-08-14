alter table profiles enable row level security;
alter table seasons enable row level security;
alter table teams enable row level security;
alter table games enable row level security;
alter table picks enable row level security;

-- profiles
create policy "profile self select" on profiles
  for select using (auth.uid() = id);
create policy "profile self insert" on profiles
  for insert with check (auth.uid() = id);
create policy "admin select profiles" on profiles
  for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- seasons
create policy "seasons select" on seasons
  for select using (auth.role() = 'authenticated');
create policy "seasons admin modify" on seasons
  for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- teams
create policy "teams select" on teams
  for select using (auth.role() = 'authenticated');
create policy "teams admin modify" on teams
  for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- games
create policy "games select" on games
  for select using (auth.role() = 'authenticated');
create policy "games admin modify" on games
  for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- picks
create policy "picks select" on picks
  for select using (auth.role() = 'authenticated');
create policy "picks insert" on picks
  for insert with check (auth.uid() = user_id);
create policy "picks update" on picks
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
