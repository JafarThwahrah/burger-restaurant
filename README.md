
# inventory controller

Welcome to your inventory controller application!.

## Getting Started

To get started with this application, follow these steps:

### 1. Requirments
Before getting started, ensure you have the following installed on your system:

- Docker
- docker-compose
- nodejs

### 1. Installation

First, clone this repository to your local machine:

```bash
https://github.com/JafarThwahrah/restaurant-inventory.git
```
Then, navigate to the project directory:
```bash
restaurant-inventory
```
Next, install the dependencies:
```bash
npm install
```
to pull and run database postgres image
```bash
npm run start:db
```
then migrate though the dataabse
```bash
npm run prisma:dev
```
seed the database
```bash
npm run db:seed
```
you can navigate to this link for swagger api documentation

http://localhost:3000/api-docs/


