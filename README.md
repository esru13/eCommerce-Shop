# eCommerce Shop

A modern e-commerce application built with Next.js, React, and Redux. Browse products, manage favorites, and handle product CRUD operations with a clean, responsive interface.

## Features

- **Product Browsing**: View products with infinite scroll pagination
- **Product Details**: Detailed product pages with image gallery
- **Favorites**: Add and remove products from favorites
- **Search**: Search products by name
- **Category Filter**: Filter products by category
- **Product Management**: Create, edit, and delete products (requires login)
- **Authentication**: Mock login system
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **Redux Toolkit** - State management
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/esru13/eCommerce-Shop.git
cd eCommerce-Shop
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── store/           # Redux store and slices
├── lib/             # Utilities and API client
├── config/          # Configuration files
└── types/           # TypeScript types
```

## API

This project uses [DummyJSON](https://dummyjson.com/) API for product data.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

