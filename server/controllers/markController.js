const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Class = require('../models/Class');

//Add marks for a student
exports.addMarks = async (req, res, next) =>{
    try{
        const { studentId, classId, subject, examType, marksObatined, maxMarks, reamrks } = req.body;

        //validate student exists
        const student = await Student.findById(studentId);
        if(!student){
            return res.status(404).json({ success:false, message: 'Student not found'});
        }
        
        //validate class exists
        const classExists = await Class.findById(classId);
        if(!classExists){
            return res.status(404).json({ success:false, message: 'Class not found'});
        }

        //Caluculate grade (simple example)
        const percentage = (marksObatined / maxMarks)*100;
        let grade;
        if (percentage >= 90) grade = 'A';
        else if (percentage >=80) grade = 'B';
        else if (percentage >=70) grade = 'C';
        else if (percentage >=60) grade = 'D';
        else grade = 'F';


        const newmark = await Mark.create({
            student: studentId,
            class: classId,
            subject,
            examType,
            marksObatined,
            maxMarks,
            grade,
            reamrks
        });

        res.status(201).json({
            success: true,
            data: newmark
        });
    }catch(err){
        next(err);
    }
};

//Get all marks for a student
exports.getStudentMarks = async (req, res, next) =>{
    try{
        const { studentId } = req.params;

        const marks = await Mark.find({ student: studentId})
        .populate('class', 'classname academicYear')
        .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: marks.length,
            data: marks
        });
    }catch(err){
        next(err);
    }
    };