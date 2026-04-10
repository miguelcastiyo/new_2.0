# Budget

![](/assets/images/budget_login.png "Budget")

> Project can be viewed [here](budget.miguelcastillo.info), although currently it is invite only :) 

## Background
My partner and I have previously kept track of our monthly spending via a Google Sheet. 
Honestly, it got the job done but with the advancement of AI tools, I wanted to give a shot at using AI to build a full, end-to-end budgeting app complete with auth and the ability to support multiple users for us to try out. 
Overall, it was a lot of fun! I really enjoyed architecting the backend, especially the mySQL databases.

## Lessons Learned
AI tools are fun to use for building projects!
With that said, it is still critical to have a good understanding of systems rather than letting AI do all of the work. I spend a lot of time architecting the backend and mapping out database fields and relationships. Providing AI tools well though out architecture is the key.
For this project, I used Codex-GPT-5.3 within VSCode.
Another cool thing I learned via this project that I did not have a lot of previous exposure to was Github Actions and how they work. Sorting that out made deploying updates to the backend a breeze.

## Features
- Mobile-first design
- Google Sign-In
- CSV data import/export
- Ability to set a monthly spend budget
    - Allows user to split monthly income into the 50/30/20 budgeting method (for me, this is what makes budgeting simple).
-  Easy, data-rich, transaction logging
- Spend breakdowns and insights
- Easy filtering of all transactions to identify spending trends (am I spending too much on eating out??).

## Tech Stack
The project is split into seperate backend and front-end repositories.
The backend was architected and built independently. Once the databases and API endpoints were sorted out for the backend, I created a Postman collection for testing. This made building the front end trivial and allowed me to design the front-end interfaces with the boundaries created by my API data contracts.

### Backend
- Vanilla PHP (shoutout Cedric!)
- Hosted on AWS Lightsail
- MySQL Databases

### Front-End
- Mostly TypeScript
- Hosted on Vercel

## Screens
![](/assets/images/budget_screens.png "Budget Screens")