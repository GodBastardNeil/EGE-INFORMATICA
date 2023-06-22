import { TOPIC_ROUTE,
         TEST_ROUTE,
         STAT_ROUTE,

         TCLASS_ROUTE,
         SCLASS_ROUTE,

         TEACHER_ROUTE,
         STUDENT_ROUTE,
         
         LOGIN_ROUTE,
         REGISTRATION_ROUTE,

         ADMIN_LOGIN_ROUTE,

         ADMIN_TOPIC_ROUTE,
         ADMIN_TYPE_ROUTE,
         ADMIN_TEMPLATE_ROUTE,

         TEMPLATE_ROUTE,
         TEMPLATE_INPUTS_ROUTE } from "./utils/consts";

import Auth from "./pages/auth";
import AdminAuth from "./pages/admin_auth";

import Teacher from "./pages/teacher";
import Student from "./pages/student";
import Admin from "./pages/admin";

import StudentClass from "./pages/student_class";
import TeacherClass from "./pages/teacher_class";

import Topic from "./pages/topic";
import Test from "./pages/test";
import Stat from "./pages/stat";

import Template from "./pages/template";
import TemplateInputs from "./pages/template_inputs";


export const publicRouter = [
   {
      path: ADMIN_LOGIN_ROUTE,
      Component: AdminAuth
   },
   {
      path: LOGIN_ROUTE,
      Component: Auth
   },
   {
      path: REGISTRATION_ROUTE,
      Component: Auth
   }
]

export const teacherRouter = [
   {
      path: TEACHER_ROUTE,
      Component: Teacher
   },
   {
      path: TOPIC_ROUTE,
      Component: Topic
   },
   {
      path: TCLASS_ROUTE,
      Component: TeacherClass
   },
   {
      path: STAT_ROUTE + '/:testId/:userId',
      Component: Stat
   }
]
export const studentRouter = [
   {
      path: STUDENT_ROUTE,
      Component: Student
   },
   {
      path: TOPIC_ROUTE,
      Component: Topic
   },
   {
      path: SCLASS_ROUTE,
      Component: StudentClass
   },
   {
      path: TEST_ROUTE + '/:Id',
      Component: Test
   },
   {
      path: STAT_ROUTE + '/:testId/:userId',
      Component: Stat
   }
]

export const adminRouter = [
   {
      path: ADMIN_TOPIC_ROUTE + '/:Id',
      Component: Admin
   },
   {
      path: ADMIN_TYPE_ROUTE + '/:Id',
      Component: Admin
   },
   {
      path: ADMIN_TEMPLATE_ROUTE + '/:Id',
      Component: Admin
   },
   {
      path: TEMPLATE_ROUTE + '/:typeId/:Id',
      Component: Template
   },
   {
      path: TEMPLATE_INPUTS_ROUTE + '/:typeId/:Id',
      Component: TemplateInputs
   }
]