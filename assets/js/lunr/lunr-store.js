var store = [{
        "title": "Jekyll custom plugins in Github page",
        "excerpt":"Github page, which uses Jekyll as it static site generator, is a very convenient way to host a personal website. However, Github only supports some official plugins they listed, to use other plugins, you have to build the site yourself. In this post, I would like to discuss their difficulties and how to overcome them. Problems The first problem is, of course, Github does not support custom plugins and they have a valid point to do so - security. Allowing arbitrary code to run on their server is somewhat vulnerable and they don’t want to do so. Hence, I do not expect them to change that anytime soon. However, some plugins are really helpful, in my case, I need plugins to generate category, month archive and tag archive file automatically instead of the painful official way to generate each of them manually as guided when you add any tag or category. To overcome this, the only way is to build the website your own and upload the static site to Github. I move all of my site source code to a src/ folder and build the static site to the main directory. However, the second problem comes in when you cannot set the destination folder including the source folder. Because of these tricky things, I have to use a quite complex solution as bellowing. My solution Step 1. To keep the code clean, I don’t want my development code and generated one to be mixed and also I don’t want my commit history to be full of built logs, I create a branch named develop and set it to the default branch, this branch will how the source code. The master branch will hold the static site. So, now I have two branches like this: branches:-develop (default branch)-master (hold static site)Step 2. In the develop branch, I add a couple of files, the dirrectory look like this: -src/  (to hold website jekyll code)-build_Site.sh (to build the webiste for development)-clean.sh (clean the built site)-.gitignore (ignore the built files) In .gitignore, I would like to exclude all files generated in the build process: #ignore temporary files_site.sass-cachesrc/*.gemsrc/*.sublime-projectsrc/*.sublime-workspacesrc/.bundlesrc/.DS_Storesrc/.jekyll-metadatasrc/.sass-cachesrc/_asset_bundler_cachesrc/_sitesrc/codekit-config.jsonsrc/Gemfile.locksrc/node_modulessrc/npm-debug.log*In clean.sh, all ignored files is deleted. #!/bin/shgit clean -fdXIn build_Site.sh, I build the jekyll site to verify in the development process: #!/bin/sh./clean.shcd srcbundle exec jekyll build --destination ../_sitecd ../_sitejekyll serveNote that, the built site is in _site directory so you should run jekyll serve there. Step 3. In the master branch, my home directory looks like this: -src/ (will be updated from develop branch)- build_Site.sh- .gitignore (ignore the src folder)- .nojekyll (avoid jekyll to build this directory)- _config.yml (if .nojekyll does not work, exclude src folder from being built)- files generated by Jekyllmy build_Site.sh is as bellowing. Other files are as simple as they are described. #!/bin/shrm -r srcgit checkout develop src/cd srcbundle exec jekyll build --destination ../_sitecd ..rsync -av --delete --exclude _site/ --exclude src/ --exclude .git/ --exclude .gitignore --exclude .nojekyll --exclude _config.yml --exclude build_Site.sh _site/ ./rm -r _siteAll my code can be viewed in the source code of this website. If you have any better solution to work around with this, please leave me a comment. ","categories": ["Tips and Tricks"],
        "tags": ["jekyll","github","website"],
        "url": "https://thaink.github.io/2018/06/custom-plugins-in-github-pages/",
        "teaser":null},{
        "title": "Notes on C++ class constructor and destructor",
        "excerpt":"In this posts, I will list some notes that I think they worth to be reminded when mentioning about classes’ declaration, constructor, and destructor. 1. In-class member function is inline function If you define a method member inside the class declaration such as class People {\tstring first_name() {return _fname;}    string last_name();}string People::last_name {return _lname;}Then first_name() function will be an inline function by default while the function last_name() is not. Remember the good and the bad of an inline function. On the good side, an inline function can remove the overhead of the function calling mechanism, thus, improves the performance. However, it also increases the code size, leads to increasing the percentage of the cache miss and reduce the performance as well. Therefore, only define a function inside its class definition if the function is small. 2. Define constructors that can take a single argument as explicit By default, a constructor invoked by a single argument acts as an implicit conversion from its argument type to its type. Implicit is usually found in copy assignment and function call. void my_fnc(Date);class Date {\tDate (int dd);}void f() {\tmy_fnc(4); //OK.implicit    my_fnc(Date(4));//OK.explicit}In this case, 4 will be implicitly converted to Date and used in my_fnc. This may be the behavior you expect. Therefore, declare a constructor that can be called with a single argument explicit. class Date {\texplicit Date (int dd =0, int mm =0, int yy =0);}3. Default arguments or in-class initializercan save your time If you want to set default values for your data members, ease the pain of defining many constructors each with a different number of arguments, there are two ways to do that: //1. Set default argument for the constructorclass Date {\tDate (int dd =0, int mm =0, int yy =0);}//2. In-class initializerclass Date {\tint dd =0;    int mm =0;    int yy =0;\tDate (int d, int m, int y);}4. Prefer member initialization over assignment in a constructor Data member of a class can be initialized by: //Initializationclass Date {\tint dd, mm, yy;    A aa;\tDate (int d, int m, int y, int a)    : dd{d}, mm{m}, yy {y}, aa{a} {}}//Assignmentclass Date {\tint dd, mm, yy;    A aa;\tDate (int d, int m, int y) {    \tdd = d; mm = m; yy = y;        aa = A(a);    }}They look the same, but there are reasons you should prefer the initialization over the assignment.   If your data member is const. You have to use initialization since you cannot assign a value to a const variable.  If your data member is of a class does not have a default constructor. The first method is the only way to go.  Reference data member. If your data member is a reference. You cannot define it then assign a value to it later. So, the first method is the only one will work.  If you inherit a Base class, it can make sure the Base class is properly initialized before your class. Otherwise, your base class will be initialized by the default constructor.  Performance boost. In the assignment method, if your member is a class, it actually is initialized by the default constructor first. Then you assign another value to it. This, of course, does excessive works.5. If a method does not need to modify data, declare it as const function A const function cannot modify any data in the class, so this is a basic rule to ensure your method does not do anything unexpected. It is important if you work in a large team. 6. If a class has a virtual function, it needs a virtual destructor This code ensures the case when a Derived class object is referred by a pointer of its Base class, if you want to delete the object, it actually calls the destructor of the Derived class. Without the virtual declaration, only the destructor of Base class could be called and it may leak the resources. 7. If you have an initializer-List Constructor, remember when it will be called If you define a container, you should have a constructor that accepts initializer_list. That way you can initialize your class with a list of value just like a vector: vector&lt;int&gt; v(3);//vector with one 3 zero elementsvector&lt;int&gt; v(); // empty vectorvector&lt;int&gt; v{}; // empty vectorvector&lt;int&gt; v{3};//initializer-list called. vector with one elementvector&lt;int&gt; v{3,4,5};//initializer-list called. vector with 3 elements 3, 4 and 5However, if you have one, make sure you remember when it will be called:   If either a default constructor (no argument) or an initializer-list constructor could be invoked, prefer the default constructor.  If both an initializer-list constructor and an ‘ordinary constructor’ could be invoked, prefer the initializer-list constructor. This rule is necessary to avoid different resolutions based on different numbers of elements.8. Remember to copy the Bases when defining copy/move constructor/assignment In these cases, consider the base class as a member of your class, remember to initialize it. Otherwise, it will be initialized by the default constructor. //B1 and B2 is base classes of DD(const D&amp; a) :B1{a}, B2{a}, m1{a.m1}, m2{a.m2} {}9. Consider before you make a default constructor for your class The default constructor is necessary in many cases, such as, when objects of your class will be used as elements of a container… But not every time, defining a default constructor is a good idea. If a class inherit your class, users of your class may forget to properly initialize it as the case above. 10. Remember when you have default operations Default operations include constructor, destructor, copy and move assignment can be autogenerated for your class. The suppression of these operations will happen when:   If the programmer declares any constructor for a class, the default constructor is not generated for that class.  If the programmer declares a copy operation, a move operation, or a destructor for a class, no copy operation, move operation, or destructor is generated for that class.Otherwise, you can control the suppression behavior by: class A {\t//Suppress the default behavior    A()= delete;\t//Explicit default    A(const A&amp;) = default;}By default, the default constructor is a member-wise constructor, it will call the default constructor of all data members. Therefore, it will fail if a data member doesn’t have its default constructor. The default copy operator is the shallow copy, so be careful if it is the behavior that you expect. ","categories": ["C++"],
        "tags": ["C++","initialization"],
        "url": "https://thaink.github.io/2018/06/Notes-on-class-constructor/",
        "teaser":null}]
