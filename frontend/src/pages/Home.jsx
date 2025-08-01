import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react'; // <-- imported useState and useEffect

// --- EXISTING ICONS ---
const PuzzleIcon = () => (
  <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
  </svg>
);
const TrophyIcon = () => (
  <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.519-4.674a1 1 0 00-.363-1.118l-3.975-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
  </svg>
);
const CodeBracketsIcon = () => (
  <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
  </svg>
);

// --- NEW ICONS FOR FEATURE CARDS ---
const TerminalIcon = () => (
  <svg className="h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);
const ChartBarIcon = () => (
  <svg className="h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const CollectionIcon = () => (
  <svg className="h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

// --- NEW COMPONENT FOR THE ANIMATED EDITOR ---
const codeSnippets = [
  {
    language: 'Python',
    code: `def greet(name):\n  print(f"Hello, {name}!")\n\ngreet("World")`
  },
  {
    language: 'JavaScript',
    code: `function greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\ngreet("World");`
  },
  {
    language: 'C++',
    code: `#include <iostream>\n\nvoid greet(std::string name) {\n  std::cout << "Hello, " << name << "!" << std::endl;\n}\n\nint main() {\n  greet("World");\n  return 0;\n}`
  }
];
// Created code Component
const AnimatedCodeEditor = () => {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullCode = codeSnippets[currentSnippetIndex].code;

      if (isDeleting) {
        // Deleting effect
        setDisplayedCode(prev => prev.substring(0, prev.length - 1));
        if (displayedCode === '') {
          setIsDeleting(false);
          setCurrentSnippetIndex((prevIndex) => (prevIndex + 1) % codeSnippets.length);
        }
      } else {
        // Typing effect
        setDisplayedCode(fullCode.substring(0, displayedCode.length + 1));
        if (displayedCode === fullCode) {
          setTimeout(() => setIsDeleting(true), 2000); // Pause before deleting
        }
      }
    };

    const typingSpeed = isDeleting ? 30 : 50;
    const timeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedCode, isDeleting, currentSnippetIndex]);

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 min-h-[300px]">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <div className="text-sm text-gray-400 font-mono">
          {codeSnippets[currentSnippetIndex].language}
        </div>
      </div>
      <pre className="text-left p-4 font-mono text-sm whitespace-pre-wrap">
        <code>
          {displayedCode}
        </code>
        <span className="animate-pulse">|</span>
      </pre>
    </div>
  );
};

export default function HomePage() {
  const  currentUser  = useSelector((state) => state.user.user);

  return (
    <main className="bg-black text-white">
      {/* --- HERO SECTION --- */}
      <div className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <h1 className="font-playwrite text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Welcome to OG-OJ!
          </h1>
          <p className="mt-4 md:mt-6 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto">
            The ultimate platform to hone your coding skills, tackle challenging algorithmic problems, and prepare for technical interviews.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            <Link
              to="/problems/all"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-xl text-white font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg shadow-lg hover:bg-purple-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-400 transition-transform transform hover:scale-105 text-base md:text-lg"
            >
              Explore Problems
            </Link>
            {!currentUser && (
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-transparent text-purple-400 border-2 border-purple-400 font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg shadow-lg hover:bg-purple-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-400 transition-all transform hover:scale-105 text-base md:text-lg"
              >
                Get Started
              </Link>
            )}
          </div>
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {[
              { icon: <PuzzleIcon />, title: "Solve" },
              { icon: <TrophyIcon />, title: "Compete" },
              { icon: <CodeBracketsIcon />, title: "Learn" },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col items-center p-2 md:p-4">
                {feature.icon}
                <h3 className="mt-2 md:mt-3 text-base md:text-lg font-semibold text-gray-400">{feature.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why OG-OJ Stands Out</h2>
          <p className="mt-4 text-lg text-gray-400">We're more than a judge; we're your dedicated training ground.</p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl hover:border-purple-400/50 transition-all">
              <CollectionIcon />
              <h3 className="mt-6 text-xl font-bold">Curated Problem Library</h3>
              <p className="mt-2 text-gray-400">Our vast library is tagged and sorted to guide your learning path efficiently.</p>
            </div>
            <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl hover:border-purple-400/50 transition-all">
              <TerminalIcon />
              <h3 className="mt-6 text-xl font-bold">Blazing Fast Judgement</h3>
              <p className="mt-2 text-gray-400">Our robust backend provides instant feedback so you can iterate faster.</p>
            </div>
            <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl hover:border-purple-400/50 transition-all">
              <ChartBarIcon />
              <h3 className="mt-6 text-xl font-bold">Engaging Contests</h3>
              <p className="mt-2 text-gray-400">Climb the leaderboard and see how you stack up against the best.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW, INTERACTIVE CODE EDITOR SECTION --- */}
      <section className="bg-gray-900/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Code in Your Favorite Language</h2>
          <p className="mt-4 text-lg text-gray-400 mb-10">Our platform supports C++, Python, JavaScript, and more. Experience our clean, responsive editor.</p>
          <AnimatedCodeEditor />
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION (CTA) --- */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-purple-600/30 to-purple-900/30 p-10 rounded-2xl border border-purple-500/30">
          <h2 className="text-3xl font-extrabold text-white">Ready to Elevate Your Coding Game?</h2>
          <p className="mt-4 text-lg text-gray-300">Join thousands of developers who are sharpening their skills. Your first challenge awaits.</p>
          <div className="mt-8">
            <Link
              to={currentUser ? "/problems/all" : "/signup"}
              className="inline-block bg-purple-600 text-white font-semibold px-12 py-4 rounded-lg shadow-lg hover:bg-purple-500 transition-all transform hover:scale-105 text-lg"
            >
              {currentUser ? "Start Solving" : "Sign Up For Free"}
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} OG-OJ. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
