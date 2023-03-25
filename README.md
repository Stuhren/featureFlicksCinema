# featureFlicksCinema
Web page for a cinema booking system.

To run the server, you first have to install all the dependencies. You can do that by simply typing "npm install" in the terminal. Once that is done you are ready to try the web page by using "npm run dev" in the terminal. Click on the provided link in the console and the web page should pop up. Otherwise, type in "http://localhost:5173" in your web browser and you should be good to go. This entire project is built on JavaScript, CSS and HTML including the frameworks React, React Bootstrap and Bootstrap. There are some comments in the code as well to clarify what it does (does not apply to every function, just some).

We start off on the component Home which uses "Movie.jsx" to render all the movies. All movies are represented as cards with each having all necessary information fetched from the database. If the user finds one of them interesting they can simply click on the "More Info" button to see all information the cinema has regarding that specific movie. At the top of the page is a nav-bar which will follow us through each and every page of this web page. You have the ability to select a category in the top left corner to filter a category which suits you.

When we click on the "More Info" button we get to see a detailed view of the specific movie you clicked on. This page is called "MovieDetails". In there contains all the different information that was fetchable from the database as well as the specific screenings for that movie at the bottom which you can use to navigate to the booking page. This section is not built entirely on cards but rather just regular text with some cards at the bottom for the future screenings.

The screenings looks a bit like the "Home" page but it works a bit different. Instead of having more info as a button on each card there is a redirect to the booking section for that specific screening. There is also one more unique thing to this page. Each day has a seperate headline with its' date with the corresponding movies that has screenings that specific day under it with their respective times which are all fetched from the database. You do have the option to filter by category on this page as well to see whenever your favourite category is on the screening the next time!

When we press the "Book Seats" button we reach a page called "DisplaySeats". DisplaySeats is by far the file containing the most code and you will soon understand why. It starts off by listing some of the information regarding the screening which you have just clicked to book seats on and then displays a graphical view with the actual layout of the auditorium that is being used for the screening which is being collected from the database. The already occupied seats are displayed red and are not avaible while the rest are displayed as white. The user can then click on the white seats and choose where to sit. Once clicked, the seat turns green to indicate that it is clicked. The user can then choose to click it again to "unclick". Below the graphical view is a section where the user needs to specify what kind of tickets they want. There are 3 options, children, adults and senior tickets which are fetched from the database. Below the ticket selection is a total that increases and decreases based on the selections of the options previously mentioned since the different ticket types have different costs. After that the user can click on the "Complete Order" button. If the user has clicked on 4 available seats but only declared for 3 tickets the user will recieve an alert that the seats and tickets are not corresponding. If everything corresponds the page renders to a receipt with all the information such as an auto generated booking id, the movie title, date, time, which seats and corresponding rows, ticket types with corresponding price and a total at the very bottom.

The "NoPage" exists to tell the user that the page it was trying to access does not exist, usually a typo in the URL or something along those lines.

The "LayOut" is the nav-bar.

"GenerateBookingNumber" is just a component for creating a randomized booking ID including both numbers and letters.

"Movie" creates cards and applies the style on each card accordingly. It uses props to with destructuring to get the information from "Home", which in turn does the fetch from the API.

"Navbar" is exactly what it sounds like, a navigation menu with a logo and two links to reach "Home" and "Screenings".

"Screening" has a similar function as "Movie" since it basically uses props to destructure the contents and then applying all the information and styling it inside of cards.

"ScreeningInfo" is the small little cards at the bottom of "MovieDetails" that has a slight different layout than the other cards since it does not include all the information as the other ones such as the movie poster.

In "main" we basically just call the "App"-file.

"App" is using BrowserRouter to call the different pages based on the URLs.

