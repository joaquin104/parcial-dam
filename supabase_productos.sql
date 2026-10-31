-- Ejecutar esto en Supabase: panel izquierdo > SQL Editor > New query > Run
-- (Ya lo corriste en el proyecto "Menudencias" — queda acá como referencia)

create table if not exists productos (
  id bigint generated always as identity primary key,
  nombre text not null,
  categoria text not null,       -- 'vacuno' | 'cerdo' | 'pollo' | 'embutidos'
  precio_kg numeric not null,
  stock numeric not null default 0,
  creado_en timestamp with time zone default now()
);

alter table productos enable row level security;

create policy "Permitir todo con anon key"
on productos
for all
to anon
using (true)
with check (true);

-- Datos de prueba:
insert into productos (nombre, categoria, precio_kg, stock) values
  ('Asado de tira', 'vacuno', 8500, 20),
  ('Bife de chorizo', 'vacuno', 12000, 15),
  ('Matambre de cerdo', 'cerdo', 7000, 10),
  ('Milanesa de pollo', 'pollo', 6500, 25),
  ('Chorizo parrillero', 'embutidos', 4500, 30);
