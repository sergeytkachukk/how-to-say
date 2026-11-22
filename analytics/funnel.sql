-- Funnel by A/B variant.
--
-- IMPORTANT: sample-events.csv is SAMPLE DATA made up for this demo.
-- It is not real traffic and it proves nothing about which variant is better.
-- It only shows how the funnel is calculated.
--
-- Table: events(session_id, event_time, event_name, variant, page_type, phrase, language)
--
-- Steps
--   1. Opened a phrase page      (page_view with page_type = 'phrase')
--   2. Saw the play button       (experiment_view)
--   3. Pressed play              (play_audio) = the first useful action
--
-- This query works in SQLite, Postgres and DuckDB. In BigQuery, use the table name
-- of your events export instead of "events".

WITH sessions AS (
  SELECT
    session_id,
    variant,
    MAX(CASE WHEN event_name = 'page_view' AND page_type = 'phrase' THEN 1 ELSE 0 END) AS opened_phrase_page,
    MAX(CASE WHEN event_name = 'experiment_view' THEN 1 ELSE 0 END) AS saw_button,
    MAX(CASE WHEN event_name = 'play_audio' THEN 1 ELSE 0 END) AS pressed_play
  FROM events
  GROUP BY session_id, variant
)

SELECT
  variant,
  SUM(opened_phrase_page) AS opened_phrase_page,
  SUM(saw_button) AS saw_button,
  SUM(pressed_play) AS pressed_play,
  ROUND(100.0 * SUM(pressed_play) / NULLIF(SUM(saw_button), 0), 1) AS play_rate_percent
FROM sessions
GROUP BY variant
ORDER BY variant;
