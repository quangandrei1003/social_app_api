This is a Node/Express/MongoDB REST API for social app that uses JWT authentication. Most of endpoints are protected and each registered user has their own profile, articles and
followers.

```Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the shape\n" +
                "1.Rectangle\n" +
                "2.Triangle");

        int shapeType = Integer.parseInt(scanner.nextLine());

        switch (shapeType) {
            case 1:
                System.out.println("Enter the length and breadth:");
//                double length = Double.parseDouble(scanner.nextLine());
//                double breadth = Double.parseDouble(scanner.nextLine());
//                double length = scanner.nextDouble();
//                double breadth = scanner.nextDouble();
                Shape.value1 = scanner.nextDouble();
                Shape.value2 = scanner.nextDouble();
                Shape.Rectangle rectangleShape = new Shape.Rectangle();
                double rectangleArea = rectangleShape.computeRectangleArea();
                System.out.printf("Area of rectangle is %.2f%n",rectangleArea);
                break;
            case 2:
                System.out.println("Enter the base and height:");
//                double base = Double.parseDouble(scanner.nextLine());
//                double height = Double.parseDouble(scanner.nextLine());
//                Shape.value1 = base;
//                Shape.value2 = height;
                Shape.value1 = scanner.nextDouble();
                Shape.value2 = scanner.nextDouble();
                Shape.Triangle triangleShape = new Shape.Triangle();
                double triangleArea = triangleShape.computeTriangleArea();
                System.out.printf("Area of triangle is %.2f%n",triangleArea);
                break;
            default:
                System.out.println("Invalid choice");
                break;
        }```
