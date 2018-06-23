---
layout: single
title:  "Notes on C++ class constructor and destructor"
date:   2018-06-20 16:02:06 +0900
categories: [C++]
tags: [C++, initialization]
---

In this posts, I will list some notes that I think they worth to be reminded when mentioning about classes' declaration, constructor, and destructor.

##### 1. In-class member function is inline function
If you define a method member inside the class declaration such as
```cpp
class People {
	string first_name() {return _fname;}
    string last_name();
}
string People::last_name {return _lname;}
```
Then `first_name()` function will be an inline function by default while the function `last_name()` is not. Remember the good and the bad of an inline function. On the good side, an inline function can remove the overhead of the function calling mechanism, thus, improves the performance. However, it also increases the code size, leads to increasing the percentage of the cache miss and reduce the performance as well. Therefore, __only define a function inside its class definition if the function is small.__

##### 2. Define constructors that can take a single argument as explicit
By default, a constructor invoked by a single argument acts as an implicit conversion from its argument type to its type. Implicit is usually found in copy assignment and function call.
```cpp
void my_fnc(Date);

class Date {
	Date (int dd);
}

void f() {
	my_fnc(4); //OK.implicit
    my_fnc(Date(4));//OK.explicit
}
```
In this case, 4 will be implicitly converted to Date and used in my_fnc. This may be the behavior you expect. Therefore, **declare a constructor that can be called with a single argument explicit.**
```cpp
class Date {
	explicit Date (int dd =0, int mm =0, int yy =0);
}
```

##### 3. Default arguments or in-class initializercan save your time
If you want to set default values for your data members, ease the pain of defining many constructors each with a different number of arguments, there are two ways to do that:
```cpp
//1. Set default argument for the constructor
class Date {
	Date (int dd =0, int mm =0, int yy =0);
}
//2. In-class initializer
class Date {
	int dd =0;
    int mm =0;
    int yy =0;
	Date (int d, int m, int y);
}
```
##### 4. Prefer member initialization over assignment in a constructor
Data member of a class can be initialized by:
```cpp
//Initialization
class Date {
	int dd, mm, yy;
    A aa;
	Date (int d, int m, int y, int a)
    : dd{d}, mm{m}, yy {y}, aa{a} {}
}
//Assignment
class Date {
	int dd, mm, yy;
    A aa;
	Date (int d, int m, int y) {
    	dd = d; mm = m; yy = y;
        aa = A(a);
    }
}
```
They look the same, but there are reasons you should prefer the initialization over the assignment.
- If your data member is const. You have to use initialization since you cannot assign a value to a const variable.
- If your data member is of a class does not have a default constructor. The first method is the only way to go.
- Reference data member. If your data member is a reference. You cannot define it then assign a value to it later. So, the first method is the only one will work.
- If you inherit a Base class, it can make sure the Base class is properly initialized before your class. Otherwise, your base class will be initialized by the default constructor.
- Performance boost. In the assignment method, if your member is a class, it actually is initialized by the default constructor first. Then you assign another value to it. This, of course, does excessive works.

##### 5. If a method does not need to modify data, declare it as const function
A const function cannot modify any data in the class, so this is a basic rule to ensure your method does not do anything unexpected. It is important if you work in a large team.
##### 6.  If a class has a virtual function, it needs a virtual destructor
This code ensures the case when a Derived class' object is referred by a pointer of its Base class, the destructor of the Derived class will be called. Without the virtual declaration, it may only call the destructor of Base class  and the resources may be leaked.

##### 7. If you have an initializer-List Constructor, remember when it will be called
If you define a container, you should have a constructor that accepts `initializer_list`. That way you can initialize your class with a list of value just like a vector:
```cpp
vector<int> v(3);//vector with one 3 zero elements
vector<int> v(); // empty vector
vector<int> v{}; // empty vector
vector<int> v{3};//initializer-list called. vector with one element
vector<int> v{3,4,5};//initializer-list called. vector with 3 elements 3, 4 and 5
```
However, if you have one, make sure you remember when it will be called:
- If either a default constructor (no argument) or an initializer-list constructor could be invoked, prefer the default constructor.
- If both an initializer-list constructor and an ‘ordinary constructor’ could be invoked, prefer the initializer-list constructor. This rule is necessary to avoid different resolutions based on different numbers of elements.

##### 8. Remember to copy the Bases when defining copy/move constructor/assignment
In these cases, consider the base class as a member of your class, remember to initialize it. Otherwise, it will be initialized by the default constructor.
```cpp
//B1 and B2 is base classes of D
D(const D& a) :B1{a}, B2{a}, m1{a.m1}, m2{a.m2} {}
```
##### 9. Consider before you make a default constructor for your class
The default constructor is necessary in many cases, such as, when objects of your class will be used as elements of a container... But not every time, defining a default constructor is a good idea. If a class inherit your class, users of your class may forget to properly initialize it as the case above.

##### 10. Remember when you have default operations
Default operations include constructor, destructor, copy and move assignment can be autogenerated for your class. The suppression of these operations will happen when:
- If the programmer declares any constructor for a class, the default constructor is not generated for that class.
- If the programmer declares a copy operation, a move operation, or a destructor for a class, no copy operation, move operation, or destructor is generated for that class.

Otherwise, you can control the suppression behavior by:
```cpp
class A {
	//Suppress the default behavior
    A()= delete;
	//Explicit default
    A(const A&) = default;
}
```
By default, the default constructor is a member-wise constructor, it will call the default constructor of all data members. Therefore, it will fail if a data member doesn't have its default constructor. The default copy operator is the shallow copy, so be careful if it is the behavior that you expect.


