# Budget

A personal budgeting app built to replace the Google Sheet my partner and I used to track our monthly spending.

The project started as a way to see how far modern AI-assisted development tools could take a complete software project. What began as an experiment quickly turned into a real product that I now use to manage my finances.

While AI significantly accelerated development, this project reinforced something I strongly believe: understanding systems, architecture, and product design is still what matters most. AI helped me write code faster, but designing the database, API contracts, user experience, and overall system architecture was where most of the real work happened.

The app is currently invite-only while I continue to iterate and improve the experience.

# Background

My partner and I tracked our spending using a shared Google Sheet for a while.

It worked surprisingly well. We knew where our money was going, could track spending over time, and had complete flexibility over how the data was organized.

The problem was that entering transactions was inconvenient, especially on mobile. Finding trends required manual analysis, and many of the workflows felt like work rather than something that naturally fit into everyday life.

I wasn't interested in building a budgeting app that tried to manage every aspect of someone's financial life. There are already plenty of products that do that.

Instead, I wanted to build something focused on a simple question:

> Where is my money going, and am I spending it the way I intended?

That goal heavily influenced every product decision that followed.

# Product Philosophy

The core principle behind my budget app is simplicity.

Many budgeting applications become complicated because they try to solve every financial problem imaginable. They connect to banks, calculate retirement projections, forecast investment growth, track net worth, and provide dozens of reports.

While those features can be useful, they often come at the expense of usability.

I wanted Budget to focus on the fundamentals:

- Quickly record spending
- Understand spending habits
- Stay within a monthly budget
- Make informed decisions about future spending
- Data privacy

If an additional feature made the product harder to understand or maintain without providing significant value, it was usually left out.

# Key Features

## Mobile-First Design

The application was designed mobile-first so that entering a transaction takes only a few seconds.

Many desktop interactions adapt into mobile trays and bottom sheets rather than traditional modal windows, helping the experience feel more natural on smaller screens.

## Google Sign-In

Authentication is handled through Google Sign-In.
This removes the need to manage passwords.

## Transaction Management

At its core, Budget is a transaction tracking application.

Users can:

- Add transactions
- Edit transactions
- Delete transactions
- Categorize spending
- Track income
- Search historical activity
- Filter spending data

A significant amount of effort went into making transaction entry feel fast while still collecting enough information to generate useful insights later.

## Budget Planning

Users can define monthly spending targets and organize their finances using the 50/30/20 budgeting framework.

I have always appreciated the simplicity of the 50/30/20 approach:

- 50% Needs
- 30% Wants
- 20% Savings

Rather than overwhelming users with dozens of financial categories and rules, the application provides a straightforward framework that is easy to understand and maintain.

## Spending Insights

The application automatically generates spending breakdowns and visualizations that help answer questions such as:

- Am I spending too much eating out?
- How much have I spent on groceries this month?
- Which categories are increasing over time?
- Where is most of my discretionary spending going?

The emphasis is on surfacing actionable information rather than overwhelming users with data.

## CSV Import & Export

Importing historical transactions was important because I was migrating years of budgeting data from spreadsheets.

Users can import transaction data from external sources and export their data whenever needed.
I really like the way Notion guides users through importing database tables. I took inspiration from that to support flexible column mapping so users are not forced into a rigid file format when exporrting.

# Architecture & Technical Decisions

One of the biggest decisions I made was to build the backend first.

Before building any front-end interfaces, I focused on:

- Database design
- API architecture
- Authentication flows
- Data contracts
- Business logic

Once the API layer was stable, I built and tested endpoints through Postman before writing the front end.

This approach created clear boundaries between systems and made front-end development significantly easier because the interfaces were built against stable API contracts rather than constantly changing requirements.

# Tech Stack

## Backend

- Vanilla PHP
- MySQL

The backend handles:

- Authentication
- User management
- Budget management
- Transaction processing
- Reporting
- Data imports and exports

I particularly enjoyed designing the database architecture for this project. While databases are rarely the most visible part of an application, they often determine how maintainable and extensible the product becomes over time.

## Front End

- TypeScript
- Node.js

The front end consumes the backend APIs and provides the budgeting experience across desktop and mobile devices.

## Infrastructure & Tooling

- AWS Lightsail
- Google Authentication
- GitHub Actions
- GitHub
- Postman
- Figma
- Vercel
- Codex
- v0

One of the more valuable skills I picked up during this project was working with GitHub Actions.

Automated deployments have made it much easier to ship updates, test changes, and maintain separate development and production environments.

# Lessons Learned

This project taught me a lot about what AI is good at and what it is not.

AI dramatically reduces the amount of time spent writing boilerplate code. Features that might have previously taken several hours can often be implemented much faster.

However, I found that the quality of the output was heavily dependent on the quality of the architecture behind it.

The biggest leverage came from:

- Well-designed database schemas
- Clearly defined API contracts
- Thoughtful product requirements
- Strong system boundaries

When those pieces were in place, AI became incredibly effective.

When they were not, AI just generated technical debt and bloated the code base faster.

The project also gave me hands-on experience with:

- End-to-end product development
- API design
- Database architecture
- CI/CD pipelines
- Cloud infrastructure

# Future Improvements

Some areas I am currently exploring include:

- Recurring transactions
- Better shared budgeting experiences
- Enhanced import capabilities
- More intelligent spending insights