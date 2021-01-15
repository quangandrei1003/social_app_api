This is a Node/Express/MongoDB REST API for social app that uses JWT authentication. Most of endpoints are protected and each registered user has their own profile, articles and
followers.


import java.io.*;

import java.util.Scanner; 

class Main{
public static void main(String[] args) throws Exception {

        Scanner scanner = new Scanner(System.in);

        System.out.println("Enter Name");

        String name = scanner.nextLine();

        System.out.println("Enter UserName");

        String userName = scanner.nextLine();

        System.out.println("Enter Password");

        String password = scanner.nextLine();

        System.out.println("Enter PhoneNo");

        long phoneNo = scanner.nextLong();

        scanner.nextLine();

        User user = new User(name,userName,password,phoneNo);

        System.out.println("Enter Name");

        String name1 = scanner.nextLine();

        System.out.println("Enter UserName");

        String userName1 = scanner.nextLine();

        System.out.println("Enter Password");

        String password1 = scanner.nextLine();

        System.out.println("Enter PhoneNo");

        long phoneNo1 = scanner.nextLong();

        User user1 = new User(name1,userName1,password1,phoneNo1);

        boolean isSamePhoneNum = user.comparePhoneNumber(user1);

        if (isSamePhoneNum) {
            System.out.println("Same Users");
        }else {
            System.out.println("Different Users");
        }
    }
}
