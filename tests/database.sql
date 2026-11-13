BEGIN;
INSERT INTO "User" (id,name,email,"updatedAt") VALUES ('qa-a','QA A','qa-a@example.invalid',NOW()),('qa-b','QA B','qa-b@example.invalid',NOW());
INSERT INTO "Mood" (id,"userId",date,mood,"updatedAt") VALUES ('qa-mood','qa-a','2026-11-13','calm',NOW());
INSERT INTO "Mood" (id,"userId",date,mood,"updatedAt") VALUES ('qa-mood-b','qa-b','2026-11-13','happy',NOW());
INSERT INTO "DiaryEntry" (id,"userId",title,content,date,"updatedAt") VALUES ('qa-entry','qa-a','Private','A private thought','2026-11-13',NOW());
INSERT INTO "FavoriteQuote" (id,"userId","quoteId") VALUES ('qa-fav','qa-a','q1');
DO $$ BEGIN
  IF (SELECT COUNT(*) FROM "DiaryEntry" WHERE "userId"='qa-b') <> 0 THEN RAISE EXCEPTION 'User scoping failed'; END IF;
  BEGIN
    INSERT INTO "Mood" (id,"userId",date,mood,"updatedAt") VALUES ('qa-dupe','qa-a','2026-11-13','sad',NOW());
    RAISE EXCEPTION 'Duplicate daily mood was accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  BEGIN
    INSERT INTO "FavoriteQuote" (id,"userId","quoteId") VALUES ('qa-fav-dupe','qa-a','q1');
    RAISE EXCEPTION 'Duplicate favorite was accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  BEGIN
    INSERT INTO "DiaryEntry" (id,"userId",title,content,date,"updatedAt") VALUES ('qa-orphan','qa-missing','Orphan','No user','2026-11-13',NOW());
    RAISE EXCEPTION 'An orphaned diary record was accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END $$;
UPDATE "Mood" SET mood='loved' WHERE "userId"='qa-a' AND date='2026-11-13';
DO $$ BEGIN
 IF (SELECT mood FROM "Mood" WHERE "userId"='qa-b' AND date='2026-11-13') <> 'happy' THEN RAISE EXCEPTION 'Another user mood was changed'; END IF;
END $$;
DELETE FROM "User" WHERE id='qa-a';
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM "Mood" WHERE "userId"='qa-a') OR EXISTS(SELECT 1 FROM "DiaryEntry" WHERE "userId"='qa-a') OR EXISTS(SELECT 1 FROM "FavoriteQuote" WHERE "userId"='qa-a') THEN RAISE EXCEPTION 'Cascading deletion failed'; END IF;
 IF NOT EXISTS(SELECT 1 FROM "Mood" WHERE "userId"='qa-b') THEN RAISE EXCEPTION 'Another user data was removed'; END IF;
END $$;
ROLLBACK;
SELECT 'DATABASE CONSTRAINTS AND USER-SCOPED QUERIES PASSED' AS result;
