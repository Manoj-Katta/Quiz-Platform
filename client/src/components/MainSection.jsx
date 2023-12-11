// This contains the routes for the app and additional styling for the app depending on logged in state and path
import { useEffect ,useState } from 'react';
import { Header, Footer, Sidebar, MobileMenu ,Roadmap} from '.';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Home, Login, Signup, NoMatch, Dashboard, Leaderboards, Profile, QuizPage } from '../pages';
import Articles from '../pages/Articles';
import Auth from '../utils/auth';
import {  VocabQuiz } from '../utils/quizGenerator';
import {  lessonData } from '../data';
const localroadmapData = [
  { Skill: 'JS', Roadmap: 'All About Variables', Link: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables' },
  // Add more data as needed
];

const MainSection = () => {
  const loggedIn = Auth.loggedIn();
  // returns true if locations includes /quiz
  const quizLocation = useLocation().pathname.includes('/quiz');
  
  const { pathname } = useLocation();
  const [roadmapData, setroadmapData] = useState(localroadmapData);

  useEffect(() => {
    // Scroll to the top of the page on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {loggedIn && !quizLocation && <Sidebar />}
      <div
        className={`overflow-x-hidden overflow-y-auto flex flex-col ${
          loggedIn ? (quizLocation ? '' : 'mb-20 sm:mb-0 sm:ms-[88px] xl:ms-[300px]') : ''
        }`}
      >
        {!loggedIn && <Header />}
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/leaderboards"
              element={<Leaderboards />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route path="/quiz">

              <Route path="lessons">
                {lessonData.map((lesson) => (
                  <Route
                    key={lesson.lessonUrl}
                    path={lesson.lessonUrl}
                  >
                    {lesson.lessonUnits.map((unit) => (
                      <Route
                        key={unit.unitUrl}
                        path={unit.unitUrl}
                        element={<QuizPage quiz={new VocabQuiz(unit.unitUrl, unit.unitContent)} />}
                      />
                    ))}
                  </Route>
                ))}
              </Route>
            </Route>
            <Route
              path="/roadmap"
              element={<Roadmap roadmapData={roadmapData} />}
            />
            <Route
            path="/articles"
            element={<Articles />}
          />
            <Route 
              path="*"
              element={<NoMatch />}
            />
          </Routes>
        </main>
        {!quizLocation && <Footer />}
      </div>
      {loggedIn && !quizLocation && <MobileMenu />}
    </>
  );
};

export default MainSection;
