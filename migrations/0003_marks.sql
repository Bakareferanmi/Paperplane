alter table submissions add column if not exists assignment_id text;
alter table submissions add column if not exists marks integer;

alter table submissions add constraint marks_range check (marks is null or (marks >= 1 and marks <= 10));

update submissions
set assignment_id = 'BAKARE' || lpad(floor(random() * 100000)::text, 5, '0')
where assignment_id is null;

alter table submissions alter column assignment_id set not null;
create unique index if not exists submissions_assignment_id_idx on submissions (assignment_id);
