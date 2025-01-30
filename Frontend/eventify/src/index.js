import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './components/Home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import User from './components/User/User';
import Github, { githubInfoLoader } from './components/Github/Github';
import Auth from './components/Authentication/Auth';
import { AuthProvider } from './Context/AuthContext';
import {ToastContainer} from 'react-toastify';
import AddTask from './components/AddTask/AddTask';
import { FilterProvider } from './Context/FilterContext';
import { TaskProvider } from './Context/TaskContext';
import TaskView from './components/Task/TaskView';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout/>,
//     children: [
//       {
//         path: "",
//         element: <Home/>
//       },
//       {
//         path: "about",
//         element: <About/>
//       },
//       {
//         path: "contact-us",
//         element: <Contact/>
//       }
//     ]
//   }
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path="/task/:taskId" element={<TaskView/>} />
      <Route path="/edit/:taskId" element={<AddTask/>} />
      <Route path='about' element={<About/>}>
        <Route path='user' element={<User/>}/>
      </Route>
      <Route path='contact-us' element={<Contact/>}/>
      <Route path='user/:userId' element={<User/>}/>
      <Route loader={githubInfoLoader} path='github/' element={<Github/>}/>
      <Route path="login" element={<Auth/>}/>
      <Route path="create-task" element={<AddTask/>}/>
    </Route>
    
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <TaskProvider>
      <AuthProvider>
        <FilterProvider>
          <RouterProvider router={router}>
            <ToastContainer />
          </RouterProvider> 
        </FilterProvider>
      </AuthProvider>
    </TaskProvider>
  </React.StrictMode>
);
