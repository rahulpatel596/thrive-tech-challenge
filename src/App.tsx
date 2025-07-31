import {useState, useEffect} from 'react'
import './App.css'
import UserTable from "./components/UserTable";
import { getEnhancedUsers } from './utils/generateUser';
import type { EnhancedUser } from './types/user';

const App = () => {
  const [users, setUsers] = useState<EnhancedUser[]>([])
  useEffect(() => {
    const data = getEnhancedUsers(500);
    setUsers(data)
  }, [])

  return (
    <>
          <UserTable data={users}/>
    </>
  )
}

export default App