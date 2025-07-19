const Preloader = () => {
  return (
      <div className="fixed inset-0 flex items-center justify-center z-10 bg-background">
          <div className="relative w-16 h-16">{
            // This is how we generate an array of 12 undefined elements:
            // Array(12) creates an array like [empty × 12] (not directly iterable).
            // [...Array(12)] spreads it into [undefined, undefined, ..., undefined] — now it's iterable.
            //   _ means “we don't care about the value” (it's undefined anyway).
            //   i is the index — from 0 to 11.
              
              //For each index i, it renders a <span> tag.
              [...Array(12)].map((_, i) => (
                  <span
                      key={i}
                      className="absolute top-0 left-1/2 w-[3px] h-4 bg-primary origin-center preloader-line"
                      style={{
                          transform: `rotate(${i * 30}deg) translateY(-100%)`,
                          animationDelay : `${i* 0.05}s`
                      }
                      }
                  ></span> 
              ))
          }</div>
          
    </div>
  )
}

export default Preloader;