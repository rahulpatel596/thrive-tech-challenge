import { faker } from "@faker-js/faker";
import {type User} from '../types/user'



export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const registeredDate = faker.date.past({ years: 5 });
    const today = new Date();
    const dsr = Math.floor((today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      id: i + 1,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      city: faker.location.city(),
      registeredDate: registeredDate.toISOString().split("T")[0],
      fullName: `${firstName} ${lastName}`,
      dsr,
    };
  });
};