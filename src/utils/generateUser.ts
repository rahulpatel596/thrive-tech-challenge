import { faker } from "@faker-js/faker";
import {type User, type EnhancedUser} from '../types/user'

export const generateUsers = (count: number, offset = 0): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const registeredDate = faker.date.past({ years: 5 });

    return {
      id: i + offset + 1,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      city: faker.location.city(),
      registeredDate: registeredDate.toISOString().split("T")[0]
    };
  });
};

export const getEnhancedUsers = (count: number, offset = 0 ): EnhancedUser[] => {
  console.log("Getting more users")
  return generateUsers(count, offset).map((user: User) => {
    const dsr = Math.floor(
      (new Date().getTime() - new Date(user.registeredDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      dsr,
    }
  })
}