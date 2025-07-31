import { useEffect, useState } from "react";
import './App.css'
import { type User } from './types/user'
import { generateUsers } from "./utils/generateUser";


const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const data = generateUsers(500);
    setUsers(data);
  }, []);

  return (
    <>
      <div>
        <h1>Users</h1>
        <div>
          <table>
            <thead>
              <tr>
                <th>
                  FirstName
                </th>
                <th>
                  LastName
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <>
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App