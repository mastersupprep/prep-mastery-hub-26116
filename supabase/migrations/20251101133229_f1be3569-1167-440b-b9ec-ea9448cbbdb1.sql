-- Update the tree diagram to include text labels for nodes
UPDATE test_questions
SET diagram_json = diagram_json || jsonb_build_array(
  jsonb_build_object(
    'type', 'text',
    'x', 265,
    'y', 75,
    'text', 'A',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  ),
  jsonb_build_object(
    'type', 'text',
    'x', 195,
    'y', 155,
    'text', 'B',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  ),
  jsonb_build_object(
    'type', 'text',
    'x', 335,
    'y', 155,
    'text', 'C',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  ),
  jsonb_build_object(
    'type', 'text',
    'x', 145,
    'y', 225,
    'text', 'D',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  ),
  jsonb_build_object(
    'type', 'text',
    'x', 245,
    'y', 225,
    'text', 'E',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  ),
  jsonb_build_object(
    'type', 'text',
    'x', 285,
    'y', 225,
    'text', 'F',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  ),
  jsonb_build_object(
    'type', 'text',
    'x', 385,
    'y', 225,
    'text', 'G',
    'fontSize', 16,
    'strokeColor', '#000000',
    'fontFamily', 1,
    'version', 1
  )
)
WHERE test_name = 'Test 1' 
AND question_statement LIKE '%tree structure%';