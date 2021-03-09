--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3 (Ubuntu 12.3-1.pgdg20.04+1)
-- Dumped by pg_dump version 12.3 (Ubuntu 12.3-1.pgdg20.04+1)

-- Started on 2020-07-17 14:55:33 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE matcha;
--
-- TOC entry 3086 (class 1262 OID 16417)
-- Name: matcha; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE matcha WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'fr_FR.UTF-8' LC_CTYPE = 'fr_FR.UTF-8';


\connect matcha

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET timezone = 'Europe/Paris';

--
-- TOC entry 2 (class 3079 OID 16418)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3087 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 556 (class 1247 OID 16430)
-- Name: genre; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.genre AS ENUM (
    'homme',
    'femme'
);


--
-- TOC entry 675 (class 1247 OID 16565)
-- Name: like_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.like_type AS ENUM (
    'message',
    'like',
    'visite',
    'return_like',
    'unlike'
);


--
-- TOC entry 559 (class 1247 OID 16438)
-- Name: orientation; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.orientation AS ENUM (
    'hetero',
    'bi',
    'homo'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16545)
-- Name: Blocked; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Blocked" (
    block_id text DEFAULT concat('block-', public.uuid_generate_v4()) NOT NULL,
    blocker_id text NOT NULL,
    blocked_id text NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 16594)
-- Name: Contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Contacts" (
    contacts_id text DEFAULT concat('contacts-', public.uuid_generate_v4()) NOT NULL,
    contact1 text NOT NULL,
    contact2 text NOT NULL
);

--
-- TOC entry 207 (class 1259 OID 16512)
-- Name: Like; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Like" (
    like_id text DEFAULT concat('like-', public.uuid_generate_v4()) NOT NULL,
    liker_id text NOT NULL,
    liked_id text NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 16613)
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    message_id text DEFAULT concat('message-', public.uuid_generate_v4()) NOT NULL,
    contacts_id text NOT NULL,
    sender_id text NOT NULL,
    message_content text NOT NULL,
    message_date date NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 16575)
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    notification_id text DEFAULT concat('notification-', public.uuid_generate_v4()) NOT NULL,
    notifier_id text NOT NULL,
    notified_id text NOT NULL,
    notification_date date NOT NULL,
    notification_message character varying(255) NOT NULL,
    notification_type character varying(255)
);


--
-- TOC entry 204 (class 1259 OID 16465)
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    tag_id text DEFAULT concat('tag-', public.uuid_generate_v4()) NOT NULL,
    tag_name character varying(255) NOT NULL
);


--
-- TOC entry 203 (class 1259 OID 16452)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    user_id text DEFAULT concat('user-', public.uuid_generate_v4()) NOT NULL,
    user_login name NOT NULL,
    user_firstname character varying(255) NOT NULL,
    user_lastname character varying(255) NOT NULL,
    user_email character varying(255) NOT NULL,
    user_password character varying(255) NOT NULL,
    user_age integer,
    user_genre character varying(255),
    user_orientation character varying(255),
    user_bio text DEFAULT ''::text NOT NULL,
    user_score bigint DEFAULT 0,
    user_locpreference boolean DEFAULT true NOT NULL,
    user_lastlogin timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_image character varying(255),
    user_image1 character varying(255),
    user_image2 character varying(255),
    user_image3 character varying(255),
    user_image4 character varying(255),
    user_latitude double precision DEFAULT 48.8534,
    user_longitude double precision DEFAULT 2.3488,
    user_vtoken character varying,
    user_ftoken character varying,
    CONSTRAINT age_positive CHECK ((user_age > 0))
);


--
-- TOC entry 205 (class 1259 OID 16474)
-- Name: Usertag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Usertag" (
    usertag_id text DEFAULT concat('usertag-', public.uuid_generate_v4()) NOT NULL,
    user_id text NOT NULL,
    tag_id text NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 16493)
-- Name: Visit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Visit" (
    visit_id text DEFAULT concat('visit-', public.uuid_generate_v4()) NOT NULL,
    visiter_id text NOT NULL,
    visited_id text NOT NULL
);


--
-- TOC entry 3077 (class 0 OID 16545)
-- Dependencies: 209
-- Data for Name: Blocked; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Blocked" (block_id, blocker_id, blocked_id) FROM stdin;
\.


--
-- TOC entry 3079 (class 0 OID 16594)
-- Dependencies: 211
-- Data for Name: Contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Contacts" (contacts_id, contact1, contact2) FROM stdin;
\.

--
-- TOC entry 3075 (class 0 OID 16512)
-- Dependencies: 207
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Like" (like_id, liker_id, liked_id) FROM stdin;
\.


--
-- TOC entry 3080 (class 0 OID 16613)
-- Dependencies: 212
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Message" (message_id, contacts_id, sender_id, message_content, message_date) FROM stdin;
\.


--
-- TOC entry 3078 (class 0 OID 16575)
-- Dependencies: 210
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (notification_id, notifier_id, notified_id, notification_date, notification_message, notification_type) FROM stdin;
\.


--
-- TOC entry 3072 (class 0 OID 16465)
-- Dependencies: 204
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (tag_id, tag_name) FROM stdin;
\.


--
-- TOC entry 3071 (class 0 OID 16452)
-- Dependencies: 203
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (user_id, user_login, user_firstname, user_lastname, user_email, user_password, user_age, user_genre, user_orientation, user_bio, user_score, user_locpreference, user_lastlogin, user_image, user_latitude, user_longitude, user_vtoken, user_ftoken) FROM stdin;
\.


--
-- TOC entry 3073 (class 0 OID 16474)
-- Dependencies: 205
-- Data for Name: Usertag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Usertag" (usertag_id, user_id, tag_id) FROM stdin;
\.


--
-- TOC entry 3074 (class 0 OID 16493)
-- Dependencies: 206
-- Data for Name: Visit; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Visit" (visit_id, visiter_id, visited_id) FROM stdin;
\.


--
-- TOC entry 2923 (class 2606 OID 16553)
-- Name: Blocked UNIQUE_block_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT "UNIQUE_block_id" PRIMARY KEY (block_id);


--
-- TOC entry 2927 (class 2606 OID 16602)
-- Name: Contacts UNIQUE_contacts_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT "UNIQUE_contacts_id" PRIMARY KEY (contacts_id);

--
-- TOC entry 2919 (class 2606 OID 16520)
-- Name: Like UNIQUE_like_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "UNIQUE_like_id" PRIMARY KEY (like_id);

--
-- TOC entry 2920 (class 2606 OID 16520)
-- Name: Like UNIQUE_liker_liked_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "UNIQUE_liker_liked_id" UNIQUE (liker_id, liked_id);

--
-- TOC entry 2929 (class 2606 OID 16621)
-- Name: Message UNIQUE_message_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "UNIQUE_message_id" PRIMARY KEY (message_id);


--
-- TOC entry 2925 (class 2606 OID 16583)
-- Name: Notification UNIQUE_notification_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "UNIQUE_notification_id" PRIMARY KEY (notification_id);


--
-- TOC entry 2913 (class 2606 OID 16473)
-- Name: Tag UNIQUE_tag_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "UNIQUE_tag_id" PRIMARY KEY (tag_id);


--
-- TOC entry 2911 (class 2606 OID 16464)
-- Name: User UNIQUE_user_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UNIQUE_user_id" PRIMARY KEY (user_id);


--
-- TOC entry 2915 (class 2606 OID 16482)
-- Name: Usertag UNIQUE_usertag_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usertag"
    ADD CONSTRAINT "UNIQUE_usertag_id" PRIMARY KEY (usertag_id);


--
-- TOC entry 2917 (class 2606 OID 16501)
-- Name: Visit UNIQUE_visit_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT "UNIQUE_visit_id" PRIMARY KEY (visit_id);


--
-- TOC entry 2938 (class 2606 OID 16559)
-- Name: Blocked blocked_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT blocked_id FOREIGN KEY (blocked_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2937 (class 2606 OID 16554)
-- Name: Blocked blocker_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT blocker_id FOREIGN KEY (blocker_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2941 (class 2606 OID 16603)
-- Name: Contacts contact1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT contact1 FOREIGN KEY (contact1) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2942 (class 2606 OID 16608)
-- Name: Contacts contact2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT contact2 FOREIGN KEY (contact2) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2943 (class 2606 OID 16622)
-- Name: Message contacts_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT contacts_id FOREIGN KEY (contacts_id) REFERENCES public."Contacts"(contacts_id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- TOC entry 2935 (class 2606 OID 16526)
-- Name: Like liked_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT liked_id FOREIGN KEY (liked_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2934 (class 2606 OID 16521)
-- Name: Like liker_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT liker_id FOREIGN KEY (liker_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2939 (class 2606 OID 16584)
-- Name: Notification notifer_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT notifer_id FOREIGN KEY (notifier_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2940 (class 2606 OID 16589)
-- Name: Notification notified_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT notified_id FOREIGN KEY (notified_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2944 (class 2606 OID 16627)
-- Name: Message sender_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT sender_id FOREIGN KEY (sender_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2931 (class 2606 OID 16488)
-- Name: Usertag tag_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usertag"
    ADD CONSTRAINT tag_id FOREIGN KEY (tag_id) REFERENCES public."Tag"(tag_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2930 (class 2606 OID 16483)
-- Name: Usertag user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usertag"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2933 (class 2606 OID 16507)
-- Name: Visit visited_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT visited_id FOREIGN KEY (visited_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2932 (class 2606 OID 16502)
-- Name: Visit visiter_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT visiter_id FOREIGN KEY (visiter_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2020-07-17 14:55:33 CEST

--
-- PostgreSQL database dump complete
--
