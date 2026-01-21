# Pet Adoption Frontend

This is the frontend client for the Pet Adoption Platform, built with React, Vite, and Material UI.

## Features

- **Modern UI**: Clean, responsive design using Material UI.
- **Authentication**: Login, Registration, and Protected Routes.
- **User Dashboard**: View and manage adoption applications, update profile/password.
- **Admin Dashboard**: Manage pets (Add/Edit/Delete) and review adoption applications.
- **Pet Browsing**: Search, Filter (by Breed, Age, Species), and Pagination.
- **State Management**: Redux Toolkit for global state (Auth, Pets, Applications).

## Technologies

- React (Vite)
- Redux Toolkit
- Material UI (MUI)
- React Router DOM
- Axios
- React Toastify

## Getting Started

### Prerequisites

- Node.js (v14+)
- The Backend server running on port 5000 (default).

### Installation

1.  Navigate to the frontend folder.
2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

### Running the App

- **Development Server**:

    ```bash
    npm run dev
    ```

- **Build for Production**:

    ```bash
    npm run build
    ```

## Folder Structure

- `src/components`: Reusable UI components (Navbar, PetCard, ProtectedRoute, etc.)
- `src/pages`: Main page views (Home, Login, Profile, AdminDashboard, etc.)
- `src/redux`: Redux slices and store configuration.
- `src/utils`: Helper functions and axios configuration.

## Key Features

- **Public Home**: Browse pets with filtering and pagination.
- **Pet Details**: View detailed information about a pet.
- **Adoption Flow**: Users can submit applications for pets.
- **Admin Controls**:
    - **Manage Pets**: Add new pets with images, update details, or remove listings.
    - **Manage Applications**: Approve or Reject adoption requests.
