-- Add sample questions to the Java Fundamentals Exam (ID: 4)
INSERT INTO exam_question (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, difficulty, topic) VALUES 
(4, 'What is the output of: System.out.println(10 + 20)?', '30', '1020', 'Error', 'None of the above', 'A', 5, 'Easy', 'Operators'),
(4, 'Which keyword is used to create a class in Java?', 'class', 'new', 'create', 'define', 'A', 5, 'Easy', 'Classes'),
(4, 'What is the correct way to declare a variable in Java?', 'int x = 5;', 'variable x = 5;', 'x = 5;', 'declare x = 5;', 'A', 5, 'Easy', 'Variables'),
(4, 'Which of the following is NOT a primitive data type in Java?', 'int', 'String', 'boolean', 'double', 'B', 5, 'Medium', 'Data Types'),
(4, 'What is the purpose of the "public" keyword in Java?', 'To make a method private', 'To make a method accessible from anywhere', 'To make a method protected', 'To make a method static', 'B', 5, 'Medium', 'Access Modifiers'),
(4, 'Which method is called when an object is created?', 'main()', 'constructor()', 'new()', 'create()', 'B', 5, 'Medium', 'Constructors'),
(4, 'What is inheritance in Java?', 'A way to create multiple objects', 'A mechanism where one class acquires properties of another class', 'A way to hide data', 'A way to create interfaces', 'B', 5, 'Medium', 'Inheritance'),
(4, 'Which keyword is used to prevent inheritance?', 'private', 'final', 'static', 'abstract', 'B', 5, 'Medium', 'Inheritance'),
(4, 'What is the output of: System.out.println("Hello" + "World");', 'HelloWorld', 'Hello World', 'Hello+World', 'Error', 'A', 5, 'Easy', 'Strings'),
(4, 'Which collection class is synchronized?', 'ArrayList', 'HashMap', 'Vector', 'LinkedList', 'C', 5, 'Medium', 'Collections');

-- Update the exam to reflect the correct question count
UPDATE exam SET question_count = 10 WHERE id = 4; 