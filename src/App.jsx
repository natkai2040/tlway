import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TimelineDisplay from './TimelineDisplay.jsx'
import moment from 'moment'

function App() {
  const sampleGroups = [
    { id: 1, title: 'Arc 1'},
    { id: 2, title: 'Arc 2'},
    { id: 3, title: 'Arc 3'},
    { id: 4, title: 'Arc 4'},
  ]
  const sampleItems = [
    {
      id: 1,
      group: 1,
      title: 'Default 1',
      start_time: moment(),
      end_time: moment().add(.25, 'hour'),
      itemProps: {
        style: {
          background: '#00000000',
          border: '0px'
        },
        primaryColor: '#00000000',
        longDescription: "This is a long item description",
        tags: ["Character B", "Setting X", "Romance"]
      }
    },
    {
      id: 2,
      group: 2,
      title: 'Default 2',
      start_time: moment().add(0.5, 'hour'),
      end_time: moment().add(0.525, 'hour'),
      itemProps: {
        style: {
          background: '#00000000',
          border: '0px', 
        },
        primaryColor: '#00000000',
        longDescription: "This is a long item description",
        tags: ["Character B", "Setting X", "Action"]
      }
    },
    {
      id: 3,
      group: 1,
      title: 'Default 3',
      start_time: moment().add(2, 'hour'),
      end_time: moment().add(2.25, 'hour'),
      itemProps: {
        style: {
          background: '#00000000',
          border: '0px'
        },
        primaryColor: '#00000000',
        longDescription: "This is a long item description",
        tags: ["Character A", "Setting Y", "Romance"]
      }
    }, 
  ]

  return (
    <div>
    <TimelineDisplay initialGroups={sampleGroups} initialItems={sampleItems}/>
    </div>
  )
}

export default App
