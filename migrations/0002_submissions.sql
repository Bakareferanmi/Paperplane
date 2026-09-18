create table if not exists submissions (
  id           serial primary key,
  student_name text not null,
  class_code   text not null,
  subject      text not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists submissions_created_at_idx on submissions (created_at desc);
create index if not exists submissions_class_code_idx on submissions (class_code);

create table if not exists submission_files (
  id             serial primary key,
  submission_id  integer not null references submissions (id) on delete cascade,
  file_name      text not null,
  file_type      text not null,
  file_size      integer not null,
  file_data      text not null,
  created_at     timestamptz not null default now()
);

create index if not exists submission_files_submission_id_idx on submission_files (submission_id);
