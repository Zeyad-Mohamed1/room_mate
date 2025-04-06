# RoommateFinder

RoommateFinder is a web application similar to Airbnb but focused on finding roommates and rooms to rent. It allows users to list their properties, search for available rooms, and connect with potential roommates.

## Features

- **User Authentication**: Register and login functionality
- **Property Listings**: Browse through available rooms and houses
- **Property Details**: View detailed information about properties
- **Add Property**: Multi-step form to add new properties
- **Search**: Search for properties based on location, price, and amenities
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Next.js**: React framework for building the frontend
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling the application
- **React Hooks**: For state management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/roommate-finder.git
   cd roommate-finder
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
roommate-finder/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── property/    # Property detail pages
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   └── components/      # React components
│       ├── Header.tsx   # Header component
│       ├── PropertyCard.tsx # Property card component
│       ├── LoginModal.tsx # Login modal
│       ├── RegisterModal.tsx # Register modal
│       └── AddPropertyModal.tsx # Add property modal
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## Future Enhancements

- **Backend Integration**: Connect to a backend API for data persistence
- **User Profiles**: Allow users to create and manage their profiles
- **Messaging System**: Enable communication between users
- **Reviews and Ratings**: Allow users to leave reviews for properties and owners
- **Payment Integration**: Process payments for deposits and rent
- **Notifications**: Send notifications for new messages and property updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Airbnb and other roommate finding platforms
- Built with Next.js and Tailwind CSS
