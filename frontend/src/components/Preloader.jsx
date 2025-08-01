const Preloader = () => {
  return (
    // 1. Changed background to solid black for a seamless theme transition.
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
      <div className="relative w-16 h-16">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={
              // 2. Changed line color to our theme's primary accent color.
              "absolute top-0 left-1/2 w-[3px] h-4 bg-purple-400 origin-center preloader-line"
            }
            style={{
              transform: `rotate(${i * 30}deg) translateY(-100%)`,
              animationDelay: `${i * 0.05}s`,
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;