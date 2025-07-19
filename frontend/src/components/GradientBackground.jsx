export const GradientBackground = () => {
    return (
    //   overflow-hidden : dont understand why it is needed.
        <div className="relative w-full h-screen backdrop-blur-sm ">
             {/* [...Array(20)] spreads it into [undefined, undefined, ..., undefined] — now it's iterable. */}
            {}
    </div>
  )
}
