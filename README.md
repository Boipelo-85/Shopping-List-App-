# 🛒 Shopping List App

A shopping list manager built with React, TypeScript, and Redux Toolkit. Organize items into custom lists, search and sort in real time, and pull in product photos straight from Pixabay — all backed by a persistent JSON database, not browser storage.

### Links

- **Live Site:** [View Live](react-weather-app-nine-weld.vercel.app)
- **Repository:** [GitHub Repo](https://github.com/Boipelo-85/Shopping-List-App-.git)


## Features

- **Accounts, no localStorage** — Register and log in with real accounts. All user, list, and item data is saved server-side in `database.json` via `json-server`, so nothing is lost or tied to a single browser.
- **Lists & Items** — Create named lists (e.g. "Groceries", "Braai supplies"), then add items to them with quantity, category, optional notes, and an image.
- **Live search** — Search across lists and items by keyword, with the query reflected directly in the URL (`?search=milk`) so results are shareable and bookmarkable.
- **Sorting** — Sort by name, category, or date added, also synced to the URL (`?sort=name`).
- **Quantity stepper** — Bump item quantities up or down inline, no modal needed.
- **Image search** — Search Pixabay for a product photo right from the Add/Edit Item form instead of uploading your own file.
- **Protected routing** — Login and Registration are public; Home and Profile are only reachable once authenticated, using React Router.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **State management:** Redux Toolkit (`createAsyncThunk` for all server-backed reads/writes)
- **Routing:** React Router v7
- **Backend:** `json-server` serving `src/database.json` as a REST API
- **Phone input:** `react-international-phone`
- **Icons:** `react-icons`

## Project Structure

```
src/
├── components/
│   ├── Header/            # Top nav, search bar, profile dropdown
│   ├── Home/               # Main lists/items view (tabs, modals, sorting)
│   ├── LoginPage/          # Login form
│   ├── Registration/       # Registration form
│   ├── Profile/            # User profile page
│   ├── ProfileDropdown/    # Account menu (view/edit profile, logout)
│   └── Text/                # Shared typography component
├── store/
│   ├── authSlice.ts        # Login/register/logout state + thunks
│   ├── listSlice.ts        # Lists CRUD state + thunks
│   ├── itemsSlice.ts       # Items CRUD state + thunks
│   └── store.ts             # Redux store setup
├── services/
│   └── api.ts               # All HTTP calls to json-server (users/lists/items)
├── PaxiBayResources.tsx    # Pixabay image search component
├── database.json            # Persistent data store (users, lists, items)
└── App.tsx                  # Routes: /login, /register, /home, /profile
```

## Getting Started

### Prerequisites
- Node.js installed
- A free [Pixabay API key](https://pixabay.com/api/docs/) (for the image search feature)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your Pixabay API key**

   Create a `.env` file in the project root (same folder as `package.json`):
   ```
   VITE_PIXABAY_API_KEY=your_pixabay_api_key_here
   ```

3. **Run the app**

   This project needs two processes running at once — the backend (`json-server`) and the frontend (`Vite`). The easiest way is:
   ```bash
   npm run dev:all
   ```

   This runs both together. Alternatively, run them separately in two terminals:
   ```bash
   npm run server   # starts json-server on http://localhost:3000
   npm run dev      # starts the Vite dev server
   ```

4. **Open the app**

   Visit the local URL Vite prints in your terminal (typically `http://localhost:5173`).

## Screenshots

- Desktop view

![Screenshot 1](src/assets/weather_1.png)
![Screenshot 2](src/assets/weather_2.png)
![Screenshot 3](src/assets/weather_3.png)
![Screenshot 4](src/assets/weather_4.png)

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server only |
| `npm run server` | Starts `json-server` on port 3000, watching `src/database.json` |
| `npm run dev:all` | Runs both the server and the dev server together |
| `npm run build` | Type-checks and builds for production |
| `npm run lint` | Runs Oxlint |
| `npm run preview` | Previews the production build locally |

## Data Persistence

All data lives in `src/database.json`, structured as:

```json
{
  "users": [],
  "lists": [],
  "items": []
}
```

`json-server` must be running for the app to load or save any data — without it, registration, login, and list/item changes will fail with a "cannot connect to backend" error.

## Author

- **Name:** Boipelo Harry Motileng
- **GitHub:** [github.com/boipelo](https://github.com/Boipelo-85)
- **LinkedIn:** [linkedin.com/in/boipelo](https://www.linkedin.com/in/boipelo-motileng)
---



### Step-by-Step Planning and Pesudocode 

### Step-by-Step Planning — Shopping List Application

# 1.Understand the Problem
The application is designed to provide users with a simple, user-friendly way to create, manage, organise, search, and share their shopping lists.
The main problem being solved is:
Users need an organised and convenient way to manage their shopping items digitally instead of relying on paper lists or unstructured notes.
________________________________________
2. Identify the Users
The primary users of the application are people who need to create and manage personal shopping lists.
Users should be able to:
•	Create an account. 
•	Log into their account. 
•	Manage their profile. 
•	Create multiple shopping lists. 
•	Add and manage shopping items. 
•	Search for items. 
•	Sort items. 
•	Organise items using categories. 
•	Share their shopping lists. 
________________________________________
3. Define User Goals
The application should allow users to accomplish the following goals:
•	Register for an account. 
•	Log into the application securely. 
•	View and manage their profile. 
•	Create shopping lists. 
•	Add items to shopping lists. 
•	View existing shopping lists. 
•	Edit shopping lists and items. 
•	Delete shopping lists and items. 
•	Search for items by name. 
•	Sort items by name, category, or date added. 
•	Organise items using categories or tags. 
•	Share shopping lists with other people. 
________________________________________
4. Define the Application Pages
The application should contain the following main pages:
Login Page
Allows existing users to enter their login credentials and access the application.
Registration Page
Allows new users to create an account using:
•	Email address 
•	Password 
•	Name 
•	Surname 
•	Cell number 
Home Page
Provides the main interface where authenticated users can access and manage their shopping lists.
Profile Page	
Allows users to:                                                                                                                                                                                
•	View their profile. 
•	Update their personal information. 
•	Update their login credentials. 
                                                                                                                                                                                                                                                                                                                                                                         
Provides the interface where users can:
•	Create shopping lists. 
•	Add items. 
•	View items. 
•	Edit items. 
•	Delete items. 
•	Search for items. 
•	Sort items. 
•	Categorise items. 
•	Share shopping lists. 
________________________________________
5. Plan Authentication
Authentication determines how users register and log into the application.
Registration Flow
User
 ↓
Open Registration Page
 ↓
Enter Email
 ↓
Enter Password
 ↓
Enter Name
 ↓
Enter Surname
 ↓
Enter Cell Number
 ↓
Validate Information
 ↓
Create Account
 ↓
Account Created
 ↓
Login
Login Flow
User
 ↓
Open Login Page
 ↓
Enter Email
 ↓
Enter Password
 ↓
Validate Credentials
 ↓
Credentials Correct?
 ├── YES → Home Page
 └── NO  → Display Error
Password Security
User passwords should not be stored as plain text.
Passwords should be securely hashed when the user registers.
During login, the entered password should be checked against the stored password hash.
Passwords should not be decrypted during login because properly hashed passwords are not meant to be decrypted.
________________________________________
6. Plan Authorisation and Protected Routes
Authorisation determines which pages and features a user is allowed to access.
Unauthenticated User
A user who is not logged in should have access to:
•	Login Page 
•	Registration Page 
They should not have access to protected pages such as:
•	Home Page 
•	Profile Page 
•	Shopping Lists 
Authenticated User
A logged-in user should have access to:
•	Home Page 
•	Profile Page 
•	Shopping Lists 
•	Shopping List Management Features 
A logged-in user should not unnecessarily be shown the Login or Registration pages.
Protected Route Flow
User Requests Page
       ↓
Is User Logged In?
       ↓
   ┌───┴───┐
  YES      NO
   ↓        ↓
Allow     Redirect
Access    to Login
________________________________________
7. Plan the Shopping List Data
Before building the interface, determine what information needs to be stored.
Each shopping item may contain:
•	Quantity 
•	Category 
•	Image 
•	Edit
•	Delete
•	Name 

The relationship between the data can be represented as:
User
 ↓
Shopping Lists
 ↓
Shopping List Items
A user can have multiple shopping lists, and each shopping list can contain multiple items.
________________________________________
8. Plan CRUD Operations
The shopping list system should make use of CRUD operations.
CRUD stands for:
Create, Read, Update, Delete
Create
Users should be able to:
•	Create a new shopping list. 
•	Add items to a shopping list. 
Read
Users should be able to:
•	View their shopping lists. 
•	View items inside a shopping list. 
•	View item information. 
Update
Users should be able to:
•	Edit shopping lists. 
•	Edit shopping list items. 
•	Update item names. 
•	Update quantities. 
•	Update notes. 
•	Update categories. 
•	Update images. 
•	Update their profile information. 
•	Update their login credentials. 
Delete
Users should be able to:
•	Delete shopping lists. 
•	Delete individual shopping list items. 
________________________________________
9. Plan the Search Function
Users should be able to search for shopping items by name.
Search Flow
User
 ↓
Enter Search Keyword
 ↓
Search Keyword Added to URL
 ↓
Application Reads URL
 ↓
Search Items
 ↓
Display Matching Items
For example:
/shopping-lists?search=milk
The search keyword should be visible in the URL.
When the user changes the search keyword, the application should update the displayed results.
For example:
/shopping-lists?search=milk
can become:
/shopping-lists?search=bread
The displayed items should update accordingly.
________________________________________
10. Plan the Sorting Function
Users should be able to sort shopping items according to:
•	Name 
•	Category 
•	Date Added 
The selected sorting option should be represented in the URL.
For example:
/shopping-lists?sort=name
/shopping-lists?sort=category
/shopping-lists?sort=date
Sorting Flow
User Selects Sort Option
          ↓
Update URL
          ↓
Application Reads URL
          ↓
Validate Sort Option
          ↓
Sort Items
          ↓
Update Page
If a user manually changes the URL to a valid sorting keyword, the application should update the page accordingly.
________________________________________
11. Plan Categories / Tags
Categories or tags should be used to organise shopping items.
Example categories could include:
Food
 ├── Milk
 ├── Bread
 └── Eggs

Cleaning
 ├── Soap
 ├── Detergent
 └── Disinfectant

Electronics
 ├── Batteries
 ├── Chargers
 └── Cables
Categories should make it easier for users to organise and identify their shopping items.
The application should allow the category to be associated with each item.
________________________________________
12. Plan Profile Management
Users should be able to manage their own profile.
View Profile
Users should be able to view their stored profile information.
Update Profile
Users should be able to update information such as:
•	Name 
•	Surname 
•	Email address 
•	Cell number 
Update Login Credentials
Users should be able to update their login credentials, including their password.
Any password update must follow the same secure password-hashing process used during registration.
________________________________________
13. Plan Shopping List Sharing
Users should be able to share their shopping lists with other people.
The basic sharing flow could be:
User
 ↓
Select Shopping List
 ↓
Select Share
 ↓
Generate Sharing Method
 ↓
Share Shopping List
 ↓
Other Person Accesses List
The project should define what the shared user is allowed to do.
For example:
View-only sharing
The person receiving the list can only view it.
Edit sharing
The person receiving the list can view and modify the list.
The sharing permissions should be clearly defined before implementation.
________________________________________
14. Plan Responsive UI/UX
The interface should be user-friendly, intuitive, and responsive.
The application should work correctly on:
•	Desktop computers 
•	Laptops 
•	Tablets 
•	Mobile phones 
The layout should adapt according to the screen size.
Areas to consider
•	Navigation 
•	Buttons 
•	Forms 
•	Shopping lists 
•	Item cards 
•	Images 
•	Search controls 
•	Sorting controls 
•	Categories 
•	Tables 
•	Spacing 
•	Typography 
The main goal is:
Users should be able to access and use the application's features easily regardless of their screen size.
________________________________________
15. Plan Accessibility
The application should be accessible and usable by as many people as possible.
Accessibility considerations should include:
•	Clear labels for form fields. 
•	Keyboard navigation. 
•	Appropriate colour contrast. 
•	Visible focus states. 
•	Meaningful error messages. 
•	Alternative text for images. 
•	Accessible buttons and controls. 
•	Clear headings. 
•	Logical page structure. 
•	Easy-to-understand navigation. 
Accessibility should be considered throughout the design process rather than added at the end.
________________________________________
16. Plan Error and Empty States
The application should define what happens when something goes wrong or when there is no information to display.
Examples include:
Login Failure
Invalid email or password.
Please try again.
Registration Failure
Unable to create account.
Please check your information.
Empty Shopping List
You don't have any shopping lists yet.
Create your first shopping list.
No Search Results
No items found matching your search.
Invalid Sorting
If an invalid sorting value is entered in the URL, the application should handle it appropriately rather than breaking.
Network Error
The application should provide an appropriate message if data cannot be loaded because of a connection or server problem.
________________________________________
17. Create User Flows
User flows show the sequence of actions a user takes to accomplish a specific task.
Registration Flow
Registration Page
       ↓
Enter Information
       ↓
Validate Information
       ↓
Create Account
       ↓
Account Created
       ↓
Login
       ↓
Home Page
Shopping List Flow
Home Page
     ↓
Create Shopping List
     ↓
Enter Item Information
     ↓
Save Item
     ↓
Shopping List
     ↓
View / Edit / Delete / Search / Sort / Share
Profile Flow
Home Page
     ↓
Profile
     ↓
View Information
     ↓
Edit Information
     ↓
Save Changes
________________________________________
18. Create Wireframes
Wireframes are basic visual plans for each screen.
Before choosing final colours, images, and styling, determine:
•	Where the navigation will appear. 
•	Where headings will appear. 
•	Where forms will appear. 
•	Where buttons will appear. 
•	Where shopping lists will appear. 
•	Where search will appear. 
•	Where sorting controls will appear. 
•	Where categories will appear. 
•	Where images will appear. 
•	How users move between screens. 
The goal of wireframing is to determine the structure and layout of the application.
________________________________________
19. Design the User Interface
After the wireframes are completed, design the actual visual interface.
Determine:
Colours
Choose a consistent colour palette.
Typography
Choose appropriate:
•	Font family 
•	Font sizes 
•	Font weights 
•	Line spacing 
Components
Design reusable components such as:
•	Buttons 
•	Input fields 
•	Cards 
•	Navigation bars 
•	Search bars 
•	Dropdowns 
•	Modals 
•	Alerts 
•	Shopping-list items 
Visual Hierarchy
Make sure users can easily identify:
•	Important information. 
•	Primary actions. 
•	Secondary actions. 
•	Navigation. 
•	Errors. 
•	Status messages. 
________________________________________
20. Create an Interactive Prototype
Connect the designed screens to simulate how the real application will work.
Example:
Login
 ↓
Home
 ↓
Shopping List
 ↓
Add Item
 ↓
Save Item
 ↓
Shopping List
 ↓
Edit / Delete / Search / Sort / Share
The prototype should demonstrate the main user journeys before the complete application is developed.
________________________________________
21. Test the Application
Testing should verify that the application meets the requirements and is easy to use.
Authentication Testing
Check that:
•	Users can register. 
•	Users can log in. 
•	Incorrect credentials are rejected. 
•	Passwords are securely handled. 
•	Protected routes work correctly. 
•	Unauthenticated users cannot access protected pages. 
Shopping List Testing
Check that:
•	Users can create lists. 
•	Users can add items. 
•	Users can view items. 
•	Users can edit items. 
•	Users can delete items. 
•	Users can delete lists. 
Search Testing
Check that:
•	Users can search by name. 
•	Search keywords appear in the URL. 
•	Changing the URL updates the results. 
•	No-result searches are handled correctly. 
Sorting Testing
Check that:
•	Sorting by name works. 
•	Sorting by category works. 
•	Sorting by date added works. 
•	Sorting information appears in the URL. 
•	Valid URL changes update the page. 
•	Invalid sorting values are handled appropriately. 
Responsive Testing
Test the application on:
•	Desktop 
•	Tablet 
•	Mobile 
________________________________________
22. Improve and Iterate
After testing, identify problems and improve the application.
The development process should be treated as a continuous cycle:
PLAN
  ↓
DESIGN
  ↓
BUILD
  ↓
TEST
  ↓
IDENTIFY PROBLEMS
  ↓
IMPROVE
  ↓
TEST AGAIN
  ↓
REPEAT
The goal is to continuously improve the usability, accessibility, functionality, and overall user experience of the application.
________________________________________


Pseudocode Planning — Shopping List Application

START REGISTRATION
DISPLAY Registration Page
INPUT email
INPUT password
INPUT name
INPUT surname
INPUT cellNumber
VALIDATE all required information
IF information is invalid THEN  
    DISPLAY validation error
    RETURN to Registration Page
END IF
CHECK if email already exists
IF email already exists THEN
    DISPLAY "Email already registered"
    RETURN to Registration Page
END IF
HASH password
CREATE new user account
SAVE user information
DISPLAY "Registration successful"
GO TO Login Page
END REGISTRATION
1. Users can login
START

INPUT username
INPUT password

IF username and password are correct THEN
    DISPLAY "Login successful"
    ALLOW user to access their account
ELSE
    DISPLAY "Invalid username or password"
END IF

END

2. User credentials are encrypted for security
START

INPUT username
INPUT password

ENCRYPT password

STORE username and encrypted password securely

WHEN user logs in
    INPUT username
    INPUT password
    ENCRYPT entered password

    IF encrypted password matches stored password THEN
        ALLOW login
    ELSE
        DENY login
    END IF

END

3. Users can add new shopping lists
START

IF user is logged in THEN
    INPUT shopping list name
    CREATE new shopping list
    SAVE shopping list to user's account
    DISPLAY "Shopping list created"
ELSE
    DISPLAY "Please login first"
END IF

END

4. Users can view existing lists
START

IF user is logged in THEN
    RETRIEVE all shopping lists belonging to user

    FOR each shopping list
        DISPLAY shopping list
    END FOR
ELSE
    DISPLAY "Please login first"
END IF

END


5. Users can update lists
START

IF user is logged in THEN
    DISPLAY user's shopping lists
    INPUT list to update

    IF list belongs to user THEN
        INPUT changes
        UPDATE selected shopping list
        SAVE changes
        DISPLAY "Shopping list updated"
    ELSE
        DISPLAY "List not found"
    END IF
ELSE
    DISPLAY "Please login first"
END IF

END


6. Users can delete lists
START

IF user is logged in THEN
    DISPLAY user's shopping lists
    INPUT list to delete

    IF list belongs to user THEN
        ASK user to confirm deletion

        IF user confirms THEN
            DELETE selected shopping list
            DISPLAY "Shopping list deleted"
        ELSE
            DISPLAY "Deletion cancelled"
        END IF
    ELSE
        DISPLAY "List not found"
    END IF
ELSE
    DISPLAY "Please login first"
END IF

END



### MOODBOARD LINK FIGMA.
https://www.figma.com/design/rHwh0dw9lGit40R8VzIe8I/Shopping-list?node-id=1-5&t=gDmRZsYoinwXv6MY-1
