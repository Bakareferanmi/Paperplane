create table if not exists students (
  id           serial primary key,
  student_id   text not null,
  student_name text not null,
  class_code   text not null,
  created_at   timestamptz not null default now()
);

create unique index if not exists students_student_id_idx on students (student_id);

alter table submissions add column if not exists student_ref_id integer references students (id);
create index if not exists submissions_student_ref_id_idx on submissions (student_ref_id);
