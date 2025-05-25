drop policy "Users can view own activity logs" on "public"."activity_logs";

drop policy "Users can view own chat sessions" on "public"."chat_sessions";

drop policy "Users can view own profile" on "public"."client_profile";

drop policy "Users can view own data" on "public"."clients";

drop policy "Users can view own conversations" on "public"."conversations";

drop policy "Users can view own leads" on "public"."leads";

drop policy "Users can view own messages" on "public"."messages";

drop policy "Users can view own searches" on "public"."queue_search";

drop policy "Users can view own tokens" on "public"."tokens";

revoke delete on table "public"."api_keys" from "anon";

revoke insert on table "public"."api_keys" from "anon";

revoke references on table "public"."api_keys" from "anon";

revoke select on table "public"."api_keys" from "anon";

revoke trigger on table "public"."api_keys" from "anon";

revoke truncate on table "public"."api_keys" from "anon";

revoke update on table "public"."api_keys" from "anon";

revoke delete on table "public"."api_keys" from "authenticated";

revoke insert on table "public"."api_keys" from "authenticated";

revoke references on table "public"."api_keys" from "authenticated";

revoke select on table "public"."api_keys" from "authenticated";

revoke trigger on table "public"."api_keys" from "authenticated";

revoke truncate on table "public"."api_keys" from "authenticated";

revoke update on table "public"."api_keys" from "authenticated";

revoke delete on table "public"."api_keys" from "service_role";

revoke insert on table "public"."api_keys" from "service_role";

revoke references on table "public"."api_keys" from "service_role";

revoke select on table "public"."api_keys" from "service_role";

revoke trigger on table "public"."api_keys" from "service_role";

revoke truncate on table "public"."api_keys" from "service_role";

revoke update on table "public"."api_keys" from "service_role";

alter table "public"."api_keys" drop constraint "api_keys_key_type_key";

alter table "public"."chat_sessions" drop constraint "chat_sessions_conversation_id_fkey";

alter table "public"."client_profile" drop constraint "client_profile_client_id_key";

alter table "public"."tokens" drop constraint "tokens_client_id_provider_key";

alter table "public"."api_keys" drop constraint "api_keys_pkey";

drop index if exists "public"."api_keys_key_type_key";

drop index if exists "public"."api_keys_pkey";

drop index if exists "public"."client_profile_client_id_key";

drop index if exists "public"."idx_activity_logs_action";

drop index if exists "public"."idx_activity_logs_client_id";

drop index if exists "public"."idx_leads_client_id";

drop index if exists "public"."idx_leads_search_id";

drop index if exists "public"."idx_messages_client_id";

drop index if exists "public"."idx_queue_search_client_id";

drop index if exists "public"."idx_queue_search_status";

drop index if exists "public"."tokens_client_id_provider_key";

drop table "public"."api_keys";

create table "public"."email_jobs" (
    "id" uuid not null default uuid_generate_v4(),
    "client_id" uuid,
    "lead_id" uuid,
    "subject" text,
    "body" text,
    "status" text default 'pending'::text,
    "error" text,
    "sent_at" timestamp without time zone
);


alter table "public"."email_jobs" enable row level security;

alter table "public"."activity_logs" drop column "timestamp";

alter table "public"."activity_logs" add column "created_at" timestamp without time zone default now();

alter table "public"."activity_logs" alter column "action" drop not null;

alter table "public"."activity_logs" alter column "id" set default uuid_generate_v4();

alter table "public"."chat_sessions" drop column "assistant_id";

alter table "public"."chat_sessions" drop column "conversation_id";

alter table "public"."chat_sessions" drop column "thread_id";

alter table "public"."chat_sessions" add column "created_at" timestamp without time zone default now();

alter table "public"."chat_sessions" add column "title" text;

alter table "public"."chat_sessions" alter column "id" set default uuid_generate_v4();

alter table "public"."client_profile" add column "banned_phrases" text;

alter table "public"."client_profile" add column "calendly_url" text;

alter table "public"."client_profile" add column "common_objections" text;

alter table "public"."client_profile" add column "linkedin_url" text;

alter table "public"."client_profile" add column "offer" text;

alter table "public"."client_profile" add column "primary_goal" text;

alter table "public"."client_profile" add column "tone" text;

alter table "public"."client_profile" alter column "id" set default uuid_generate_v4();

alter table "public"."clients" drop column "avatar_url";

alter table "public"."clients" drop column "full_name";

alter table "public"."clients" add column "created_at" timestamp without time zone default now();

alter table "public"."clients" add column "is_active" boolean default false;

alter table "public"."clients" add column "plan" text default 'starter'::text;

alter table "public"."clients" add column "stripe_id" text;

alter table "public"."clients" alter column "id" set default uuid_generate_v4();

alter table "public"."conversations" drop column "last_message_at";

alter table "public"."conversations" add column "created_at" timestamp with time zone default now();

alter table "public"."conversations" add column "type" text not null default 'campaign'::text;

alter table "public"."conversations" alter column "id" set default uuid_generate_v4();

alter table "public"."leads" drop column "notes";

alter table "public"."leads" add column "created_at" timestamp without time zone default now();

alter table "public"."leads" add column "enriched_from" jsonb;

alter table "public"."leads" add column "phone_number" text;

alter table "public"."leads" alter column "id" set default uuid_generate_v4();

alter table "public"."leads" alter column "status" set default 'à contacter'::text;

alter table "public"."messages" drop column "toolcalls";

alter table "public"."messages" add column "created_at" timestamp without time zone default now();

alter table "public"."messages" add column "toolCalls" jsonb;

alter table "public"."messages" alter column "id" set default uuid_generate_v4();

alter table "public"."queue_search" drop column "error";

alter table "public"."queue_search" alter column "created_at" set data type timestamp without time zone using "created_at"::timestamp without time zone;

alter table "public"."queue_search" alter column "id" set default uuid_generate_v4();

alter table "public"."queue_search" alter column "keyword" drop not null;

alter table "public"."tokens" add column "created_at" timestamp with time zone default now();

alter table "public"."tokens" add column "provider_token_id" character varying(255);

alter table "public"."tokens" add column "scope" text[];

alter table "public"."tokens" add column "updated_at" timestamp with time zone default now();

alter table "public"."tokens" alter column "access_token" drop not null;

alter table "public"."tokens" alter column "expires_at" set data type timestamp without time zone using "expires_at"::timestamp without time zone;

alter table "public"."tokens" alter column "id" set default uuid_generate_v4();

alter table "public"."tokens" alter column "provider" set default 'google'::character varying;

alter table "public"."tokens" alter column "provider" drop not null;

alter table "public"."tokens" alter column "provider" set data type character varying(50) using "provider"::character varying(50);

CREATE UNIQUE INDEX email_jobs_pkey ON public.email_jobs USING btree (id);

CREATE INDEX idx_client_profile_is_complete ON public.client_profile USING btree (is_complete);

CREATE INDEX idx_clients_email ON public.clients USING btree (email);

CREATE INDEX idx_clients_stripe_id ON public.clients USING btree (stripe_id);

CREATE INDEX idx_tokens_client_id ON public.tokens USING btree (client_id);

CREATE INDEX idx_tokens_expires_at ON public.tokens USING btree (expires_at);

CREATE INDEX messages_chat_session_id_idx ON public.messages USING btree (chat_session_id);

alter table "public"."email_jobs" add constraint "email_jobs_pkey" PRIMARY KEY using index "email_jobs_pkey";

alter table "public"."email_jobs" add constraint "email_jobs_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE not valid;

alter table "public"."email_jobs" validate constraint "email_jobs_client_id_fkey";

alter table "public"."email_jobs" add constraint "email_jobs_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE not valid;

alter table "public"."email_jobs" validate constraint "email_jobs_lead_id_fkey";

alter table "public"."leads" add constraint "leads_search_id_fkey" FOREIGN KEY (search_id) REFERENCES queue_search(id) ON DELETE CASCADE not valid;

alter table "public"."leads" validate constraint "leads_search_id_fkey";

alter table "public"."messages" add constraint "messages_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text]))) not valid;

alter table "public"."messages" validate constraint "messages_role_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_message_toolcalls(message_id uuid, tool_calls jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.messages
  SET toolCalls = tool_calls
  WHERE id = message_id;
END;
$function$
;

grant delete on table "public"."email_jobs" to "anon";

grant insert on table "public"."email_jobs" to "anon";

grant references on table "public"."email_jobs" to "anon";

grant select on table "public"."email_jobs" to "anon";

grant trigger on table "public"."email_jobs" to "anon";

grant truncate on table "public"."email_jobs" to "anon";

grant update on table "public"."email_jobs" to "anon";

grant delete on table "public"."email_jobs" to "authenticated";

grant insert on table "public"."email_jobs" to "authenticated";

grant references on table "public"."email_jobs" to "authenticated";

grant select on table "public"."email_jobs" to "authenticated";

grant trigger on table "public"."email_jobs" to "authenticated";

grant truncate on table "public"."email_jobs" to "authenticated";

grant update on table "public"."email_jobs" to "authenticated";

grant delete on table "public"."email_jobs" to "service_role";

grant insert on table "public"."email_jobs" to "service_role";

grant references on table "public"."email_jobs" to "service_role";

grant select on table "public"."email_jobs" to "service_role";

grant trigger on table "public"."email_jobs" to "service_role";

grant truncate on table "public"."email_jobs" to "service_role";

grant update on table "public"."email_jobs" to "service_role";

create policy "Clients can insert logs"
on "public"."activity_logs"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "Clients can read their activity logs"
on "public"."activity_logs"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "Utilisateurs peuvent créer leurs propres sessions"
on "public"."chat_sessions"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Utilisateurs peuvent mettre à jour leurs propres sessions"
on "public"."chat_sessions"
as permissive
for update
to public
using ((auth.uid() = client_id));


create policy "Utilisateurs peuvent supprimer leurs propres sessions"
on "public"."chat_sessions"
as permissive
for delete
to public
using ((auth.uid() = client_id));


create policy "Utilisateurs peuvent voir leurs propres sessions"
on "public"."chat_sessions"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "User can create their own profile"
on "public"."client_profile"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "User can read their profile"
on "public"."client_profile"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "User can update their profile"
on "public"."client_profile"
as permissive
for update
to public
using ((client_id = auth.uid()));


create policy "Users can delete their own profile"
on "public"."client_profile"
as permissive
for delete
to public
using ((auth.uid() = client_id));


create policy "Users can insert their own profile"
on "public"."client_profile"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Users can read own profile"
on "public"."client_profile"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Users can update their own profile"
on "public"."client_profile"
as permissive
for update
to public
using ((auth.uid() = client_id));


create policy "Users can view their own profile"
on "public"."client_profile"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Authenticated users can create client records"
on "public"."clients"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Clients can insert themselves"
on "public"."clients"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Clients can read their own data"
on "public"."clients"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can update their own client record"
on "public"."clients"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Users can view their own client record"
on "public"."clients"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can delete their own conversations"
on "public"."conversations"
as permissive
for delete
to public
using ((auth.uid() = client_id));


create policy "Users can insert their own conversations"
on "public"."conversations"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Users can update their own conversations"
on "public"."conversations"
as permissive
for update
to public
using ((auth.uid() = client_id));


create policy "Users can view their own conversations"
on "public"."conversations"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Clients can insert email jobs"
on "public"."email_jobs"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "Clients can read their email jobs"
on "public"."email_jobs"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "Clients can insert leads"
on "public"."leads"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "Clients can read their leads"
on "public"."leads"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "Clients can insert their messages"
on "public"."messages"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "Clients can read their messages"
on "public"."messages"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "Users can insert their own messages"
on "public"."messages"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Users can view their own messages"
on "public"."messages"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Utilisateurs peuvent créer leurs propres messages"
on "public"."messages"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Utilisateurs peuvent voir leurs propres messages"
on "public"."messages"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Clients can insert queue searches"
on "public"."queue_search"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "Clients can read their searches"
on "public"."queue_search"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "Clients can insert their tokens"
on "public"."tokens"
as permissive
for insert
to public
with check ((client_id = auth.uid()));


create policy "Clients can read their tokens"
on "public"."tokens"
as permissive
for select
to public
using ((client_id = auth.uid()));


create policy "Users can only access their own tokens"
on "public"."tokens"
as permissive
for all
to public
using ((client_id = auth.uid()))
with check ((client_id = auth.uid()));


CREATE TRIGGER update_client_profile_updated_at BEFORE UPDATE ON public.client_profile FOR EACH ROW EXECUTE FUNCTION update_client_profile_updated_at();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON public.tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


