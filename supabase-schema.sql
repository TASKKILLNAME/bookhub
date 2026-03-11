-- ============================================
-- BookHub Supabase Schema
-- Supabase 대시보드 > SQL Editor 에서 실행하세요
-- ============================================

-- 1. 프로필 테이블 (auth.users 확장)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name varchar(50) not null,
  bio text default '',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "프로필 공개 읽기" on public.profiles for select using (true);
create policy "본인 프로필 수정" on public.profiles for update using (auth.uid() = id);
create policy "본인 프로필 생성" on public.profiles for insert with check (auth.uid() = id);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', '독서인'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. 도서 테이블
create table public.books (
  isbn text primary key,
  title varchar(200) not null,
  author varchar(100) not null,
  publisher varchar(100) default '',
  cover_url text default '',
  genre varchar(50) default '',
  description text default '',
  created_at timestamptz default now()
);

alter table public.books enable row level security;
create policy "도서 공개 읽기" on public.books for select using (true);
create policy "로그인 사용자 도서 추가" on public.books for insert with check (auth.uid() is not null);
create policy "로그인 사용자 도서 수정" on public.books for update using (auth.uid() is not null);

-- 3. 독서 기록 테이블
create table public.reading_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  isbn text references public.books(isbn) on delete cascade not null,
  rating decimal(2,1) default 0 check (rating >= 0 and rating <= 5),
  description text default '',
  like_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.reading_records enable row level security;
create policy "기록 공개 읽기" on public.reading_records for select using (true);
create policy "본인 기록 생성" on public.reading_records for insert with check (auth.uid() = user_id);
create policy "본인 기록 수정" on public.reading_records for update using (auth.uid() = user_id);
create policy "본인 기록 삭제" on public.reading_records for delete using (auth.uid() = user_id);

-- 4. 좋아요 테이블
create table public.record_likes (
  user_id uuid references public.profiles(id) on delete cascade,
  record_id uuid references public.reading_records(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, record_id)
);

alter table public.record_likes enable row level security;
create policy "좋아요 공개 읽기" on public.record_likes for select using (true);
create policy "본인 좋아요 생성" on public.record_likes for insert with check (auth.uid() = user_id);
create policy "본인 좋아요 삭제" on public.record_likes for delete using (auth.uid() = user_id);

-- 5. 댓글 테이블
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  record_id uuid references public.reading_records(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;
create policy "댓글 공개 읽기" on public.comments for select using (true);
create policy "본인 댓글 생성" on public.comments for insert with check (auth.uid() = user_id);
create policy "본인 댓글 삭제" on public.comments for delete using (auth.uid() = user_id);

-- 6. 자유 이야기 테이블
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title varchar(200) not null,
  content text not null,
  like_count int default 0,
  comment_count int default 0,
  created_at timestamptz default now()
);

alter table public.stories enable row level security;
create policy "이야기 공개 읽기" on public.stories for select using (true);
create policy "본인 이야기 생성" on public.stories for insert with check (auth.uid() = user_id);
create policy "본인 이야기 수정" on public.stories for update using (auth.uid() = user_id);
create policy "본인 이야기 삭제" on public.stories for delete using (auth.uid() = user_id);

-- 7. 기록 조회용 뷰 (프로필 이름 조인)
create or replace view public.records_with_user as
select
  r.*,
  p.name as user_name,
  b.title as book_title,
  b.author as book_author,
  b.cover_url as book_cover_url,
  b.publisher as book_publisher,
  (select count(*) from public.comments c where c.record_id = r.id) as comment_count
from public.reading_records r
join public.profiles p on p.id = r.user_id
join public.books b on b.isbn = r.isbn;
