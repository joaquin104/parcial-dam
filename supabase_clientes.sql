-- Ejecutar en el proyecto "Menudencias" (SQL Editor > New query > Run)
-- Crea la tabla clientes que todavía no existe en este proyecto.

create table if not exists clientes (
  id bigint generated always as identity primary key,
  nombre text not null,
  email text not null,
  telefono text,
  creado_en timestamp with time zone default now()
);

alter table clientes enable row level security;

create policy "Permitir todo con anon key"
on clientes
for all
to anon
using (true)
with check (true);

-- Opcional, un par de clientes de prueba:
insert into clientes (nombre, email, telefono) values
  ('Juan Pérez', 'juan@mail.com', '11-2345-6789'),
  ('María Gómez', 'maria@mail.com', '11-9876-5432');
