# Fitbook

## About

Fitbook is an application designed for sports centers, offering a solution to simplify the booking process. With this app, members can effortlessly reserve spots for classes, and administrators can easily manage training sessions.

## Features

### Administrators

- **Create Sessions**: Administrators can view, create and cancel sessions. Sessions can be created one at a time or be automatically populated with timeslots from schedule.

- **Manage Session Schedule**: Manage a session schedule that can be used to populate session calendar.

- **Trainers**: Create sessions and schedule timeslots by selecting trainers from a prearranged list. The application validates if there are any overlapping sessions or timeslots.

### Members

- **User Booking Management**: Registered members can view all existing sessions, book, and cancel them.

- **Confirmation via Email**: Users get confirmation e-mails about successfully booked or canceled sessions and are informed about session cancellations.

## Built With

<div align="center">
	<code><img width="30" src="https://github.com/marwin1991/profile-technology-icons/assets/25181517/1275d076-f047-432b-9084-308f88f8c176" alt="tRPC" title="tRPC"/></code>
	<code><img width="30" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/></code>
	<code><img width="30" src="https://user-images.githubusercontent.com/25181517/117448124-a2da9800-af3e-11eb-85d2-bd1b69b65603.png" alt="Vue.js" title="Vue.js"/></code>
	<code><img width="30" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></code>
	<code><img width="30" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/></code>
	<code><img width="30" src="https://github.com/marwin1991/profile-technology-icons/assets/62091613/b40892ef-efb8-4b0e-a6b5-d1cfc2f3fc35" alt="Vite" title="Vite"/></code>
	<code><img width="30" src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" alt="Docker" title="Docker"/></code>
	<code><img width="30" src="https://github.com/marwin1991/profile-technology-icons/assets/25181517/37cb517e-d059-4cc0-8124-1a72b663167c" alt="Playwright" title="Playwright"/></code>
</div>

## Getting Started

### Installation

1. Install npm packages

```bash
npm install
```

2. Create a PostgreSQL database.

3. Add credentials to `.env` file based on `.env.example`.

## Running the server

In development mode:

```bash
npm run dev
```

Running server with in-memory database

```bash
npm run dev:mem
```

### Usage

- To use application as a member, signup by providing a first name, e-mail and password. To use application as an administrator you need to signup and set user as an admin in the database.

- Link to a live version application [here](https://fitbook.4jp42qnr9a86s.eu-central-1.cs.amazonlightsail.com/).

## API Reference

- [SendGrid](https://sendgrid.com/): Fitbook utilizes SendGrid for sending email notifications to users.
