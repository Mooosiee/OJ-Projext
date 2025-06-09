export default function home(){
    return(
        <div>Home</div>
    )
}

// import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
// Placeholder icons (replace with actual SVGs or an icon library like Heroicons or Font Awesome)
// const PlaceholderIcon = ({ className = "w-12 h-12 text-indigo-500" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//   </svg>
// );

// export default function home() {
//   // Dummy data - replace with actual data fetching or static content
//   const features = [
//     {
//       icon: <PlaceholderIcon />,
//       title: "Vast Problem Library",
//       description: "Challenge yourself with a wide range of algorithmic problems, from beginner to expert levels.",
//       link: "/problems"
//     },
//     {
//       icon: <PlaceholderIcon className="w-12 h-12 text-green-500" />,
//       title: "Engaging Contests",
//       description: "Participate in regular coding contests to test your skills against others in a timed environment.",
//       link: "/contests"
//     },
//     {
//       icon: <PlaceholderIcon className="w-12 h-12 text-blue-500" />,
//       title: "Multi-Language Support",
//       description: "Solve problems in your favorite languages, including C++, Java, Python, and JavaScript.",
//       link: "/solve" // Or a page about supported languages
//     },
//   ];

//   const featuredProblems = [
//     { id: "1", title: "Two Sum Challenge", difficulty: "Easy", link: "/problem/1" },
//     { id: "2", title: "Binary Tree Traversal", difficulty: "Medium", link: "/problem/2" },
//     { id: "3", title: "Shortest Path Quest", difficulty: "Hard", link: "/problem/3" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       {/* Navbar Placeholder - You'll likely have a separate Navbar component */}
//       <nav className="bg-white shadow-md">
//         <div className="container mx-auto px-6 py-3 flex justify-between items-center">
//           <Link to="/" className="text-2xl font-bold text-indigo-600">
//             YourOJName
//           </Link>
//           <div className="space-x-4">
//             <Link to="/problems" className="text-gray-600 hover:text-indigo-600">Problems</Link>
//             <Link to="/contests" className="text-gray-600 hover:text-indigo-600">Contests</Link>
//             {/* Add more nav links as needed */}
//             <Link to="/signin" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
//               Login
//             </Link>
//             <Link to="/signup" className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-50">
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 md:py-32">
//         <div className="container mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             Sharpen Your Coding Skills.
//           </h1>
//           <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
//             Welcome to YourOJName, the ultimate platform to practice coding, participate in challenges, and elevate your problem-solving abilities.
//           </p>
//           <Link
//             to="/problems"
//             className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg"
//           >
//             Explore Problems
//           </Link>
//         </div>
//       </header>

//       {/* Features Section */}
//       <section className="py-16 md:py-24 bg-white">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//             Why Choose YourOJName?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8 md:gap-12">
//             {features.map((feature, index) => (
//               <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
//                 <div className="flex justify-center mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2 text-gray-700">{feature.title}</h3>
//                 <p className="text-gray-600 mb-4">{feature.description}</p>
//                 <Link to={feature.link} className="text-indigo-600 hover:text-indigo-800 font-medium">
//                   Learn More →
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Problems Section (Optional) */}
//       {featuredProblems.length > 0 && (
//         <section className="py-16 md:py-24 bg-gray-100">
//           <div className="container mx-auto px-6">
//             <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//               Featured Challenges
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {featuredProblems.map((problem) => (
//                 <div key={problem.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//                   <h3 className="text-xl font-semibold mb-2 text-indigo-700">{problem.title}</h3>
//                   <span className={`text-sm font-medium px-2 py-1 rounded-full
//                     ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
//                       problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
//                       'bg-red-100 text-red-700'}`}>
//                     {problem.difficulty}
//                   </span>
//                   <Link to={problem.link} className="block mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
//                     Solve Problem →
//                   </Link>
//                 </div>
//               ))}
//             </div>
//             <div className="text-center mt-12">
//               <Link to="/problems" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
//                 View All Problems
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Call to Action Section (Optional Secondary) */}
//       <section className="py-20 bg-indigo-700 text-white">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
//           <p className="text-lg mb-8 max-w-xl mx-auto">
//             Join thousands of coders improving their skills every day. Create your account and dive into the world of competitive programming.
//           </p>
//           <Link
//             to="/signup"
//             className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg"
//           >
//             Create Free Account
//           </Link>
//         </div>
//       </section>

//       {/* Footer Placeholder - You'll likely have a separate Footer component */}
//       <footer className="bg-gray-800 text-gray-300 py-12">
//         <div className="container mx-auto px-6 text-center">
//           <p>© {new Date().getFullYear()} YourOJName. All rights reserved.</p>
//           <div className="mt-4 space-x-4">
//             <Link to="/about" className="hover:text-white">About Us</Link>
//             <Link to="/contact" className="hover:text-white">Contact</Link>
//             <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }