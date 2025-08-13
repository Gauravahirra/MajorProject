package com.epathshala.config;

import com.epathshala.entity.*;
import com.epathshala.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private ParentRepository parentRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    @Autowired
    private AcademicCalendarRepository academicCalendarRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private ForumCategoryRepository forumCategoryRepository;
    
    @Autowired
    private ForumThreadRepository forumThreadRepository;
    
    @Autowired
    private ForumReplyRepository forumReplyRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Only initialize if no data exists
        if (userRepository.count() == 0) {
            System.out.println("🚀 Initializing sample data...");
            initializeSampleData();
            System.out.println("🎉 Sample data initialization completed!");
            System.out.println("📋 Available test accounts:");
            System.out.println("   👨‍💼 Admin: admin@epathshala.com / admin123");
            System.out.println("   👨‍🏫 Teacher: teacher1@epathshala.com / teacher123");
            System.out.println("   👨‍🎓 Student: student1@epathshala.com / student123");
            System.out.println("   👨‍👩‍👧‍👦 Parent: parent1@epathshala.com / parent123");
        } else {
            System.out.println("✅ Database already contains data, skipping initialization.");
        }
    }

    @Transactional
    private void initializeSampleData() {
        // Create Admin User
        User admin = createUser("Admin User", "admin@epathshala.com", "admin123", "ADMIN");
        userRepository.save(admin);
        System.out.println("✅ Admin user created");

        // Create Teachers
        User teacher1 = createUser("John Smith", "teacher1@epathshala.com", "teacher123", "TEACHER");
        User teacher2 = createUser("Sarah Johnson", "teacher2@epathshala.com", "teacher123", "TEACHER");
        User teacher3 = createUser("Mike Wilson", "teacher3@epathshala.com", "teacher123", "TEACHER");
        User teacher4 = createUser("Emily Davis", "teacher4@epathshala.com", "teacher123", "TEACHER");
        User teacher5 = createUser("James Anderson", "teacher5@epathshala.com", "teacher123", "TEACHER");
        
        userRepository.save(teacher1);
        userRepository.save(teacher2);
        userRepository.save(teacher3);
        userRepository.save(teacher4);
        userRepository.save(teacher5);

        Teacher t1 = new Teacher();
        t1.setUser(teacher1);
        t1.setSubject("Mathematics");
        t1.setAssignedClass("Class 10A");
        teacherRepository.save(t1);

        Teacher t2 = new Teacher();
        t2.setUser(teacher2);
        t2.setSubject("Science");
        t2.setAssignedClass("Class 10B");
        teacherRepository.save(t2);

        Teacher t3 = new Teacher();
        t3.setUser(teacher3);
        t3.setSubject("English");
        t3.setAssignedClass("Class 9A");
        teacherRepository.save(t3);

        Teacher t4 = new Teacher();
        t4.setUser(teacher4);
        t4.setSubject("History");
        t4.setAssignedClass("Class 10A");
        teacherRepository.save(t4);

        Teacher t5 = new Teacher();
        t5.setUser(teacher5);
        t5.setSubject("Computer Science");
        t5.setAssignedClass("Class 11A");
        teacherRepository.save(t5);
        System.out.println("✅ Sample teachers created");

        // Create Parents
        User parent1 = createUser("Robert Johnson", "parent1@epathshala.com", "parent123", "PARENT");
        User parent2 = createUser("Mary Williams", "parent2@epathshala.com", "parent123", "PARENT");
        User parent3 = createUser("David Brown", "parent3@epathshala.com", "parent123", "PARENT");
        User parent4 = createUser("Lisa Garcia", "parent4@epathshala.com", "parent123", "PARENT");
        User parent5 = createUser("Michael Lee", "parent5@epathshala.com", "parent123", "PARENT");
        
        userRepository.save(parent1);
        userRepository.save(parent2);
        userRepository.save(parent3);
        userRepository.save(parent4);
        userRepository.save(parent5);

        Parent p1 = new Parent();
        p1.setUser(parent1);
        parentRepository.save(p1);

        Parent p2 = new Parent();
        p2.setUser(parent2);
        parentRepository.save(p2);

        Parent p3 = new Parent();
        p3.setUser(parent3);
        parentRepository.save(p3);

        Parent p4 = new Parent();
        p4.setUser(parent4);
        parentRepository.save(p4);

        Parent p5 = new Parent();
        p5.setUser(parent5);
        parentRepository.save(p5);
        System.out.println("✅ Sample parents created");

        // Create Students
        User student1 = createUser("Alice Johnson", "student1@epathshala.com", "student123", "STUDENT");
        User student2 = createUser("Bob Smith", "student2@epathshala.com", "student123", "STUDENT");
        User student3 = createUser("Charlie Brown", "student3@epathshala.com", "student123", "STUDENT");
        User student4 = createUser("Diana Wilson", "student4@epathshala.com", "student123", "STUDENT");
        User student5 = createUser("Eva Martinez", "student5@epathshala.com", "student123", "STUDENT");
        User student6 = createUser("Frank Taylor", "student6@epathshala.com", "student123", "STUDENT");
        User student7 = createUser("Grace Chen", "student7@epathshala.com", "student123", "STUDENT");
        User student8 = createUser("Henry Rodriguez", "student8@epathshala.com", "student123", "STUDENT");
        
        userRepository.save(student1);
        userRepository.save(student2);
        userRepository.save(student3);
        userRepository.save(student4);
        userRepository.save(student5);
        userRepository.save(student6);
        userRepository.save(student7);
        userRepository.save(student8);

        Student s1 = new Student();
        s1.setUser(student1);
        s1.setStudentClass("Class 10A");
        s1.setParent(p1);
        studentRepository.save(s1);

        Student s2 = new Student();
        s2.setUser(student2);
        s2.setStudentClass("Class 10B");
        s2.setParent(p2);
        studentRepository.save(s2);

        Student s3 = new Student();
        s3.setUser(student3);
        s3.setStudentClass("Class 9A");
        s3.setParent(p3);
        studentRepository.save(s3);

        Student s4 = new Student();
        s4.setUser(student4);
        s4.setStudentClass("Class 10A");
        s4.setParent(p4);
        studentRepository.save(s4);

        Student s5 = new Student();
        s5.setUser(student5);
        s5.setStudentClass("Class 10B");
        s5.setParent(p5);
        studentRepository.save(s5);

        Student s6 = new Student();
        s6.setUser(student6);
        s6.setStudentClass("Class 11A");
        s6.setParent(p1);
        studentRepository.save(s6);

        Student s7 = new Student();
        s7.setUser(student7);
        s7.setStudentClass("Class 9A");
        s7.setParent(p2);
        studentRepository.save(s7);

        Student s8 = new Student();
        s8.setUser(student8);
        s8.setStudentClass("Class 11A");
        s8.setParent(p3);
        studentRepository.save(s8);
        studentRepository.save(s3);
        System.out.println("✅ Sample students created");

        // Create Sample Data for all students
        createSampleDataForStudent(s1, t1, "Class 10A");
        createSampleDataForStudent(s2, t2, "Class 10B");
        createSampleDataForStudent(s3, t3, "Class 9A");
        createSampleDataForStudent(s4, t1, "Class 10A");
        createSampleDataForStudent(s5, t2, "Class 10B");
        createSampleDataForStudent(s6, t5, "Class 11A");
        createSampleDataForStudent(s7, t3, "Class 9A");
        createSampleDataForStudent(s8, t5, "Class 11A");
        
        // Create additional assignments
        createAdditionalAssignments(t1, t2, t3, t4, t5);
        
        // Create leave requests
        createSampleLeaveRequests(s1, s2, s3, s4, s5, t1, t2, t3);
        
        // Create sample calendar events
        createSampleCalendarEvents();
        
        // Create sample forum data
        createSampleForumData();
        
        // Create sample chat rooms
        createSampleChatRooms();
        
        // Create sample notifications
        createSampleNotifications();
        
        log.info("✅ Sample data initialization completed successfully!");
    }
    
    private void createSampleForumData() {
        log.info("📝 Creating sample forum data...");
        
        // Create forum categories
        ForumCategory generalCategory = new ForumCategory();
        generalCategory.setName("General Discussion");
        generalCategory.setDescription("General topics and discussions");
        generalCategory.setColor("#2196F3");
        generalCategory.setIcon("forum");
        generalCategory.setIsActive(true);
        forumCategoryRepository.save(generalCategory);
        
        ForumCategory academicCategory = new ForumCategory();
        academicCategory.setName("Academic Support");
        academicCategory.setDescription("Academic questions and support");
        academicCategory.setColor("#4CAF50");
        academicCategory.setIcon("school");
        academicCategory.setIsActive(true);
        forumCategoryRepository.save(academicCategory);
        
        ForumCategory techCategory = new ForumCategory();
        techCategory.setName("Technology");
        techCategory.setDescription("Technology and programming discussions");
        techCategory.setColor("#FF9800");
        techCategory.setIcon("computer");
        techCategory.setIsActive(true);
        forumCategoryRepository.save(techCategory);
        
        ForumCategory sportsCategory = new ForumCategory();
        sportsCategory.setName("Sports & Activities");
        sportsCategory.setDescription("Sports, extracurricular activities, and events");
        sportsCategory.setColor("#E91E63");
        sportsCategory.setIcon("sports_soccer");
        sportsCategory.setIsActive(true);
        forumCategoryRepository.save(sportsCategory);
        
        ForumCategory careerCategory = new ForumCategory();
        careerCategory.setName("Career Guidance");
        careerCategory.setDescription("Career advice, college applications, and future planning");
        careerCategory.setColor("#9C27B0");
        careerCategory.setIcon("work");
        careerCategory.setIsActive(true);
        forumCategoryRepository.save(careerCategory);
        
        // Create sample threads
        User admin = userRepository.findByEmail("admin@epathshala.com").orElse(null);
        User teacher1 = userRepository.findByEmail("teacher1@epathshala.com").orElse(null);
        User student1 = userRepository.findByEmail("student1@epathshala.com").orElse(null);
        
        if (admin != null && teacher1 != null && student1 != null) {
            // Thread 1
            ForumThread thread1 = new ForumThread();
            thread1.setTitle("Welcome to ePathshala Forum!");
            thread1.setContent("Welcome everyone to our new forum! Feel free to start discussions and ask questions.");
            thread1.setAuthorName(admin.getName());
            thread1.setAuthor(admin);
            thread1.setCategory(generalCategory);
            thread1.setIsPinned(true);
            thread1.setIsLocked(false);
            thread1.setViewCount(150);
            thread1.setReplyCount(3);
            forumThreadRepository.save(thread1);
            
            // Thread 2
            ForumThread thread2 = new ForumThread();
            thread2.setTitle("Mathematics Help Needed");
            thread2.setContent("I'm having trouble with calculus. Can anyone help me understand derivatives?");
            thread2.setAuthorName(student1.getName());
            thread2.setAuthor(student1);
            thread2.setCategory(academicCategory);
            thread2.setIsPinned(false);
            thread2.setIsLocked(false);
            thread2.setViewCount(75);
            thread2.setReplyCount(2);
            forumThreadRepository.save(thread2);
            
            // Thread 3
            ForumThread thread3 = new ForumThread();
            thread3.setTitle("Best Programming Languages for Beginners");
            thread3.setContent("What programming language would you recommend for someone just starting to learn coding?");
            thread3.setAuthorName(teacher1.getName());
            thread3.setAuthor(teacher1);
            thread3.setCategory(techCategory);
            thread3.setIsPinned(false);
            thread3.setIsLocked(false);
            thread3.setViewCount(120);
            thread3.setReplyCount(4);
            forumThreadRepository.save(thread3);
            
            // Thread 4 - Sports
            ForumThread thread4 = new ForumThread();
            thread4.setTitle("Annual Sports Day Registration");
            thread4.setContent("Registration for annual sports day is now open! Events include athletics, football, basketball, and more.");
            thread4.setAuthorName(admin.getName());
            thread4.setAuthor(admin);
            thread4.setCategory(sportsCategory);
            thread4.setIsPinned(true);
            thread4.setIsLocked(false);
            thread4.setViewCount(200);
            thread4.setReplyCount(5);
            forumThreadRepository.save(thread4);
            
            // Thread 5 - Career
            ForumThread thread5 = new ForumThread();
            thread5.setTitle("Engineering vs Medical - Career Advice");
            thread5.setContent("I'm confused between choosing engineering or medical as my career path. Can anyone share their experiences?");
            thread5.setAuthorName(student1.getName());
            thread5.setAuthor(student1);
            thread5.setCategory(careerCategory);
            thread5.setIsPinned(false);
            thread5.setIsLocked(false);
            thread5.setViewCount(180);
            thread5.setReplyCount(6);
            forumThreadRepository.save(thread5);
            
            // Thread 6 - Academic
            ForumThread thread6 = new ForumThread();
            thread6.setTitle("Study Tips for Board Exams");
            thread6.setContent("Board exams are approaching. What are your best study strategies and tips for preparation?");
            thread6.setAuthorName(teacher1.getName());
            thread6.setAuthor(teacher1);
            thread6.setCategory(academicCategory);
            thread6.setIsPinned(false);
            thread6.setIsLocked(false);
            thread6.setViewCount(300);
            thread6.setReplyCount(8);
            forumThreadRepository.save(thread6);
            
            // Create sample replies
            createSampleReplies(thread1, admin, teacher1, student1);
            createSampleReplies(thread2, teacher1, admin, student1);
            createSampleReplies(thread3, student1, teacher1, admin);
            createSampleReplies(thread4, admin, teacher1, student1);
            createSampleReplies(thread5, teacher1, admin, student1);
            createSampleReplies(thread6, student1, teacher1, admin);
        }
    }
    
    private void createSampleReplies(ForumThread thread, User... users) {
        String[] replies = {
            "Great thread! Thanks for sharing.",
            "I agree with your points. Very helpful discussion.",
            "This is exactly what I was looking for. Thanks!",
            "Interesting perspective. I have a different view on this.",
            "Thanks for the detailed explanation. It really helped me understand."
        };
        
        for (int i = 0; i < Math.min(users.length, replies.length); i++) {
            ForumReply reply = new ForumReply();
            reply.setContent(replies[i]);
            reply.setAuthorName(users[i].getName());
            reply.setAuthor(users[i]);
            reply.setThread(thread);
            reply.setReplyNumber(i + 1);
            forumReplyRepository.save(reply);
        }
    }
    
    private void createSampleChatRooms() {
        log.info("💬 Creating sample chat rooms...");
        
        // General chat room
        ChatRoom generalChat = new ChatRoom();
        generalChat.setName("General Chat");
        generalChat.setDescription("General discussion and casual chat");
        generalChat.setCategory("General");
        generalChat.setIsActive(true);
        generalChat.setIsPrivate(false);
        generalChat.setMaxUsers(100);
        generalChat.setCurrentUsers(5);
        chatRoomRepository.save(generalChat);
        
        // Academic support chat room
        ChatRoom academicChat = new ChatRoom();
        academicChat.setName("Academic Support");
        academicChat.setDescription("Get help with academic questions");
        academicChat.setCategory("Academic");
        academicChat.setIsActive(true);
        academicChat.setIsPrivate(false);
        academicChat.setMaxUsers(50);
        academicChat.setCurrentUsers(3);
        chatRoomRepository.save(academicChat);
        
        // Technology chat room
        ChatRoom techChat = new ChatRoom();
        techChat.setName("Technology Discussion");
        techChat.setDescription("Discuss technology, programming, and tech news");
        techChat.setCategory("Technology");
        techChat.setIsActive(true);
        techChat.setIsPrivate(false);
        techChat.setMaxUsers(75);
        techChat.setCurrentUsers(2);
        chatRoomRepository.save(techChat);
        
        // Create sample chat messages
        User admin = userRepository.findByEmail("admin@epathshala.com").orElse(null);
        User teacher1 = userRepository.findByEmail("teacher1@epathshala.com").orElse(null);
        User student1 = userRepository.findByEmail("student1@epathshala.com").orElse(null);
        
        if (admin != null && teacher1 != null && student1 != null) {
            createSampleChatMessages(generalChat, admin, teacher1, student1);
            createSampleChatMessages(academicChat, teacher1, student1, admin);
            createSampleChatMessages(techChat, student1, admin, teacher1);
        }
    }
    
    private void createSampleChatMessages(ChatRoom chatRoom, User... users) {
        String[] messages = {
            "Hello everyone! Welcome to the chat room.",
            "Hi! Great to be here. How is everyone doing?",
            "I'm doing well, thanks for asking!",
            "This is a great platform for discussions.",
            "I agree! The forum and chat features are really useful."
        };
        
        for (int i = 0; i < Math.min(users.length, messages.length); i++) {
            ChatMessage message = new ChatMessage();
            message.setMessage(messages[i]);
            message.setAuthorName(users[i].getName());
            message.setAuthor(users[i]);
            message.setChatRoom(chatRoom);
            message.setMessageType("TEXT");
            message.setIsUserMessage(true);
            message.setSessionId("sample-session-" + chatRoom.getId());
            message.setResponse("Sample response for: " + messages[i]);
            message.setUserRole(users[i].getRole());
            message.setUserEmail(users[i].getEmail());
            message.setTimestamp(LocalDateTime.now().minusMinutes(i));
            chatMessageRepository.save(message);
        }
    }
    
    private void createSampleNotifications() {
        log.info("🔔 Creating sample notifications...");
        
        User admin = userRepository.findByEmail("admin@epathshala.com").orElse(null);
        User teacher1 = userRepository.findByEmail("teacher1@epathshala.com").orElse(null);
        User student1 = userRepository.findByEmail("student1@epathshala.com").orElse(null);
        
        if (admin != null && teacher1 != null && student1 != null) {
            // Global announcement
            Notification announcement = new Notification();
            announcement.setTitle("Welcome to ePathshala!");
            announcement.setContent("Welcome to our new learning platform. We hope you enjoy the forum and chat features!");
            announcement.setType("ANNOUNCEMENT");
            announcement.setPriority("HIGH");
            announcement.setSender(admin);
            announcement.setIsRead(false);
            announcement.setIsGlobal(true);
            announcement.setTargetRole("ALL");
            announcement.setExpiresAt(LocalDateTime.now().plusDays(30));
            announcement.setActionUrl("/announcements");
            announcement.setActionText("View Announcement");
            notificationRepository.save(announcement);
            
            // Forum notification
            Notification forumNotification = new Notification();
            forumNotification.setTitle("New Forum Thread");
            forumNotification.setContent("A new thread 'Mathematics Help Needed' has been created in Academic Support");
            forumNotification.setType("FORUM_THREAD");
            forumNotification.setPriority("MEDIUM");
            forumNotification.setSender(student1);
            forumNotification.setRecipient(teacher1);
            forumNotification.setIsRead(false);
            forumNotification.setIsGlobal(false);
            forumNotification.setTargetRole("TEACHER");
            forumNotification.setExpiresAt(LocalDateTime.now().plusDays(7));
            forumNotification.setActionUrl("/forum/thread/2");
            forumNotification.setActionText("View Thread");
            notificationRepository.save(forumNotification);
            
            // Chat mention notification
            Notification chatNotification = new Notification();
            chatNotification.setTitle("You were mentioned in chat");
            chatNotification.setContent("admin mentioned you in General Chat: @teacher1 can you help with this?");
            chatNotification.setType("CHAT_MENTION");
            chatNotification.setPriority("MEDIUM");
            chatNotification.setSender(admin);
            chatNotification.setRecipient(teacher1);
            chatNotification.setIsRead(false);
            chatNotification.setIsGlobal(false);
            chatNotification.setTargetRole("ALL");
            chatNotification.setExpiresAt(LocalDateTime.now().plusDays(7));
            chatNotification.setActionUrl("/chat/room/1");
            chatNotification.setActionText("View Chat");
            notificationRepository.save(chatNotification);
        }
    }

    private User createUser(String name, String email, String password, String role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return user;
    }

    @Transactional
    private void createSampleDataForStudent(Student student, Teacher teacher, String className) {
        System.out.println("📊 Creating sample data for " + student.getUser().getName() + " (" + className + ")");
        
        // Create sample attendance records
        for (int i = 0; i < 5; i++) {
            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setDate(LocalDate.now().minusDays(i));
            attendance.setStatus(i % 2 == 0 ? "Present" : "Absent");
            attendance.setMarkedBy(teacher);
            attendanceRepository.save(attendance);
        }
        
        // Create sample grades
        String[] subjects = {"Mathematics", "Science", "English"};
        for (String subject : subjects) {
            Grade grade = new Grade();
            grade.setStudent(student);
            grade.setSubject(subject);
            grade.setMarks(85.0 + Math.random() * 15.0);
            grade.setTeacher(teacher);
            gradeRepository.save(grade);
        }
        
        // Create sample assignments
        String[] assignmentTitles = {"Math Homework", "Science Project", "English Essay"};
        String[] fileUrls = {
            "/api/files/assignments/1753983287395_database.pdf",
            "/api/files/assignments/1754043875194_database.pdf", 
            "/api/files/assignments/1753983287395_database.pdf"
        };
        for (int i = 0; i < assignmentTitles.length; i++) {
            Assignment assignment = new Assignment();
            assignment.setTitle(assignmentTitles[i]);
            assignment.setSubject(subjects[i]);
            assignment.setClassName(className);
            assignment.setDueDate(LocalDate.now().plusDays(7));
            assignment.setFileUrl(fileUrls[i]);
            assignment.setTeacher(teacher);
            assignmentRepository.save(assignment);
        }
        
        // Create sample leave requests
        String[] reasons = {"Medical appointment", "Family function", "Personal emergency"};
        for (int i = 0; i < reasons.length; i++) {
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setStudent(student);
            leaveRequest.setReason(reasons[i]);
            leaveRequest.setFromDate(LocalDate.now().plusDays(i + 1));
            leaveRequest.setToDate(LocalDate.now().plusDays(i + 2));
            leaveRequest.setTeacherApproval("Pending");
            leaveRequest.setParentApproval("Pending");
            leaveRequest.setStatus("Pending");
            leaveRequestRepository.save(leaveRequest);
        }
        
        System.out.println("✅ Sample data created for " + student.getUser().getName());
    }

    private void createSampleCalendarEvents() {
        System.out.println("📅 Creating sample calendar events...");
        
        String[] eventNames = {
            "Annual Sports Day",
            "Parent-Teacher Meeting",
            "Science Exhibition",
            "Annual Day Celebration",
            "Mid-Term Examinations",
            "Republic Day Celebration",
            "Independence Day Celebration",
            "Teachers' Day",
            "Children's Day",
            "Christmas Celebration"
        };
        
        String[] descriptions = {
            "Annual sports competition for all students",
            "Meeting between parents and teachers to discuss student progress",
            "Students showcase their science projects",
            "Annual cultural and academic celebration",
            "Mid-term examinations for all classes",
            "Republic Day celebration with cultural programs",
            "Independence Day celebration with flag hoisting",
            "Teachers' Day celebration by students",
            "Children's Day celebration with fun activities",
            "Christmas celebration with carols and gifts"
        };
        
        for (int i = 0; i < eventNames.length; i++) {
            AcademicCalendar event = new AcademicCalendar();
            event.setEventName(eventNames[i]);
            event.setDescription(descriptions[i]);
            event.setDate(LocalDate.now().plusDays(i * 15)); // Spread events over time
            academicCalendarRepository.save(event);
        }
        
        System.out.println("✅ Sample calendar events created!");
    }

    @Transactional
    private void createAdditionalAssignments(Teacher t1, Teacher t2, Teacher t3, Teacher t4, Teacher t5) {
        System.out.println("📚 Creating additional assignments...");
        
        // Mathematics assignments
        String[] mathAssignments = {"Calculus Problem Set", "Algebra Quiz", "Geometry Project", "Statistics Assignment"};
        for (String title : mathAssignments) {
            Assignment assignment = new Assignment();
            assignment.setTitle(title);
            assignment.setSubject("Mathematics");
            assignment.setClassName("Class 10A");
            assignment.setDueDate(LocalDate.now().plusDays(5 + (int)(Math.random() * 10)));
            assignment.setFileUrl("/api/files/assignments/math_assignment.pdf");
            assignment.setTeacher(t1);
            assignmentRepository.save(assignment);
        }
        
        // Science assignments
        String[] scienceAssignments = {"Physics Lab Report", "Chemistry Experiment", "Biology Research", "Environmental Science Project"};
        for (String title : scienceAssignments) {
            Assignment assignment = new Assignment();
            assignment.setTitle(title);
            assignment.setSubject("Science");
            assignment.setClassName("Class 10B");
            assignment.setDueDate(LocalDate.now().plusDays(5 + (int)(Math.random() * 10)));
            assignment.setFileUrl("/api/files/assignments/science_assignment.pdf");
            assignment.setTeacher(t2);
            assignmentRepository.save(assignment);
        }
        
        // English assignments
        String[] englishAssignments = {"Shakespeare Analysis", "Creative Writing", "Grammar Test", "Literature Review"};
        for (String title : englishAssignments) {
            Assignment assignment = new Assignment();
            assignment.setTitle(title);
            assignment.setSubject("English");
            assignment.setClassName("Class 9A");
            assignment.setDueDate(LocalDate.now().plusDays(5 + (int)(Math.random() * 10)));
            assignment.setFileUrl("/api/files/assignments/english_assignment.pdf");
            assignment.setTeacher(t3);
            assignmentRepository.save(assignment);
        }
        
        // History assignments
        String[] historyAssignments = {"World War II Research", "Ancient Civilizations", "Indian Independence Movement", "Modern History Essay"};
        for (String title : historyAssignments) {
            Assignment assignment = new Assignment();
            assignment.setTitle(title);
            assignment.setSubject("History");
            assignment.setClassName("Class 10A");
            assignment.setDueDate(LocalDate.now().plusDays(5 + (int)(Math.random() * 10)));
            assignment.setFileUrl("/api/files/assignments/history_assignment.pdf");
            assignment.setTeacher(t4);
            assignmentRepository.save(assignment);
        }
        
        // Computer Science assignments
        String[] csAssignments = {"Java Programming", "Database Design", "Web Development", "Algorithm Analysis"};
        for (String title : csAssignments) {
            Assignment assignment = new Assignment();
            assignment.setTitle(title);
            assignment.setSubject("Computer Science");
            assignment.setClassName("Class 11A");
            assignment.setDueDate(LocalDate.now().plusDays(5 + (int)(Math.random() * 10)));
            assignment.setFileUrl("/api/files/assignments/cs_assignment.pdf");
            assignment.setTeacher(t5);
            assignmentRepository.save(assignment);
        }
        
        System.out.println("✅ Additional assignments created!");
    }

    @Transactional
    private void createSampleLeaveRequests(Student s1, Student s2, Student s3, Student s4, Student s5, Teacher t1, Teacher t2, Teacher t3) {
        System.out.println("📋 Creating sample leave requests...");
        
        Student[] students = {s1, s2, s3, s4, s5};
        String[] reasons = {
            "Medical appointment with doctor",
            "Family wedding ceremony",
            "Personal emergency",
            "Sports competition",
            "Religious ceremony",
            "Dental checkup",
            "Family vacation",
            "Academic competition",
            "Health checkup",
            "Family function"
        };
        
        String[] statuses = {"Pending", "Approved", "Rejected", "Pending"};
        
        for (Student student : students) {
            for (int i = 0; i < 3; i++) {
                LeaveRequest leaveRequest = new LeaveRequest();
                leaveRequest.setStudent(student);
                leaveRequest.setReason(reasons[(int)(Math.random() * reasons.length)]);
                leaveRequest.setFromDate(LocalDate.now().plusDays((int)(Math.random() * 30)));
                leaveRequest.setToDate(LocalDate.now().plusDays((int)(Math.random() * 30) + 1));
                leaveRequest.setTeacherApproval(statuses[(int)(Math.random() * statuses.length)]);
                leaveRequest.setParentApproval(statuses[(int)(Math.random() * statuses.length)]);
                leaveRequest.setStatus(statuses[(int)(Math.random() * statuses.length)]);
                leaveRequestRepository.save(leaveRequest);
            }
        }
        
        System.out.println("✅ Sample leave requests created!");
    }
} 