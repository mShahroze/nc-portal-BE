const articleData = [
  {
    title: 'Running a Node App',
    topic: 'coding',
    author: 'jessjelly',
    body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
    created_at: 1471522072389,
    votes: 100,
  },
  {
    title:
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
    topic: 'coding',
    author: 'jessjelly',
    body: 'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
    created_at: 1500584273256,
    votes: 50,
  },
  {
    title: '22 Amazing open source React projects',
    topic: 'coding',
    author: 'happyamy2016',
    body: 'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
    created_at: 1500659650346,
    votes: 23,
  },
  {
    title:
      'Which current Premier League manager was the best player?',
    topic: 'coding',
    author: 'icellusedkars',
    body: 'This article dives into the debate about which of the current Premier League managers had the most successful playing career. With many former footballers turning to management, the Premier League has seen some legendary players take on coaching roles. The piece examines the playing careers of top managers like Pep Guardiola, Mikel Arteta, and Frank Lampard, comparing their achievements on the field. Stats, trophies, and individual accolades are taken into account to crown the best player-turned-manager in the current Premier League season.',
    created_at: 1647590400000,
    votes: 45,
  },
  {
    title:
      'Which historical figure is known for inventing the light bulb?',
    topic: 'coding',
    author: 'tickle122',
    body: 'This article explores the life and work of Thomas Edison, the inventor often credited with creating the first commercially practical light bulb. Although Edison wasn’t the first to invent a light bulb, his improvements to the design in the late 19th century made it more durable and efficient, leading to widespread adoption. The article also discusses other inventors like Joseph Swan, who made significant contributions to the development of electric lighting, and how these pioneers shaped the future of technology.',
    created_at: 1623549600000,
    votes: 78,
  },
  {
    title:
      'The People Tracking Every Touch, Pass And Tackle in the World Cup',
    topic: 'coding',
    author: 'grumpy19',
    body: 'This article highlights the growing trend of using data analytics in sports, particularly during the World Cup. Developers have created open-source tools using various programming languages to track and analyze every move on the field, from passes to tackles. The focus here is on how coding and data science are becoming integral in improving player performance and providing insights that coaches and fans can use. These tools are built with JavaScript frameworks such as React.js, offering both real-time analytics and historical data comparison.',
    created_at: 1635157200000,
    votes: 87,
  },
  {
    title: 'Making sense of Redux',
    topic: 'coding',
    author: 'jessjelly',
    body: 'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
    created_at: 1514093931240,
    votes: 120,
  },
  {
    title: 'Please stop worrying about Angular 3',
    topic: 'coding',
    author: 'jessjelly',
    body: 'Another Angular version planned already? Whaaaat? Didn’t Angular 2 just ship? Why Angular 3? What? Why? First off, there is no massive rewrite, and won’t be for Angular 3. Secondly, let me explain the future of Angular 2 and what Angular 3, Angular 4 will mean for you.',
    created_at: 1477282382648,
    votes: 200,
  },
  {
    title:
      'JavaScript’s Apply, Call, and Bind Methods are Essential for JavaScript Professionals',
    topic: 'coding',
    author: 'grumpy19',
    body: 'Functions are objects in JavaScript, as you should know by now, if you have read any of the prerequisite articles. And as objects, functions have methods, including the powerful Apply, Call, and Bind methods. On the one hand, Apply and Call are nearly identical and are frequently used in JavaScript for borrowing methods and for setting the this value explicitly. We also use Apply for variable-arity functions; you will learn more about this in a bit.',
    created_at: 1521023259137,
    votes: 150,
  },
  {
    title: 'Using React Native: One Year Later',
    topic: 'coding',
    author: 'tickle122',
    body: 'When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision.',
    created_at: 1481146646335,
    votes: 110,
  },
  {
    title: 'Express.js: A Server-Side JavaScript Framework',
    topic: 'coding',
    author: 'cooljmessy',
    body: 'You’re probably aware that JavaScript is the programming language most often used to add interactivity to the front end of a website, but its capabilities go far beyond that—entire sites can be built on JavaScript, extending it from the front to the back end, seamlessly. Express.js and Node.js gave JavaScript newfound back-end functionality—allowing developers to build software with JavaScript on the server side for the first time. Together, they make it possible to build an entire site with JavaScript: You can develop server-side applications with Node.js and then publish those Node.js apps as websites with Express. Because Node.js itself wasn’t intended to build websites, the Express framework is able to layer in built-in structure and functions needed to actually build a site. It’s a pretty lightweight framework that’s great for giving developers extra, built-in web application features and the Express API without overriding the already robust, feature-packed Node.js platform. In short, Express and Node are changing the way developers build websites.',
    created_at: 1467269979654,
    votes: 75,
  },
  {
    title:
      'Learn HTML5, CSS3, and Responsive WebSite Design in One Go',
    topic: 'coding',
    author: 'grumpy19',
    body: 'Both CSS3 and HTML5 are just about fully supported in all modern browsers, and we there are techniques in place to patch old browsers that lack support. So there is no disadvantage to using CSS3 and HTML5 today. The opposite is true, however: there are many painful, frustrating disadvantages with forgoing HTML5 and CSS3. You may already “know” a bit of HTML5 and a touch of CSS3 (or perhaps you probably know enough old-school HTML and CSS), and with this knowledge, you might have thought you needn’t learn HTML5 and CSS3 fully.',
    created_at: 1488766934447,
    votes: 82,
  },
  {
    title:
      'An Introduction to JavaScript Object Notation (JSON) in JavaScript and .NET',
    topic: 'coding',
    author: 'cooljmessy',
    body: 'When designing an application that will communicate with a remote computer, a data format and exchange protocol must be selected. There are a variety of open, standardized options, and the ideal choice depends on the applications requirements and pre-existing functionality. For example, SOAP-based web services format the data in an XML payload wrapped within a SOAP envelope. While XML works well for many application scenarios, it has some drawbacks that make it less than ideal for others. One such space where XML is often less than ideal is with Ajax-style web applications. Ajax is a technique used for building interactive web applications that provide a snappier user experience through the use of out-of-band, lightweight calls to the web server in lieu of full-page postbacks. These asynchronous calls are initiated on the client using JavaScript and involve formatting data, sending it to a web server, and parsing and working with the returned data. While most browsers can construct, send, and parse XML, JavaScript Object Notation (or JSON) provides a standardized data exchange format that is better-suited for Ajax-style web applications. JSON is an open, text-based data exchange format (see RFC 4627). Like XML, it is human-readable, platform independent, and enjoys a wide availability of implementations. Data formatted according to the JSON standard is lightweight and can be parsed by JavaScript implementations with incredible ease, making it an ideal data exchange format for Ajax web applications. Since it is primarily a data format, JSON is not limited to just Ajax web applications, and can be used in virtually any scenario where applications need to exchange or store structured information as text. This article examines the JSON standard, its relationship to JavaScript, and how it compares to XML. Jayrock, an open-source JSON implementation for .NET, is discussed and examples of creating and parsing JSON messages are provided in JavaScript and C#.',
    created_at: 1477707849225,
    votes: 13,
  },
  {
    title: 'Understanding Asynchronous Programming in JavaScript',
    topic: 'coding',
    author: 'icellusedkars',
    body: 'Asynchronous programming in JavaScript is a paradigm that allows developers to write non-blocking code. Unlike traditional synchronous programming, where tasks are executed one after another, asynchronous programming enables multiple tasks to run concurrently, improving the performance of applications. This is particularly useful when dealing with I/O-bound operations, such as network requests or file reading, which can take time to complete. In JavaScript, asynchronous programming is commonly achieved using callbacks, promises, and the async/await syntax. These mechanisms ensure that the code remains responsive while waiting for an operation to finish. In this article, we will explore the different approaches to asynchronous programming, how they work, and when to use each technique to build efficient and maintainable JavaScript applications.',
    created_at: 1633104800000,
    votes: 42,
  },
  // Add more articles as needed
];

export default articleData;
