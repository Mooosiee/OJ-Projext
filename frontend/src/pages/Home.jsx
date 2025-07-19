import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { GradientBackground } from '../components/GradientBackground';
// Placeholder Icons (replace with actual SVGs or an icon library)
const PuzzleIcon = () => <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>;
const TrophyIcon = () => <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.519-4.674a1 1 0 00-.363-1.118l-3.975-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>;
const CodeBracketsIcon = () => <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>;


export default function HomePage() {
  const currentUser = useSelector((state) => state.user.user);
  

  // Calculate the height available after accounting for your header.
  // You'll need to know your header's height. Let's assume it's around 64px (h-16 in Tailwind).
  // Adjust 'calc(100vh - 64px)' if your header height is different.
  // If your Header component is part of a layout that already subtracts its height,
  // then this component might just need `h-full` or `flex-grow`.
  // For this example, I'm assuming HomePage itself needs to manage this.
   // Example: 64px for header height

  return (
    //  <GradientBackground/>
    <main
      className="min-h-screen bg-gradient-to-b from-primary-ii/90 via-black to-black  text-text-primary flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
       // Ensure it takes at least the remaining viewport height
    >
      <section className="mt-14 max-w-3xl"> {/* Limiting width for better readability */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Welcome to <span className="text-primary">OG-OJ</span>!
        </h1>
        <p className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-text-secondary max-w-xl mx-auto">
          The ultimate platform to hone your coding skills, tackle challenging algorithmic problems, and prepare for technical interviews.
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          <Link
            to="/problems/all"
            className="w-full sm:w-auto bg-white/10 backdrop-blur-xl text-white font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg shadow-lg hover:bg-cyan focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-transform transform hover:scale-105 text-base md:text-lg"
          >
            Explore Problems
          </Link>
          {!currentUser && (
      <Link
            to="/signup" // Or /signin if user is not logged in
            className="w-full sm:w-auto bg-surface text-primary border-2 border-primary font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg shadow-lg hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-transform transform hover:scale-105 text-base md:text-lg"
          >
            Get Started
          </Link>
        )}
        </div>

        {/* Optional: A very brief features highlight if space allows and it's crucial */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {[
            { icon: <PuzzleIcon />, title: "Solve" },
            { icon: <TrophyIcon />, title: "Compete" },
            { icon: <CodeBracketsIcon />, title: "Learn" },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-center p-2 md:p-4">
              {feature.icon}
              <h3 className="mt-1 md:mt-2 text-sm md:text-base font-semibold text-text-secondary">{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer is intentionally omitted to keep it single-screen. 
          If absolutely needed, a very minimal one-liner could be at the bottom,
          but it might push content to scroll on smaller viewports.
          Consider putting footer links in your main Header or a dedicated About page.
      */}
    </main>
  );
}
