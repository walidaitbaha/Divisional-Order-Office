# Divisional-Order-Office

## Overview
The **Divisional Order Office System**  is a web-based application designed to streamline the management of incoming and outgoing messages within a divisional office. It provides tools for efficient communication, document tracking, and workflow management, ensuring that tasks are handled systematically and securely.

## Features
### Authentication and Security
  - Secure login using JWT authentication.
  - Role-based permissions to restrict access to specific features.
    ###
    ![Image](https://github.com/user-attachments/assets/4c5ccf71-187d-452a-a043-ca9e8cd6dc47)
### Admin Features:
- Access to an **Admin Dashboard** displaying:
  - Total number of messages, users, and divisions.
  - Overview of incoming and outgoing messages.
  - Notifications for pending tasks or updates.
   - Manage:
     - **Divisions** (add, update, delete, view divisions)
        ###
        ![Image](https://github.com/user-attachments/assets/38e6f254-5f9c-4ce1-90e1-acf7edab9578)
        ###
        ![Image](https://github.com/user-attachments/assets/01253693-9ac3-43bd-8987-619872e3e161)
       
     - **Messages** (view messages of all divisions)
         ###
         ![Image](https://github.com/user-attachments/assets/ab777aca-e32d-4772-af7d-6629df14e28c)
       
     - **Users** (view users, add, update, delete)
         ###
         ![Image](https://github.com/user-attachments/assets/e3c31bd0-fbda-4627-9f35-5e48c1a75d8b)
         ###
         ![Image](https://github.com/user-attachments/assets/b1716cea-6f7e-4383-9843-e542a713e8d0)
         ###
         ![Image](https://github.com/user-attachments/assets/25d9dc56-668b-4cff-8130-1bb9f6fe8186)
         ###
         ![Image](https://github.com/user-attachments/assets/ec023776-7b6c-4488-ac83-89ba52d076ef)
       
### Chef Division Features:
- Access to an **Chef Division** displaying:
  - Oversees messages and manages approvals.
    - Manage:
     - **Messages** (view messages of his division, update, delete)
         ###
         ![Image](https://github.com/user-attachments/assets/5a1ce0e5-ee05-4369-a4e4-12d1d393e060)
         ###
         ![Image](https://github.com/user-attachments/assets/4d4ee4ba-f7ab-424c-8035-78b73fb0ae7d)
         ###
         ![Image](https://github.com/user-attachments/assets/8cb8476f-c148-4f81-b7a2-a3eb30742313)
 
### Saiaie Features:
- Access to an **Chef Division** displaying:
  - Responsible for entering and managing messages.
    - Manage:
     - **Messages** (view messages of his division, add)
         ###
         ![Image](https://github.com/user-attachments/assets/5f87744a-84c6-4931-9b3e-3f1e3c86d129)
         ###
         ![Image](https://github.com/user-attachments/assets/26c58c27-c6f3-4f5e-9dab-f979abe19d5d)
         ###
         ![Image](https://github.com/user-attachments/assets/6d7691c7-f89d-4c3c-95bf-ed28e6376147)



### Tech stack 
## Front-end
- React.js
- Tailwind.css
## Back-end
- Laravel php
## Databases
- MySQL

## INSTALLATION
### Set up the laravel backend app
1. Clone the repository
   ```
   git clone https://github.com/walidaitbaha/Divisional-Order-Office.git
   ```
2. laravel backend Setup
   ```
   cd back-end
   composer install
   php artisan migrate
   php artisan storage:link
   ```
3. Setup .env file
   Set up the database credentials

### Setup the react frontend app
1. react front-end setup
   ```
   cd front-end
   npm install
   ```
2. set up the .env file
   Make sure to make a variable named `VITE_API_URL` and set it to `http://localhost:3000/api/`

3. Start the app
   ```
   cd front-end
   npm run dev
   cd ../back-end
   php artisan serve
