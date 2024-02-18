import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Card(props: {
    children: JSX.Element
}) {
    return (
        <div className="p-5 rounded-2xl text-center gradient-card h-full overflow-hidden">
            {props.children}
        </div>  
    )
}

export function Home()  {
    const location = useLocation();
    const navigate = useNavigate();
    const { connected } = useWallet();

    if(location.pathname === "/" && connected) navigate("/project");

    return (
        <>
            <div className="min-h-[30vh] md:min-h-[75vh] flex items-center max-w-5xl mx-auto">
                <div className="relative p-5">
                    <div className="home-spotlight aspect-square rounded-full"></div>
                    <h1 className="text-7xl md:text-[7rem]">DeDoc</h1>
                    <p className="md:text-3xl md:ml-2">On-chain documentation suitable for all projects</p>
                </div>
            </div>
            <div className="grid grid-cols-12 md:gap-10 max-w-7xl mx-auto">
                <div className="col-span-12 md:col-span-7">
                    <Card>
                        <div>
                            <h2 className="text-3xl">Write</h2>
                            <p className="mb-3">Craft documentation using our Markdown editor</p>
                            <img src="/icons/write-graphic.svg"/>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12 md:col-span-5">
                    <Card>
                        <div>
                            <img src="/icons/theme-graphic.svg" />
                            <h2 className="text-3xl mt-7">Theme</h2>
                            <p>Customize using built-in themes.</p>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12 md:col-span-5">
                    <Card>
                        <div>
                            <img src="/icons/on-chain-graphic.svg" className="w-[75%] mx-auto" />
                            <h2 className="text-3xl mt-7">On-Chain</h2>
                            <p>All projects are stored on-chain using Solana cNFTs & Arweave.</p>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12 md:col-span-7">
                    <Card>
                        <div>
                            <h2 className="text-3xl">Publish</h2>
                            <p className="mb-3">Generate and deploy as a static website.</p>
                            <img src="/icons/publish-graphic.svg" className="w-[80%] mx-auto" />
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card>
                        <div className="flex justify-between items-center text-left flex-wrap">
                            <div className="mb-3">
                                <h2 className="text-3xl mb-3">Getting Started</h2>
                                <p>Connect a Solana wallet to create a project.</p>
                            </div>
                            <div>
                                <i>Coming Soon</i>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <footer className="mt-[10rem] text-center text-xs">
                
            </footer>
        </>
    );
}