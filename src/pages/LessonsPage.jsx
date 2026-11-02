import React from 'react'
import { PortalScreen } from '../portal/PortalScreen.jsx'
import {ElearningList} from '../elearning/ElearningLessons.jsx'
import { ClassLessonPlanList } from './ClassLessonPlans.jsx'
export default function LessonsPage() { return <><ClassLessonPlanList/><ElearningList/><PortalScreen mode="lesson" /></> }
