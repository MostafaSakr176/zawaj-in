import React from 'react'

const loading = () => {
    return (
        <div className="w-screen h-screen text-center fixed top-0 left-0 z-[999999] flex items-center justify-center">
            <div className='w-full h-full flex items-center justify-center'
                style={{
                    backgroundImage: "url('/photos/footer-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                <div className="w-0 h-[15rem] flex items-center justify-center transform rotate-30 overflow-hidden animate-[expand_2s_ease-out_forwards]">
                    <div className="text-6xl font-bold transform -rotate-30 text-nowrap">
                        <span className="text-[#301B69]">زواج</span>{" "}
                        <span className="text-[#E30BCD]">إن</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default loading