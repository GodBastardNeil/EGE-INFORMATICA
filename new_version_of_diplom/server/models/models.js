const sequelize = require('../database');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
var fs = require('fs');

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
}, {freezeTableName: true});

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false, unique: true},
    FIO: {type: DataTypes.STRING},
    school: {type: DataTypes.STRING},
}, {
    hooks:
    {
        afterCreate: function(user, options)
        {
            Role.findByPk(user.roleId).then(role => {
                if (role.dataValues.name === 'student')
                {
                    Student.create({'id': user.id});
                } else if (role.dataValues.name === 'teacher') { Teacher.create({'id': user.id}); }
            });
        }
    },
    freezeTableName: true
});
Role.hasMany(User, {
    foreignKey: 'roleId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
User.belongsTo(Role, { foreignKey: 'roleId' });

const Student = sequelize.define('student', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    test_score: {type: DataTypes.INTEGER, defaultValue: 0},
    notest_score: {type: DataTypes.INTEGER, defaultValue: 0},
    max_percent: {type: DataTypes.INTEGER, defaultValue: 0},
    min_percent: {type: DataTypes.INTEGER, defaultValue: 0},
    middle_percent: {type: DataTypes.INTEGER, defaultValue: 0}
}, {
    hooks:
    {
        afterCreate: function(user, options)
        {
            Topic.findAll().then(topic => {
                topic.forEach(top => {
                    Stat.create({'studentId': user.dataValues.id, 'topicId': top.dataValues.id, 'active': top.dataValues.active});
                })
            });
        }
    },
    freezeTableName: true
});
User.hasOne(Student, {
    foreignKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Student.belongsTo(User, { foreignKey: 'id' });

const Teacher = sequelize.define('teacher', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    student_in_request: {type: DataTypes.INTEGER, defaultValue: 0},
    student_score: {type: DataTypes.INTEGER, defaultValue: 0},
    created_test_score: {type: DataTypes.INTEGER, defaultValue: 0},
    uncreated_test_score: {type: DataTypes.INTEGER, defaultValue: 0}
}, {freezeTableName: true});
User.hasOne(Teacher, {
    foreignKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Teacher.belongsTo(User, { foreignKey: 'id' });

const Class = sequelize.define('class', {
    active: {type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    hooks:
    {
        afterCreate: function(cl, options)
        {
            Teacher.increment(
                'student_in_request',
                { by: 1, where: { 'id': cl.dataValues.teacherId } }
            );
        },
        afterUpdate: function(cl, options)
        {
            if (cl.dataValues.active != cl._previousDataValues.active)
            {
                if (cl.dataValues.active)
                {
                    Teacher.increment(
                        { 'student_score': 1, 'student_in_request': -1 },
                        { where: { 'id': cl.dataValues.teacherId } }
                    );
                } else (!cl.dataValues.active)
                {
                    Teacher.increment(
                        { 'student_score': -1, 'student_in_request': 1 },
                        { where: { 'id': cl.dataValues.teacherId } }
                    );
                }
            }
        },
        afterDestroy: function(cl, options)
        {
            if (cl.dataValues.active)
            {
                Teacher.increment(
                    'student_score',
                    { by: -1, where: { 'id': cl.dataValues.teacherId } }
                );
            } else (!cl.dataValues.active)
            {
                Teacher.increment(
                    'student_in_request',
                    { by: -1, where: { 'id': cl.dataValues.teacherId } }
                );
            }
        },
    },
    freezeTableName: true
});
/*
Student.belongsToMany(Teacher, {through: Class});
Teacher.belongsToMany(Student, {through: Class});
*/

Student.hasMany(Class);
Class.belongsTo(Student);
Teacher.hasMany(Class);
Class.belongsTo(Teacher);


const Topic = sequelize.define('topic', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    active:
    {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    hooks:
    {
        afterCreate: function(topic, options)
        {
            Student.findAll().then(student => {
                student.forEach(st => {
                    Stat.create({'studentId': st.dataValues.id, 'topicId': topic.dataValues.id, 'active': topic.dataValues.active});
                });
            });
            /*fs.open(`../controllers/exersize_tmp/theory/${topic.dataValues.id}.docx`, 'w', (err) => {
                if(err) { throw err; }
                console.log('File created');
            });*/
        },
        afterUpdate: function(topic, options)
        {
            console.log('topic afterUpdate', topic.dataValues.active, topic._previousDataValues.active);
            if (topic.dataValues.active != topic._previousDataValues.active)
            {
                Stat.update(
                    { 'active': false },
                    { where: { 'topicId': topic.dataValues.id } }
                );
            }
        }
    },
    freezeTableName: true
});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    active:
    {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    hooks:
    {
        afterUpdate: function(type, options)
        {
            console.log('type afterUpdate', type.dataValues.active, type._previousDataValues.active);
            if (type.dataValues.active != type._previousDataValues.active)
            {
                if (type.dataValues.active)
                {
                    Topic.update(
                        { 'active': true },
                        {
                            where: {'id': type.dataValues.topicId},
                            individualHooks: true
                        }
                    );
                } else if (!type.dataValues.active)
                {
                    Type.count({where: {'id': type.dataValues.topicId}}).then(count1 => {
                        Type.count({where: {'id': type.dataValues.topicId, 'active': false}}).then(count2 => {
                            console.log('count', count1, count2)
                            if (count1 == count2)
                            {
                                Topic.update(
                                    { 'active': false },
                                    {
                                        where: {'id': type.dataValues.topicId},
                                        individualHooks: true
                                    }
                                );
                            }
                        });
                    });
                }
            }
        }
    },
    freezeTableName: true
});
Topic.hasMany(Type, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Type.belongsTo(Topic);

const Template = sequelize.define('template', {
    id:   {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT, allowNull: false},
    ans:  {type: DataTypes.TEXT, allowNull: false},
    rand: {type: DataTypes.ARRAY(DataTypes.JSON), defaultValue: [], allowNull: false},
    word: {type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [], allowNull: false},

    masRL: {type: DataTypes.ARRAY(DataTypes.JSON), defaultValue: [], allowNull: false},
    logFT: {type: DataTypes.ARRAY(DataTypes.JSON), defaultValue: [], allowNull: false},
    docFN: {type: DataTypes.ARRAY(DataTypes.JSON), defaultValue: [], allowNull: false},

    comp: {type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [], allowNull: false},
    code: {type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [], allowNull: false},
    active: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
}, {
    validate:
    {
        temp_activation()
        {
            if (this.dataValues.active)
            {
                let err = new Error('Не может быть активирована, потому что теги не доделаны');

                if ((this.dataValues.rand == []) && (this.dataValues.comp == []) &&
                    (this.dataValues.code == []) && (this.dataValues.word == []) &&
                    (this.dataValues.masRL == []) && (this.dataValues.logFT == []) &&
                    (this.dataValues.docFN == []))
                {
                    throw err;
                }

                this.dataValues.rand.forEach(r =>
                {
                    if (r['min'] == '' || r['max'] == '') { throw err; }
                });
                this.dataValues.comp.forEach(c => { if (c == '') { throw err; } });
                this.dataValues.code.forEach(c => { if (c == '') { throw err; } });

                this.dataValues.word.forEach(w => { if (w == '') { throw err; } });
                this.dataValues.masRL.forEach(rm =>
                {
                    let n = rm['mas'].split(',').length;

                    if (rm['mas'] == '' || n < 2) { throw err; }
                    rm['length'].split(',').forEach(l =>
                    {
                        if (n < l) { throw err; }
                    });
                });
                this.dataValues.logFT.forEach(ft =>
                {
                    if (ft['show'] == '' || ft['all'] == '' || ft['hidden'] == '') { throw err; }
                });
                this.dataValues.docFN.forEach(fn =>
                {
                    if (fn['file'] == '' || fn['name'] == '' ||
                        fn['file'].split(',').length != fn['name'].split(',').length) { throw err; }
                });
            }
        }
    },
    hooks:
    {
        afterCreate: function(template, options)
        {
            if (template.dataValues.active)
            {
                Type.update(
                    { 'active': true },
                    {
                        where: {'id': template.dataValues.typeId},
                        individualHooks: true
                    }
                );
            }
        },
        afterUpdate: function(template, options)
        {
            console.log('template afterUpdate', template.dataValues.active, template._previousDataValues.active);
            if (template.dataValues.active != template._previousDataValues.active)
            {
                if (template.dataValues.active)
                {
                    Type.update(
                        { 'active': true },
                        {
                            where: {'id': template.dataValues.typeId},
                            individualHooks: true
                        }
                    );
                } else if (!template.dataValues.active) 
                {
                    Template.count({where: {'typeId': template.dataValues.typeId}}).then(count1 => {
                        Template.count({where: {'typeId': template.dataValues.typeId, 'active': false}}).then(count2 => {
                            if (count1 == count2)
                            {
                                Type.update(
                                    { 'active': false },
                                    {
                                        where: {'id': template.dataValues.typeId},
                                        individualHooks: true
                                    }
                                );
                            }
                        });
                    });
                }
            }
        }
    },
    freezeTableName: true
});
Type.hasMany(Template, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Template.belongsTo(Type);

const Task = sequelize.define('task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    right_answer: {type: DataTypes.STRING},
    text: {type: DataTypes.TEXT},
    max_score: {type: DataTypes.INTEGER, defaultValue: 1}
}, {freezeTableName: true});
Template.hasMany(Task, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Task.belongsTo(Template);


const Test = sequelize.define('test', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    task_score: {type: DataTypes.INTEGER, defaultValue: 0},
    max_score: {type: DataTypes.INTEGER, defaultValue: 0},
    active: {type: DataTypes.BOOLEAN, defaultValue: false},
    variant: {type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    hooks:
    {
        afterCreate: function(test, options)
        {
            /*
            User.findByPk(test.userId).then(user => {
                if (user.dataValues.roleId === 3)
                {
                    if (test.dataValues.active)
                    {
                        Teacher.increment(
                            'created_test_score',
                            {by: 1, where: { 'id': test.dataValues.userId } }
                        );
                    } else
                    {
                        Teacher.increment(
                            'uncreated_test_score',
                            {by: 1, where: { 'id': test.dataValues.userId } }
                        );
                    }
                }
            });
            */
        }/*,
        afterUpdate: function(test, options)
        {
            if (test.dataValues.active != test._previousDataValues.active)
            {
                User.findByPk(test.userId).then(user => {
                    if (user.dataValues.roleId === 3)
                    {
                            if (test.dataValues.active)
                            {
                                Teacher.increment(
                                    { 'uncreated_test_score': -1, 'created_test_score': 1 },
                                    { where: { 'id': test.dataValues.userId } }
                                );
                            }
                    }
                });
            }
        }*/
    },
    freezeTableName: true
});
User.hasMany(Test); // ON UPDATE CASCADE ON DELETE SET NULL
Test.belongsTo(User);

const Task_List = sequelize.define('task_list', {
}, {
    hooks:
    {
        afterCreate: function(list, options)
        {
            Task.findByPk(list.dataValues.taskId).then(task => {
                Test.increment(
                    { 'max_score': task.max_score }, // суммировать
                    { where: { 'id': list.dataValues.testId } }
                );
            })
        }
    },
    freezeTableName: true
});
/*
Task.belongsToMany(Test, {through: Task_List});
Test.belongsToMany(Task, {through: Task_List});
*/

Task.hasMany(Task_List);
Task_List.belongsTo(Task);
Test.hasMany(Task_List);
Task_List.belongsTo(Test);

const Test_List = sequelize.define('test_list', {
    scores: {type: DataTypes.ARRAY(DataTypes.INTEGER)},
    dates: {type: DataTypes.ARRAY(DataTypes.DATE)},
    answers: {type: DataTypes.ARRAY(DataTypes.JSON)}
    /** answers:
     * [
     *      {
     *          taskId1: {
     *                      answer: ...,
     *                      scores: ...
     *                  },
     *          taskId2: {
     *                      answer: ...,
     *                      scores: ...
     *                  },
     *          ...
     *      },
     *      {
     *          taskId1: {
     *                      answer: ...,
     *                      scores: ...
     *                  },
     *          taskId2: {
     *                      answer: ...,
     *                      scores: ...
     *                  },
     *          ...
     *      },
     * ...
     * ]
     */
}, {
    hooks:
    {
        afterCreate: function(test_list, options)
        {
            Student.increment(
                'notest_score',
                {by: 1, where: { 'id': test_list.dataValues.studentId } }
            );
        },
        afterUpdate: function(test_list, options)
        {
            if (test_list.dataValues.scores.length != 0)
            {
                Student.increment(
                    { 'test_score': 1, 'notest_score': -1 },
                    { where: { 'id': test_list.dataValues.studentId } }
                );
            }
/*
            let ans = test_list.dataValues.answers[test_list.dataValues.answers.length-1];
            for (let key in ans)
            {
                Task.findByPk(key).then(task => {
                    Template.findByPk(task.templateId).then(temp => {
                        Type.findByPk(temp.typeId).then(type => {
                            Topic.findByPk(type.topicId).then(topic => {
                                Stat.update(
                                    {
                                        'max_score': sequelize.literal(`max_score + 1`),
                                        'user_score': sequelize.literal(`user_score + ${ans[key].scores}`),
                                        'last_5': sequelize.fn('array_append', sequelize.col('last_5'), ans[key].scores)
                                    },
                                    {
                                        where:
                                        {
                                            'studentId': test_list.dataValues.studentId,
                                            'topicId': topic.dataValues.id
                                        }
                                    }
                                );
                            })
                        })
                    })
                })
            }
*/
        }
    },
    freezeTableName: true
});
Student.hasMany(Test_List);
Test_List.belongsTo(Student);
Test.hasMany(Test_List);
Test_List.belongsTo(Test);

const Stat = sequelize.define('stat', {
    max_score: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    user_score: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    last_5: {type: DataTypes.ARRAY(DataTypes.BOOLEAN)},
    active: {type: DataTypes.BOOLEAN, defaultValue: true}
}, {
    hooks:
    {
        afterUpdate: function(stat, options)
        {
            if (stat.dataValues.last_5.length > 5)
            {
                stat.dataValues.last_5.shift();
                stat.save();
            }
        }
    },
    freezeTableName: true
});
Student.hasMany(Stat);
Stat.belongsTo(Student);
Topic.hasMany(Stat);
Stat.belongsTo(Topic);


/* delete
DROP TABLE IF EXISTS public.stat;

DROP TABLE IF EXISTS public.test_list;
DROP TABLE IF EXISTS public.task_list;
DROP TABLE IF EXISTS public.task;
DROP TABLE IF EXISTS public.test;

DROP TABLE IF EXISTS public.template;
DROP TABLE IF EXISTS public.type;
DROP TABLE IF EXISTS public.topic;

DROP TABLE IF EXISTS public.class;
DROP TABLE IF EXISTS public.student;
DROP TABLE IF EXISTS public.teacher;
DROP TABLE IF EXISTS public.user;
DROP TABLE IF EXISTS public.role;
*/
Role.create({id: 1, name: 'admin'});
Role.create({id: 2, name: 'student'});
Role.create({id: 3, name: 'teacher'});


//const hashPassword = bcrypt.hash('admin', 5)
User.create({id: 10, login: 'admin', email: 'admin', password: '$2a$05$tONhSanTT3pQIDPrCNRsI.H0qY4ROqdGHJRwz4k7dAp/MbzXO46hy', FIO: 'admin', school: 'admin', roleId: 1});



Topic.create({id: 2,  theory: '',                active: false, title: 'Построение таблиц истинности логических выражений'});
Topic.create({id: 8,  theory: 'задание_8.html',  active: false, title: 'Перебор слов и системы счисления'});
Topic.create({id: 11, theory: 'задание_11.html', active: false, title: 'Вычисление количества информации'});

Topic.create({id: 6,  theory: '',                active: false, title: 'Анализ программ'});
Topic.create({id: 10, theory: '',                active: false, title: 'Поиск символов в текстовом редакторе просмотреть'});

Topic.create({id: 4,  theory: '',                active: false, title: 'Кодирование и декодирование информации'});
Topic.create({id: 7,  theory: '',                active: false, title: 'Кодирование и декодирование информации. Передача информации'});
Topic.create({id: 12, theory: '',                active: false, title: 'Выполнение алгоритмов для исполнителей'});
Topic.create({id: 13, theory: '',                active: false, title: 'Поиск путей в графе'});
Topic.create({id: 15, theory: '',                active: false, title: 'Преобразование логических выражений'});
Topic.create({id: 16, theory: '',                active: false, title: 'Рекурсивные алгоритмы'});
Topic.create({id: 23, theory: '',                active: false, title: 'Оператор присваивания и ветвления. Перебор вариантов, построение дерева'});
Topic.create({id: 25, theory: '',                active: false, title: 'Обработка целочисленной информации'});

Type.create({id: 1,  topicId: 2,  active: false, title: 'Монотонные функции'});
Type.create({id: 2,  topicId: 2,  active: false, title: 'Немонотонные функции'});
Type.create({id: 3,  topicId: 2,  active: false, title: 'Строки с пропущенными значениями'});
Type.create({id: 4,  topicId: 2,  active: false, title: 'Разные задачи'});
Type.create({id: 5,  topicId: 2,  active: false, title: 'Поголовный пересчёт'});

Type.create({id: 6,  topicId: 8,  active: false, title: 'Подсчет количества слов'});
Type.create({id: 7,  topicId: 8,  active: false, title: 'Подсчет количества слов с ограничениями'});
Type.create({id: 8,  topicId: 8,  active: false, title: 'Последовательность лампочек'});
Type.create({id: 9,  topicId: 8,  active: false, title: 'Последовательность сигнальных ракет'});
Type.create({id: 10, topicId: 8,  active: false, title: 'Разное'});
Type.create({id: 11, topicId: 8,  active: false, title: 'Подсчет количества разных последовательностей'});
Type.create({id: 12, topicId: 8,  active: false, title: 'Слова по порядку'});
Type.create({id: 13, topicId: 11, active: false, title: 'Пароли с дополнительными сведениями'});
Type.create({id: 14, topicId: 11, active: false, title: 'Разное'});
Type.create({id: 15, topicId: 11, active: false, title: 'Номера спортсменов'});
Type.create({id: 16, topicId: 11, active: false, title: 'Автомобильные номера'});
Type.create({id: 17, topicId: 11, active: false, title: 'Пароли'});

Type.create({id: 18,  topicId: 6,  active: false, title: 'Две линейные функции'});
Type.create({id: 19,  topicId: 6,  active: false, title: 'Сумма двух линейных функций'});
Type.create({id: 20,  topicId: 6,  active: false, title: 'Арифметическая прогрессия'});
Type.create({id: 21,  topicId: 6,  active: false, title: 'Условие выполнения цикла'});

Type.create({id: 22,  topicId: 10,  active: false, title: 'Поиск символов в текстовом редакторе'});

Template.create({id: 1, typeId: 6,
    text: "<p>Некоторый алфавит содержит $rand1$ различных символов. Сколько $rand2$ -буквенных слов можно составить из символов этого алфавита, если символы в слове могут повторяться?</p>",
    ans:
        `let r = Math.pow($rand1$, $rand2$);
        return r`,
    rand:
        [
            {min: '2', max: '6'},
            {min: '2', max: '6'}
        ],
    word: [],
    masRL: [],
    logFT: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 2, typeId: 6,
    text: "<p>Сколько слов длины $rand1$ можно составить из букв Е, Г, Э? Каждая буква может входить в слово несколько раз.</p>",
    ans:
        `let alf = 3;
        let r = Math.pow(alf, $rand1$);
        return r;`,
    logFT: [],
    rand:
        [
            {min: '1', max: '7'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
/*
Template.create({id: 3, typeId: 6,
    text: "<p>Сколько существует различных символьных последовательностей длины от $rand1$ до $rand2$ в четырёхбуквенном алфавите {A, T, Г, Ц}?</p>",
    ans:
        `let alf = 4;
            let r = 0;
            for (let i=$rand1$; i<=$rand2$; ++i)
            {
                r += Math.pow(alf, i);
            }
            return r;`,
    logFT: [],
    rand:
        [
            {min: '1', max: '5'},
            {min: '$rand1', max: '7'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 4, typeId: 11,
    text: "<p>Азбука Морзе позволяет кодировать символы для сообщений по радиосвязи, задавая комбинацию точек и тире. Сколько различных символов (цифр, букв, знаков пунктуации и т. д.) можно закодировать, используя код азбуки Морзе длиной <b>не менее $rand1$ и не более $rand2$</b> сигналов (точек и тире)?</p>",
    ans:
        `let alf = 2;
            let r = 0;
            for (let i=$rand1$; i<=$rand2$; ++i)
            {
                r += Math.pow(alf, i);
            }
            return r;`,
    logFT: [],
    rand:
        [
            {min: '1', max: '5'},
            {min: '$rand1', max: '7'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
*/
Template.create({id: 5, typeId: 11,
    text: "<p>Сколько существует различных последовательностей из символов «плюс» и «минус», длиной ровно в $rand1$ символов?</p>",
    ans:
        `let alf = 2;
            let r = Math.pow(alf, $rand1$);
            return r;`,
    logFT: [],
    rand:
        [
            {min: '1', max: '7'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 6, typeId: 11,
    text: "<p>Для передачи сигналов на флоте используются специальные сигнальные флаги, вывешиваемые в одну линию (последовательность важна). Какое количество различных сигналов может передать корабль при помощи $rand1$ сигнальных флагов, если на корабле имеются флаги $rand2$ различных видов (флагов каждого вида неограниченное количество)?</p>",
    ans:
        `let r = Math.pow($rand1$, $rand2$);
            return r;`,
    logFT: [],
    rand:
        [
            {min: '2', max: '6'},
            {min: '2', max: '6'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 7, typeId: 13,
    text: "<p>При регистрации в компьютерной системе каждому пользователю выдаётся пароль, состоящий из $rand1$ символов и содержащий только символы из 12-символьного набора: А, В, C, D, Е, F, G, H, К, L, M, N. В базе данных для хранения сведений о каждом пользователе отведено одинаковое и минимально возможное целое число байт. При этом используют посимвольное кодирование паролей, все символы кодируют одинаковым и минимально возможным количеством бит. Кроме собственно пароля, для каждого пользователя в системе хранятся дополнительные сведения, для чего отведено $rand2$ байт на одного пользователя.</p>"
        + "<p>Определите объём памяти (в байтах), необходимый для хранения сведений о $rand3$ пользователях. В ответе запишите только целое число — количество байт.</p>",
    ans:
        `let b1 = 4*$rand1$;
            let b2 = Math.ceil(b1/8);
            let b3 = b2+$rand2$;
            let r = b3*$rand3$;
            return r;`,
    logFT: [],
    rand:
        [
            {min: '6', max: '20'},
            {min: '6', max: '20'},
            {min: '20', max: '50'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 8, typeId: 13,
    text: "<p>При регистрации в компьютерной системе каждому пользователю выдаётся пароль, состоящий из $rand1$ символов и содержащий только символы из 7-буквенного набора Н, О, Р, С, Т, У, X. В базе данных для хранения сведений о каждом пользователе отведено одинаковое целое число байт, при этом для хранения сведений о $rand2$ пользователях используется $comp1$ байт. Для каждого пользователя хранятся пароль и дополнительные сведения. Для хранения паролей используют посимвольное кодирование, все символы кодируются одинаковым и минимально возможным количеством бит. Сколько бит отведено для хранения дополнительных сведений о каждом пользователе?</p>",
    ans:
        `let r = ($comp1$/$rand2$) - ((3*$rand1$)/8);
            return r;`,
    logFT: [],
    rand:
        [
            {min: '6', max: '20'},
            {min: '20', max: '100'}
        ],
    word: [],
    masRL: [],
    docFN: [],
    comp:
        [
            `let min = Math.ceil(6);
            let max = Math.floor(20);
            let r = ($rand2$*((3*$rand1$/8) + (Math.floor(Math.random()*(max - min)) + min)));
            return r;`
        ],
    code: [],
    active: true
});


Template.create({id: 9, typeId: 1,
    text:
        `<p>Логическая функция F задаётся выражением:</p>
        <p>$logF1$.</p>
        <p>На рисунке приведён фрагмент таблицы истинности функции F.</p>
        <p>Определите, какому столбцу таблицы истинности функции F соответствует каждая из переменных x, y, z.</p>
        <p>$logT1$.</p>
        <p>В ответе напишите буквы x, y, z в том порядке, в котором идут соответствующие им столбцы (сначала – буква, соответствующая первому столбцу, затем – буква, соответствующая второму столбцу, и т.д.) Буквы в ответе пишите подряд, никаких разделителей между буквами ставить не нужно.</p>
        <p>Пример. Если бы функция была задана выражением ¬x V y, зависящим от двух переменных: x и y, и был приведён фрагмент её таблицы истинности.</p>
        <p>
            <table style="margin:auto">
            <tbody>
                <tr>
                    <th style="text-align:center">Перем. 1</th>
                    <th style="text-align:center">Перем. 2</th>
                    <th style="text-align:center">Перем. 3</th>
                    <th style="text-align:center">Функция</th>
                </tr>
                <tr>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center"><i>F</i></td>
                </tr>
                <tr>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">1</td>
                </tr>
                <tr>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">1</td>
                </tr>
                <tr>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">1</td>
                </tr>
            </tbody>
            </table>
        </p>
        <p>Тогда первому столбцу соответствовала бы переменная y, а второму столбцу — переменная x. В ответе следовало бы написать: yx.</p>`,
    ans:
        `let r = '123';
        let a = [0, 1, 2];
        let table = $logT1$;
        for (let i=0; i<table.length; ++i)
            {
            while (eval('(x, y, z) => { return $logF1$; }')(table[i][a[0]], table[i][a[1]], table[i][a[2]]) != table[i][3])
            {
                let cI = a.length;
                let rI = 0;
                while (cI != 0)
                {
                    rI = Math.floor(Math.random() * cI);
                    cI--;
                    a[cI] = a[rI] + (a[rI]=a[cI], 0);
                }
            }
        }
        r = r.replace(a[0]+1, 'x');
        r = r.replace(a[1]+1, 'y');
        r = r.replace(a[2]+1, 'z');
        return r;`,
    logFT:
        [
            {show: 'true', all: 'false', hidden: 'false'} // show - показыватся ли таблица, all - все ли варианты показываются, hidden - есть ли скрытые параменты
        ],
    rand: [],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 10, typeId: 2,
    text:
        `<p>Логическая функция F задаётся выражением:</p>
        <p>$logF1$.</p>
        <p>На рисунке приведён фрагмент таблицы истинности функции F.</p>
        <p>Определите, какому столбцу таблицы истинности функции F соответствует каждая из переменных x, y, z.</p>
        <p>$logT1$.</p>
        <p>В ответе напишите буквы x, y, z в том порядке, в котором идут соответствующие им столбцы (сначала – буква, соответствующая первому столбцу, затем – буква, соответствующая второму столбцу, и т. д.) Буквы в ответе пишите подряд, никаких разделителей между буквами ставить не нужно.</p>
        <p>Пример. Если бы функция была задана выражением ¬x ∨ y, зависящим от двух переменных: x и y, и был приведён фрагмент её таблицы истинности.</p>
        <p>
            <table style="margin:auto">
            <tbody>
                <tr>
                    <th style="text-align:center">Перем. 1</th>
                    <th style="text-align:center">Перем. 2</th>
                    <th style="text-align:center">Перем. 3</th>
                    <th style="text-align:center">Функция</th>
                </tr>
                <tr>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center"><i>F</i></td>
                </tr>
                <tr>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">1</td>
                </tr>
                <tr>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">1</td>
                </tr>
                <tr>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">1</td>
                </tr>
            </tbody>
            </table>
        </p>
        <p>Тогда первому столбцу соответствовала бы переменная y, а второму столбцу — переменная x. В ответе следовало бы написать: yx.</p>`,
    ans:
        `let r = '123';
        let a = [0, 1, 2];
        let table = $logT1$;
        for (let i=0; i<table.length; ++i)
            {
            while (eval('(x, y, z) => { return $logF1$; }')(table[i][a[0]], table[i][a[1]], table[i][a[2]]) != table[i][3])
            {
                let cI = a.length;
                let rI = 0;
                while (cI != 0)
                {
                    rI = Math.floor(Math.random() * cI);
                    cI--;
                    a[cI] = a[rI] + (a[rI]=a[cI], 0);
                }
            }
        }
        r = r.replace(a[0]+1, 'x');
        r = r.replace(a[1]+1, 'y');
        r = r.replace(a[2]+1, 'z');
        return r;`,
    logFT:
        [
            {show: 'true', all: 'true', hidden: 'false'} // show - показыватся ли таблица, all - все ли варианты показываются, hidden - есть ли скрытые параменты
        ],
    rand: [],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});
Template.create({id: 11, typeId: 3,
    text:
        `<p>Логическая функция F задаётся выражением:</p>
        <p>$logF1$.</p>
        <p>На рисунке приведён фрагмент таблицы истинности функции F.</p>
        <p>Определите, какому столбцу таблицы истинности функции F соответствует каждая из переменных x, y, z.</p>
        <p>$logT1$.</p>
        <p>В ответе напишите буквы x, y, z в том порядке, в котором идут соответствующие им столбцы (сначала – буква, соответствующая первому столбцу, затем – буква, соответствующая второму столбцу, и т. д.) Буквы в ответе пишите подряд, никаких разделителей между буквами ставить не нужно.</p>
        <p>Пример. Если бы функция была задана выражением ¬x ∨ y, зависящим от двух переменных: x и y, и был приведён фрагмент её таблицы истинности.</p>
        <p>
            <table style="margin:auto">
            <tbody>
                <tr>
                    <th style="text-align:center">Перем. 1</th>
                    <th style="text-align:center">Перем. 2</th>
                    <th style="text-align:center">Перем. 3</th>
                    <th style="text-align:center">Функция</th>
                </tr>
                <tr>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center">???</td>
                    <td style="text-align:center"><i>F</i></td>
                </tr>
                <tr>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">1</td>
                </tr>
                <tr>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">0</td>
                    <td style="text-align:center">1</td>
                </tr>
                <tr>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">1</td>
                    <td style="text-align:center">1</td>
                </tr>
            </tbody>
            </table>
        </p>
        <p>Тогда первому столбцу соответствовала бы переменная y, а второму столбцу — переменная x. В ответе следовало бы написать: yx.</p>`,
    ans:
        `let r = '123';
        let a = [0, 1, 2];
        let table = $logT1$;
        for (let i=0; i<table.length; ++i)
            {
            while (eval('(x, y, z) => { return $logF1$; }')(table[i][a[0]], table[i][a[1]], table[i][a[2]]) != table[i][3])
            {
                let cI = a.length;
                let rI = 0;
                while (cI != 0)
                {
                    rI = Math.floor(Math.random() * cI);
                    cI--;
                    a[cI] = a[rI] + (a[rI]=a[cI], 0);
                }
            }
        }
        r = r.replace(a[0]+1, 'x');
        r = r.replace(a[1]+1, 'y');
        r = r.replace(a[2]+1, 'z');
        return r;`,
    logFT:
        [
            {show: 'true', all: 'false', hidden: 'true'} // show - показыватся ли таблица, all - все ли варианты показываются, hidden - есть ли скрытые параменты
        ],
    rand: [],
    word: [],
    masRL: [],
    docFN: [],
    comp: [],
    code: [],
    active: true
});


Template.create({id: 12, typeId: 18,
    text: `<p>Запишите число, которое будет напечатано в результате выполнения программы. Для Вашего удобства программа представлена на пяти языках программирования</p> $code1$
            <p>
            let s = $rand1$;
            let n = $rand2$;
            while ($rand3$*s > $rand4$)
            {
                s = s - $comp1$;
                n = n $word1$ $rand5$;
            }
            return n;
            </p>
    `,
    ans: `return $code1$`,
    logFT: [],
    rand:
        [
            {min: '40', max: '550'},
            {min: '0', max: '2'},
            {min: '1', max: '4'},
            {min: '0', max: '10'},
            {min: '1', max: '5'}
        ],
    word:
        [
            `+,*`
        ],
    masRL: [],
    docFN: [],
    comp:
        [
            `let r = 0;
            if ($rand1$ < 100)
            { 
                r = Math.floor(Math.random()*(10 - 1) + 1)
            } else { r = Math.floor(Math.random()*(100 - 10) + 10) }
            return r;`
        ],
    code:
        [
            `let s = $rand1$;
            let n = $rand2$;
            while ($rand3$*s > $rand4$)
            {
                s = s - $comp1$;
                n = n $word1$ $rand5$;
            }
            return n;`
        ],
    active: true
});
/*
Template.create({id: 13, typeId: 22,
    text: `<p>В файле $docF1$ приведена $docN1$</p>.
            <p>Сколько раз встречается $word1$ (с заглавной или строчной буквы) в тексте (не считая сносок)?</p>
            <p>В ответе укажите только число.</p>`,
    ans: `return ($docF1$.toLowerCase().split($word1$).length - 1)`,
    logFT: [],
    rand: [],
    word:
        [
            `я,ты,вы,мы,он,она,они,оно,его,её,наш,ваш,мой,их,его`
        ],
    masRL: [],
    docFN:
        [
            {
                file: `10_demo.docx,10.docx,Гоголь. Нос.docx,Пушкин. Капитанская дочка.docx,dubrovskiy.docx`,
                isName: true,
                name: `роман в стихах А. С. Пушкина «Евгений Онегин»,произведение А. С. Грибоедова «Горе от ума»,произведение Н. В. Гоголя «Нос»,произведение А. С. Пушкина «Капитанская дочка»,произведение А. С. Пушкина «Дубровский»`
            }
        ],
    comp: [],
    code: [],
    active: true
});*/

module.exports = {
    Topic,
    Type,
    Template,

    Task,

    Stat,

    Role,
    User,
    Student,
    Teacher,

    Class,

    Test,

    Task_List,

    Test_List
};
