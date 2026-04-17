# Budget

![](/assets/images/budget_login.png "Budget")

> Project can be viewed [here](budget.miguelcastillo.info), although it is currently invite-only :) 

## Background
My partner and I have previously kept track of our monthly spending via a Google Sheet. 
It got the job done but with the advancement of AI tools, I wanted to give a shot at using AI to build a full, end-to-end budgeting app complete with auth and the ability to support multiple users for us to try out. 
Overall, it was a lot of fun and a great learning experience. I really enjoyed architecting the backend, especially the MySQL databases.

## Lessons Learned
AI tools are really useful to use for building projects. They reduce the amount of time spent on writing boilerplate code. Simply put, you get to the implementation part of building a lot faster.
With that said, it is still critical to have a good understanding of systems rather than letting AI do all of the work. I spent a lot of time architecting the backend. Providing AI tools with well-thought-out architecture is the key.
Another cool thing I learned through this project that I did not have previous exposure to was GitHub Actions. Knowing how to set those up for my specific project makes deploying changes from development to production easy as I introduce new features.

## Features
- Mobile-first design
- Google Sign-In
- CSV data import/export
- Ability to set a monthly spend budget
    - Allows user to split monthly income into the 50/30/20 budgeting method (for me, this is what makes budgeting simple).
-  Easy, data-rich, transaction logging
- Spend breakdowns and insights
- Easy filtering of all transactions to identify spending trends (am I spending too much on eating out?).

## Tech Stack
The project is split into separate backend and front-end repositories.
The backend was architected and built independently. Once the databases and API endpoints were sorted out, I created a Postman collection for testing. This made building the front end trivial and allowed me to design the front-end interfaces with the boundaries created by my API data contracts.

### Backend
- Vanilla PHP
- MySQL Databases

### Front-End
- TypeScript
- NodeJS

### Other Tools & Technologies Used
- [Google Auth](https://developers.google.com/identity/protocols/oauth2)
- [AWS Lightsail](https://aws.amazon.com/free/compute/lightsail/?trk=e219cf17-9f99-4f53-b40b-9c3dd6744d9d&sc_channel=ps&ef_id=Cj0KCQjwkYLPBhC3ARIsAIyHi3SF89YQlgtQSDN-8OfNEhP_Xapr6i0kwNf3npijGTTEOg3HwveKuI4aAulvEALw_wcB:G:s&s_kwcid=AL!4422!3!798550402708!p!!g!!aws%20lightsail%20web%20hosting!23610840664!193209707266&gad_campaignid=23610840664&gbraid=0AAAAADjHtp9eI0BJ733xkaQhLByexh1-d&gclid=Cj0KCQjwkYLPBhC3ARIsAIyHi3SF89YQlgtQSDN-8OfNEhP_Xapr6i0kwNf3npijGTTEOg3HwveKuI4aAulvEALw_wcB)
- [Postman](https://learning.postman.com/)
- [Figma](https://help.figma.com/hc/en-us)
- [Codex](https://developers.openai.com/codex/ide)
- [v0](https://v0.app/docs)
- [Vercel](https://vercel.com/docs)
- [GitHub](https://docs.github.com/en)

## Screens
![](/assets/images/budget_screens.png "Budget Screens")
